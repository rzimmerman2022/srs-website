import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
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
const idSchema = z.string().uuid('Invalid questionnaire ID format');

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
interface QuestionnaireDetail {
  id: string;
  client_id: string;
  questionnaire_id: string;
  answers: Record<string, unknown>;
  current_question_index: number;
  current_module_index: number;
  points: number;
  streak: number;
  combo: number;
  shown_milestones: number[];
  completed: boolean;
  created_at: string;
  updated_at: string;
  metadata: {
    total_questions: number;
    answered_questions: number;
    progress_percentage: number;
    completion_rate: number;
    last_activity: string;
  };
}

function computeQuestionnaireDetail(response: unknown): QuestionnaireDetail {
  const r = response as {
    id: string;
    client_id: string;
    questionnaire_id: string;
    answers: Record<string, unknown>;
    current_question_index: number;
    current_module_index: number;
    points: number;
    streak: number;
    combo: number;
    shown_milestones: number[];
    completed: boolean;
    created_at: string;
    updated_at: string;
  };

  const answeredCount = Object.keys(r.answers || {}).filter(
    key => r.answers[key] !== null && r.answers[key] !== undefined && r.answers[key] !== ''
  ).length;

  const estimatedTotal = Math.max(r.current_question_index + 1, answeredCount);
  const progressPercentage = estimatedTotal > 0
    ? Math.round((answeredCount / estimatedTotal) * 100)
    : 0;
  const completionRate = r.completed ? 100 : progressPercentage;

  return {
    id: r.id,
    client_id: r.client_id,
    questionnaire_id: r.questionnaire_id,
    answers: r.answers,
    current_question_index: r.current_question_index,
    current_module_index: r.current_module_index,
    points: r.points,
    streak: r.streak,
    combo: r.combo,
    shown_milestones: r.shown_milestones,
    completed: r.completed,
    created_at: r.created_at,
    updated_at: r.updated_at,
    metadata: {
      total_questions: estimatedTotal,
      answered_questions: answeredCount,
      progress_percentage: progressPercentage,
      completion_rate: completionRate,
      last_activity: r.updated_at,
    },
  };
}

// ============================================================================
// GET - Retrieve single questionnaire with full details
// ============================================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    // Validate ID
    const validation = idSchema.safeParse(id);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid questionnaire ID format' },
        { status: 400 }
      );
    }

    // Fetch questionnaire
    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Questionnaire not found' },
          { status: 404 }
        );
      }

      const safeMessage = getSafeErrorMessage(error, 'GET /admin/questionnaires/[id]');
      return NextResponse.json(
        { error: safeMessage },
        { status: 500 }
      );
    }

    // Compute detailed stats
    const questionnaireDetail = computeQuestionnaireDetail(data);

    // Fetch response history
    const { data: historyData, error: historyError } = await supabase
      .from('response_history')
      .select('*')
      .eq('response_id', id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (historyError) {
      console.warn('Error fetching history:', historyError);
    }

    return NextResponse.json({
      questionnaire: questionnaireDetail,
      history: historyData || [],
    });
  } catch (error) {
    const safeMessage = getSafeErrorMessage(error, 'GET /admin/questionnaires/[id]');
    return NextResponse.json(
      { error: safeMessage },
      { status: 500 }
    );
  }
}
