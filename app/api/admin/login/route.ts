import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/auth/admin-auth';
import { z } from 'zod';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * POST /api/admin/login
 * Authenticate admin user and set session cookies
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Authenticate admin
    const { user, error } = await authenticateAdmin(email, password);

    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Authentication failed' },
        { status: 401 }
      );
    }

    // Return success (cookies are already set by authenticateAdmin)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[POST /api/admin/login] Error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
