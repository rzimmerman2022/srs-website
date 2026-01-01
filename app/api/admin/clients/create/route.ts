/**
 * Client Creation API with Automated Onboarding
 *
 * This endpoint handles the complete client onboarding process:
 * 1. Creates client record
 * 2. Auto-generates secure questionnaire access token
 * 3. Returns ready-to-send link
 *
 * Fortune 500-level automation - one click creates everything needed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import { getAdminUser } from '@/lib/auth/admin-auth';
import { syncNewClientToHubSpot, isHubSpotEnabled } from '@/lib/hubspot';

// ============================================================================
// SECURITY: Rate Limiting
// ============================================================================
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT = 30; // Client creation limit per hour
const RATE_WINDOW = 60 * 60 * 1000;

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
  return request.headers.get('x-real-ip') || 'unknown';
}

// ============================================================================
// Validation Schema
// ============================================================================
const createClientSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .transform((val) => val.trim()),

  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .transform((val) => val.toLowerCase().trim()),

  phone: z
    .string()
    .max(20, 'Phone must be less than 20 characters')
    .optional()
    .nullable()
    .transform((val) => val?.trim() || null),

  packageType: z
    .enum(['discovery', 'elite', 'executive'])
    .default('discovery'),

  questionnaireId: z
    .string()
    .min(1, 'Questionnaire ID is required')
    .max(100, 'Questionnaire ID must be less than 100 characters')
    .default('elite-discovery'),

  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable()
    .transform((val) => val?.trim() || null),

  sendEmail: z
    .boolean()
    .default(false),
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a URL-safe client ID from the full name
 */
function generateClientId(fullName: string): string {
  // Extract first initial and last name
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].toLowerCase().slice(0, 20);
  }

  const firstName = parts[0];
  const lastName = parts[parts.length - 1];

  // Format: first initial + last name (e.g., "jdeleon")
  const baseId = (firstName[0] + lastName).toLowerCase().replace(/[^a-z0-9]/g, '');

  // Add random suffix to ensure uniqueness
  const randomSuffix = randomBytes(2).toString('hex');

  return `${baseId}-${randomSuffix}`;
}

/**
 * Generate a cryptographically secure token
 */
function generateSecureToken(): string {
  return randomBytes(16).toString('hex');
}

/**
 * Get Supabase client with service role key
 * SECURITY: Admin operations require service_role to bypass RLS
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Use service role key for admin operations (bypasses RLS)
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

// ============================================================================
// POST - Create New Client with Auto-Generated Access
// ============================================================================
export async function POST(request: NextRequest) {
  // SECURITY: Authentication check
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  // SECURITY: Rate limiting
  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '3600' } }
    );
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
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

    const validation = createClientSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.issues.map(e => e.message).join(', ');
      return NextResponse.json(
        { error: `Validation failed: ${errors}` },
        { status: 400 }
      );
    }

    const data = validation.data;
    const clientId = generateClientId(data.fullName);

    // Get base URL for link generation
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
      `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('host')}`;

    // ========================================================================
    // STEP 1: Generate secure access token
    // ========================================================================
    const token = generateSecureToken();
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 30); // 30-day expiry

    const { data: tokenData, error: tokenError } = await supabase
      .from('questionnaire_access_tokens')
      .insert({
        client_id: clientId,
        questionnaire_id: data.questionnaireId,
        token,
        expires_at: expiresAt.toISOString(),
        revoked: false,
        access_count: 0,
        metadata: {
          created_by: admin.email,
          package_type: data.packageType,
        },
      })
      .select()
      .single();

    if (tokenError) {
      console.error('Error creating access token:', tokenError);
      return NextResponse.json(
        { error: 'Failed to create access token' },
        { status: 500 }
      );
    }

    // ========================================================================
    // STEP 2: Create client record
    // ========================================================================
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        client_id: clientId,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        package_type: data.packageType,
        status: 'pending',
        questionnaire_id: data.questionnaireId,
        access_token_id: tokenData.id,
        notes: data.notes,
        metadata: {
          created_by: admin.email,
          created_at: now.toISOString(),
        },
      })
      .select()
      .single();

    if (clientError) {
      // If client creation fails, clean up the token we created
      console.error('Error creating client:', clientError);
      await supabase
        .from('questionnaire_access_tokens')
        .delete()
        .eq('id', tokenData.id);

      // Check for duplicate email
      if (clientError.code === '23505') {
        return NextResponse.json(
          { error: 'A client with this email already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create client' },
        { status: 500 }
      );
    }

    // ========================================================================
    // STEP 3: Generate the questionnaire link
    // ========================================================================
    const questionnaireLink = `${baseUrl}/q/${token}`;

    // ========================================================================
    // STEP 4: Sync to HubSpot CRM (if enabled)
    // ========================================================================
    let hubspotSync = null;
    if (isHubSpotEnabled()) {
      try {
        hubspotSync = await syncNewClientToHubSpot({
          id: clientData.id,
          client_id: clientData.client_id,
          full_name: clientData.full_name,
          email: clientData.email,
          phone: clientData.phone,
          package_type: clientData.package_type,
          status: clientData.status,
          questionnaire_id: clientData.questionnaire_id,
          access_token_id: clientData.access_token_id,
          notes: clientData.notes,
          metadata: clientData.metadata,
          created_at: clientData.created_at,
          updated_at: clientData.updated_at,
          onboarded_at: clientData.onboarded_at,
          completed_at: clientData.completed_at,
        });
        console.log('[HubSpot] Client synced:', hubspotSync);
      } catch (hubspotError) {
        // Log but don't fail - HubSpot sync is non-blocking
        console.error('[HubSpot] Sync failed (non-blocking):', hubspotError);
      }
    }

    // ========================================================================
    // STEP 5: Optionally send welcome email (future implementation)
    // ========================================================================
    // if (data.sendEmail) {
    //   await sendWelcomeEmail(data.email, data.fullName, questionnaireLink);
    //   await supabase
    //     .from('clients')
    //     .update({
    //       status: 'active',
    //       onboarded_at: new Date().toISOString()
    //     })
    //     .eq('id', clientData.id);
    // }

    // ========================================================================
    // Return success with all generated data
    // ========================================================================
    return NextResponse.json({
      success: true,
      message: 'Client created successfully',
      client: {
        id: clientData.id,
        clientId: clientData.client_id,
        fullName: clientData.full_name,
        email: clientData.email,
        packageType: clientData.package_type,
        status: clientData.status,
      },
      questionnaire: {
        link: questionnaireLink,
        token: token,
        expiresAt: expiresAt.toISOString(),
        questionnaireId: data.questionnaireId,
      },
      hubspot: hubspotSync ? {
        synced: hubspotSync.success,
        contactId: hubspotSync.hubspotContactId,
        dealId: hubspotSync.hubspotDealId,
      } : null,
      instructions: {
        next_step: 'Copy the link and send it to your client via email or text',
        link_expires: '30 days from now',
        no_login_required: 'Client clicks link and starts immediately',
      },
    });

  } catch (error) {
    console.error('[POST /api/admin/clients/create] Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
