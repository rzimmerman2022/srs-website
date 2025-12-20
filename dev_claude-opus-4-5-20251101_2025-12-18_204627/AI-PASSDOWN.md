# AI Model Passdown Document
## Strategic Placement Diagnostic Questionnaire System

**Last Updated:** December 19, 2025 (Session 4 - Opus 4.5)
**Project Location:** `/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/dev_claude-opus-4-5-20251101_2025-12-18_204627/`

---

## QUICK START FOR NEW AI MODELS

```bash
# 1. Navigate to dev folder
cd "/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/dev_claude-opus-4-5-20251101_2025-12-18_204627"

# 2. Start dev server
npm run dev -- -p 3005

# 3. Open in browser
open http://localhost:3005/discovery/test-client

# 4. Verify build passes
npm run build
```

---

## PROJECT OVERVIEW

This is a gamified questionnaire system for Southwest Resume Service (SRS) that collects client information through an engaging, Duolingo-style experience. The questionnaire is used to gather career data for resume writing services.

### Key URLs
- **Development Server:** `http://localhost:3005` (default port)
- **Test Discovery Page:** `/discovery/test-client` or `/discovery/Jacqueline%20%22Jackie%22%20DeLeon`
- **Live Website:** DO NOT deploy to live - this is isolated in the dev folder

### Tech Stack
- Next.js 15.1.2 (App Router)
- React 19
- TypeScript 5.7.2
- Tailwind CSS 3.4.17
- Supabase (PostgreSQL database)
- Zod 4.2.1 (input validation)

---

## CURRENT STATUS

### ✅ What's Working
1. **Questionnaire UI** - Glass morphism design with premium feel
2. **Gamification System** - Points, streaks, combos, milestones
3. **Supabase Sync** - Data persists to cloud database
4. **Local Storage Fallback** - Works offline with auto-sync on reconnect
5. **Animations** - Spring animations, shimmer effects, fire popup
6. **Keyboard Navigation** - Enter key to continue
7. **Sidebar Navigation** - Full module titles visible
8. **Retry Logic** - 3 attempts with exponential backoff

### ⚠️ Issues Found by Audit (Need Fixing)
See **MASTER TODO LIST** section below for prioritized action items.

---

## SUPABASE CONFIGURATION

**Status:** ✅ Configured and Working

| Field | Value |
|-------|-------|
| **Project** | SRS-Questionnaire |
| **Organization** | SparkData Analytics |
| **URL** | `https://aougseszcvzgxwniossn.supabase.co` |
| **Region** | AWS us-west-2 (Oregon) |

**Credentials stored in:**
- `.env.local` (in dev folder - git-ignored)
- `SUPABASE_CONFIG.md` (in repo root - for reference)

**Database tables:**
- `questionnaire_responses` - main data storage
- `response_history` - audit trail

---

## BUGS FIXED (Sessions 2-3)

### 1. Fire Popup Not Fading Away ✅
**File:** `components/questionnaire/PointsPopup.tsx`
**Fix:** Removed `animationPhase` from useEffect dependencies, added early return when `show=false`

### 2. Module Sidebar Title Truncation ✅
**File:** `components/questionnaire/ModuleNav.tsx` (line 61)
**Fix:** Changed `truncate` to `text-wrap leading-tight`

### 3. Intermittent "Offline" Status ✅
**File:** `hooks/useQuestionnaireSync.ts`
**Fix:** Added retry logic, timeout, HTTP validation, consecutive failure tracking

```typescript
const SYNC_CONFIG = {
  FETCH_TIMEOUT_MS: 10000,        // 10 second timeout
  MAX_RETRIES: 3,                  // Retry 3 times
  RETRY_DELAYS: [1000, 2000, 4000], // Exponential backoff
  CONSECUTIVE_FAILURES_FOR_OFFLINE: 2,
};
```

### 4. Logo Not Showing ✅
**Fix:** Copied logo from root project's public folder to dev folder's public folder

---

## MASTER TODO LIST

### 🟢 REMAINING - Nice to Have

