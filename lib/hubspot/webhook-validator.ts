/**
 * HubSpot Webhook Signature Validator
 *
 * SUBAGENT-3: claude-opus-4-5/SUBAGENT-3/hubspot-integration/2025-12-23T-webhooks
 * Fortune 50 / World-Class Client Onboarding System
 *
 * Validates incoming webhook requests from HubSpot using HMAC-SHA256.
 */

import { createHmac } from 'crypto';
import { HubSpotWebhookEvent } from './types';

// ============================================================================
// Webhook Validation
// ============================================================================

/**
 * Validate HubSpot webhook signature
 *
 * HubSpot sends X-HubSpot-Signature-v3 header with HMAC-SHA256 signature
 * of: requestMethod + requestUri + requestBody + timestamp
 */
export function validateWebhookSignature(
  signature: string | null,
  timestamp: string | null,
  requestMethod: string,
  requestUri: string,
  requestBody: string
): boolean {
  if (!signature || !timestamp) {
    console.error('[HubSpot Webhook] Missing signature or timestamp');
    return false;
  }

  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  if (!clientSecret) {
    console.error('[HubSpot Webhook] HUBSPOT_CLIENT_SECRET not configured');
    return false;
  }

  // Check timestamp is recent (within 5 minutes)
  const timestampMs = parseInt(timestamp, 10);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (Math.abs(now - timestampMs) > fiveMinutes) {
    console.error('[HubSpot Webhook] Request timestamp too old or in future');
    return false;
  }

  // Build the source string
  const sourceString = `${requestMethod}${requestUri}${requestBody}${timestamp}`;

  // Compute expected signature
  const expectedSignature = createHmac('sha256', clientSecret)
    .update(sourceString)
    .digest('base64');

  // Constant-time comparison to prevent timing attacks
  if (signature.length !== expectedSignature.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Alternative validation for v2 signatures (fallback)
 */
export function validateWebhookSignatureV2(
  signature: string | null,
  requestBody: string
): boolean {
  if (!signature) {
    return false;
  }

  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  if (!clientSecret) {
    return false;
  }

  const sourceString = clientSecret + requestBody;
  const expectedSignature = createHmac('sha256', clientSecret)
    .update(sourceString)
    .digest('hex');

  return signature === expectedSignature;
}

// ============================================================================
// Event Processing
// ============================================================================

/**
 * Parse and validate webhook payload
 */
export function parseWebhookPayload(body: string): HubSpotWebhookEvent[] {
  try {
    const events = JSON.parse(body);

    if (!Array.isArray(events)) {
      console.error('[HubSpot Webhook] Payload is not an array');
      return [];
    }

    // Validate each event has required fields
    return events.filter((event) => {
      if (!event.objectId || !event.subscriptionType) {
        console.warn('[HubSpot Webhook] Invalid event:', event);
        return false;
      }
      return true;
    });
  } catch (error) {
    console.error('[HubSpot Webhook] Failed to parse payload:', error);
    return [];
  }
}

/**
 * Check if event has already been processed (idempotency)
 * Uses generic supabase client type to avoid complex generics
 */
export async function isEventProcessed(
  eventId: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<boolean> {
  const { data } = await supabase
    .from('hubspot_webhook_events')
    .select('id')
    .eq('event_id', eventId.toString())
    .single();

  return !!data;
}

/**
 * Extract changed properties from webhook event
 */
export function extractChangedProperties(
  event: HubSpotWebhookEvent
): Record<string, unknown> {
  const changes: Record<string, unknown> = {};

  if (event.propertyName && event.propertyValue !== undefined) {
    changes[event.propertyName] = event.propertyValue;
  }

  return changes;
}

// ============================================================================
// Event Type Helpers
// ============================================================================

export function isContactEvent(event: HubSpotWebhookEvent): boolean {
  return event.subscriptionType.startsWith('contact.');
}

export function isDealEvent(event: HubSpotWebhookEvent): boolean {
  return event.subscriptionType.startsWith('deal.');
}

export function isCreationEvent(event: HubSpotWebhookEvent): boolean {
  return event.subscriptionType.endsWith('.creation');
}

export function isDeletionEvent(event: HubSpotWebhookEvent): boolean {
  return event.subscriptionType.endsWith('.deletion');
}

export function isPropertyChangeEvent(event: HubSpotWebhookEvent): boolean {
  return event.subscriptionType.endsWith('.propertyChange');
}
