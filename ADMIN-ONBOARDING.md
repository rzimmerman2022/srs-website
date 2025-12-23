# ADMIN AUTHENTICATION - DEVELOPER ONBOARDING

**Document Version:** 1.0
**Last Updated:** December 22, 2025
**Audience:** New developers joining the project
**Time to Complete:** 30-45 minutes

---

## Welcome!

This guide will help you set up and understand the Southwest Resume Services admin authentication system. By the end, you'll be able to:

- Run the admin portal locally
- Login with admin credentials
- Understand the authentication flow
- Modify admin permissions
- Debug common issues

---

## Prerequisites

Before starting, ensure you have:

- [x] Node.js 18.17+ installed (`node --version`)
- [x] npm 9.0+ installed (`npm --version`)
- [x] Git installed (`git --version`)
- [x] Code editor (VS Code recommended)
- [x] Access to Supabase project (credentials provided separately)
- [x] Terminal/command line access

---

## Step 1: Clone and Install (5 minutes)

### 1.1 Clone Repository

```bash
# Navigate to your projects directory
cd ~/Projects

# Clone the repository
git clone https://github.com/[your-org]/srs-website.git

# Navigate to project
cd "SRS - Website"
```

### 1.2 Install Dependencies

```bash
# Install all npm packages
npm install

# This will install:
# - Next.js 15
# - React 18
# - Supabase client
# - TypeScript
# - Tailwind CSS
# - And ~150 other dependencies

# Expected time: 2-3 minutes
```

### 1.3 Verify Installation

```bash
# Check Next.js installed
npx next --version
# Expected output: 15.x.x

# Check TypeScript installed
npx tsc --version
# Expected output: 5.x.x
```

---

## Step 2: Environment Setup (10 minutes)

### 2.1 Create .env.local File

```bash
# Create environment file
touch .env.local

# Open in editor
code .env.local
# Or use nano/vim
```

### 2.2 Add Supabase Credentials

```env
# Copy these values from project lead or Supabase dashboard

# Supabase URL
NEXT_PUBLIC_SUPABASE_URL=https://aougseszcvzgxwniossn.supabase.co

# Supabase Anonymous Key (public, safe to commit)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (NEVER commit this!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANT SECURITY NOTES:**
- `.env.local` is in `.gitignore` - never commit it!
- Service role key has admin access - keep it secret
- If key is compromised, rotate it in Supabase dashboard immediately

### 2.3 Verify .gitignore

```bash
# Check .env.local is ignored
cat .gitignore | grep .env.local

# Expected output: .env*.local

# Verify file won't be committed
git status

# .env.local should NOT appear in untracked files
```

### 2.4 Test Supabase Connection

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
# If page loads, Supabase connection works!

# Check terminal for errors
# Should see: "Ready in Xms"
# Should NOT see: "Supabase connection error"
```

---

## Step 3: Database Setup (10 minutes)

### 3.1 Access Supabase Dashboard

```
1. Go to https://supabase.com/dashboard
2. Login with provided credentials
3. Select project: "SRS-Questionnaire"
4. You should see the project dashboard
```

### 3.2 Verify Tables Exist

```
1. Click "Table Editor" in left sidebar
2. Should see tables:
   - admin_users
   - questionnaire_responses
   - security_audit_log
   - questionnaire_access_tokens

If tables missing:
→ Run migrations (see Step 3.3)
```

### 3.3 Run Database Migrations (If Needed)

```sql
-- Open SQL Editor in Supabase
-- Copy and paste migration files in order:

-- File 1: supabase/migrations/20251221_create_admin_users.sql
-- Creates admin_users table

-- File 2: lib/supabase/migrations/001_questionnaire_access_tokens.sql
-- Creates questionnaire_access_tokens table

-- Execute each file separately
-- Check for errors in output
```

### 3.4 Create Your Admin User

**Option A: Use Existing Admin User (Recommended for Onboarding)**

```
Email: ryan.zimmerman@southwestresumes.com
Password: Welectric9191!

Use this to login initially
Create your own user later
```