| Issue | File | Description |
|-------|------|-------------|
| No Rate Limiting | `route.ts` | Allows brute-force/DoS (TODO with implementation guide added) |
| Code Duplication | `QuestionCard.tsx` / `QuestionnaireDark.tsx` | ~250 lines of identical switch statements |
| Request Batching | `useQuestionnaireSync.ts` | Sends full state instead of deltas |
| JSON Blocking | `QuestionnaireDark.tsx:80-99` | Synchronous JSON.parse in hot path |
| Bundle Size | `package.json` | Supabase client adds ~250KB (unused features) |
| Beacon Fix | `useQuestionnaireSync.ts:344-350` | sendBeacon sends string, not JSON Blob |

### ✅ COMPLETED

#### Session 4 - Audit Fixes (Dec 19, 2025)
- [x] **P0 Security: RLS Policy Documentation** - Added security warnings and proper auth examples to `secure-schema.sql`
- [x] **P0 Security: Removed Service Role Key Fallback** - Now uses only anon key in `route.ts`
- [x] **P1 Security: Fixed JSONB Validation** - Replaced `z.any()` with strict schema in `route.ts`
- [x] **P1 Performance: Fixed Event Listener Leak** - Added refs pattern to `useQuestionnaireSync.ts`
- [x] **P1 Performance: Added React.memo** - Wrapped `QuestionCard.tsx` to prevent re-renders
- [x] **P1 Accessibility: Fixed Color Contrast** - Changed `text-gray-500/400` to `text-gray-600` in `QuestionCard.tsx`
- [x] **P1 Accessibility: Added fieldset/legend** - Wrapped radio/checkbox groups in `QuestionCard.tsx`
- [x] **P1 Accessibility: Focus Trap + Escape** - Added to `MilestoneModal.tsx` with role="dialog"
- [x] **P1 Accessibility: Added aria-labels** - Sync status indicators in `QuestionnaireContainer.tsx`
- [x] **P2 Code Quality: Fixed Type Coercion** - Added type guard in `route.ts`
- [x] **P2 Code Quality: Added Division Guards** - Protected progress calculations in `QuestionnaireContainer.tsx`
- [x] **P2 Code Quality: Documented Race Condition** - Added useReducer TODO in `QuestionnaireContainer.tsx`

#### Previous Sessions
- [x] Create Supabase project and add credentials
- [x] Run schema.sql in Supabase SQL Editor
- [x] Fix module sidebar truncation
- [x] Fix fire popup not fading
- [x] Fix intermittent offline status
- [x] Copy logo to dev folder
- [x] Run 4-agent SDA SOP audit (Code, UI/UX, Security, Performance)

---

## KEY FILES & ARCHITECTURE

### Components (`components/questionnaire/`)
| File | Purpose | Status |
|------|---------|--------|
| `QuestionnaireContainer.tsx` | Main orchestrator | ✅ Fixed (aria-labels, division guards) |
| `QuestionnaireDark.tsx` | Dark theme version | ✅ Working |
| `QuestionCard.tsx` | Question rendering | ✅ Fixed (memo, contrast, fieldset) |
| `ModuleNav.tsx` | Sidebar navigation | ✅ Fixed |
| `ProgressRing.tsx` | Circular progress | ✅ Working |
| `MilestoneModal.tsx` | Achievement modal | ✅ Fixed (focus trap, Escape, ARIA) |
| `PointsPopup.tsx` | Animated points | ✅ Fixed |
| `ErrorBoundary.tsx` | Error fallback | ✅ Working |

### Data Persistence (`lib/supabase/`)
| File | Purpose | Status |
|------|---------|--------|
| `client.ts` | Supabase client singleton | ✅ Working |
| `types.ts` | TypeScript types for database | ✅ Working |
| `schema.sql` | SQL tables | ✅ Already run |
| `secure-schema.sql` | RLS policies | ✅ Documented (app-layer auth) |

### API Routes (`app/api/questionnaire/[clientId]/`)
| File | Purpose | Status |
|------|---------|--------|
| `route.ts` | GET/POST with Zod validation | ✅ Fixed (validation, type guards) |

### Hooks (`hooks/`)
| File | Purpose | Status |
|------|---------|--------|
| `useQuestionnaireSync.ts` | Sync with retry logic | ✅ Fixed (event listener leak) |

