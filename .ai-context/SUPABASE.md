# SRS Website - Supabase Configuration

## Project Details

- **Dashboard**: https://supabase.com/dashboard/project/[PROJECT_ID]
- **API URL**: Set in `NEXT_PUBLIC_SUPABASE_URL` environment variable
- **Region**: Check Supabase dashboard

## Database Schema

### Tables

#### 1. questionnaire_responses
Client questionnaire answer storage with gamification.

```sql
- id: UUID (PK)
- client_id: TEXT
- questionnaire_id: TEXT
- answers: JSONB
- current_question_index: INTEGER
- current_module_index: INTEGER
- points: INTEGER
- streak: INTEGER
- combo: INTEGER
- shown_milestones: INTEGER[]
- completed: BOOLEAN
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### 2. response_history
Snapshot history for questionnaire responses.

```sql
- id: UUID (PK)
- response_id: UUID (FK -> questionnaire_responses)
- snapshot: JSONB
- created_at: TIMESTAMPTZ
```

#### 3. questionnaire_access_tokens
Secure token-based access for client questionnaires.

```sql
- id: UUID (PK)
- client_id: TEXT
- questionnaire_id: TEXT
- token: TEXT (UNIQUE, 32-char hex)
- created_at: TIMESTAMPTZ
- expires_at: TIMESTAMPTZ (30 days from creation)
- accessed_at: TIMESTAMPTZ
- access_count: INTEGER
- revoked: BOOLEAN
- metadata: JSONB
```

#### 4. admin_users
Admin panel users with role-based access control.

```sql
- id: UUID (PK)
- user_id: UUID (FK -> auth.users)
- email: TEXT (UNIQUE)
- full_name: TEXT
- role: TEXT ('super_admin' | 'admin' | 'viewer')
- active: BOOLEAN
- last_login_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### 5. admin_settings
Application configuration key-value store.

```sql
- id: UUID (PK)
- setting_key: TEXT (UNIQUE)
- setting_value: JSONB
- category: TEXT
- description: TEXT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
- updated_by: TEXT
```

## TypeScript Types

All table types are defined in `/lib/supabase/types.ts`:

```typescript
import type { Database } from '@/lib/supabase/types';

// Row types (for reading)
type QuestionnaireResponse = Database['public']['Tables']['questionnaire_responses']['Row'];
type AdminUser = Database['public']['Tables']['admin_users']['Row'];

// Insert types (for creating)
type QuestionnaireResponseInsert = Database['public']['Tables']['questionnaire_responses']['Insert'];

// Update types (for updating)
type QuestionnaireResponseUpdate = Database['public']['Tables']['questionnaire_responses']['Update'];
```

## SQL Migrations

Located in:
- `/lib/supabase/migrations/001_questionnaire_access_tokens.sql`
- `/lib/supabase/migrations/002_admin_settings.sql`
- `/supabase/migrations/20251221_create_admin_users.sql`

## Row Level Security (RLS)

All tables have RLS enabled. Policies defined in migration files.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (public, safe for client)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (secret, server-side only)
```

## Last Updated
2024-12-22
