# HubSpot CRM Integration

**SUBAGENT-5: claude-opus-4-5/SUBAGENT-5/hubspot-integration/2025-12-23T-documentation**
Fortune 50 / World-Class Client Onboarding System

## Overview

This document describes the bi-directional integration between Southwest Resume Systems (SRS) and HubSpot CRM. The integration enables automatic synchronization of client data, questionnaire status, and deal tracking.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          HubSpot CRM                            │
│  ┌──────────────┐        ┌──────────────┐                      │
│  │   Contacts   │        │    Deals     │                      │
│  └──────┬───────┘        └──────┬───────┘                      │
└─────────┼──────────────────────┼──────────────────────────────┘
          │                      │
          │ Webhooks             │ Webhooks
          ↓                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SRS Next.js Application                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  lib/hubspot/          - API Client & Sync Service       │  │
│  │  app/api/webhooks/     - Webhook Handler                 │  │
│  │  app/api/admin/...     - Admin API with Sync             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────┬───────────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase PostgreSQL                        │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────┐   │
│  │   clients    │  │ hubspot_sync_  │  │  hubspot_webhook │   │
│  │              │  │    state       │  │     _events      │   │
│  └──────────────┘  └────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Create HubSpot Private App

1. Go to HubSpot → Settings → Account Setup → Integrations → Private Apps
2. Click "Create a private app"
3. Name it "SRS Integration"
4. Select scopes:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`
   - `crm.schemas.contacts.read`
   - `crm.schemas.deals.read`
5. Copy the access token

### 2. Configure Environment Variables

Add to `.env.local`:

```bash
# HubSpot Integration
HUBSPOT_PRIVATE_APP_TOKEN=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
HUBSPOT_CLIENT_SECRET=your-client-secret-for-webhooks
HUBSPOT_PORTAL_ID=12345678

# Feature Flags
HUBSPOT_ENABLED=true
HUBSPOT_WEBHOOKS_ENABLED=true
HUBSPOT_BIDIRECTIONAL_SYNC=true
HUBSPOT_CREATE_DEALS=true
HUBSPOT_DEBUG=false
```

### 3. Run Database Migrations

Execute in Supabase SQL Editor:

1. First, run the clients table migration:
   - File: `lib/supabase/migrations/002_clients_table.sql`

2. Then, run the HubSpot integration migration:
   - File: `lib/supabase/migrations/003_hubspot_integration.sql`

### 4. Create Custom Properties in HubSpot

The integration requires custom contact properties in HubSpot. These should be created manually or via the HubSpot API:

| Property Name | Label | Type | Description |
|--------------|-------|------|-------------|
| client_id | SRS Client ID | String | Unique identifier from SRS |
| package_type | Package Type | Dropdown | discovery, elite, executive |
| questionnaire_status | Questionnaire Status | Dropdown | pending, active, completed, archived |
| questionnaire_id | Questionnaire ID | String | Questionnaire identifier |
| questionnaire_link | Questionnaire Link | String | Direct link to questionnaire |
| supabase_id | Supabase ID | String | UUID from database |
| onboarded_at | Onboarded At | Date | Onboarding timestamp |
| completed_at | Completed At | Date | Completion timestamp |

### 5. Set Up Webhooks (Optional)

If using bi-directional sync:

1. Go to HubSpot → Settings → Account Setup → Integrations → Private Apps
2. Select your app → Webhooks
3. Add subscription:
   - Object: Contact
   - Event: Property Change
   - Target URL: `https://yourdomain.com/api/webhooks/hubspot`

## File Structure

```
lib/hubspot/
├── index.ts           # Public API exports
├── types.ts           # TypeScript types
├── config.ts          # Configuration & feature flags
├── client.ts          # HubSpot API client
├── rate-limiter.ts    # Token bucket rate limiting
├── sync-service.ts    # Bi-directional sync logic
└── webhook-validator.ts # Webhook signature validation

app/api/
├── webhooks/hubspot/route.ts              # Webhook receiver
└── admin/clients/
    ├── create/route.ts                    # Client creation with HubSpot sync
    └── [clientId]/hubspot-sync/route.ts   # Manual sync trigger

components/admin/
└── HubSpotSyncStatus.tsx                  # Sync status UI component

lib/supabase/migrations/
├── 002_clients_table.sql                  # Clients table
└── 003_hubspot_integration.sql            # HubSpot sync tables
```