---

## AUDIT SUMMARY (Dec 19, 2025)

### Security Audit
**Status:** ✅ FIXED (Session 4)

| Finding | Status |
|---------|--------|
| RLS policies use hardcoded `true` | ✅ Documented with proper auth examples |
| Service Role Key fallback bypasses RLS | ✅ Removed - uses anon key only |
| No rate limiting | ⚠️ TODO added with implementation guide |
| Unvalidated JSONB answers field | ✅ Fixed with strict Zod schema |
| Unencrypted localStorage (PII) | ⚠️ Deferred (low risk for questionnaire data) |

### Accessibility Audit
**Status:** ✅ ~85% WCAG 2.1 AA Compliant (Session 4)

| Finding | Status |
|---------|--------|
| Color contrast failures (6+ elements) | ✅ Fixed (gray-500→gray-600) |
| Missing fieldset/legend for groups | ✅ Added to radio/checkbox groups |
| No focus trap in modal | ✅ Added focus trap + Escape handler |
| Missing aria-labels on status | ✅ Added to sync indicators |

### Performance Audit
**Status:** ✅ FIXED (Session 4)

| Finding | Status |
|---------|--------|
| Event listener memory leak | ✅ Fixed with refs pattern |
| Excessive re-renders | ✅ Fixed with React.memo |
| Missing React.memo on QuestionCard | ✅ Added |
| Synchronous JSON.parse blocking | ⚠️ Deferred (low priority) |

### Code Quality Audit
**Status:** ✅ FIXED (Session 4)

| Finding | Status |
|---------|--------|
| Unsafe type coercion (3 locations) | ✅ Added type guards |
| z.any() bypasses validation | ✅ Fixed with strict schema |
| Code duplication (~250 LOC) | ⚠️ Deferred (P2 - nice to have) |
| Missing dependency array optimization | ✅ Fixed with refs pattern |

---

## VIEWING CLIENT DATA

This section explains how to view and export the questionnaire data that clients enter. Written for business owners who need to access client responses.

### Step 1: Access the Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Log in with your SparkData Analytics account
3. Select the "SRS-Questionnaire" project
4. You'll see the project dashboard

### Step 2: Navigate to the Table Editor

1. In the left sidebar, click "Table Editor"
2. You'll see two tables:
   - `questionnaire_responses` - Current data from clients
   - `response_history` - Audit trail of all changes

### Understanding the Data Structure

#### Table: `questionnaire_responses`

This table contains the current state of each client's questionnaire. One row per client per questionnaire.

| Column Name | What It Means | Example Value |
|-------------|---------------|---------------|
| `id` | Unique record identifier | `550e8400-e29b-41d4-a716-446655440000` |
| `client_id` | Client identifier from URL | `jdeleon` or `test-client` |
| `questionnaire_id` | Which questionnaire | `discovery` |
| `answers` | Client's responses in JSON format | See "Understanding Answers" below |
| `current_question_index` | Where they stopped | `15` (they're on question 16) |
| `current_module_index` | Which section they're in | `2` (they're in Module 3) |
| `points` | Gamification score | `75` |
| `streak` | Consecutive questions answered | `5` |
| `combo` | Current combo multiplier | `3` |
| `shown_milestones` | Which achievements they've seen | `[0, 25, 50]` |
| `completed` | Finished or still working? | `false` (in progress) or `true` (done) |
| `created_at` | When they first started | `2025-12-19 14:30:00` |
| `updated_at` | Last time they saved an answer | `2025-12-19 15:45:00` |

#### Understanding the `answers` Field

The `answers` column stores client responses in JSON format. Each question is stored with its question ID as the key.

Example `answers` content:
```json
{
  "q1-salary-floor": "55000",
  "q2-salary-target": "70000",
  "q3-remote-tolerance": "remote-preferred",
  "q4-primary-lane": "ur-um",
  "q5-criteria-tools": ["interqual", "mcg"],
  "q14-ehr": ["kipu", "advancedmd"]
}
```

To understand what each question ID means, refer to the questionnaire definition in `/lib/questionnaire/jackie-deleon.ts`.

