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
 * - For POST/PUT/DELETE/PATCH: Verify Origin header matches the request host
 * - If Origin is missing or doesn't match: Return 403 Forbidden
 *
 * Additional Security Notes:
 * - This is a defense-in-depth measure, complementing other security controls
 * - CORS headers should also be configured appropriately
 * - For API endpoints handling sensitive data, consider adding CSRF tokens
 * - Rate limiting should be implemented separately (see route.ts comments)
 */

export function middleware(request: NextRequest) {
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
  const host = request.headers.get('host');

  // In development, allow localhost with different ports
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!origin) {
    // No origin header - could be a direct API call or curl
    // In production, we should reject these for security
    if (!isDevelopment) {
      console.warn('CSRF: Request blocked - missing Origin header', {
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
    console.warn('CSRF: Allowing request without Origin (development mode)');
    return NextResponse.next();
  }

  // Extract hostname from origin (remove protocol and port for comparison)
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
