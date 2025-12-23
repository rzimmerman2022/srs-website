import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// ============================================================================
// SECURITY: Rate Limiting (Q-SEC-01 CRITICAL)
// ============================================================================
// Simple in-memory rate limiter to prevent abuse
// - Tracks requests per IP address
// - Limit: 100 requests per hour per IP
// - Returns 429 (Too Many Requests) when exceeded
//
// NOTE: This is a basic implementation suitable for single-instance deployments.
// For production multi-instance deployments, consider using a distributed cache
// like Upstash Redis or Vercel KV.
// ============================================================================

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT = 100; // requests per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

// Cleanup old entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // No record or expired record - allow and create new record
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  // Over limit - deny
  if (record.count >= RATE_LIMIT) {
    return false;
  }

  // Under limit - increment and allow
  record.count++;
  return true;
}

function getClientIp(request: NextRequest): string {
  // Try various headers in order of preference
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a default (not ideal but better than nothing)
  return 'unknown';
}

// ============================================================================
// SECURITY: Request Deduplication (Q-SEC-08 LOW)
// ============================================================================
// Prevents duplicate requests from being processed multiple times
// Uses a short-lived cache to track recent requests
// ============================================================================

interface DeduplicationRecord {
  timestamp: number;
  response: unknown;
}

const deduplicationCache = new Map<string, DeduplicationRecord>();
const DEDUPLICATION_WINDOW = 5000; // 5 seconds

// Cleanup old entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of deduplicationCache.entries()) {
    if (now - record.timestamp > DEDUPLICATION_WINDOW) {
      deduplicationCache.delete(key);
    }
  }
}, 60 * 1000);

function generateRequestKey(method: string, clientId: string, body?: unknown): string {
  const bodyHash = body ? JSON.stringify(body) : '';
  return `${method}:${clientId}:${bodyHash}`;
}

function checkDeduplication(key: string): DeduplicationRecord | null {
  const record = deduplicationCache.get(key);
  if (record && Date.now() - record.timestamp < DEDUPLICATION_WINDOW) {
    return record;
  }
  return null;
}

function setDeduplication(key: string, response: unknown): void {
  deduplicationCache.set(key, {
    timestamp: Date.now(),
    response,
  });
}

// ============================================================================
// Type Guards and Validation
// ============================================================================

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
  // - Values can be:
  //   * strings (max 1000 chars) - for text, textarea, radio, date inputs
  //   * arrays of strings (max 50 items, 100 chars each) - for checkbox inputs
  //   * numbers (for currency/numeric inputs)
  //   * objects with number values (for percentage-split inputs)
  //   * null (for unanswered questions)
  // - This prevents arbitrary JSON injection and limits data size while supporting all question types
  answers: z.record(
    z.string().regex(/^[a-zA-Z0-9_-]+$/),
    z.union([
      z.string().max(1000),
      z.array(z.string().max(100)).max(50),
      z.number().min(-999999999).max(999999999),
      z.record(z.string().regex(/^[a-zA-Z0-9_-]+$/), z.number().min(0).max(100)), // percentage-split objects
      z.null()
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

// ============================================================================
// SECURITY: Error Sanitization (Q-SEC-05 MEDIUM)
// ============================================================================
// Prevents information leakage through error messages
// - Only show generic messages to clients
// - Log detailed errors server-side for debugging
// - Never expose internal implementation details
// ============================================================================

const getSafeErrorMessage = (error: unknown, context?: string): string => {
  // Always log detailed error server-side for debugging
  if (context) {
    console.error(`[${context}] Error details:`, error);
  }

  // SECURITY: Never expose internal error details to clients
  // Even in development, we sanitize to prevent accidental exposure
  // Developers should check server logs for detailed error information
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
  // SECURITY: Rate limiting check
  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '3600', // 1 hour in seconds
        }
      }
    );
  }

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

    // SECURITY: Request deduplication check
    const dedupeKey = generateRequestKey('GET', `${clientId}:${questionnaireId}`);
    const cachedResponse = checkDeduplication(dedupeKey);
    if (cachedResponse) {
      return NextResponse.json(cachedResponse.response);
    }

    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('client_id', clientId)
      .eq('questionnaire_id', questionnaireId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine for new users
      // SECURITY: Log detailed error server-side, return sanitized message
      const safeMessage = getSafeErrorMessage(error, 'GET /questionnaire');
      return NextResponse.json(
        { error: safeMessage },
        { status: 500 }
      );
    }

    const responseData = { data: data || null };

    // Cache successful response for deduplication
    setDeduplication(dedupeKey, responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    // SECURITY: Log detailed error server-side, return sanitized message
    const safeMessage = getSafeErrorMessage(error, 'GET /questionnaire');
    return NextResponse.json(
      { error: safeMessage },
      { status: 500 }
    );
  }
}

// POST - Create or update questionnaire response
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  // SECURITY: Rate limiting check
  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '3600', // 1 hour in seconds
        }
      }
    );
  }

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
      // SECURITY: Sanitize parse error
      getSafeErrorMessage(parseError, 'POST /questionnaire - JSON parse');
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const validation = questionnaireRequestSchema.safeParse(body);
    if (!validation.success) {
      // SECURITY: Don't expose Zod validation details, just log them
      console.warn('Validation error:', validation.error.issues);
      return NextResponse.json(
        { error: 'Invalid request data format' },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // SECURITY: Request deduplication check
    const dedupeKey = generateRequestKey('POST', clientId, validatedData);
    const cachedResponse = checkDeduplication(dedupeKey);
    if (cachedResponse) {
      return NextResponse.json(cachedResponse.response);
    }

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
      // SECURITY: Log detailed error server-side, return sanitized message
      const safeMessage = getSafeErrorMessage(error, 'POST /questionnaire - upsert');
      return NextResponse.json(
        { error: safeMessage },
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
            // SECURITY: Log history errors but don't expose to client
            console.warn('[POST /questionnaire - history] Error:', historyError);
          }
        });
    } else if (data) {
      // Handle case where data doesn't have expected structure
      console.warn('[POST /questionnaire] Response data missing id field, skipping history save');
    }

    const responseData = { data, success: true };

    // Cache successful response for deduplication
    setDeduplication(dedupeKey, responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    // SECURITY: Log detailed error server-side, return sanitized message
    const safeMessage = getSafeErrorMessage(error, 'POST /questionnaire');
    return NextResponse.json(
      { error: safeMessage },
      { status: 500 }
    );
  }
}
