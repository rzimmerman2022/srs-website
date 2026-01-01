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
const RATE_LIMIT = 100;
const RATE_WINDOW = 60 * 60 * 1000;

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
  search: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
  sortBy: z.enum(['client_id', 'last_activity', 'questionnaire_count']).optional().default('last_activity'),
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
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

// ============================================================================
// Utility Functions
// ============================================================================
interface ClientSummary {
  client_id: string;
  questionnaire_count: number;
  completed_count: number;
  in_progress_count: number;
  total_points: number;
  first_activity: string;
  last_activity: string;
}

function aggregateClientData(responses: unknown[]): ClientSummary[] {
  const clientMap = new Map<string, {
    client_id: string;
    questionnaires: unknown[];
  }>();

  // Group responses by client_id
  for (const response of responses) {
    const r = response as { client_id: string };
    if (!clientMap.has(r.client_id)) {
      clientMap.set(r.client_id, {
        client_id: r.client_id,
        questionnaires: [],
      });
    }
    clientMap.get(r.client_id)?.questionnaires.push(response);
  }

  // Compute stats for each client
  const clientSummaries: ClientSummary[] = [];
  Array.from(clientMap.entries()).forEach(([clientId, clientData]) => {
    const questionnaires = clientData.questionnaires as Array<{
      completed: boolean;
      points: number;
      created_at: string;
      updated_at: string;
    }>;

    const completedCount = questionnaires.filter(q => q.completed).length;
    const inProgressCount = questionnaires.length - completedCount;
    const totalPoints = questionnaires.reduce((sum, q) => sum + (q.points || 0), 0);

    const createdDates = questionnaires.map(q => new Date(q.created_at).getTime());
    const updatedDates = questionnaires.map(q => new Date(q.updated_at).getTime());

    const firstActivity = new Date(Math.min(...createdDates)).toISOString();
    const lastActivity = new Date(Math.max(...updatedDates)).toISOString();

    clientSummaries.push({
      client_id: clientId,
      questionnaire_count: questionnaires.length,
      completed_count: completedCount,
      in_progress_count: inProgressCount,
      total_points: totalPoints,
      first_activity: firstActivity,
      last_activity: lastActivity,
    });
  });

  return clientSummaries;
}

// ============================================================================
// GET - Retrieve all clients with questionnaire counts
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
      user_type: 'admin',
      ip_address: clientIp,
      user_agent: request.headers.get('user-agent') || undefined,
      resource_type: 'api',
      metadata: {
        endpoint: '/api/admin/clients',
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
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') || '50',
      offset: searchParams.get('offset') || '0',
      sortBy: searchParams.get('sortBy') || 'last_activity',
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

    const { search, limit, offset, sortBy, sortOrder } = validation.data;

    // Fetch all questionnaire responses
    let query = supabase
      .from('questionnaire_responses')
      .select('*');

    // Apply search filter
    if (search) {
      query = query.ilike('client_id', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      const safeMessage = getSafeErrorMessage(error, 'GET /admin/clients');
      return NextResponse.json(
        { error: safeMessage },
        { status: 500 }
      );
    }

    // Aggregate data by client
    const clientSummaries = aggregateClientData(data || []);

    // Apply sorting
    clientSummaries.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case 'client_id':
          compareValue = a.client_id.localeCompare(b.client_id);
          break;
        case 'last_activity':
          compareValue = new Date(a.last_activity).getTime() - new Date(b.last_activity).getTime();
          break;
        case 'questionnaire_count':
          compareValue = a.questionnaire_count - b.questionnaire_count;
          break;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    // Apply pagination
    const total = clientSummaries.length;
    const paginatedClients = clientSummaries.slice(offset, offset + limit);

    return NextResponse.json({
      clients: paginatedClients,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    const safeMessage = getSafeErrorMessage(error, 'GET /admin/clients');
    return NextResponse.json(
      { error: safeMessage },
      { status: 500 }
    );
  }
}
