# AI Task: Merge Prototype Homepage Components into Root

**Date:** December 22, 2025
**Priority:** HIGH
**Estimated Complexity:** Medium

---

## CONTEXT

You are a SENIOR FULL-STACK ENGINEER with 15 years experience in Next.js, TypeScript, and production deployments.

### Project Structure
- **ROOT** (`/app`, `/lib`, `/components`): Production application with admin dashboard, authentication, security, questionnaire system, and testing scaffolding
- **PROTOTYPE** (`/prototype`): Contains a redesigned homepage with updated components

### The Problem
The prototype folder has redesigned homepage components (TrustSection, VerifiedProof, ProblemBlock, etc.) that need to be merged into the ROOT project WITHOUT breaking the existing admin authentication and testing infrastructure.

### Previous Failures
Other AI models attempted to copy files from prototype and accidentally overwrote critical files:
- `/lib/supabase/types.ts` - Contains `admin_users` table types needed for auth
- `/lib/auth/admin-auth.ts` - Contains admin authentication logic
- `/lib/utils.ts` - Contains utility functions used by admin

This broke the admin login because prototype's types don't include admin tables.

---

## HARD CONSTRAINTS (Cannot Be Violated)

1. **DO NOT OVERWRITE** these files in ROOT:
   - `/lib/supabase/types.ts`
   - `/lib/auth/admin-auth.ts`
   - `/lib/utils.ts`
   - `/lib/security/*`
   - `/app/admin/*`
   - `/app/api/admin/*`

2. **DO NOT DELETE** any admin-related code

3. **PRESERVE** the existing testing scaffolding and Supabase connection

4. **VERIFY** the build compiles after changes: `npm run build`

5. **VERIFY** admin login works after changes: http://localhost:3005/admin/login

---

## TASK: Merge Homepage Components

### Step 1: Identify Components to Merge

Compare and identify which files in `/prototype/components/sections/` are newer/different from `/components/sections/`:

```bash
# List prototype section components
ls -la /prototype/components/sections/

# Expected files to potentially merge:
# - TrustSection.tsx (or TrustSectionWithToggle.tsx)
# - VerifiedProof.tsx
# - ProblemBlock.tsx
# - Hero.tsx (if updated)
# - ServiceGrid.tsx (if updated)
```

### Step 2: Compare Homepage Files

```bash
# Compare the homepages
diff /app/page.tsx /prototype/app/page.tsx
```

If they're identical, the homepage was already copied. Focus on supporting components.

### Step 3: Copy ONLY Homepage-Related Components

For each component that needs updating:

1. Read the prototype version
2. Read the root version (if exists)
3. Copy the prototype version to root IF:
   - It doesn't exist in root, OR
   - The prototype version is newer/better
4. Ensure imports don't reference prototype-specific paths

### Step 4: Verify No Type Conflicts

After copying, check that:
- No imports reference `/prototype/`
- No imports break existing types
- The AdminUser type is still available from `@/lib/supabase/types`

### Step 5: Test Build

```bash
cd "/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website"
rm -rf .next
npm run build
```

Expected: Build succeeds with no type errors

### Step 6: Test Admin Login

```bash
PORT=3005 npm run dev
# Open http://localhost:3005/admin/login
# Login with: ryan.zimmerman@southwestresumes.com / REDACTED_DB_PASSWORD
```

Expected: Login succeeds, dashboard loads

---

## SUPABASE CONFIGURATION

The correct Supabase keys are in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://aougseszcvzgxwniossn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdWdzZXN6Y3Z6Z3h3bmlvc3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNzc1NDYsImV4cCI6MjA4MTc1MzU0Nn0.gf3DH1rRE1fWWnNIOdaTNFRM6osnLriG91SFni2BUP4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdWdzZXN6Y3Z6Z3h3bmlvc3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE3NzU0NiwiZXhwIjoyMDgxNzUzNTQ2fQ.6X4M574Rbrp8-8fHt16p8yKWAsxXy9Vz6rMV5ASoBg8
```

**CRITICAL:** Keys MUST start with `eyJ...` (JWT format). If you see `sb_publishable_` or `sb_secret_`, those are WRONG.

---

## VERIFICATION CHECKLIST

Before declaring task complete:

- [ ] Homepage components from prototype are in root `/components/sections/`
- [ ] `npm run build` succeeds with no errors
- [ ] Admin login page loads: http://localhost:3005/admin/login
- [ ] Admin login succeeds with correct credentials
- [ ] Admin dashboard displays after login
- [ ] Homepage displays correctly: http://localhost:3005/
- [ ] No imports reference `/prototype/` paths
- [ ] `/lib/supabase/types.ts` still contains `admin_users` table type
- [ ] `/lib/auth/admin-auth.ts` is unchanged

---

## CHAIN OF VERIFICATION (CoVe)

After completing the merge:

1. **Generate 5 verification questions** that would expose errors
2. **Answer each question** by actually testing/reading code
3. **Fix any issues** found during verification
4. **Provide final report** with evidence of success

---

## OUTPUT FORMAT

```markdown
## Merge Report

### Files Copied from Prototype → Root
- [list each file with source and destination]

### Files NOT Copied (Protected)
- /lib/supabase/types.ts - Contains admin_users types
- /lib/auth/admin-auth.ts - Contains admin auth logic
- [etc.]

### Build Result
[output of npm run build]

### Admin Login Test
- Page loads: YES/NO
- Login succeeds: YES/NO
- Dashboard displays: YES/NO

### Homepage Test
- Page loads: YES/NO
- All sections render: YES/NO

### Verification Questions & Answers
1. Q: [question]
   A: [answer with evidence]
[etc.]
```

---

## REFERENCE FILES

Read these for context:
- `/SUPABASE_CONFIG.md` - Supabase setup and correct API keys
- `/lib/supabase/types.ts` - Database types (DO NOT OVERWRITE)
- `/lib/auth/admin-auth.ts` - Admin auth (DO NOT OVERWRITE)
- `/app/admin/login/page.tsx` - Admin login page
- `/prototype/components/sections/` - Components to potentially merge

---

## FAILURE MODES TO AVOID

1. **Overwriting types.ts** → Breaks admin auth (AdminUser type missing)
2. **Overwriting admin-auth.ts** → Breaks admin auth entirely
3. **Using wrong Supabase keys** → Auth fails with "Invalid credentials"
4. **Leaving prototype imports** → Build fails with "Cannot find module"
5. **Not testing after merge** → Hidden bugs deployed

---

## SUCCESS CRITERIA

The task is COMPLETE when:
1. All prototype homepage components are in ROOT
2. Build passes: `npm run build` exits with code 0
3. Admin login works: Can login and see dashboard
4. Homepage works: All sections display correctly
5. No prototype references remain in ROOT code
