import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Type guard for validating response data structure
function isValidResponseData(data: unknown): data is { id: string } {
  return typeof data === 'object' && data !== null && 'id' in data && typeof (data as { id: string }).id === 'string';
}

// Validation schemas
const clientIdSchema = z
  .string()
  .min(1, 'Client ID is required')
  .max(100, 'Client ID must be less than 100 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Client ID must contain only alphanumeric characters, hyphens, and underscores'
  );

const questionnaireRequestSchema = z.object({
  questionnaireId: z.string().min(1).max(100).optional().default('discovery'),
  // SECURITY: Constrain answers JSONB field to prevent injection attacks and excessive data
  // - Keys must be alphanumeric with hyphens/underscores only
  // - Values must be either strings (max 1000 chars) or arrays of strings (max 50 items, 100 chars each)
  // - This prevents arbitrary JSON injection and limits data size
  answers: z.record(
    z.string().regex(/^[a-zA-Z0-9_-]+$/),
    z.union([
      z.string().max(1000),
      z.array(z.string().max(100)).max(50)
    ])
  ).optional().default({}),
  currentQuestionIndex: z.number().int().min(0).optional().default(0),
  currentModuleIndex: z.number().int().min(0).optional().default(0),
  points: z.number().int().min(0).optional().default(0),
  streak: z.number().int().min(0).optional().default(0),
  combo: z.number().int().min(0).optional().default(0),
  shownMilestones: z.array(z.number().int()).optional().default([]),
  completed: z.boolean().optional().default(false),
});

// Helper to get safe error message (hide details in production)
const getSafeErrorMessage = (error: unknown): string => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment && error instanceof Error) {
    return error.message;
  }

  return 'An error occurred while processing your request';
};

// Create server-side Supabase client (untyped for flexibility)
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // SECURITY: Use ONLY the anon key, never the service role key
  // The service role key bypasses RLS policies and should NEVER be exposed to API routes
  // that handle user input. The anon key respects RLS policies and is safe for client-facing APIs.
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

// GET - Retrieve questionnaire response for a client
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured', fallback: true },
      { status: 200 }
    );
  }

  try {
    const { clientId } = await params;

    // Validate clientId
    const clientIdValidation = clientIdSchema.safeParse(clientId);
    if (!clientIdValidation.success) {
      return NextResponse.json(
        { error: 'Invalid client ID format' },
        { status: 400 }
      );
    }

    const questionnaireId = request.nextUrl.searchParams.get('questionnaireId') || 'discovery';

    // Validate questionnaireId
    if (questionnaireId.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(questionnaireId)) {
      return NextResponse.json(
        { error: 'Invalid questionnaire ID format' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('client_id', clientId)
      .eq('questionnaire_id', questionnaireId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine for new users
      console.error('Supabase GET error:', error);
      return NextResponse.json(
        { error: getSafeErrorMessage(error) },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || null });
  } catch (error) {
    console.error('API GET error:', error);
    return NextResponse.json(
      { error: getSafeErrorMessage(error) },
      { status: 500 }
    );
  }
}

// POST - Create or update questionnaire response
//
// TODO: IMPLEMENT RATE LIMITING - CRITICAL SECURITY REQUIREMENT
//
// Without rate limiting, this endpoint is vulnerable to:
// - DoS attacks (flooding with requests)
// - Data pollution (creating excessive records)
// - Resource exhaustion (database/API quota abuse)
//
// Recommended implementation using Vercel Edge Config + Upstash Redis:
//
// 1. Install dependencies:
//    npm install @upstash/redis @vercel/edge-config
//
// 2. Set up Upstash Redis:
//    - Create account at https://upstash.com/
//    - Create Redis database
//    - Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env
//
// 3. Implement rate limiting logic:
//    import { Redis } from '@upstash/redis'
//    const redis = new Redis({
//      url: process.env.UPSTASH_REDIS_REST_URL,
//      token: process.env.UPSTASH_REDIS_REST_TOKEN,
//    })
//
// 4. Add rate limit check at the top of POST function:
//    const rateLimitKey = `ratelimit:questionnaire:${clientId}`
//    const requests = await redis.incr(rateLimitKey)
//    if (requests === 1) {
//      await redis.expire(rateLimitKey, 3600) // 1 hour window
//    }
//    if (requests > 100) { // Max 100 requests per hour
//      return NextResponse.json(
//        { error: 'Rate limit exceeded. Please try again later.' },
//        { status: 429 }
//      )
//    }
//
// 5. Consider additional limits:
//    - Per-IP rate limiting (using request headers)
//    - Per-questionnaire rate limiting
//    - Exponential backoff for repeated violations
//
// References:
// - Upstash Redis: https://upstash.com/docs/redis/overall/getstarted
// - Vercel Rate Limiting: https://vercel.com/docs/edge-network/rate-limiting
// - Rate Limiting Patterns: https://blog.cloudflare.com/counting-things-a-lot-of-different-things/
//
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured', fallback: true },
      { status: 200 }
    );
  }

  try {
    const { clientId } = await params;

    // Validate clientId
    const clientIdValidation = clientIdSchema.safeParse(clientId);
    if (!clientIdValidation.success) {
      return NextResponse.json(
        { error: 'Invalid client ID format' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const validation = questionnaireRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Upsert - insert or update based on unique constraint
    const { data, error } = await supabase
      .from('questionnaire_responses')
      .upsert(
        {
          client_id: clientId,
          questionnaire_id: validatedData.questionnaireId,
          answers: validatedData.answers,
          current_question_index: validatedData.currentQuestionIndex,
          current_module_index: validatedData.currentModuleIndex,
          points: validatedData.points,
          streak: validatedData.streak,
          combo: validatedData.combo,
          shown_milestones: validatedData.shownMilestones,
          completed: validatedData.completed,
        },
        {
          onConflict: 'client_id,questionnaire_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase POST error:', error);
      return NextResponse.json(
        { error: getSafeErrorMessage(error) },
        { status: 500 }
      );
    }

    // Save to history for audit trail (async, don't wait)
    // Using type guard to safely access response ID
    if (data && isValidResponseData(data)) {
      supabase
        .from('response_history')
        .insert({
          response_id: data.id,
          snapshot: {
            answers: validatedData.answers,
            currentQuestionIndex: validatedData.currentQuestionIndex,
            currentModuleIndex: validatedData.currentModuleIndex,
            points: validatedData.points,
            streak: validatedData.streak,
            combo: validatedData.combo,
            shownMilestones: validatedData.shownMilestones,
            completed: validatedData.completed,
            timestamp: new Date().toISOString(),
          },
        })
        .then(({ error: historyError }) => {
          if (historyError) {
            console.warn('History save warning:', historyError);
          }
        });
    } else if (data) {
      // Handle case where data doesn't have expected structure
      console.warn('Response data missing id field, skipping history save');
    }

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error('API POST error:', error);
    return NextResponse.json(
      { error: getSafeErrorMessage(error) },
      { status: 500 }
    );
  }
}
