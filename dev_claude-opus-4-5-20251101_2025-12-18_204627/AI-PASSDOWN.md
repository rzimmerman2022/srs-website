# AI Model Passdown Document
## Strategic Placement Diagnostic Questionnaire System

**Last Updated:** December 19, 2025 (Session 3 - Opus 4.5)
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

### 🔴 CRITICAL - Must Fix Before Production

#### Security Issues
| Priority | Issue | File:Line | Description |
|----------|-------|-----------|-------------|
| P0 | RLS Policy Bypass | `lib/supabase/secure-schema.sql:43-113` | Hardcoded `true` allows any client to read ALL data |
| P0 | Service Role Key Fallback | `app/api/questionnaire/[clientId]/route.ts:40-41` | Bypasses all RLS if set |
| P1 | No Rate Limiting | `route.ts:113-115` | Allows brute-force/DoS |
| P1 | Unvalidated JSONB | `route.ts:15-17` | `z.any()` bypasses validation |

#### Code Quality Issues
| Priority | Issue | File:Line | Description |
|----------|-------|-----------|-------------|
| P1 | Unsafe Type Coercion | `route.ts:198` | `(data as { id: string }).id` |
| P1 | Race Condition | `QuestionnaireContainer.tsx:63-76` | Multiple setState in succession |

### 🟡 HIGH - Should Fix

#### Accessibility (WCAG 2.1 AA ~60% Compliant)
| Issue | File:Line | Description |
|-------|-----------|-------------|
| Color Contrast | `QuestionCard.tsx:45,121,178,200` | `text-gray-500/400` below 4.5:1 ratio |
| Missing fieldset | `QuestionCard.tsx:85-129` | Radio groups need `<fieldset>/<legend>` |
| No Focus Trap | `MilestoneModal.tsx:30-94` | Modal doesn't trap focus |
| Missing aria-labels | `QuestionnaireContainer.tsx:510-546` | Sync status dots unlabeled |

#### Performance
| Issue | File:Line | Description |
|-------|-----------|-------------|
| Event Listener Leak | `useQuestionnaireSync.ts:318-335` | Listeners re-added on every state change |
| Missing React.memo | `QuestionCard.tsx` | Component re-renders unnecessarily |
| JSON Blocking | `QuestionnaireDark.tsx:80-99` | Synchronous JSON.parse in hot path |
| Bundle Size | `package.json` | Supabase client adds ~250KB (unused features) |

### 🟢 MEDIUM - Nice to Have

| Issue | File | Description |
|-------|------|-------------|
| Code Duplication | `QuestionCard.tsx` / `QuestionnaireDark.tsx` | ~250 lines of identical switch statements |
| Request Batching | `useQuestionnaireSync.ts` | Sends full state instead of deltas |
| Modal a11y | `MilestoneModal.tsx` | Missing `role="dialog"` and Escape handler |
| Beacon Fix | `useQuestionnaireSync.ts:344-350` | sendBeacon sends string, not JSON Blob |

### ✅ COMPLETED
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
| `QuestionnaireContainer.tsx` | Main orchestrator | ⚠️ Race condition |
| `QuestionnaireDark.tsx` | Dark theme version | ✅ Working |
| `QuestionCard.tsx` | Question rendering | ⚠️ Needs memo, contrast fix |
| `ModuleNav.tsx` | Sidebar navigation | ✅ Fixed |
| `ProgressRing.tsx` | Circular progress | ✅ Working |
| `MilestoneModal.tsx` | Achievement modal | ⚠️ Needs focus trap |
| `PointsPopup.tsx` | Animated points | ✅ Fixed |
| `ErrorBoundary.tsx` | Error fallback | ✅ Working |

### Data Persistence (`lib/supabase/`)
| File | Purpose | Status |
|------|---------|--------|
| `client.ts` | Supabase client singleton | ✅ Working |
| `types.ts` | TypeScript types for database | ✅ Working |
| `schema.sql` | SQL tables | ✅ Already run |
| `secure-schema.sql` | RLS policies | 🔴 INSECURE |

### API Routes (`app/api/questionnaire/[clientId]/`)
| File | Purpose | Status |
|------|---------|--------|
| `route.ts` | GET/POST with Zod validation | ⚠️ Needs fixes |

### Hooks (`hooks/`)
| File | Purpose | Status |
|------|---------|--------|
| `useQuestionnaireSync.ts` | Sync with retry logic | ⚠️ Event leak |

---

## AUDIT SUMMARY (Dec 19, 2025)

### Security Audit
**Status:** 🔴 CRITICAL ISSUES FOUND

| Finding | Severity |
|---------|----------|
| RLS policies use hardcoded `true` | CRITICAL |
| Service Role Key fallback bypasses RLS | CRITICAL |
| No rate limiting | HIGH |
| Unvalidated JSONB answers field | HIGH |
| Unencrypted localStorage (PII) | MEDIUM |

### Accessibility Audit
**Status:** ⚠️ ~60% WCAG 2.1 AA Compliant

| Finding | Severity |
|---------|----------|
| Color contrast failures (6+ elements) | HIGH |
| Missing fieldset/legend for groups | HIGH |
| No focus trap in modal | HIGH |
| Missing aria-labels on status | MEDIUM |

### Performance Audit
**Status:** ⚠️ Optimization Needed

| Finding | Severity |
|---------|----------|
| Event listener memory leak | CRITICAL |
| Excessive re-renders | HIGH |
| Missing React.memo on QuestionCard | HIGH |
| Synchronous JSON.parse blocking | MEDIUM |

### Code Quality Audit
**Status:** ⚠️ Issues Found

| Finding | Severity |
|---------|----------|
| Unsafe type coercion (3 locations) | HIGH |
| z.any() bypasses validation | HIGH |
| Code duplication (~250 LOC) | MEDIUM |
| Missing dependency array optimization | MEDIUM |

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

---

## GIT/DEPLOYMENT SAFETY

⚠️ **IMPORTANT:**
- All development is in `dev_claude-opus-4-5-20251101_2025-12-18_204627/` folder
- This folder is NOT part of the main website build
- Pushing to main branch will NOT affect the live website
- The live website is built from the root `app/` folder only
- DO NOT deploy this dev folder to production until security issues are fixed