**Option B: Create Your Own Admin User**

```sql
-- Run in Supabase SQL Editor

-- Step 1: Create auth user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'your.email@example.com',  -- ← YOUR EMAIL
  crypt('YourSecurePassword123!', gen_salt('bf')),  -- ← YOUR PASSWORD
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  '',
  '',
  ''
)
RETURNING id;

-- Copy the returned ID

-- Step 2: Create admin_users record
INSERT INTO admin_users (
  user_id,
  email,
  name,
  role,
  active,
  created_at
)
VALUES (
  'PASTE_ID_FROM_STEP_1',  -- ← UUID from above
  'your.email@example.com',  -- ← YOUR EMAIL
  'Your Name',  -- ← YOUR NAME
  'admin',  -- Start with 'admin' role (not super_admin)
  true,
  NOW()
);
```

### 3.5 Verify Admin User Created

```sql
-- Check auth.users
SELECT email, confirmed_at
FROM auth.users
WHERE email = 'your.email@example.com';

-- Check admin_users
SELECT email, role, active
FROM admin_users
WHERE email = 'your.email@example.com';

-- Both queries should return 1 row
```

---

## Step 4: First Login (5 minutes)

### 4.1 Start Development Server

```bash
# In project directory
npm run dev

# Expected output:
# ▲ Next.js 15.x.x
# - Local:        http://localhost:3000
# ✓ Ready in 1.2s
```

### 4.2 Open Login Page

```
1. Open browser
2. Navigate to: http://localhost:3000/admin/login
3. You should see the admin login form
```

### 4.3 Login

```
Email: ryan.zimmerman@southwestresumes.com
Password: Welectric9191!

Click "Sign In"

Expected: Redirect to /admin dashboard
If error: See Troubleshooting section
```

### 4.4 Verify Login Success

```
After login, you should see:
✓ Admin dashboard at /admin
✓ Sidebar navigation (Questionnaires, Clients, etc.)
✓ User name displayed (Ryan Zimmerman)
✓ Sign Out button

Open DevTools → Application → Cookies
Should see:
- sb-access-token (HttpOnly, Secure)
- sb-refresh-token (HttpOnly, Secure)
```

---

## Step 5: Understanding the Codebase (10 minutes)

### 5.1 Admin Routes Structure

```
app/admin/
├── layout.tsx              # Server Component - validates session
├── layout-client.tsx       # Client Component - UI (sidebar, nav)
├── page.tsx                # Dashboard homepage
├── login/
│   └── page.tsx            # Login form (Client Component)
├── questionnaires/
│   └── page.tsx            # Questionnaires list
└── clients/
    └── page.tsx            # Clients list
```

### 5.2 Authentication Logic

```
lib/auth/admin-auth.ts
├── getAdminUser()          # Get current admin user
├── requireAdmin()          # Require authentication (throws redirect)
├── authenticateAdmin()     # Login with email/password
├── signOutAdmin()          # Logout and clear cookies
└── hasPermission()         # Check if user has permission
```

### 5.3 Middleware Protection

```
middleware.ts
├── Check pathname → starts with /admin?
├── Allow /admin/login without auth
├── For other /admin routes:
│   ├── Check cookies present
│   ├── If missing → redirect to login
│   └── If present → add security headers
└── Continue to page
```

### 5.4 API Routes

```
app/api/admin/auth/login/route.ts
├── POST /api/admin/auth/login
├── Rate limiting (5 attempts per 15 min)
├── Validate credentials with Supabase
├── Set HTTP-only cookies
└── Return success/error
```

---

## Step 6: Making Your First Change (5 minutes)

### 6.1 Customize Dashboard Welcome Message

```typescript
// File: app/admin/page.tsx
// Find the welcome message (around line 10)

// BEFORE:
<h1 className="text-3xl font-bold text-navy">
  Welcome to Admin Dashboard
</h1>

// AFTER:
<h1 className="text-3xl font-bold text-navy">
  Welcome, {adminUser?.name || 'Admin'}!
</h1>
```