## Data Flow

### Client Creation (Supabase → HubSpot)

1. Admin creates client via `/admin/clients/new`
2. API creates client record in Supabase
3. If `HUBSPOT_ENABLED=true`, sync service:
   - Searches for existing contact by email
   - Creates or updates HubSpot contact
   - Creates associated deal (if `HUBSPOT_CREATE_DEALS=true`)
   - Updates Supabase with HubSpot IDs

### Status Updates (Supabase → HubSpot)

When questionnaire status changes:
1. Client completes questionnaire
2. Status updated in Supabase
3. Sync service updates HubSpot contact properties
4. Deal stage updated accordingly

### Contact Updates (HubSpot → Supabase)

When contact modified in HubSpot:
1. HubSpot sends webhook to `/api/webhooks/hubspot`
2. Webhook handler validates signature
3. Sync service applies changes per source-of-truth rules

## Source of Truth

| Field | Source | Rationale |
|-------|--------|-----------|
| Email, Phone, Name | HubSpot | Sales team updates contact info |
| Package Type | HubSpot | Sales assigns packages |
| Questionnaire Status | Supabase | Application tracks completion |
| Questionnaire Answers | Supabase | Client submissions |
| Notes | HubSpot | Sales team commentary |

## Rate Limits

- **Private App**: 500 requests / 10 seconds, 500,000 / day
- Rate limiter uses token bucket algorithm
- Automatic retry with exponential backoff on 429 errors

## Monitoring

### Health Check

```typescript
import { getHubSpotClient } from '@/lib/hubspot';

const client = getHubSpotClient();
const health = await client.healthCheck();
// { healthy: true, rateLimitState: { tokens: 450, requestsToday: 1234 } }
```

### Sync Status API

```bash
GET /api/admin/clients/{clientId}/hubspot-sync
```

Response:
```json
{
  "hubspotEnabled": true,
  "hubspotContactId": "12345",
  "hubspotDealId": "67890",
  "lastSyncedAt": "2025-12-23T10:30:00Z",
  "syncStatus": "synced",
  "errorMessage": null
}
```

### Manual Sync

```bash
POST /api/admin/clients/{clientId}/hubspot-sync
```

## Troubleshooting

### Common Issues

1. **Sync fails with "HUBSPOT_PRIVATE_APP_TOKEN not set"**
   - Ensure environment variable is set
   - Restart Next.js server after adding env vars

2. **Rate limit exceeded**
   - Check `rateLimitState` in health check
   - Consider reducing sync frequency
   - Batch operations when possible

3. **Webhook signature invalid**
   - Verify `HUBSPOT_CLIENT_SECRET` matches app settings
   - Check webhook URL is correct (HTTPS only)
   - Ensure clock sync between servers

4. **Contact not syncing**
   - Check `HUBSPOT_ENABLED=true`
   - Verify custom properties exist in HubSpot
   - Check Supabase RLS policies

### Debug Mode

Enable detailed logging:

```bash
HUBSPOT_DEBUG=true
```

## Security Considerations

1. **Token Storage**: Never commit tokens to version control
2. **Webhook Validation**: All webhooks verified via HMAC-SHA256
3. **Rate Limiting**: Internal rate limiting prevents abuse
4. **RLS Policies**: Sync tables only accessible via service role

## Future Enhancements

- [ ] Email sending via HubSpot
- [ ] Marketing automation triggers
- [ ] Deal pipeline customization
- [ ] Bulk sync UI in admin dashboard
- [ ] Sync conflict resolution UI

---

**Signed:**
claude-opus-4-5/SUBAGENT-5/hubspot-integration/2025-12-23T-documentation

SIGN-OFF COMPLETE
