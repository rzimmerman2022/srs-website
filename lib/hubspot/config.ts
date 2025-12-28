/**
 * HubSpot Configuration
 *
 * SUBAGENT-2: claude-opus-4-5/SUBAGENT-2/hubspot-integration/2025-12-23T-implementation
 * Fortune 50 / World-Class Client Onboarding System
 */

import { HubSpotConfig } from './types';

// ============================================================================
// Environment Variable Validation
// ============================================================================

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

// ============================================================================
// HubSpot Configuration
// ============================================================================

export function getHubSpotConfig(): HubSpotConfig {
  return {
    accessToken: getRequiredEnvVar('HUBSPOT_PRIVATE_APP_TOKEN'),
    portalId: getOptionalEnvVar('HUBSPOT_PORTAL_ID', ''),
    apiVersion: 'v3',
    baseUrl: 'https://api.hubapi.com',
    rateLimitPerTenSeconds: 500, // Private App limit
    dailyLimit: 500000, // Private App daily limit
  };
}

// ============================================================================
// Feature Flags
// ============================================================================

export const HUBSPOT_FEATURES = {
  // Enable/disable HubSpot integration entirely
  ENABLED: process.env.HUBSPOT_ENABLED === 'true',

  // Enable webhook processing
  WEBHOOKS_ENABLED: process.env.HUBSPOT_WEBHOOKS_ENABLED === 'true',

  // Enable bi-directional sync (vs unidirectional Supabase -> HubSpot)
  BIDIRECTIONAL_SYNC: process.env.HUBSPOT_BIDIRECTIONAL_SYNC === 'true',

  // Enable deal creation alongside contacts
  CREATE_DEALS: process.env.HUBSPOT_CREATE_DEALS === 'true',

  // Enable debug logging
  DEBUG: process.env.HUBSPOT_DEBUG === 'true',
} as const;

// ============================================================================
// Custom Property Definitions
// ============================================================================

export const HUBSPOT_CUSTOM_PROPERTIES = {
  contact: [
    {
      name: 'client_id',
      label: 'SRS Client ID',
      type: 'string',
      fieldType: 'text',
      groupName: 'srs_integration',
      description: 'Unique client identifier from Southwest Resume Systems',
    },
    {
      name: 'package_type',
      label: 'Package Type',
      type: 'enumeration',
      fieldType: 'select',
      groupName: 'srs_integration',
      description: 'Selected resume package tier',
      options: [
        { label: 'Discovery', value: 'discovery' },
        { label: 'Elite', value: 'elite' },
        { label: 'Executive', value: 'executive' },
      ],
    },
    {
      name: 'questionnaire_status',
      label: 'Questionnaire Status',
      type: 'enumeration',
      fieldType: 'select',
      groupName: 'srs_integration',
      description: 'Current status of the client questionnaire',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'questionnaire_id',
      label: 'Questionnaire ID',
      type: 'string',
      fieldType: 'text',
      groupName: 'srs_integration',
      description: 'Unique questionnaire identifier',
    },
    {
      name: 'questionnaire_link',
      label: 'Questionnaire Link',
      type: 'string',
      fieldType: 'text',
      groupName: 'srs_integration',
      description: 'Direct link to client questionnaire',
    },
    {
      name: 'supabase_id',
      label: 'Supabase ID',
      type: 'string',
      fieldType: 'text',
      groupName: 'srs_integration',
      description: 'UUID from Supabase database',
    },
    {
      name: 'onboarded_at',
      label: 'Onboarded At',
      type: 'datetime',
      fieldType: 'date',
      groupName: 'srs_integration',
      description: 'When the client was onboarded',
    },
    {
      name: 'completed_at',
      label: 'Completed At',
      type: 'datetime',
      fieldType: 'date',
      groupName: 'srs_integration',
      description: 'When the questionnaire was completed',
    },
  ],
  deal: [
    {
      name: 'client_id',
      label: 'SRS Client ID',
      type: 'string',
      fieldType: 'text',
      groupName: 'srs_integration',
      description: 'Linked client identifier',
    },
    {
      name: 'questionnaire_completion',
      label: 'Questionnaire Completion %',
      type: 'number',
      fieldType: 'number',
      groupName: 'srs_integration',
      description: 'Percentage of questionnaire completed',
    },
    {
      name: 'supabase_client_id',
      label: 'Supabase Client ID',
      type: 'string',
      fieldType: 'text',
      groupName: 'srs_integration',
      description: 'UUID of linked client in Supabase',
    },
  ],
} as const;

// ============================================================================
// Deal Pipeline Configuration
// ============================================================================

export const HUBSPOT_PIPELINE = {
  name: 'SRS Resume Services',
  stages: [
    { id: 'onboarding', label: 'Onboarding', displayOrder: 0 },
    { id: 'questionnaire_sent', label: 'Questionnaire Sent', displayOrder: 1 },
    { id: 'questionnaire_in_progress', label: 'Questionnaire In Progress', displayOrder: 2 },
    { id: 'questionnaire_completed', label: 'Questionnaire Completed', displayOrder: 3 },
    { id: 'resume_in_progress', label: 'Resume In Progress', displayOrder: 4 },
    { id: 'delivered', label: 'Delivered', displayOrder: 5 },
    { id: 'closed_won', label: 'Closed Won', displayOrder: 6 },
  ],
} as const;

// ============================================================================
// Status Mapping
// ============================================================================

export function mapQuestionnaireStatusToDealStage(
  status: 'pending' | 'active' | 'completed' | 'archived'
): string {
  const mapping: Record<string, string> = {
    pending: 'questionnaire_sent',
    active: 'questionnaire_in_progress',
    completed: 'questionnaire_completed',
    archived: 'closed_won',
  };
  return mapping[status] || 'onboarding';
}

// ============================================================================
// Package Pricing (for deal amount)
// ============================================================================

export const PACKAGE_PRICING: Record<string, number> = {
  discovery: 299,
  elite: 599,
  executive: 999,
} as const;
