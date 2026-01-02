import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { createClient } from '@supabase/supabase-js';

// Rate limit configuration for token verification
const MAX_TOKEN_ATTEMPTS = 10;
const TOKEN_WINDOW_MS = 60 * 1000; // 1 minute

// Supabase client with SERVICE ROLE key (bypasses RLS for token verification)
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);

    // Check rate limit - 10 attempts per minute per IP
    const rateLimitKey = `token_verify:${clientIp}`;
    const rateLimit = checkRateLimit(rateLimitKey, MAX_TOKEN_ATTEMPTS, TOKEN_WINDOW_MS);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many attempts. Please wait before trying again.',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter || 60),
            'X-RateLimit-Limit': String(MAX_TOKEN_ATTEMPTS),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor(rateLimit.resetTime / 1000)),
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Validate token format (basic check)
    if (typeof token !== 'string' || token.length < 10) {
      return NextResponse.json(
        {
          error: 'Invalid token format',
          attemptsRemaining: rateLimit.remaining,
        },
        {
          status: 400,
          headers: {
            'X-RateLimit-Limit': String(MAX_TOKEN_ATTEMPTS),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(Math.floor(rateLimit.resetTime / 1000)),
          },
        }
      );
    }

    // Get Supabase client
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Look up token in database (correct table name)
    const { data: tokenData, error: dbError } = await supabase
      .from('questionnaire_access_tokens')
      .select('client_id, questionnaire_id, expires_at, revoked, access_count')
      .eq('token', token)
      .single();

    if (dbError || !tokenData) {
      return NextResponse.json(
        {
          error: 'Invalid or expired token',
          attemptsRemaining: rateLimit.remaining,
        },
        {
          status: 401,
          headers: {
            'X-RateLimit-Limit': String(MAX_TOKEN_ATTEMPTS),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(Math.floor(rateLimit.resetTime / 1000)),
          },
        }
      );
    }

    // Check if token is revoked
    if (tokenData.revoked) {
      return NextResponse.json(
        {
          error: 'Token has been revoked',
          attemptsRemaining: rateLimit.remaining,
        },
        {
          status: 401,
          headers: {
            'X-RateLimit-Limit': String(MAX_TOKEN_ATTEMPTS),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(Math.floor(rateLimit.resetTime / 1000)),
          },
        }
      );
    }

    // Check if token has expired
    if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json(
        {
          error: 'Token has expired',
          attemptsRemaining: rateLimit.remaining,
        },
        {
          status: 401,
          headers: {
            'X-RateLimit-Limit': String(MAX_TOKEN_ATTEMPTS),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(Math.floor(rateLimit.resetTime / 1000)),
          },
        }
      );
    }

    // Update access tracking (fire and forget - don't block response)
    supabase
      .from('questionnaire_access_tokens')
      .update({
        accessed_at: new Date().toISOString(),
        access_count: (tokenData.access_count || 0) + 1,
      })
      .eq('token', token)
      .then(() => {
        // Access tracking updated silently
      });

    // Successful verification
    return NextResponse.json(
      {
        success: true,
        clientId: tokenData.client_id,
        questionnaireId: tokenData.questionnaire_id,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': String(MAX_TOKEN_ATTEMPTS),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(Math.floor(rateLimit.resetTime / 1000)),
        },
      }
    );
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
