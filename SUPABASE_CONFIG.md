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

| Key | Value |
|-----|-------|
| **Project URL** | `https://aougseszcvzgxwniossn.supabase.co` |
| **Publishable API Key (anon)** | `sb_publishable_G_woN2OIIfim7XUVYCs8XA_fpLW4uFg` |

## Database Password

**Stored securely - see password manager or contact Ryan Zimmerman**

Password hint: `wNf4-****-****` (16 chars, special chars included)

## For AI Models / Developers

To configure the questionnaire app:

1. Create `.env.local` in the dev folder with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://aougseszcvzgxwniossn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_G_woN2OIIfim7XUVYCs8XA_fpLW4uFg
   ```

2. Run the schema SQL in Supabase SQL Editor:
   - File location: `staging/lib/supabase/schema.sql`

## Dashboard Access

- **URL**: https://supabase.com/dashboard/project/aougseszcvzgxwniossn
- **Login**: Use rzimmerman2022 credentials

## Database Tables

| Table | Purpose | Status |
|-------|---------|--------|
| `questionnaire_responses` | Main storage for client answers | ✅ Created |
| `response_history` | Audit trail of changes | ✅ Created |

## Security Status

**WARNING:** RLS policies need to be fixed before production. See audit report:
`staging/AUDIT-REPORT.md`

Current RLS policies use hardcoded `true` which allows any client to read all data.

## Created

- **Date**: December 19, 2025
- **Created By**: Claude Opus 4.5 (AI assistant)
- **Purpose**: Questionnaire data persistence for SRS client discovery forms
- **Last Updated**: December 19, 2025 (Session 3)
