/**
 * HubSpot Webhook Handler
 *
 * SUBAGENT-3: claude-opus-4-5/SUBAGENT-3/hubspot-integration/2025-12-23T-webhooks
 * Fortune 50 / World-Class Client Onboarding System
 *
 * Receives and processes webhook events from HubSpot for real-time sync.
 *
 * Security:
 * - Validates HMAC-SHA256 signature
 * - Implements idempotency via event_id tracking
 * - Rate limits incoming requests
 * - Responds within 5 seconds (async processing)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  validateWebhookSignature,
  parseWebhookPayload,
  isEventProcessed,
  extractChangedProperties,
  isContactEvent,
  isPropertyChangeEvent,
} from '@/lib/hubspot/webhook-validator';
import { getHubSpotSyncService } from '@/lib/hubspot/sync-service';
import { HUBSPOT_FEATURES } from '@/lib/hubspot/config';
import { HubSpotWebhookEvent } from '@/lib/hubspot/types';

// ============================================================================
// Supabase Admin Client
// ============================================================================

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ============================================================================
// Rate Limiting
// ============================================================================

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const webhookRateLimitMap = new Map<string, RateLimitRecord>();
const WEBHOOK_RATE_LIMIT = 100; // Per 10 seconds
const WEBHOOK_RATE_WINDOW = 10 * 1000;

function checkWebhookRateLimit(portalId: string): boolean {
  const now = Date.now();
  const record = webhookRateLimitMap.get(portalId);

  if (!record || now > record.resetTime) {
    webhookRateLimitMap.set(portalId, { count: 1, resetTime: now + WEBHOOK_RATE_WINDOW });
    return true;
  }

  if (record.count >= WEBHOOK_RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// ============================================================================
// POST - Handle HubSpot Webhook Events
// ============================================================================

export async function POST(request: NextRequest) {
  // Check if webhooks are enabled
  if (!HUBSPOT_FEATURES.WEBHOOKS_ENABLED) {
    console.log('[HubSpot Webhook] Webhooks disabled, returning 200');
    return NextResponse.json({ received: true, processed: false });
  }

  // Get raw body for signature validation
  const rawBody = await request.text();

  // Validate signature
  const signature = request.headers.get('X-HubSpot-Signature-v3');
  const timestamp = request.headers.get('X-HubSpot-Request-Timestamp');
  const requestUri = request.url;

  const isValid = validateWebhookSignature(
    signature,
    timestamp,
    'POST',
    requestUri,
    rawBody
  );

  if (!isValid) {
    console.error('[HubSpot Webhook] Invalid signature');
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }

  // Parse webhook events
  const events = parseWebhookPayload(rawBody);

  if (events.length === 0) {
    return NextResponse.json({ received: true, processed: 0 });
  }

  // Rate limit by portal ID
  const portalId = events[0].portalId?.toString() || 'unknown';
  if (!checkWebhookRateLimit(portalId)) {
    console.warn('[HubSpot Webhook] Rate limit exceeded for portal:', portalId);
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  // Process events synchronously to prevent data loss in serverless environment
  // IMPORTANT: Vercel serverless functions may freeze/kill execution after response
  // We MUST await processing before returning, otherwise updates may be lost
  //
  // TODO: For high-volume webhooks, implement proper queue system:
  // - Vercel Queue (https://vercel.com/docs/storage/vercel-queue)
  // - Inngest (https://www.inngest.com/)
  // - Or custom queue with Redis/BullMQ
  try {
    await processEventsAsync(events);

    return NextResponse.json({
      received: true,
      processed: true,
      eventCount: events.length,
    });
  } catch (error) {
    console.error('[HubSpot Webhook] Processing error:', error);

    // Still return 200 to HubSpot so they don't retry
    // Log error for investigation
    return NextResponse.json({
      received: true,
      processed: false,
      error: 'Processing failed - check logs',
      eventCount: events.length,
    });
  }
}

// ============================================================================
// Async Event Processing
// ============================================================================

async function processEventsAsync(events: HubSpotWebhookEvent[]): Promise<void> {
  const supabase = getSupabaseAdmin();
  const syncService = getHubSpotSyncService();

  for (const event of events) {
    try {
      // Check idempotency
      const alreadyProcessed = await isEventProcessed(event.eventId, supabase);
      if (alreadyProcessed) {
        console.log('[HubSpot Webhook] Event already processed:', event.eventId);
        continue;
      }

      // Log the event
      await logWebhookEvent(supabase, event);

      // Process based on event type
      if (isContactEvent(event) && isPropertyChangeEvent(event)) {
        await processContactPropertyChange(syncService, event);
      }

      // Mark as processed
      await markEventProcessed(supabase, event.eventId);

    } catch (error) {
      console.error('[HubSpot Webhook] Error processing event:', event.eventId, error);
      await logEventError(supabase, event.eventId, (error as Error).message);
    }
  }
}

// ============================================================================
// Event Handlers
// ============================================================================

async function processContactPropertyChange(
  syncService: ReturnType<typeof getHubSpotSyncService>,
  event: HubSpotWebhookEvent
): Promise<void> {
  const changes = extractChangedProperties(event);

  if (Object.keys(changes).length === 0) {
    return;
  }

  console.log('[HubSpot Webhook] Processing contact property change:', {
    contactId: event.objectId,
    changes,
  });

  await syncService.syncHubSpotToClient(event.objectId.toString(), changes);
}

// ============================================================================
// Database Operations
// ============================================================================

async function logWebhookEvent(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  event: HubSpotWebhookEvent
): Promise<void> {
  await supabase.from('hubspot_webhook_events').insert({
    event_id: event.eventId.toString(),
    subscription_id: event.subscriptionId?.toString(),
    object_type: event.subscriptionType.split('.')[0],
    object_id: event.objectId.toString(),
    property_name: event.propertyName || null,
    property_value: event.propertyValue || null,
    raw_payload: event,
    occurred_at: new Date(event.occurredAt).toISOString(),
    processed: false,
  });
}

async function markEventProcessed(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  eventId: number
): Promise<void> {
  await supabase
    .from('hubspot_webhook_events')
    .update({
      processed: true,
      processed_at: new Date().toISOString(),
    })
    .eq('event_id', eventId.toString());
}

async function logEventError(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  eventId: number,
  errorMessage: string
): Promise<void> {
  await supabase
    .from('hubspot_webhook_events')
    .update({
      error_message: errorMessage,
    })
    .eq('event_id', eventId.toString());
}

// ============================================================================
// GET - Health Check
// ============================================================================

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    webhooksEnabled: HUBSPOT_FEATURES.WEBHOOKS_ENABLED,
    bidirectionalSync: HUBSPOT_FEATURES.BIDIRECTIONAL_SYNC,
  });
}
