import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, clearRateLimit } from '@/lib/security/rate-limit';
import { authenticateAdmin } from '@/lib/auth/admin-auth';
import { logLoginSuccess, logLoginFailure } from '@/lib/security/audit-log';

// Rate limit configuration for login attempts
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);

    // Check rate limit - 5 attempts per 15 minutes per IP
    const rateLimitKey = `admin_login:${clientIp}`;
    const rateLimit = checkRateLimit(rateLimitKey, MAX_LOGIN_ATTEMPTS, LOGIN_WINDOW_MS);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter || 900),
            'X-RateLimit-Limit': String(MAX_LOGIN_ATTEMPTS),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor(rateLimit.resetTime / 1000)),
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate using Supabase
    const { user, error } = await authenticateAdmin(email, password);

    if (error || !user) {
      // Log failed login attempt (non-blocking)
      logLoginFailure({
        user_type: 'admin',
        ip_address: clientIp,
        user_agent: request.headers.get('user-agent') || undefined,
        error_message: error || 'Invalid email or password',
        metadata: {
          email,
          attempts_remaining: rateLimit.remaining,
          login_method: 'credentials',
        },
      }).catch((loggingError) => {
        console.error('[AUDIT] Failed to log login failure:', loggingError);
      });

      // Failed login - rate limit is already incremented
      return NextResponse.json(
        {
          error: error || 'Invalid email or password',
          attemptsRemaining: rateLimit.remaining,
        },
        {
          status: 401,
          headers: {
            'X-RateLimit-Limit': String(MAX_LOGIN_ATTEMPTS),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(Math.floor(rateLimit.resetTime / 1000)),
          },
        }
      );
    }

    // Successful login - clear rate limit for this IP
    clearRateLimit(rateLimitKey);

    // Log successful login attempt (non-blocking)
    logLoginSuccess({
      user_id: user.id,
      user_type: 'admin',
      ip_address: clientIp,
      user_agent: request.headers.get('user-agent') || undefined,
      metadata: {
        email: user.email,
        role: user.role,
        login_method: 'credentials',
      },
    }).catch((loggingError) => {
      console.error('[AUDIT] Failed to log login success:', loggingError);
    });

    // authenticateAdmin() already set the Supabase session cookies
    // (sb-access-token and sb-refresh-token)
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
