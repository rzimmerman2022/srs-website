import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, clearRateLimit } from '@/lib/security/rate-limit';

// Admin password - in production this should be from environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

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

    // Check credentials (in production, verify against database)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@southwestresumeservices.com';

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      // Failed login - rate limit is already incremented
      return NextResponse.json(
        {
          error: 'Invalid email or password',
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

    // In a real application, you would:
    // 1. Create a session token
    // 2. Store it in a secure cookie
    // 3. Return the token or set cookie

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
      },
      {
        status: 200,
        headers: {
          // Set session cookie (example - implement proper session management)
          'Set-Cookie': 'admin_session=authenticated; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=28800',
        },
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
