/**
 * HubSpot Manual Sync API
 *
 * SUBAGENT-4: claude-opus-4-5/SUBAGENT-4/hubspot-integration/2025-12-23T-admin-ui
 * Fortune 50 / World-Class Client Onboarding System
 *
 * Allows admin to manually trigger HubSpot sync for a client.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAdminUser } from '@/lib/auth/admin-auth';
import { getHubSpotSyncService, isHubSpotEnabled } from '@/lib/hubspot';
import { Client } from '@/lib/supabase/types';

// ============================================================================
// Supabase Client
// ============================================================================

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ============================================================================
// POST - Trigger Manual Sync
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  // Auth check
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  // Check if HubSpot is enabled
  if (!isHubSpotEnabled()) {
    return NextResponse.json(
      { error: 'HubSpot integration is not enabled' },
      { status: 400 }
    );
  }

  const { clientId } = await params;

  try {
    const supabase = getSupabaseAdmin();

    // Fetch client from database
    const { data: client, error: fetchError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (fetchError || !client) {
      // Try by client_id if not found by id
      const { data: clientByClientId, error: fetchError2 } = await supabase
        .from('clients')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (fetchError2 || !clientByClientId) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        );
      }

      // Use this client
      const syncService = getHubSpotSyncService();
      const result = await syncService.syncClientToHubSpot(clientByClientId as Client);

      return NextResponse.json({
        success: result.success,
        hubspotContactId: result.hubspotContactId,
        hubspotDealId: result.hubspotDealId,
        error: result.error,
      });
    }

    // Sync to HubSpot
    const syncService = getHubSpotSyncService();
    const result = await syncService.syncClientToHubSpot(client as Client);

    return NextResponse.json({
      success: result.success,
      hubspotContactId: result.hubspotContactId,
      hubspotDealId: result.hubspotDealId,
      error: result.error,
    });
  } catch (error) {
    console.error('[HubSpot Sync API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to sync with HubSpot' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET - Get Sync Status
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  // Auth check
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  const { clientId } = await params;

  try {
    const supabase = getSupabaseAdmin();

    // Fetch client with HubSpot data
    const { data: client, error: fetchError } = await supabase
      .from('clients')
      .select('id, hubspot_contact_id, hubspot_deal_id, hubspot_synced_at')
      .or(`id.eq.${clientId},client_id.eq.${clientId}`)
      .single();

    if (fetchError || !client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Fetch sync state
    const { data: syncState } = await supabase
      .from('hubspot_sync_state')
      .select('*')
      .eq('client_id', client.id)
      .single();

    return NextResponse.json({
      hubspotEnabled: isHubSpotEnabled(),
      hubspotContactId: client.hubspot_contact_id,
      hubspotDealId: client.hubspot_deal_id,
      lastSyncedAt: client.hubspot_synced_at,
      syncStatus: syncState?.sync_status || null,
      errorMessage: syncState?.error_message || null,
    });
  } catch (error) {
    console.error('[HubSpot Sync Status API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}
