import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Get env vars
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@southwestresumes.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    console.log('[LOGIN TEST] Email from env:', ADMIN_EMAIL);
    console.log('[LOGIN TEST] Password set:', !!ADMIN_PASSWORD);
    console.log('[LOGIN TEST] Received email:', email);
    console.log('[LOGIN TEST] Received password:', '***');
    console.log('[LOGIN TEST] Email match:', email === ADMIN_EMAIL);
    console.log('[LOGIN TEST] Password match:', password === ADMIN_PASSWORD);

    // Check credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          debug: {
            emailMatch: email === ADMIN_EMAIL,
            expectedEmail: ADMIN_EMAIL,
            receivedEmail: email,
          }
        },
        { status: 401 }
      );
    }

    // Success
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful - TEST ROUTE',
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': 'admin_session=authenticated; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=28800',
        },
      }
    );
  } catch (error) {
    console.error('[LOGIN TEST] Error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred during login',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
