import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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
interface DashboardStats {
  overview: {
    total_questionnaires: number;
    total_clients: number;
    completed_questionnaires: number;
    in_progress_questionnaires: number;
    completion_rate: number;
    average_progress: number;
  };
  recent_activity: Array<{
    client_id: string;
    questionnaire_id: string;
    action: string;
    timestamp: string;
  }>;
  trends: {
    questionnaires_last_24h: number;
    questionnaires_last_7d: number;
    questionnaires_last_30d: number;
    completions_last_24h: number;
    completions_last_7d: number;
    completions_last_30d: number;
  };
  top_performers: Array<{
    client_id: string;
    total_points: number;
    completed_count: number;
  }>;
}

function computeDashboardStats(responses: unknown[]): DashboardStats {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Type assertion for response data
  const typedResponses = responses as Array<{
    id: string;
    client_id: string;
    questionnaire_id: string;
    answers: Record<string, unknown>;
    current_question_index: number;
    completed: boolean;
    points: number;
    created_at: string;
    updated_at: string;
  }>;

  // Overview stats
  const totalQuestionnaires = typedResponses.length;
  const uniqueClients = new Set(typedResponses.map(r => r.client_id)).size;
  const completedQuestionnaires = typedResponses.filter(r => r.completed).length;
  const inProgressQuestionnaires = totalQuestionnaires - completedQuestionnaires;
  const completionRate = totalQuestionnaires > 0
    ? Math.round((completedQuestionnaires / totalQuestionnaires) * 100)
    : 0;

  // Calculate average progress
  const totalProgress = typedResponses.reduce((sum, r) => {
    const answeredCount = Object.keys(r.answers || {}).filter(
      key => r.answers[key] !== null && r.answers[key] !== undefined && r.answers[key] !== ''
    ).length;
    const estimatedTotal = Math.max(r.current_question_index + 1, answeredCount);
    const progress = estimatedTotal > 0 ? (answeredCount / estimatedTotal) * 100 : 0;
    return sum + progress;
  }, 0);
  const averageProgress = totalQuestionnaires > 0
    ? Math.round(totalProgress / totalQuestionnaires)
    : 0;

  // Recent activity (last 10 updates)
  const recentActivity = typedResponses
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 10)
    .map(r => ({
      client_id: r.client_id,
      questionnaire_id: r.questionnaire_id,
      action: r.completed ? 'Completed' : 'Updated',
      timestamp: r.updated_at,
    }));

  // Trends
  const questionnairesLast24h = typedResponses.filter(
    r => new Date(r.created_at) >= last24h
  ).length;
  const questionnairesLast7d = typedResponses.filter(
    r => new Date(r.created_at) >= last7d
  ).length;
  const questionnairesLast30d = typedResponses.filter(
    r => new Date(r.created_at) >= last30d
  ).length;

  const completionsLast24h = typedResponses.filter(
    r => r.completed && new Date(r.updated_at) >= last24h
  ).length;
  const completionsLast7d = typedResponses.filter(
    r => r.completed && new Date(r.updated_at) >= last7d
  ).length;
  const completionsLast30d = typedResponses.filter(
    r => r.completed && new Date(r.updated_at) >= last30d
  ).length;

  // Top performers (clients with most points)
  const clientStats = new Map<string, { points: number; completed: number }>();
  for (const response of typedResponses) {
    if (!clientStats.has(response.client_id)) {
      clientStats.set(response.client_id, { points: 0, completed: 0 });
    }
    const stats = clientStats.get(response.client_id)!;
    stats.points += response.points;
    if (response.completed) {
      stats.completed += 1;
    }
  }

  const topPerformers = Array.from(clientStats.entries())
    .map(([client_id, stats]) => ({
      client_id,
      total_points: stats.points,
      completed_count: stats.completed,
    }))
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, 10);

  return {
    overview: {
      total_questionnaires: totalQuestionnaires,
      total_clients: uniqueClients,
      completed_questionnaires: completedQuestionnaires,
      in_progress_questionnaires: inProgressQuestionnaires,
      completion_rate: completionRate,
      average_progress: averageProgress,
    },
    recent_activity: recentActivity,
    trends: {
      questionnaires_last_24h: questionnairesLast24h,
      questionnaires_last_7d: questionnairesLast7d,
      questionnaires_last_30d: questionnairesLast30d,
      completions_last_24h: completionsLast24h,
      completions_last_7d: completionsLast7d,
      completions_last_30d: completionsLast30d,
    },
    top_performers: topPerformers,
  };
}

// ============================================================================
// GET - Retrieve dashboard statistics
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
    // Fetch all questionnaire responses
    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      const safeMessage = getSafeErrorMessage(error, 'GET /admin/stats');
      return NextResponse.json(
        { error: safeMessage },
        { status: 500 }
      );
    }

    // Compute dashboard statistics
    const stats = computeDashboardStats(data || []);

    return NextResponse.json({
      stats,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    const safeMessage = getSafeErrorMessage(error, 'GET /admin/stats');
    return NextResponse.json(
      { error: safeMessage },
      { status: 500 }
    );
  }
}
