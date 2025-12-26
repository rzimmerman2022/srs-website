# Supabase AI Automation Guide

**Purpose**: This document enables AI models to directly manage the Supabase database without human intervention.

## Quick Reference

| Resource | Value |
|----------|-------|
| Project URL | https://aougseszcvzgxwniossn.supabase.co |
| Project Ref | aougseszcvzgxwniossn |
| Dashboard | https://supabase.com/dashboard/project/aougseszcvzgxwniossn |
| SQL Editor | https://supabase.com/dashboard/project/aougseszcvzgxwniossn/sql/new |

## Environment Variables

All credentials are stored in `.env.local`:

```bash
# Public (safe for client-side)
NEXT_PUBLIC_SUPABASE_URL=https://aougseszcvzgxwniossn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Server-side only (NEVER expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # Bypasses RLS for admin operations

# CLI Automation (for AI models)
SUPABASE_ACCESS_TOKEN=REDACTED_SUPABASE_TOKEN
SUPABASE_PROJECT_REF=aougseszcvzgxwniossn
```

## Key Differences Between Tokens

| Token | Purpose | How to Use |
|-------|---------|------------|
| **Anon Key** | Public client-side API access | `supabase.createClient(url, anonKey)` |
| **Service Role Key** | Server-side admin operations (bypasses RLS) | API calls from Next.js API routes |
| **Access Token** | Supabase CLI authentication | `supabase login` or `SUPABASE_ACCESS_TOKEN` env var |

## Running Migrations (AI Workflow)

### Option 1: Supabase CLI (Preferred)

```bash
# Set the access token
export SUPABASE_ACCESS_TOKEN=REDACTED_SUPABASE_TOKEN

# Link the project (first time only)
supabase link --project-ref aougseszcvzgxwniossn

# Push migrations
supabase db push
```

### Option 2: Direct SQL via psql

```bash
# Connection string format
psql "postgresql://postgres.[project-ref]:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# For this project:
psql "postgresql://postgres.aougseszcvzgxwniossn:REDACTED_DB_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

**Note**: Direct psql requires IPv4 add-on ($4/mo) on Supabase free tier. Use CLI method instead.

### Option 3: MCP Server (VS Code)

The Supabase MCP server is configured in VS Code for direct database access:

```json
// ~/Library/Application Support/Code/User/mcp.json
{
  "servers": {
    "supabase": {
      "type": "sse",
      "url": "https://mcp.supabase.com/mcp?project_ref=aougseszcvzgxwniossn"
    }
  }
}
```

## Migration Files Location

```
lib/supabase/migrations/
├── 001_initial_schema.sql      # Base tables (questionnaire_responses, etc.)
├── 002_clients_table.sql       # Client management table
└── 003_hubspot_integration.sql # HubSpot sync tables
```

## Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `questionnaire_responses` | Client questionnaire answers |
| `questionnaire_access_tokens` | Secure access links |
| `clients` | CRM-style client management |
| `admin_users` | Admin dashboard users |
| `admin_settings` | System configuration |

### HubSpot Integration Tables

| Table | Purpose |
|-------|---------|
| `hubspot_sync_state` | Tracks sync status per client |
| `sync_queue` | Async sync processing queue |
| `hubspot_webhook_events` | Incoming webhook event log |

## TypeScript Types

Types are defined in `lib/supabase/types.ts` and should be updated when schema changes.

## Checking Table Status

```typescript
// Check if a table exists via Supabase client
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .limit(1);

if (error?.message.includes('does not exist')) {
  // Table doesn't exist - run migrations
}
```

## Troubleshooting

### "Tenant or user not found" Error
- Verify project ref is correct: `aougseszcvzgxwniossn`
- Check access token hasn't expired

### "IPv4 incompatible" Error
- Use Supabase CLI instead of direct psql
- Or add IPv4 add-on in Supabase dashboard

### Migrations Not Running
1. Check `SUPABASE_ACCESS_TOKEN` is set
2. Run `supabase link --project-ref aougseszcvzgxwniossn`
3. Run `supabase db push`

## Security Notes

- NEVER commit `.env.local` to git (already in `.gitignore`)
- Access Token expires: 01 May 2026
- Service Role Key bypasses all RLS - use only server-side
- Database password: Only for direct psql connections

---

**Last Updated**: 2025-12-25
**Token Expiry**: 01 May 2026
