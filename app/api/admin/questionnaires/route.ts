import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { logRateLimitExceeded } from '@/lib/security/audit-log';
import { getAdminUser } from '@/lib/auth/admin-auth';

// ============================================================================
// SECURITY: Rate Limiting
// ============================================================================
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT = 100; // requests per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitMap.entries()).forEach(([ip, record]) => {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  });
}, 10 * 60 * 1000);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

// ============================================================================
// Validation Schemas
// ============================================================================
const queryParamsSchema = z.object({
  status: z.enum(['all', 'completed', 'in_progress']).optional().default('all'),
  search: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
  sortBy: z.enum(['created_at', 'updated_at', 'client_id']).optional().default('updated_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// ============================================================================
// Error Handling
// ============================================================================
const getSafeErrorMessage = (error: unknown, context?: string): string => {
  if (context) {
    console.error(`[${context}] Error details:`, error);
  }
  return 'An error occurred while processing your request';
};

// ============================================================================
// Supabase Client
// ============================================================================
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

// ============================================================================
// Utility Functions
// ============================================================================
interface QuestionnaireStats {
  id: string;
  client_id: string;
  questionnaire_id: string;
  completed: boolean;
  progress_percentage: number;
  total_questions: number;
  answered_questions: number;
  points: number;
  created_at: string;
  updated_at: string;
  last_activity: string;
}

function computeQuestionnaireStats(response: unknown): QuestionnaireStats {
  // Type assertion with validation
  const r = response as {
    id: string;
    client_id: string;
    questionnaire_id: string;
    answers: Record<string, unknown>;
    current_question_index: number;
    completed: boolean;
    points: number;
    created_at: string;
    updated_at: string;
  };

  const answeredCount = Object.keys(r.answers || {}).filter(
    key => r.answers[key] !== null && r.answers[key] !== undefined && r.answers[key] !== ''
  ).length;

  // Estimate total questions based on current index (rough approximation)
  // In a real scenario, you'd fetch this from the questionnaire definition
  const estimatedTotal = Math.max(r.current_question_index + 1, answeredCount);

  const progressPercentage = estimatedTotal > 0
    ? Math.round((answeredCount / estimatedTotal) * 100)
    : 0;

  return {
    id: r.id,
    client_id: r.client_id,
    questionnaire_id: r.questionnaire_id,
    completed: r.completed,
    progress_percentage: progressPercentage,
    total_questions: estimatedTotal,
    answered_questions: answeredCount,
    points: r.points,
    created_at: r.created_at,
    updated_at: r.updated_at,
    last_activity: r.updated_at,
  };
}

// ============================================================================
// GET - Retrieve all questionnaires with filtering and pagination
// ============================================================================
export async function GET(request: NextRequest) {
  // SECURITY: Authentication check - MUST be first
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  // SECURITY: Rate limiting check
  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp)) {
    // Log the rate limit violation (non-blocking)
    logRateLimitExceeded({
      user_type: 'admin', // Assuming this is an admin endpoint
      ip_address: clientIp,
      user_agent: request.headers.get('user-agent') || undefined,
      resource_type: 'api',
      metadata: {
        endpoint: '/api/admin/questionnaires',
        method: 'GET',
      },
    }).catch((err) => console.error('Failed to log rate limit:', err));

    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '3600',
        }
      }
    );
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 503 }
    );
  }

  try {
    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      status: searchParams.get('status') || 'all',
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') || '50',
      offset: searchParams.get('offset') || '0',
      sortBy: searchParams.get('sortBy') || 'updated_at',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    };

    const validation = queryParamsSchema.safeParse(queryParams);
    if (!validation.success) {
      console.warn('Validation error:', validation.error.issues);
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      );
    }

    const { status, search, limit, offset, sortBy, sortOrder } = validation.data;

    // Build query
    let query = supabase
      .from('questionnaire_responses')
      .select('*', { count: 'exact' });

    // Apply status filter
    if (status === 'completed') {
      query = query.eq('completed', true);
    } else if (status === 'in_progress') {
      query = query.eq('completed', false);
    }

    // Apply search filter (searches client_id and questionnaire_id)
    if (search) {
      query = query.or(`client_id.ilike.%${search}%,questionnaire_id.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      const safeMessage = getSafeErrorMessage(error, 'GET /admin/questionnaires');
      return NextResponse.json(
        { error: safeMessage },
        { status: 500 }
      );
    }

    // Compute stats for each questionnaire
    const questionnairesWithStats = (data || []).map(computeQuestionnaireStats);

    return NextResponse.json({
      questionnaires: questionnairesWithStats,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: count ? offset + limit < count : false,
      },
    });
  } catch (error) {
    const safeMessage = getSafeErrorMessage(error, 'GET /admin/questionnaires');
    return NextResponse.json(
      { error: safeMessage },
      { status: 500 }
    );
  }
}
