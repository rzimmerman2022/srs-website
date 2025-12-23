# Supabase Configuration - SRS Website

**CONFIDENTIAL - DO NOT COMMIT CREDENTIALS TO PUBLIC REPOS**

## Project Details

| Field | Value |
|-------|-------|
| **Organization** | SparkData Analytics |
| **Organization Slug** | nqozkugvlahsrjxkfpgl |
| **Project Name** | SRS-Questionnaire |
| **Region** | AWS us-west-2 (Oregon) |
| **Plan** | Free (Nano) |

## API Credentials

### CRITICAL: Use Legacy JWT Keys (NOT the new sb_publishable_ format)

Supabase introduced a new key format (`sb_publishable_...`, `sb_secret_...`) but the **Supabase JS client library REQUIRES the legacy JWT format** that starts with `eyJ...`.

| Key | Value |
|-----|-------|
| **Project URL** | `https://aougseszcvzgxwniossn.supabase.co` |
| **Anon Key (Legacy JWT)** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdWdzZXN6Y3Z6Z3h3bmlvc3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNzc1NDYsImV4cCI6MjA4MTc1MzU0Nn0.gf3DH1rRE1fWWnNIOdaTNFRM6osnLriG91SFni2BUP4` |
| **Service Role Key (Legacy JWT)** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdWdzZXN6Y3Z6Z3h3bmlvc3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE3NzU0NiwiZXhwIjoyMDgxNzUzNTQ2fQ.6X4M574Rbrp8-8fHt16p8yKWAsxXy9Vz6rMV5ASoBg8` |

### DO NOT USE (New Format - Incompatible with JS Client)

| Key | Name | Value | Why Not |
|-----|------|-------|---------|
| ~~Publishable Key~~ | default | `sb_publishable_G_woN2OIIfim7XUVYCs8XA_fpLW4uFg` | Not a JWT - JS client won't work |
| ~~Secret Key~~ | default | `sb_secret_4ouFk4U87W2Rt9PlGJFDbQ_4-u7s_Cb` | Not a JWT - JS client won't work |

### Where to Find Legacy Keys in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/aougseszcvzgxwniossn/settings/api
2. Click "API Keys" in sidebar
3. Click **"Legacy anon, service_role API keys"** tab
4. Use the keys that start with `eyJ...`

## Database Password

**Stored securely - see password manager or contact Ryan Zimmerman**

Password hint: `wNf4-****-****` (16 chars, special chars included)

## For AI Models / Developers

### IMPORTANT: Environment Variable Setup

Create `.env.local` in the project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://aougseszcvzgxwniossn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdWdzZXN6Y3Z6Z3h3bmlvc3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNzc1NDYsImV4cCI6MjA4MTc1MzU0Nn0.gf3DH1rRE1fWWnNIOdaTNFRM6osnLriG91SFni2BUP4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdWdzZXN6Y3Z6Z3h3bmlvc3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE3NzU0NiwiZXhwIjoyMDgxNzUzNTQ2fQ.6X4M574Rbrp8-8fHt16p8yKWAsxXy9Vz6rMV5ASoBg8

# Admin Login Credentials
ADMIN_EMAIL=ryan.zimmerman@southwestresumes.com
ADMIN_PASSWORD=REDACTED_DB_PASSWORD
```

### Validation Checklist for AI Models

Before troubleshooting Supabase connection issues, verify:

1. **Anon key starts with `eyJ`** - If it starts with `sb_publishable_`, it's WRONG
2. **Service role key exists** - Required for admin operations
3. **Service role key starts with `eyJ`** - If it starts with `sb_secret_`, it's WRONG

### Common Pitfall (December 2025)

Supabase changed their dashboard to show new-format keys by default. The tabs are:
- "Publishable and secret API keys" (NEW - don't use with JS client)
- "Legacy anon, service_role API keys" (USE THESE)

## Dashboard Access

- **URL**: https://supabase.com/dashboard/project/aougseszcvzgxwniossn
- **Login**: Use rzimmerman2022 credentials

## Database Tables

| Table | Purpose | Status |
|-------|---------|--------|
| `questionnaire_responses` | Main storage for client answers | Created |
| `response_history` | Audit trail of changes | Created |
| `admin_users` | Admin authentication | Created |

## Admin Authentication

Admin users are stored in both:
1. `auth.users` - Supabase Auth (for password verification)
2. `admin_users` - Custom table (for roles and metadata)

Current admin user:
- Email: `ryan.zimmerman@southwestresumes.com`
- Role: `super_admin`
- Password: See ADMIN_PASSWORD in .env.local

## Security Status

**WARNING:** RLS policies need to be fixed before production. See audit report:
`staging/AUDIT-REPORT.md`

Current RLS policies use hardcoded `true` which allows any client to read all data.

## Created

- **Date**: December 19, 2025
- **Created By**: Claude Opus 4.5 (AI assistant)
- **Purpose**: Questionnaire data persistence for SRS client discovery forms
- **Last Updated**: December 22, 2025 (Fixed API key format - JWT required, not sb_publishable_)