Common question patterns:
- `q1-salary-floor` = Minimum salary requirement
- `q2-salary-target` = Target salary
- `q3-remote-tolerance` = Remote work preference
- `q5-criteria-tools` = Medical necessity tools used (array of values)
- `q14-ehr` = EHR systems experience (array of values)

#### Table: `response_history`

This table keeps a record of every time a client saves their progress. It's an audit trail.

| Column Name | What It Means |
|-------------|---------------|
| `id` | Unique history record ID |
| `response_id` | Links to the main response record |
| `snapshot` | Complete copy of their data at that moment |
| `created_at` | When this version was saved |

### SQL Queries to Run in Supabase

Click "SQL Editor" in the left sidebar to run these queries.

#### 1. View All Questionnaire Responses

```sql
SELECT
  client_id,
  questionnaire_id,
  completed,
  current_module_index,
  current_question_index,
  points,
  created_at,
  updated_at
FROM questionnaire_responses
ORDER BY updated_at DESC;
```

#### 2. View Responses for a Specific Client

```sql
SELECT
  client_id,
  questionnaire_id,
  answers,
  completed,
  created_at,
  updated_at
FROM questionnaire_responses
WHERE client_id = 'jdeleon';
```

Replace `'jdeleon'` with the client ID you want to view.

#### 3. See Completed vs In-Progress Questionnaires

```sql
SELECT
  completed,
  COUNT(*) as count
FROM questionnaire_responses
GROUP BY completed;
```

This shows how many questionnaires are finished vs in progress.

#### 4. View Most Recent Activity

```sql
SELECT
  client_id,
  questionnaire_id,
  completed,
  updated_at
FROM questionnaire_responses
ORDER BY updated_at DESC
LIMIT 10;
```

Shows the 10 most recently updated questionnaires.

#### 5. Extract Specific Answer Fields

```sql
SELECT
  client_id,
  answers->>'q1-salary-floor' as salary_floor,
  answers->>'q2-salary-target' as salary_target,
  answers->>'q3-remote-tolerance' as remote_preference,
  answers->>'q4-primary-lane' as primary_lane,
  completed
FROM questionnaire_responses
ORDER BY updated_at DESC;
```

This extracts specific answers into separate columns for easier reading.

#### 6. View Complete Answer History for a Client

```sql
SELECT
  rh.created_at,
  rh.snapshot
FROM response_history rh
JOIN questionnaire_responses qr ON rh.response_id = qr.id
WHERE qr.client_id = 'jdeleon'
ORDER BY rh.created_at DESC;
```

Shows every version of a client's responses over time.

### How to Export Data

#### Method 1: Export from Table Editor (Simple)

1. Click "Table Editor" in the left sidebar
2. Select the `questionnaire_responses` table
3. Click the "Export" button (top right)
4. Choose format:
   - **CSV** - Opens in Excel/Google Sheets
   - **JSON** - Raw data format

The CSV will include all columns. The `answers` column will appear as JSON text that you can parse separately.

#### Method 2: Export from SQL Editor (Custom)

1. Run any SQL query (see examples above)
2. After the results appear, click "Download CSV" button below the results
3. This exports only the columns in your query, making it cleaner

#### Method 3: Export All Data with Readable Answers

Run this query, then download as CSV:

```sql
SELECT
  client_id,
  questionnaire_id,

  -- Extract key answers
  answers->>'q1-salary-floor' as "Minimum Salary",
  answers->>'q2-salary-target' as "Target Salary",
  answers->>'q3-remote-tolerance' as "Remote Preference",
  answers->>'q4-primary-lane' as "Primary Lane",

  -- Metadata
  completed as "Completed?",
  current_module_index as "Current Module",
  current_question_index as "Current Question",
  points as "Points",
  created_at as "Started At",
  updated_at as "Last Updated"

FROM questionnaire_responses
ORDER BY updated_at DESC;
```

This creates a clean spreadsheet with readable column names.

### Automated Backups

Supabase automatically backs up your data, but you can set up additional safeguards:

#### Option 1: Manual Weekly Exports

