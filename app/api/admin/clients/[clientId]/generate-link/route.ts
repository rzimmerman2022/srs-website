import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminUser } from '@/lib/auth/admin-auth';
import { getQuestionnaireLink, getClientTokens } from '@/lib/auth/questionnaire-auth';

// ============================================================================
// SECURITY: Rate Limiting
// ============================================================================
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT = 50; // Lower limit for link generation
const RATE_WINDOW = 60 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitMap.entries()).forEach(([ip, record]) => {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  });
}, 10 * 60 * 1000);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

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

// ============================================================================
// Validation Schemas
// ============================================================================
const clientIdSchema = z
  .string()
  .min(1, 'Client ID is required')
  .max(100, 'Client ID must be less than 100 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Client ID must contain only alphanumeric characters, hyphens, and underscores'
  );

const requestBodySchema = z.object({
  questionnaireId: z.string().min(1).max(100),
});

// ============================================================================
// POST - Generate a new questionnaire access link
// ============================================================================
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  // SECURITY: Authentication check - MUST be first
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  // SECURITY: Rate limiting check
  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '3600',
        }
      }
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
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const bodyValidation = requestBodySchema.safeParse(body);
    if (!bodyValidation.success) {
      return NextResponse.json(
        { error: 'Invalid request data - questionnaireId is required' },
        { status: 400 }
      );
    }

    const { questionnaireId } = bodyValidation.data;

    // Get base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
      `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('host')}`;

    // Generate the secure link
    const link = await getQuestionnaireLink(clientId, questionnaireId, baseUrl);

    return NextResponse.json({
      success: true,
      link,
      clientId,
      questionnaireId,
      expiresIn: '30 days',
    });
  } catch (error) {
    console.error('[POST /admin/clients/[clientId]/generate-link] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate questionnaire link' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET - Get all existing tokens for a client
// ============================================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  // SECURITY: Authentication check - MUST be first
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  // SECURITY: Rate limiting check
  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '3600',
        }
      }
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

    // Get all tokens for this client
    const tokens = await getClientTokens(clientId);

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
      `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('host')}`;

    // Add full links to tokens
    const tokensWithLinks = tokens.map(token => ({
      ...token,
      link: `${baseUrl}/q/${token.token}`,
      isExpired: new Date(token.expires_at) < new Date(),
      isActive: !token.revoked && new Date(token.expires_at) > new Date(),
    }));

    return NextResponse.json({
      tokens: tokensWithLinks,
      clientId,
    });
  } catch (error) {
    console.error('[GET /admin/clients/[clientId]/generate-link] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client tokens' },
      { status: 500 }
    );
  }
}
