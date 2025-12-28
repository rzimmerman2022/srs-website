/**
 * HubSpot Sync Service
 *
 * SUBAGENT-2: claude-opus-4-5/SUBAGENT-2/hubspot-integration/2025-12-23T-implementation
 * Fortune 50 / World-Class Client Onboarding System
 *
 * Orchestrates bi-directional sync between Supabase and HubSpot.
 */

import { createClient } from '@supabase/supabase-js';
import { getHubSpotClient, isHubSpotEnabled } from './client';
import {
  HUBSPOT_FEATURES,
  mapQuestionnaireStatusToDealStage,
  PACKAGE_PRICING,
} from './config';
import {
  SyncDirection,
  SyncStatus,
  SOURCE_OF_TRUTH_MAP,
} from './types';
import { Client } from '@/lib/supabase/types';

// ============================================================================
// Supabase Client for Sync Operations
// ============================================================================

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ============================================================================
// Sync Manager Class
// ============================================================================

export class HubSpotSyncService {
  private hubspot = getHubSpotClient();
  private supabase = getSupabaseAdmin();
  private activeSyncs = new Set<string>();

  // ==========================================================================
  // Client -> HubSpot Sync
  // ==========================================================================

  /**
   * Sync a Supabase client to HubSpot
   * Creates contact if doesn't exist, updates if exists
   */
  async syncClientToHubSpot(client: Client): Promise<{
    success: boolean;
    hubspotContactId?: string;
    hubspotDealId?: string;
    error?: string;
  }> {
    if (!isHubSpotEnabled()) {
      return { success: true }; // No-op if disabled
    }

    const syncKey = `supabase-to-hubspot-${client.id}`;

    // Prevent duplicate syncs
    if (this.activeSyncs.has(syncKey)) {
      console.log('[HubSpot Sync] Sync already in progress for client:', client.id);
      return { success: true };
    }

    this.activeSyncs.add(syncKey);

    try {
      // Check if client already has HubSpot ID
      let hubspotContactId: string | undefined = client.hubspot_contact_id ?? undefined;
      let hubspotDealId: string | undefined = client.hubspot_deal_id ?? undefined;

      // Split name into first/last
      const nameParts = client.full_name.trim().split(' ');
      const firstname = nameParts[0] || '';
      const lastname = nameParts.slice(1).join(' ') || '';

      const contactProperties = {
        email: client.email,
        firstname,
        lastname,
        phone: client.phone || undefined,
        client_id: client.client_id,
        package_type: client.package_type,
        questionnaire_status: client.status,
        questionnaire_id: client.questionnaire_id,
        supabase_id: client.id,
        onboarded_at: client.onboarded_at || undefined,
        completed_at: client.completed_at || undefined,
      };

      if (hubspotContactId) {
        // Update existing contact
        await this.hubspot.updateContact(hubspotContactId, {
          properties: contactProperties,
        });
      } else {
        // Try to find by email first
        const existingContact = await this.hubspot.findContactByEmail(client.email);

        if (existingContact) {
          hubspotContactId = existingContact.id;
          await this.hubspot.updateContact(hubspotContactId, {
            properties: contactProperties,
          });
        } else {
          // Create new contact
          const newContact = await this.hubspot.createContact({
            properties: contactProperties,
          });
          hubspotContactId = newContact.id;
        }
      }

      // Create/update deal if enabled
      if (HUBSPOT_FEATURES.CREATE_DEALS) {
        if (hubspotDealId) {
          // Update existing deal
          await this.hubspot.updateDeal(hubspotDealId, {
            dealstage: mapQuestionnaireStatusToDealStage(client.status),
            questionnaire_completion: this.calculateCompletion(client),
          });
        } else {
          // Create new deal
          const deal = await this.hubspot.createDeal({
            dealname: `${client.full_name} - ${this.formatPackageType(client.package_type)}`,
            dealstage: mapQuestionnaireStatusToDealStage(client.status),
            amount: PACKAGE_PRICING[client.package_type]?.toString() || '0',
            client_id: client.client_id,
            supabase_client_id: client.id,
            questionnaire_completion: '0',
          });
          hubspotDealId = deal.id;

          // Associate contact with deal
          await this.hubspot.associateContactToDeal(hubspotDealId, hubspotContactId);
        }
      }

      // Update Supabase with HubSpot IDs
      await this.supabase
        .from('clients')
        .update({
          hubspot_contact_id: hubspotContactId,
          hubspot_deal_id: hubspotDealId,
          hubspot_synced_at: new Date().toISOString(),
        })
        .eq('id', client.id);

      // Update sync state
      await this.updateSyncState(client.id, {
        hubspot_contact_id: hubspotContactId,
        hubspot_deal_id: hubspotDealId,
        sync_status: 'synced',
        sync_direction: 'supabase_to_hubspot',
        last_synced_at: new Date().toISOString(),
        error_message: null,
      });

      console.log('[HubSpot Sync] Client synced successfully:', {
        clientId: client.id,
        hubspotContactId,
        hubspotDealId,
      });

      return {
        success: true,
        hubspotContactId,
        hubspotDealId,
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('[HubSpot Sync] Error syncing client:', errorMessage);

      // Update sync state with error
      await this.updateSyncState(client.id, {
        sync_status: 'error',
        error_message: errorMessage,
        retry_count: await this.incrementRetryCount(client.id),
      });

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      this.activeSyncs.delete(syncKey);
    }
  }

  // ==========================================================================
  // HubSpot -> Client Sync (for webhooks)
  // ==========================================================================

  /**
   * Sync HubSpot contact changes to Supabase
   */
  async syncHubSpotToClient(
    hubspotContactId: string,
    changedProperties: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    if (!HUBSPOT_FEATURES.BIDIRECTIONAL_SYNC) {
      return { success: true }; // No-op if bidirectional sync disabled
    }

    const syncKey = `hubspot-to-supabase-${hubspotContactId}`;

    if (this.activeSyncs.has(syncKey)) {
      return { success: true };
    }

    this.activeSyncs.add(syncKey);

    try {
      // Find client by HubSpot ID
      const { data: client, error: findError } = await this.supabase
        .from('clients')
        .select('*')
        .eq('hubspot_contact_id', hubspotContactId)
        .single();

      if (findError || !client) {
        console.log('[HubSpot Sync] Client not found for HubSpot ID:', hubspotContactId);
        return { success: true }; // Not an error, just not our contact
      }

      // Resolve conflicts and apply changes
      const updates: Record<string, unknown> = {};

      // Special handling for firstname/lastname - combine them into full_name
      const hasFirstNameChange = 'firstname' in changedProperties;
      const hasLastNameChange = 'lastname' in changedProperties;

      if (hasFirstNameChange || hasLastNameChange) {
        // Fetch full contact from HubSpot to get both firstname and lastname
        // This prevents partial updates that would corrupt the full_name
        try {
          const hubspotClient = getHubSpotClient();
          const contact = await hubspotClient.getContact(
            hubspotContactId,
            ['firstname', 'lastname']
          );

          const firstname = contact.properties.firstname || '';
          const lastname = contact.properties.lastname || '';

          // Combine into full_name (trim to handle empty values)
          const fullName = [firstname, lastname].filter(Boolean).join(' ').trim();

          if (fullName && SOURCE_OF_TRUTH_MAP['full_name'] === 'hubspot') {
            updates['full_name'] = fullName;
          }
        } catch (error) {
          console.error('[HubSpot Sync] Error fetching contact for name sync:', error);
          // Fall back to what we have in changedProperties (not ideal but prevents crash)
          const firstname = changedProperties.firstname || '';
          const lastname = changedProperties.lastname || '';
          const fullName = [firstname, lastname].filter(Boolean).join(' ').trim();
          if (fullName && SOURCE_OF_TRUTH_MAP['full_name'] === 'hubspot') {
            updates['full_name'] = fullName;
          }
        }
      }

      for (const [property, value] of Object.entries(changedProperties)) {
        // Skip firstname/lastname - already handled above
        if (property === 'firstname' || property === 'lastname') continue;

        const supabaseField = this.mapHubSpotPropertyToSupabase(property);
        if (!supabaseField) continue;

        const sourceOfTruth = SOURCE_OF_TRUTH_MAP[supabaseField];

        if (sourceOfTruth === 'hubspot') {
          // HubSpot wins - apply the change
          updates[supabaseField] = value;
        } else if (sourceOfTruth === 'supabase') {
          // Supabase wins - ignore HubSpot change
          console.log(
            `[HubSpot Sync] Ignoring HubSpot change for ${supabaseField} (Supabase is source of truth)`
          );
        }
      }

      if (Object.keys(updates).length > 0) {
        updates.updated_at = new Date().toISOString();

        await this.supabase
          .from('clients')
          .update(updates)
          .eq('id', client.id);

        console.log('[HubSpot Sync] Client updated from HubSpot:', {
          clientId: client.id,
          updates,
        });
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    } finally {
      this.activeSyncs.delete(syncKey);
    }
  }

  // ==========================================================================
  // Bulk Sync Operations
  // ==========================================================================

  /**
   * Sync all clients that need syncing
   */
  async syncAllPendingClients(): Promise<{
    synced: number;
    failed: number;
    errors: string[];
  }> {
    const { data: clients, error } = await this.supabase
      .from('clients')
      .select('*')
      .or('hubspot_contact_id.is.null,hubspot_synced_at.is.null');

    if (error || !clients) {
      return { synced: 0, failed: 0, errors: [error?.message || 'Unknown error'] };
    }

    let synced = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const client of clients) {
      const result = await this.syncClientToHubSpot(client as Client);
      if (result.success) {
        synced++;
      } else {
        failed++;
        errors.push(`${client.client_id}: ${result.error}`);
      }

      // Small delay to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return { synced, failed, errors };
  }

  // ==========================================================================
  // Sync State Management
  // ==========================================================================

  /**
   * Get sync status for a client
   */
  async getSyncStatus(clientId: string): Promise<{
    synced: boolean;
    lastSyncedAt: string | null;
    hubspotContactId: string | null;
    hubspotDealId: string | null;
    error: string | null;
  }> {
    const { data } = await this.supabase
      .from('hubspot_sync_state')
      .select('*')
      .eq('client_id', clientId)
      .single();

    if (!data) {
      return {
        synced: false,
        lastSyncedAt: null,
        hubspotContactId: null,
        hubspotDealId: null,
        error: null,
      };
    }

    return {
      synced: data.sync_status === 'synced',
      lastSyncedAt: data.last_synced_at,
      hubspotContactId: data.hubspot_contact_id,
      hubspotDealId: data.hubspot_deal_id,
      error: data.error_message,
    };
  }

  // ==========================================================================
  // Private Helper Methods
  // ==========================================================================

  private async updateSyncState(
    clientId: string,
    updates: Partial<{
      hubspot_contact_id: string | null;
      hubspot_deal_id: string | null;
      sync_status: SyncStatus;
      sync_direction: SyncDirection | null;
      last_synced_at: string | null;
      error_message: string | null;
      retry_count: number;
    }>
  ): Promise<void> {
    await this.supabase
      .from('hubspot_sync_state')
      .upsert(
        {
          client_id: clientId,
          ...updates,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'client_id' }
      );
  }

  private async incrementRetryCount(clientId: string): Promise<number> {
    const { data } = await this.supabase
      .from('hubspot_sync_state')
      .select('retry_count')
      .eq('client_id', clientId)
      .single();

    return (data?.retry_count || 0) + 1;
  }

  private mapHubSpotPropertyToSupabase(hubspotProperty: string): string | null {
    const mapping: Record<string, string> = {
      email: 'email',
      phone: 'phone',
      firstname: 'full_name', // Will need special handling
      lastname: 'full_name', // Will need special handling
      package_type: 'package_type',
      questionnaire_status: 'status',
    };
    return mapping[hubspotProperty] || null;
  }

  private formatPackageType(packageType: string): string {
    return packageType.charAt(0).toUpperCase() + packageType.slice(1) + ' Package';
  }

  private calculateCompletion(client: Client): string {
    // TODO: Calculate actual questionnaire completion percentage
    if (client.status === 'completed') return '100';
    if (client.status === 'active') return '50';
    return '0';
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let syncServiceInstance: HubSpotSyncService | null = null;

export function getHubSpotSyncService(): HubSpotSyncService {
  if (!syncServiceInstance) {
    syncServiceInstance = new HubSpotSyncService();
  }
  return syncServiceInstance;
}

// ============================================================================
// Convenience Functions for API Routes
// ============================================================================

/**
 * Sync a client to HubSpot after creation
 */
export async function syncNewClientToHubSpot(client: Client) {
  return getHubSpotSyncService().syncClientToHubSpot(client);
}

/**
 * Sync a client after status update
 */
export async function syncClientStatusToHubSpot(client: Client) {
  return getHubSpotSyncService().syncClientToHubSpot(client);
}
