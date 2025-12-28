/**
 * HubSpot Integration Types
 *
 * SUBAGENT-2: claude-opus-4-5/SUBAGENT-2/hubspot-integration/2025-12-23T-implementation
 * Fortune 50 / World-Class Client Onboarding System
 */

// ============================================================================
// HubSpot Contact Types
// ============================================================================

export interface HubSpotContactProperties {
  // Standard HubSpot properties
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;

  // Custom properties for SRS integration
  client_id: string;
  package_type: 'discovery' | 'elite' | 'executive';
  questionnaire_status: 'pending' | 'active' | 'completed' | 'archived';
  questionnaire_id: string;
  questionnaire_link?: string;
  access_token_id?: string;
  supabase_id: string;
  onboarded_at?: string;
  completed_at?: string;
}

export interface HubSpotContact {
  id: string;
  properties: HubSpotContactProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HubSpotContactCreateInput {
  properties: Partial<HubSpotContactProperties>;
  associations?: HubSpotAssociation[];
}

export interface HubSpotContactUpdateInput {
  properties: Partial<HubSpotContactProperties>;
}

// ============================================================================
// HubSpot Deal Types
// ============================================================================

export interface HubSpotDealProperties {
  dealname: string;
  dealstage: string;
  amount?: string;
  closedate?: string;
  pipeline?: string;

  // Custom properties
  client_id: string;
  questionnaire_completion?: string;
  supabase_client_id: string;
}

export interface HubSpotDeal {
  id: string;
  properties: HubSpotDealProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

// ============================================================================
// HubSpot Association Types
// ============================================================================

export interface HubSpotAssociation {
  to: {
    id: string;
  };
  types: Array<{
    associationCategory: 'HUBSPOT_DEFINED' | 'USER_DEFINED';
    associationTypeId: number;
  }>;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface HubSpotApiResponse<T> {
  results: T[];
  paging?: {
    next?: {
      after: string;
      link: string;
    };
  };
}

export interface HubSpotBatchResponse<T> {
  status: 'COMPLETE' | 'PENDING';
  results: T[];
  numErrors?: number;
  errors?: HubSpotError[];
}

export interface HubSpotError {
  status: string;
  category: string;
  message: string;
  correlationId: string;
  context?: Record<string, string[]>;
}

// ============================================================================
// Search Types
// ============================================================================

export interface HubSpotSearchFilter {
  propertyName: string;
  operator: 'EQ' | 'NEQ' | 'LT' | 'LTE' | 'GT' | 'GTE' | 'CONTAINS_TOKEN' | 'NOT_CONTAINS_TOKEN';
  value: string;
}

export interface HubSpotSearchFilterGroup {
  filters: HubSpotSearchFilter[];
}

export interface HubSpotSearchRequest {
  filterGroups: HubSpotSearchFilterGroup[];
  sorts?: Array<{
    propertyName: string;
    direction: 'ASCENDING' | 'DESCENDING';
  }>;
  properties?: string[];
  limit?: number;
  after?: string;
}

// ============================================================================
// Webhook Types
// ============================================================================

export interface HubSpotWebhookEvent {
  objectId: number;
  propertyName?: string;
  propertyValue?: string;
  changeSource: string;
  eventId: number;
  subscriptionId: number;
  portalId: number;
  appId: number;
  occurredAt: number;
  subscriptionType: 'contact.creation' | 'contact.deletion' | 'contact.propertyChange' | 'deal.creation' | 'deal.propertyChange';
  attemptNumber: number;
}

// ============================================================================
// Sync Types
// ============================================================================

export type SyncDirection = 'supabase_to_hubspot' | 'hubspot_to_supabase';
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'error';

export interface SyncState {
  id: string;
  client_id: string;
  hubspot_contact_id: string | null;
  hubspot_deal_id: string | null;
  last_synced_at: string | null;
  sync_status: SyncStatus;
  sync_direction: SyncDirection | null;
  error_message: string | null;
  retry_count: number;
  created_at: string;
  updated_at: string;
}

export interface SyncQueueItem {
  id: string;
  entity_type: 'client' | 'response';
  entity_id: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  max_attempts: number;
  scheduled_for: string;
  processed_at: string | null;
  error_message: string | null;
  created_at: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface HubSpotConfig {
  accessToken: string;
  portalId?: string;
  apiVersion: 'v3';
  baseUrl: string;
  rateLimitPerTenSeconds: number;
  dailyLimit: number;
}

// ============================================================================
// Rate Limiting Types
// ============================================================================

export interface RateLimitState {
  tokens: number;
  lastRefill: number;
  requestsToday: number;
  lastResetDate: string;
}

// ============================================================================
// Conflict Resolution Types
// ============================================================================

export interface SyncConflict {
  field: string;
  hubspotValue: unknown;
  supabaseValue: unknown;
  hubspotUpdatedAt: Date;
  supabaseUpdatedAt: Date;
}

export type SourceOfTruth = 'hubspot' | 'supabase' | 'most_recent';

export const SOURCE_OF_TRUTH_MAP: Record<string, SourceOfTruth> = {
  email: 'hubspot',
  phone: 'hubspot',
  full_name: 'hubspot',
  package_type: 'hubspot',
  status: 'supabase',
  questionnaire_id: 'supabase',
  access_token_id: 'supabase',
  notes: 'hubspot',
} as const;