### 6.2 Save and Test

```bash
# Save file
# Development server auto-reloads

# Refresh browser at /admin
# Should see: "Welcome, Ryan Zimmerman!"
# (or your name if you created own user)
```

### 6.3 Verify Hot Reload Works

```
1. Make change in any .tsx file
2. Save
3. Check terminal - should see "Compiled in Xms"
4. Browser auto-refreshes
5. Change appears immediately
```

---

## Step 7: Understanding Permissions (5 minutes)

### 7.1 Permission Levels

```typescript
// File: lib/auth/admin-auth.ts

export const ADMIN_ROLES = {
  super_admin: [
    'view_questionnaires',
    'edit_questionnaires',
    'delete_questionnaires',
    'view_clients',
    'edit_clients',
    'manage_users',      // ← Only super_admin
    'view_settings',
    'edit_settings',     // ← Only super_admin
  ],

  admin: [
    'view_questionnaires',
    'edit_questionnaires',
    'view_clients',
    'edit_clients',
    'view_settings',
    // Cannot delete or manage users
  ],

  viewer: [
    'view_questionnaires',
    'view_clients',
    // Read-only access
  ],
};
```

### 7.2 Check Your Permissions

```sql
-- Run in Supabase SQL Editor
SELECT email, role
FROM admin_users
WHERE email = 'your.email@example.com';

-- Your role determines what you can access
```

### 7.3 Using Permissions in Code

```typescript
import { hasPermission } from '@/lib/auth/admin-auth';

// In a Server Component or Server Action
const canEdit = await hasPermission('edit_questionnaires');

if (!canEdit) {
  return <p>You don't have permission to edit</p>;
}

// Render edit UI
```

---

## Common Development Tasks

### Task 1: Add New Admin User

```sql
-- Use create-admin-user.sql as template
-- Modify email, password, name, role
-- Run in Supabase SQL Editor
```

### Task 2: Change User Role

```sql
UPDATE admin_users
SET role = 'super_admin'  -- or 'admin' or 'viewer'
WHERE email = 'user@example.com';
```

### Task 3: Disable User Account

```sql
UPDATE admin_users
SET active = false
WHERE email = 'user@example.com';

-- User can no longer login
-- To re-enable: SET active = true
```

### Task 4: View Audit Logs

```sql
SELECT
  event_type,
  user_type,
  ip_address,
  success,
  created_at
FROM security_audit_log
ORDER BY created_at DESC
LIMIT 20;
```

### Task 5: Clear Rate Limit

```typescript
// File: lib/security/rate-limit.ts
import { clearRateLimit } from '@/lib/security/rate-limit';

// Clear rate limit for IP
clearRateLimit('admin_login:192.168.1.1');
```

---

## Development Workflow

### Daily Workflow

```bash
# 1. Start development server
npm run dev

# 2. Make code changes
# Edit files in /app/admin or /lib/auth

# 3. Test in browser
# Navigate to /admin
# Verify changes work

# 4. Check for errors
# Terminal (build errors)
# Browser console (runtime errors)

# 5. Commit changes
git add .
git commit -m "Descriptive message"
git push origin feature-branch
```

### Before Committing

```bash
# 1. Type check
npm run type-check

# 2. Lint
npm run lint

# 3. Build (ensures production build works)
npm run build

# If all pass:
git add .
git commit -m "Your message"
```

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/admin-user-management

# Make changes
# Commit changes

# Push to GitHub
git push origin feature/admin-user-management

# Create pull request
# Wait for review
# Merge to main
```

---

## Debugging Tips

### Enable Verbose Logging

```typescript
// Add to middleware.ts for debugging
console.log('[Middleware] Pathname:', request.nextUrl.pathname);
console.log('[Middleware] Cookies:', request.cookies.getAll());

// Add to admin-auth.ts
console.log('[getAdminUser] Session:', session);
console.log('[getAdminUser] Admin user:', adminUser);
```

### Check Session in Browser

```javascript
// Run in browser console
// After login, check cookies (won't show HTTP-only)
document.cookie;

