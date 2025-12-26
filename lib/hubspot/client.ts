/**
 * HubSpot API Client
 *
 * SUBAGENT-2: claude-opus-4-5/SUBAGENT-2/hubspot-integration/2025-12-23T-implementation
 * Fortune 50 / World-Class Client Onboarding System
 *
 * Core API client with rate limiting, error handling, and retry logic.
 */

import { getHubSpotConfig, HUBSPOT_FEATURES } from './config';
import { getRateLimiter, withRetry, RateLimitError } from './rate-limiter';
import {
  HubSpotContact,
  HubSpotContactCreateInput,
  HubSpotContactUpdateInput,
  HubSpotDeal,
  HubSpotApiResponse,
  HubSpotBatchResponse,
  HubSpotSearchRequest,
  HubSpotError,
  RateLimitState,
} from './types';

// ============================================================================
// API Error Types
// ============================================================================

export class HubSpotApiError extends Error {
  public readonly statusCode: number;
  public readonly category: string;
  public readonly correlationId: string;
  public readonly context?: Record<string, string[]>;

  constructor(error: HubSpotError & { statusCode: number }) {
    super(error.message);
    this.name = 'HubSpotApiError';
    this.statusCode = error.statusCode;
    this.category = error.category;
    this.correlationId = error.correlationId;
    this.context = error.context;
  }
}

// ============================================================================
// HubSpot API Client Class
// ============================================================================

export class HubSpotClient {
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly rateLimiter = getRateLimiter();

  constructor() {
    const config = getHubSpotConfig();
    this.baseUrl = config.baseUrl;
    this.accessToken = config.accessToken;
  }

  // ==========================================================================
  // Contact Operations
  // ==========================================================================

  /**
   * Create a new contact in HubSpot
   */
  async createContact(input: HubSpotContactCreateInput): Promise<HubSpotContact> {
    return withRetry(async () => {
      await this.rateLimiter.acquireToken();

      const response = await this.request<HubSpotContact>(
        '/crm/v3/objects/contacts',
        {
          method: 'POST',
          body: JSON.stringify(input),
        }
      );

      this.log('Contact created', { id: response.id });
      return response;
    });
  }

  /**
   * Get a contact by ID
   */
  async getContact(
    contactId: string,
    properties?: string[]
  ): Promise<HubSpotContact> {
    await this.rateLimiter.acquireToken();

    const params = new URLSearchParams();
    if (properties?.length) {
      params.set('properties', properties.join(','));
    }

    const url = `/crm/v3/objects/contacts/${contactId}${params.toString() ? `?${params}` : ''}`;
    return this.request<HubSpotContact>(url);
  }

