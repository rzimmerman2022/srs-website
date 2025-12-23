import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security Middleware for CSRF Protection
 *
 * This middleware protects against Cross-Site Request Forgery (CSRF) attacks
 * by validating that state-changing requests originate from the same domain.
 *
 * CSRF Protection Strategy:
 * - For GET requests: Allow all (read-only operations are safe)
 * - For POST/PUT/DELETE/PATCH: Verify Origin or Referer header matches the request host
 * - Origin header is checked first (more reliable and harder to spoof)
 * - If Origin is missing, fall back to Referer header validation
 * - If neither header is present or doesn't match: Return 403 Forbidden
 *
 * Additional Security Notes:
 * - This is a defense-in-depth measure, complementing other security controls
 * - CORS headers should also be configured appropriately
 * - For API endpoints handling sensitive data, consider adding CSRF tokens
 * - Rate limiting should be implemented separately (see route.ts comments)
 */

export function middleware(request: NextRequest) {
  // Admin route protection - check for authentication cookies
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Support dual-mode authentication:
    // 1. admin_session cookie (simple mode for testing)
    // 2. sb-access-token/sb-refresh-token (Supabase mode for production)
    const adminSession = request.cookies.get('admin_session')?.value;
    const supabaseAccess = request.cookies.get('sb-access-token')?.value;
    const supabaseRefresh = request.cookies.get('sb-refresh-token')?.value;

    // Allow access if EITHER authentication method is present
    const isAuthenticated = adminSession === 'authenticated' || (supabaseAccess && supabaseRefresh);

    if (!isAuthenticated) {
      // Redirect to login if no valid authentication found
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Only apply CSRF protection to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
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
 * - /api/* - All API routes
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
