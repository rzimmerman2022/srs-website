/**
 * HubSpot Integration - Public API
 *
 * SUBAGENT-2: claude-opus-4-5/SUBAGENT-2/hubspot-integration/2025-12-23T-implementation
 * Fortune 50 / World-Class Client Onboarding System
 *
 * This module exports the public API for HubSpot integration.
 * Import from here instead of individual files.
 */

// Core client
export { HubSpotClient, getHubSpotClient, isHubSpotEnabled, HubSpotApiError } from './client';

// Sync service
export {
  HubSpotSyncService,
  getHubSpotSyncService,
  syncNewClientToHubSpot,
  syncClientStatusToHubSpot,
} from './sync-service';

// Rate limiting
export { getRateLimiter, RateLimitError, withRetry } from './rate-limiter';

// Configuration
export {
  getHubSpotConfig,
  HUBSPOT_FEATURES,
  HUBSPOT_CUSTOM_PROPERTIES,
  HUBSPOT_PIPELINE,
  mapQuestionnaireStatusToDealStage,
  PACKAGE_PRICING,
} from './config';

// Types
export type {
  HubSpotContact,
  HubSpotContactProperties,
  HubSpotContactCreateInput,
  HubSpotContactUpdateInput,
  HubSpotDeal,
  HubSpotDealProperties,
  HubSpotApiResponse,
  HubSpotBatchResponse,
  HubSpotSearchRequest,
  HubSpotSearchFilter,
  HubSpotSearchFilterGroup,
  HubSpotWebhookEvent,
  HubSpotConfig,
  SyncState,
  SyncQueueItem,
  SyncDirection,
  SyncStatus,
  SyncConflict,
  RateLimitState,
} from './types';
