import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logCsrfViolation } from '@/lib/security/audit-log';

/**
 * Security Middleware for CSRF Protection and SEO Blocking
 *
 * This middleware provides multiple security functions:
 *
 * 1. SEO BLOCKING (Defense in Depth):
 *    - Adds X-Robots-Tag headers to prevent search engine indexing
 *    - Applies to: /admin/*, /discovery/*, /q/* routes
 *    - Complements robots.txt and page-level metadata
 *
 * 2. CSRF Protection:
 *    - Protects against Cross-Site Request Forgery (CSRF) attacks
 *    - Validates that state-changing requests originate from the same domain
 *    - For GET requests: Allow all (read-only operations are safe)
 *    - For POST/PUT/DELETE/PATCH: Verify Origin or Referer header matches host
 *    - Origin header is checked first (more reliable and harder to spoof)
 *    - If Origin is missing, fall back to Referer header validation
 *    - If neither header is present or doesn't match: Return 403 Forbidden
 *
 * Additional Security Notes:
 * - This is a defense-in-depth measure, complementing other security controls
 * - CORS headers should also be configured appropriately
 * - For API endpoints handling sensitive data, consider adding CSRF tokens
 * - Rate limiting should be implemented separately (see route.ts comments)
 */

/**
 * Helper to get client IP address from request
 */
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

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ============================================================================
  // ADMIN ROUTE PROTECTION & SECURITY HEADERS
  // ============================================================================
  if (pathname.startsWith('/admin')) {
    // Allow access to login page and rate-limited page without authentication
    if (pathname === '/admin/login' || pathname === '/admin/login/rate-limited') {
      const response = NextResponse.next();

      // Add security headers for login pages
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, nocache');

      return response;
    }

    // Support dual-mode authentication:
    // 1. admin_session cookie (simple mode for testing) - DEV ONLY
    // 2. sb-access-token/sb-refresh-token (Supabase mode for production)
    const supabaseAccess = request.cookies.get('sb-access-token')?.value;
    const supabaseRefresh = request.cookies.get('sb-refresh-token')?.value;

    // SECURITY: Test mode (admin_session cookie) only allowed in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    const adminSession = isDevelopment ? request.cookies.get('admin_session')?.value : null;

    // Allow access if EITHER authentication method is present (test mode only in dev)
    const isAuthenticated = (isDevelopment && adminSession === 'authenticated') || (supabaseAccess && supabaseRefresh);

    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Authentication present - add security headers and continue
    // Note: Full session validation happens in the layout via getAdminUser()
    // This middleware provides basic authentication presence check for performance
    const response = NextResponse.next();

    // Security headers for admin pages
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, nocache');

    return response;
  }

  // ============================================================================
  // SEO BLOCKING: Add X-Robots-Tag header for other private routes
  // ============================================================================
  // This is defense-in-depth alongside robots.txt and page metadata
  const isPrivateRoute =
    pathname.startsWith('/discovery') ||
    pathname.startsWith('/q/');

  if (isPrivateRoute) {
    const response = NextResponse.next();
    response.headers.set(
      'X-Robots-Tag',
      'noindex, nofollow, noarchive, nosnippet, nocache'
    );
    return response;
  }

  // Only apply CSRF protection to API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip CSRF check for safe methods (GET, HEAD, OPTIONS)
  const method = request.method;
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

  if (safeMethods.includes(method)) {
    return NextResponse.next();
  }

  // For state-changing methods (POST, PUT, DELETE, PATCH), verify origin
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');

  // In development, allow localhost with different ports
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Check Origin header first (more reliable and harder to spoof)
  if (origin) {
    const originUrl = new URL(origin);
    const originHost = originUrl.host;

    // Check if origin matches host
    // In development, allow localhost variations (e.g., localhost:3000, 127.0.0.1:3000)
    const isOriginValid = isDevelopment
      ? originHost.includes('localhost') || originHost.includes('127.0.0.1')
      : originHost === host;

    if (!isOriginValid) {
      console.warn('CSRF: Request blocked - origin mismatch', {
        origin: origin,
        host: host,
        path: request.nextUrl.pathname,
        method: request.method,
      });

      // Log the CSRF violation (non-blocking)
      logCsrfViolation({
        ip_address: getClientIp(request),
        user_agent: request.headers.get('user-agent') || undefined,
        origin: origin,
        expected_origin: host || undefined,
        path: request.nextUrl.pathname,
        method: request.method,
      }).catch((err) => console.error('Failed to log CSRF violation:', err));

      return new NextResponse(
        JSON.stringify({
          error: 'Forbidden: Cross-origin request not allowed',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Origin is valid, allow the request
    return NextResponse.next();
  } else if (referer) {
    // Fall back to Referer header if Origin is not present
    try {
      const refererUrl = new URL(referer);
      const refererHost = refererUrl.host;

      // Check if referer matches host
      // In development, allow localhost variations
      const isRefererValid = isDevelopment
        ? refererHost.includes('localhost') || refererHost.includes('127.0.0.1')
        : refererHost === host;

      if (!isRefererValid) {
        console.warn('CSRF: Request blocked - referer mismatch', {
          referer: referer,
          host: host,
          path: request.nextUrl.pathname,
          method: request.method,
        });

        // Log the CSRF violation (non-blocking)
        logCsrfViolation({
          ip_address: getClientIp(request),
          user_agent: request.headers.get('user-agent') || undefined,
          origin: referer,
          expected_origin: host || undefined,
          path: request.nextUrl.pathname,
          method: request.method,
        }).catch((err) => console.error('Failed to log CSRF violation:', err));

        return new NextResponse(
          JSON.stringify({
            error: 'Forbidden: Cross-origin request not allowed',
          }),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      // Referer is valid, allow the request
      return NextResponse.next();
    } catch (error) {
      // Invalid referer URL
      console.warn('CSRF: Request blocked - invalid Referer URL', {
        referer: referer,
        path: request.nextUrl.pathname,
        method: request.method,
      });

      // Log the CSRF violation (non-blocking)
      logCsrfViolation({
        ip_address: getClientIp(request),
        user_agent: request.headers.get('user-agent') || undefined,
        origin: referer,
        expected_origin: host || undefined,
        path: request.nextUrl.pathname,
        method: request.method,
      }).catch((err) => console.error('Failed to log CSRF violation:', err));

      return new NextResponse(
        JSON.stringify({
          error: 'Forbidden: Invalid request origin',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } else {
    // Neither Origin nor Referer header present
    // In production, we should reject these for security
    if (!isDevelopment) {
      console.warn('CSRF: Request blocked - missing Origin and Referer headers', {
        path: request.nextUrl.pathname,
        method: request.method,
        host: host,
      });

      // Log the CSRF violation (non-blocking)
      logCsrfViolation({
        ip_address: getClientIp(request),
        user_agent: request.headers.get('user-agent') || undefined,
        origin: undefined,
        expected_origin: host || undefined,
        path: request.nextUrl.pathname,
        method: request.method,
      }).catch((err) => console.error('Failed to log CSRF violation:', err));

      return new NextResponse(
        JSON.stringify({
          error: 'Forbidden: Invalid request origin',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // In development, allow for testing with tools like Postman
    console.warn('CSRF: Allowing request without Origin or Referer (development mode)');
    return NextResponse.next();
  }
}

/**
 * Configure which routes this middleware applies to
 *
 * Currently applied to:
 * - /admin/* - Admin pages (for X-Robots-Tag header)
 * - /discovery/* - Discovery pages (for X-Robots-Tag header)
 * - /q/* - Questionnaire pages (for X-Robots-Tag header)
 * - /api/* - All API routes (for CSRF protection)
 *
 * Excluded:
 * - Static files (_next/static)
 * - Image optimization (_next/image)
 * - Favicon
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
