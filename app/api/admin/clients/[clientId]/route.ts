import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { getAdminUser } from '@/lib/auth/admin-auth';
import { jackieDeleonQuestionnaire } from '@/lib/questionnaire/jackie-deleon';
import { eliteDiscoveryQuestionnaire } from '@/lib/questionnaire/elite-discovery';
import type { Questionnaire } from '@/lib/questionnaire/types';

// Questionnaire definitions registry
const QUESTIONNAIRES: Record<string, Questionnaire> = {
  'elite-discovery': eliteDiscoveryQuestionnaire,
  'jdeleon': jackieDeleonQuestionnaire,
  'jackie-deleon-dec-2025': jackieDeleonQuestionnaire,
};

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
const clientIdSchema = z
  .string()
  .min(1, 'Client ID is required')
  .max(100, 'Client ID must be less than 100 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Client ID must contain only alphanumeric characters, hyphens, and underscores'
  );

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
interface QuestionnaireInfo {
  id: string;
  questionnaire_id: string;
  completed: boolean;
  progress_percentage: number;
  answered_questions: number;
  total_questions: number;
  points: number;
  created_at: string;
  updated_at: string;
}

interface ActivityEvent {
  id: string;
  questionnaire_id: string;
  event_type: 'created' | 'updated' | 'completed';
  timestamp: string;
  snapshot?: unknown;
}

interface ClientDetail {
  client_id: string;
  questionnaires: QuestionnaireInfo[];
  activity_history: ActivityEvent[];
  summary: {
    total_questionnaires: number;
    completed_questionnaires: number;
    in_progress_questionnaires: number;
    total_points: number;
    total_answered_questions: number;
    first_activity: string;
    last_activity: string;
  };
}

/**
 * Get total question count from questionnaire definition
 */
function getQuestionnaireStats(clientId: string): { totalRequired: number; totalAll: number } {
  const questionnaire = QUESTIONNAIRES[clientId];
  if (!questionnaire) {
    return { totalRequired: 0, totalAll: 0 };
  }

  let totalRequired = 0;
  let totalAll = 0;

  for (const mod of questionnaire.modules) {
    for (const question of mod.questions) {
      totalAll++;
      if (question.required || mod.required) {
        totalRequired++;
      }
    }
  }

  return { totalRequired, totalAll };
}

function computeQuestionnaireInfo(response: unknown, clientId: string): QuestionnaireInfo {
  const r = response as {
    id: string;
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

  // Get actual question count from questionnaire definition
  const { totalRequired } = getQuestionnaireStats(clientId);
  const actualTotal = totalRequired > 0 ? totalRequired : Math.max(r.current_question_index + 1, answeredCount);

  const progressPercentage = actualTotal > 0
    ? Math.min(Math.round((answeredCount / actualTotal) * 100), 100)
    : 0;

  return {
    id: r.id,
    questionnaire_id: r.questionnaire_id,
    completed: r.completed,
    progress_percentage: progressPercentage,
    answered_questions: answeredCount,
    total_questions: actualTotal,
    points: r.points,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

function buildActivityHistory(
  responses: unknown[],
  historyRecords: unknown[]
): ActivityEvent[] {
  const activities: ActivityEvent[] = [];

  // Add creation and completion events from responses
  for (const response of responses) {
    const r = response as {
      id: string;
      questionnaire_id: string;
      completed: boolean;
      created_at: string;
      updated_at: string;
    };

    activities.push({
      id: r.id,
      questionnaire_id: r.questionnaire_id,
      event_type: 'created',
      timestamp: r.created_at,
    });

    if (r.completed) {
      activities.push({
        id: r.id,
        questionnaire_id: r.questionnaire_id,
        event_type: 'completed',
        timestamp: r.updated_at,
      });
    }
  }

  // Add update events from history
  for (const history of historyRecords) {
    const h = history as {
      response_id: string;
      snapshot: { questionnaire_id?: string };
      created_at: string;
    };

    const response = responses.find((r: unknown) => {
      const resp = r as { id: string };
      return resp.id === h.response_id;
    }) as { questionnaire_id: string } | undefined;

    if (response) {
      activities.push({
        id: h.response_id,
        questionnaire_id: response.questionnaire_id,
        event_type: 'updated',
        timestamp: h.created_at,
        snapshot: h.snapshot,
      });
    }
  }

  // Sort by timestamp descending
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return activities;
}

// ============================================================================
// GET - Retrieve single client with all questionnaires and activity
// ============================================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
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
    const { clientId } = await params;

    // Validate clientId
    const validation = clientIdSchema.safeParse(clientId);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid client ID format' },
        { status: 400 }
      );
    }

    // Fetch all questionnaires for this client
    const { data: responses, error: responsesError } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('client_id', clientId)
      .order('updated_at', { ascending: false });

    if (responsesError) {
      const safeMessage = getSafeErrorMessage(responsesError, 'GET /admin/clients/[clientId]');
      return NextResponse.json(
        { error: safeMessage },
        { status: 500 }
      );
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Get response IDs for history lookup
    const responseIds = responses.map((r: { id: string }) => r.id);

    // Fetch response history for all questionnaires
    const { data: historyData, error: historyError } = await supabase
      .from('response_history')
      .select('*')
      .in('response_id', responseIds)
      .order('created_at', { ascending: false })
      .limit(50);

    if (historyError) {
      console.warn('Error fetching history:', historyError);
    }

    // Compute questionnaire info
    const questionnaires = responses.map(r => computeQuestionnaireInfo(r, clientId));

    // Build activity history
    const activityHistory = buildActivityHistory(responses, historyData || []);

    // Compute summary statistics
    const completedCount = questionnaires.filter(q => q.completed).length;
    const inProgressCount = questionnaires.length - completedCount;
    const totalPoints = questionnaires.reduce((sum, q) => sum + q.points, 0);
    const totalAnswered = questionnaires.reduce((sum, q) => sum + q.answered_questions, 0);

    const createdDates = responses.map((r: { created_at: string }) => new Date(r.created_at).getTime());
    const updatedDates = responses.map((r: { updated_at: string }) => new Date(r.updated_at).getTime());

    const clientDetail: ClientDetail = {
      client_id: clientId,
      questionnaires,
      activity_history: activityHistory.slice(0, 20), // Limit to 20 most recent
      summary: {
        total_questionnaires: questionnaires.length,
        completed_questionnaires: completedCount,
        in_progress_questionnaires: inProgressCount,
        total_points: totalPoints,
        total_answered_questions: totalAnswered,
        first_activity: new Date(Math.min(...createdDates)).toISOString(),
        last_activity: new Date(Math.max(...updatedDates)).toISOString(),
      },
    };

    return NextResponse.json({
      client: clientDetail,
    });
  } catch (error) {
    const safeMessage = getSafeErrorMessage(error, 'GET /admin/clients/[clientId]');
    return NextResponse.json(
      { error: safeMessage },
      { status: 500 }
    );
  }
}