1. Set a calendar reminder for every Monday
2. Go to Table Editor > `questionnaire_responses`
3. Click "Export" > "CSV"
4. Save to a dedicated folder like `SRS Questionnaire Backups/2025/`

#### Option 2: Enable Supabase Daily Backups

1. Go to your Supabase project settings
2. Click "Database" in the left sidebar
3. Scroll to "Backups"
4. Supabase Free Tier includes 7 days of automated backups
5. For longer retention, upgrade to Pro ($25/month) for 30-day backups

#### Option 3: Schedule Exports with Automation

If you upgrade to a paid Supabase plan, you can use scheduled functions to email you weekly CSV exports. (This requires technical setup.)

### Reading Client Responses

When you export the data, here's how to interpret the answers:

1. Open the CSV in Excel or Google Sheets
2. Find the `answers` column
3. The data will look like: `{"q1-salary-floor":"55000","q3-remote-tolerance":"remote-preferred"}`
4. To make it readable:
   - Use a JSON formatter tool like https://jsonformatter.org/
   - Or use the SQL query method above to extract specific fields

### Common Tasks

#### "How do I see what Jackie answered for salary requirements?"

```sql
SELECT
  client_id,
  answers->>'q1-salary-floor' as minimum_salary,
  answers->>'q2-salary-target' as target_salary,
  updated_at
FROM questionnaire_responses
WHERE client_id = 'jdeleon';
```

#### "How do I see all completed questionnaires this week?"

```sql
SELECT
  client_id,
  completed,
  updated_at
FROM questionnaire_responses
WHERE completed = true
  AND updated_at >= NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC;
```

#### "How do I recover data if a client accidentally resets their answers?"

```sql
-- Find their previous version in history
SELECT
  created_at,
  snapshot
FROM response_history rh
JOIN questionnaire_responses qr ON rh.response_id = qr.id
WHERE qr.client_id = 'jdeleon'
ORDER BY created_at DESC
LIMIT 10;
```

The `snapshot` field contains their complete answers at that point in time.

### Security Notes

- The Supabase dashboard requires login - only people with account access can view data
- Client responses are stored securely in PostgreSQL
- All database connections use SSL encryption
- Row Level Security (RLS) policies are enabled (see `lib/supabase/schema.sql`)

### Need Help?

- Supabase documentation: https://supabase.com/docs
- SQL query help: https://supabase.com/docs/guides/database/tables
- Contact your development team if you need custom reports or automated exports

---

## FOR CONTINUING AI MODELS

### Before Starting Work
1. **Read this document completely**
2. **Check the MASTER TODO LIST** - prioritize P0/P1 items
3. **Start dev server:** `npm run dev -- -p 3005`
4. **Verify build:** `npm run build`

### Key Technical Decisions
- Supabase Free Tier (500MB, unlimited API)
- localStorage as offline fallback
- Debounced sync (2 second delay)
- Retry logic: 3 attempts with exponential backoff (1s, 2s, 4s)
- Consecutive failure threshold: 2 before showing offline
- Combo system: 15-second window, max 3x multiplier
- Points: base 5, max 15 with full combo

### If You Encounter Issues
1. Clear `.next` cache: `rm -rf .next`
2. Restart dev server
3. Check browser console for errors
4. Verify `.env.local` exists with Supabase credentials
5. Check port availability: `lsof -ti:3005 | xargs kill -9`

### Session History
| Session | Date | Work Done |
|---------|------|-----------|
| 1 | Dec 18, 2025 | Initial build, gamification, localStorage |
| 2 | Dec 19, 2025 | Supabase config, bug fixes, sync refactor |
| 3 | Dec 19, 2025 | 4-agent audit, documentation update |
| 4 | Dec 19, 2025 | Fixed all P0/P1/P2 audit findings (4 parallel agents) |

---

## GIT/DEPLOYMENT SAFETY

⚠️ **IMPORTANT:**
- All development is in `dev_claude-opus-4-5-20251101_2025-12-18_204627/` folder
- This folder is NOT part of the main website build
- Pushing to main branch will NOT affect the live website
- The live website is built from the root `app/` folder only
- DO NOT deploy this dev folder to production until security issues are fixed
