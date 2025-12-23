# Admin Authentication Supabase Setup Guide

**Date:** December 22, 2025
**Purpose:** Connect admin authentication to Supabase (currently using simple cookies)

---

## Current Status

❌ **Admin auth is NOT connected to Supabase**
- Login route uses simple email/password comparison
- No database verification
- Questionnaire data IS in Supabase ✅
- Admin auth is NOT ❌

---

## What We Need to Do

### Step 1: Get Your Supabase Service Role Key

1. Go to: https://supabase.com/dashboard/project/aougseszcvzgxwniossn/settings/api
2. Copy the **service_role** key (NOT the anon key)
3. **KEEP IT SECRET** - this has admin privileges

### Step 2: Add Service Role Key to .env.local

Add this line to `/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/.env.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-service-role-key-here
```

Your .env.local should now have:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://aougseszcvzgxwniossn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_G_woN2OIIfim7XUVYCs8XA_fpLW4uFg
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-service-role-key-here
ADMIN_EMAIL=ryan.zimmerman@southwestresumes.com
ADMIN_PASSWORD=Welectric9191!
```

### Step 3: Run Database Migrations

Go to Supabase SQL Editor:
https://supabase.com/dashboard/project/aougseszcvzgxwniossn/sql/new

**Run Migration 1: Create admin_users table**
```sql
-- Copy from: /Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/supabase/migrations/20251221_create_admin_users.sql
-- Paste into SQL Editor and run
```

**Run Migration 2: Create your admin user**
```sql
-- Copy from: /Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/create-admin-user.sql
-- Paste into SQL Editor and run
```

**Verify it worked:**
```sql
SELECT
  au.id,
  au.email,
  au.full_name,
  au.role,
  au.active,
  au.created_at
FROM admin_users au
WHERE au.email = 'ryan.zimmerman@southwestresumes.com';
```

Expected output:
```
id          | email                                | full_name      | role        | active | created_at
------------|--------------------------------------|----------------|-------------|--------|-------------
[UUID]      | ryan.zimmerman@southwestresumes.com  | Ryan Zimmerman | super_admin | true   | [timestamp]
```

If you see this, your admin user exists! ✅

### Step 4: Update Login Route to Use Supabase

The file `/app/api/admin/auth/login/route.ts` needs to be updated to use the `authenticateAdmin()` function instead of simple string comparison.

**Current code (WRONG):**
```typescript
if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
  return 401
}
// Set simple cookie
```

**Should be (CORRECT):**
```typescript
const { user, error } = await authenticateAdmin(email, password);
if (error || !user) {
  return 401
}
// authenticateAdmin() already sets Supabase tokens
```

### Step 5: Test the Connection

1. Restart dev server
2. Go to http://localhost:3005/admin/login
3. Login with:
   - Email: ryan.zimmerman@southwestresumes.com
   - Password: Welectric9191!
4. Check browser DevTools → Application → Cookies
5. You should see:
   - ✅ `sb-access-token` (Supabase JWT token)
   - ✅ `sb-refresh-token` (Supabase refresh token)
   - ❌ `admin_session` (old simple cookie - should NOT be present)

---

## After Setup

Once connected to Supabase:
- ✅ Admin user stored in `admin_users` table
- ✅ Login validated against Supabase Auth
- ✅ Session tokens are JWTs
- ✅ Can add more admin users via Supabase dashboard
- ✅ Role-based access control works
- ✅ Last login tracking works
- ✅ Admin auth synced with questionnaire data

---

## Files That Will Be Modified

1. `.env.local` - Add SUPABASE_SERVICE_ROLE_KEY
2. `/app/api/admin/auth/login/route.ts` - Use authenticateAdmin()
3. Supabase database - Run migrations

---

## Need Help?

All the code is already written! We just need to:
1. Get the service role key
2. Run 2 SQL scripts
3. Update 1 line in login route

**Ready to proceed?**