// Check if on admin route
window.location.pathname;

// Force logout (for testing)
await fetch('/api/admin/auth/logout', { method: 'POST' });
location.reload();
```

### Common Issues

**Issue: Cookies not persisting**
- Check `secure` flag matches environment
- Development: `secure: false`
- Production: `secure: true`

**Issue: Redirect loop**
- Clear browser cookies
- Check middleware logic
- Verify cookies being set correctly

**Issue: 404 on /admin routes**
- Run `npm run build` to check for errors
- Verify files exist in /app/admin
- Check `git status` for uncommitted files

---

## Testing Checklist

### Before Deploying Changes

- [ ] Login works with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Rate limiting triggers after 5 attempts
- [ ] Logout clears session
- [ ] Session persists across page reloads
- [ ] Session expires after 7 days (check cookie expiration)
- [ ] Admin routes require authentication
- [ ] Login page is accessible without auth
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No build errors (`npm run build`)
- [ ] No lint errors (`npm run lint`)

---

## Next Steps

### After Onboarding

1. **Read Full Documentation:**
   - ADMIN-AUTH-SOP.md (complete procedures)
   - ADMIN-AUTH-ARCHITECTURE.md (technical deep dive)
   - ADMIN-AUTH-TROUBLESHOOTING.md (debugging guide)

2. **Build a Feature:**
   - Add new admin page
   - Add permission check
   - Test with different roles

3. **Review Security:**
   - SECURITY-IMPLEMENTATION-GUIDE.md
   - Understand CSRF protection
   - Understand rate limiting

4. **Explore Codebase:**
   - Read existing admin components
   - Understand Server vs Client Components
   - Learn Next.js 15 App Router patterns

---

## Resources

### Internal Documentation
- README.md - Project overview
- OWNERS_MANUAL.md - Non-technical guide
- ADMIN-AUTH-SOP.md - Standard operating procedures
- ADMIN-AUTH-ARCHITECTURE.md - Technical architecture
- ADMIN-AUTH-TROUBLESHOOTING.md - Issue resolution

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [React Server Components](https://react.dev/reference/react/use-server)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Getting Help
- Review troubleshooting guide first
- Check existing GitHub issues
- Ask team lead or senior developer
- Create GitHub issue with:
  - Exact error message
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots (if applicable)

---

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run type-check       # TypeScript check
npm run lint             # ESLint

# Git
git status              # Check changes
git add .               # Stage all changes
git commit -m "msg"     # Commit
git push                # Push to remote

# Database
# Use Supabase SQL Editor
# Access at: https://supabase.com/dashboard
```

### Essential Files

```
/app/admin/layout.tsx              # Admin auth check
/lib/auth/admin-auth.ts            # Auth utilities
/middleware.ts                     # Route protection
/app/api/admin/auth/login/route.ts # Login API
/.env.local                        # Environment vars
```

### Essential Credentials

```
Supabase Dashboard: https://supabase.com/dashboard
Project: SRS-Questionnaire

Admin Login (Development):
Email: ryan.zimmerman@southwestresumes.com
Password: Welectric9191!

Local Dev: http://localhost:3000/admin/login
```

---

## Onboarding Checklist

- [ ] Cloned repository
- [ ] Installed dependencies
- [ ] Created .env.local with credentials
- [ ] Verified Supabase connection
- [ ] Ran database migrations
- [ ] Created admin user
- [ ] Successfully logged in
- [ ] Viewed admin dashboard
- [ ] Made first code change
- [ ] Tested hot reload
- [ ] Understood permissions system
- [ ] Reviewed codebase structure
- [ ] Read full documentation
- [ ] Configured git branch
- [ ] Ran all checks (type/lint/build)
- [ ] Ready to develop!

---

**Welcome to the team! Happy coding!**

---

**Document Version:** 1.0
**Last Updated:** December 22, 2025
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