  /**
   * Update an existing contact
   */
  async updateContact(
    contactId: string,
    input: HubSpotContactUpdateInput
  ): Promise<HubSpotContact> {
    return withRetry(async () => {
      await this.rateLimiter.acquireToken();

      const response = await this.request<HubSpotContact>(
        `/crm/v3/objects/contacts/${contactId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(input),
        }
      );

      this.log('Contact updated', { id: contactId });
      return response;
    });
  }

  /**
   * Search for contacts
   */
  async searchContacts(
    searchRequest: HubSpotSearchRequest
  ): Promise<HubSpotApiResponse<HubSpotContact>> {
    await this.rateLimiter.acquireToken();

    return this.request<HubSpotApiResponse<HubSpotContact>>(
      '/crm/v3/objects/contacts/search',
      {
        method: 'POST',
        body: JSON.stringify(searchRequest),
      }
    );
  }

  /**
   * Find contact by email
   */
  async findContactByEmail(email: string): Promise<HubSpotContact | null> {
    const response = await this.searchContacts({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: 'EQ',
              value: email,
            },
          ],
        },
      ],
      limit: 1,
    });

    return response.results[0] || null;
  }

  /**
   * Find contact by Supabase ID
   */
  async findContactBySupabaseId(
    supabaseId: string
  ): Promise<HubSpotContact | null> {
    const response = await this.searchContacts({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'supabase_id',
              operator: 'EQ',
              value: supabaseId,
            },
          ],
        },
      ],
      limit: 1,
    });

    return response.results[0] || null;
  }

  /**
   * Batch create contacts
   */
  async batchCreateContacts(
    inputs: HubSpotContactCreateInput[]
  ): Promise<HubSpotBatchResponse<HubSpotContact>> {
    const chunks = this.chunkArray(inputs, 100);
    const allResults: HubSpotContact[] = [];

    for (const chunk of chunks) {
      await this.rateLimiter.acquireToken(Math.ceil(chunk.length / 10)); // Batch uses more capacity

      const response = await this.request<HubSpotBatchResponse<HubSpotContact>>(
        '/crm/v3/objects/contacts/batch/create',
        {
          method: 'POST',
          body: JSON.stringify({ inputs: chunk }),
        }
      );

      allResults.push(...response.results);
    }

    return {
      status: 'COMPLETE',
      results: allResults,
    };
  }

  /**
   * Batch update contacts
   */
  async batchUpdateContacts(
    updates: Array<{ id: string; properties: Record<string, unknown> }>
  ): Promise<HubSpotBatchResponse<HubSpotContact>> {
    const chunks = this.chunkArray(updates, 100);
    const allResults: HubSpotContact[] = [];

    for (const chunk of chunks) {
      await this.rateLimiter.acquireToken(Math.ceil(chunk.length / 10));

      const response = await this.request<HubSpotBatchResponse<HubSpotContact>>(
        '/crm/v3/objects/contacts/batch/update',
        {
          method: 'POST',
          body: JSON.stringify({ inputs: chunk }),
        }
      );

      allResults.push(...response.results);
    }

    return {
      status: 'COMPLETE',
      results: allResults,
    };
  }

  // ==========================================================================
  // Deal Operations
  // ==========================================================================

  /**
   * Create a new deal
   */
  async createDeal(properties: Record<string, unknown>): Promise<HubSpotDeal> {
    return withRetry(async () => {
      await this.rateLimiter.acquireToken();

      const response = await this.request<HubSpotDeal>(
        '/crm/v3/objects/deals',
        {
          method: 'POST',
          body: JSON.stringify({ properties }),
        }
      );

      this.log('Deal created', { id: response.id });
      return response;
    });
  }

  /**
   * Update a deal
   */
  async updateDeal(
    dealId: string,
    properties: Record<string, unknown>
  ): Promise<HubSpotDeal> {
    return withRetry(async () => {
      await this.rateLimiter.acquireToken();

      const response = await this.request<HubSpotDeal>(
        `/crm/v3/objects/deals/${dealId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ properties }),
        }
      );

      this.log('Deal updated', { id: dealId });
      return response;
    });
  }

  /**
   * Associate a contact with a deal
   */
  async associateContactToDeal(
    dealId: string,
    contactId: string
  ): Promise<void> {
    await this.rateLimiter.acquireToken();

    // Association type 3 = Contact to Deal (standard HubSpot defined)
    await this.request(
      `/crm/v3/objects/deals/${dealId}/associations/contacts/${contactId}/3`,
      { method: 'PUT' }
    );

    this.log('Contact associated with deal', { dealId, contactId });
  }

  // ==========================================================================
  // Properties API
  // ==========================================================================

  /**
   * Create a custom property
   */
  async createProperty(
    objectType: 'contacts' | 'deals',
    property: {
      name: string;
      label: string;
      type: string;
      fieldType: string;
      groupName: string;
      description?: string;
      options?: Array<{ label: string; value: string }>;
    }
  ): Promise<unknown> {
    await this.rateLimiter.acquireToken();

    return this.request(`/crm/v3/properties/${objectType}`, {
      method: 'POST',
      body: JSON.stringify(property),
    });
  }

  /**
   * Get all properties for an object type
   */
  async getProperties(
    objectType: 'contacts' | 'deals'
  ): Promise<{ results: Array<{ name: string; label: string }> }> {
    await this.rateLimiter.acquireToken();

    return this.request(`/crm/v3/properties/${objectType}`);
  }

  // ==========================================================================
  // Monitoring & Health
  // ==========================================================================

  /**
   * Get current rate limit status
   */
  getRateLimitStatus() {
    return this.rateLimiter.getState();
  }

  /**
   * Check if HubSpot integration is healthy
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    rateLimitState: RateLimitState;
    error?: string;
  }> {
    try {
      // Simple API call to verify connectivity
      await this.getProperties('contacts');

      return {
        healthy: true,
        rateLimitState: this.getRateLimitStatus(),
      };
    } catch (error) {
      return {
        healthy: false,
        rateLimitState: this.getRateLimitStatus(),
        error: (error as Error).message,
      };
    }
  }

  // ==========================================================================
  // Private Methods
  // ==========================================================================

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Handle rate limit response
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '10', 10) * 1000;
      throw new RateLimitError('HubSpot rate limit exceeded', retryAfter);
    }

    // Handle other errors
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new HubSpotApiError({
        statusCode: response.status,
        status: response.statusText,
        category: errorBody.category || 'UNKNOWN',
        message: errorBody.message || `HTTP ${response.status}`,
        correlationId: errorBody.correlationId || 'unknown',
        context: errorBody.context,
      });
    }

    // Return empty object for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private log(message: string, data?: Record<string, unknown>): void {
    if (HUBSPOT_FEATURES.DEBUG) {
      console.log(`[HubSpot] ${message}`, data || '');
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let clientInstance: HubSpotClient | null = null;

export function getHubSpotClient(): HubSpotClient {
  if (!clientInstance) {
    clientInstance = new HubSpotClient();
  }
  return clientInstance;
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Check if HubSpot integration is enabled
 */
export function isHubSpotEnabled(): boolean {
  return HUBSPOT_FEATURES.ENABLED;
}
