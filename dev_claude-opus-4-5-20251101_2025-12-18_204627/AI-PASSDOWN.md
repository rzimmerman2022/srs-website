# AI Model Passdown Document
## Strategic Placement Diagnostic Questionnaire System

**Last Updated:** December 19, 2025 (Session 2 - Opus 4.5)
**Project Location:** `/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/dev_claude-opus-4-5-20251101_2025-12-18_204627/`

---

## PROJECT OVERVIEW

This is a gamified questionnaire system for Southwest Resume Service (SRS) that collects client information through an engaging, Duolingo-style experience. The questionnaire is used to gather career data for resume writing services.

### Key URLs
- **Development Server:** `http://localhost:3005` (default port)
- **Test Discovery Page:** `/discovery/Jacqueline%20%22Jackie%22%20DeLeon` (example client)
- **Live Website:** DO NOT deploy to live - this is isolated in the dev folder

### Tech Stack
- Next.js 15.1.2 (App Router)
- React 19
- TypeScript 5.7.2
- Tailwind CSS 3.4.17
- Supabase (configured and working)
- Zod 4.2.1 (input validation)

---

## CURRENT STATUS - ALL SYSTEMS GO ✅

### Supabase Configuration (COMPLETE)
```
Project: SRS-Questionnaire
Organization: SparkData Analytics
URL: https://aougseszcvzgxwniossn.supabase.co
```

**Credentials stored in:**
- `.env.local` (in dev folder - git-ignored)
- `SUPABASE_CONFIG.md` (in repo root - for reference)

**Database tables created:**
- `questionnaire_responses` - main data storage
- `response_history` - audit trail

### What's Working
1. **Questionnaire UI** - Glass morphism design with premium feel
2. **Gamification System** - Points, streaks, combos, milestones
3. **Supabase Sync** - Data persists to cloud database ✅
4. **Local Storage Fallback** - Works offline with auto-sync on reconnect
5. **Animations** - Spring animations, shimmer effects, fire popup (FIXED)
6. **Keyboard Navigation** - Enter key to continue
7. **Sidebar Navigation** - Full module titles visible (FIXED)

---

## BUGS FIXED THIS SESSION (Dec 19, 2025 - Session 2)

### 1. Fire Popup Not Fading Away
**File:** `components/questionnaire/PointsPopup.tsx`
**Problem:** The +5 fire animation stayed on screen permanently
**Fix:** Removed `animationPhase` from useEffect dependencies, added early return when `show=false`

### 2. Module Sidebar Title Truncation
**File:** `components/questionnaire/ModuleNav.tsx` (line 61)
**Problem:** Module titles cut off with "..."
**Fix:** Changed `truncate` to `text-wrap leading-tight`

### 3. Intermittent "Offline" Status (MAJOR REFACTOR)
**File:** `hooks/useQuestionnaireSync.ts`
**Problem:** Status flipping between "Synced" and "Offline" randomly
**Root Causes Fixed:**
1. No HTTP status code validation
2. No fetch timeout (requests hung forever)
3. Missing `setIsOnline(true)` in fallback mode
4. Single failure immediately showed offline
5. Browser online/offline events unreliable

**Solution Applied:**
```typescript
// Added SYNC_CONFIG (lines 44-50)
const SYNC_CONFIG = {
  FETCH_TIMEOUT_MS: 10000,        // 10 second timeout
  MAX_RETRIES: 3,                  // Retry 3 times
  RETRY_DELAYS: [1000, 2000, 4000], // Exponential backoff
  CONSECUTIVE_FAILURES_FOR_OFFLINE: 2, // Need 2+ failures
};

// Added fetchWithTimeout with AbortController (lines 93-110)
// Added retry logic with exponential backoff (lines 167-175)
// Fixed fallback mode setIsOnline(true) (lines 149, 253)
// Added consecutive failure tracking (lines 178-188)
```

### 4. Logo Not Showing
**Problem:** Logo returned 404 in dev folder
**Fix:** Copied logo from root project's public folder to dev folder's public folder

---

## AUDIT RESULTS (Multi-Agent Workflow)

### Security Audit ✅ PASS
| Check | Status | Location |
|-------|--------|----------|
| Zod input validation | ✅ | route.ts lines 6-25 |
| clientId regex validation | ✅ | `^[a-zA-Z0-9_-]+$` |
| questionnaireId validation | ✅ | route.ts line 79 |
| JSON parse error handling | ✅ | route.ts lines 143-150 |
| Error message sanitization | ✅ | `getSafeErrorMessage()` hides details in prod |
| .env.local in .gitignore | ✅ | Credentials protected |
| No dangerouslySetInnerHTML | ✅ | XSS safe |
| No eval() or Function() | ✅ | Injection safe |

**Note:** Rate limiting documented but not yet implemented (see route.ts lines 113-115)

### Accessibility Audit ✅ PASS
| Check | Status | Details |
|-------|--------|---------|
| ARIA labels | ✅ | Extensive usage across all components |
| Screen reader text | ✅ | `sr-only` classes for hidden descriptions |
| Role attributes | ✅ | `progressbar`, `status`, `alert` roles |
| aria-hidden decorative | ✅ | Icons and emojis marked appropriately |
| aria-live for updates | ✅ | Points popup announces dynamically |
| Reduced motion | ✅ | `@media (prefers-reduced-motion)` in globals.css |

### Performance Audit ✅ PASS
| Check | Status | Details |
|-------|--------|---------|
| Bundle size | ✅ | ~132KB for questionnaire page |
| Dependencies | ✅ | Only 7 deps (minimal) |
| Debounced sync | ✅ | 2000ms debounce |
| AbortController | ✅ | Added for timeout handling |
| No heavy libraries | ✅ | No moment.js, lodash, etc. |

### Code Quality Audit ✅ PASS
| Check | Status | Details |
|-------|--------|---------|
| TypeScript strict | ✅ | Proper typing throughout |
| useEffect cleanup | ✅ | Timers cleared on unmount |
| Error handling | ✅ | Try/catch with fallbacks |
| Build passes | ✅ | `npm run build` succeeds |

---

## KEY FILES & ARCHITECTURE

### Components (`components/questionnaire/`)
| File | Purpose | Status |
|------|---------|--------|
| `QuestionnaireContainer.tsx` | Main orchestrator | ✅ Working |
| `QuestionnaireDark.tsx` | Dark theme version | ✅ Working |
| `QuestionCard.tsx` | Question rendering | ✅ Working |
| `ModuleNav.tsx` | Sidebar navigation | ✅ FIXED (truncation) |
| `ProgressRing.tsx` | Circular progress | ✅ Working |
| `MilestoneModal.tsx` | Achievement modal | ✅ Working |
| `PointsPopup.tsx` | Animated points | ✅ FIXED (fade) |

### Data Persistence (`lib/supabase/`)
| File | Purpose |
|------|---------|
| `client.ts` | Supabase client singleton |
| `types.ts` | TypeScript types for database |
| `schema.sql` | SQL tables (ALREADY RUN) |

### API Routes (`app/api/questionnaire/[clientId]/`)
| File | Purpose |
|------|---------|
| `route.ts` | GET/POST with Zod validation |

### Hooks (`hooks/`)
| File | Purpose |
|------|---------|
| `useQuestionnaireSync.ts` | Sync with retry logic (REFACTORED) |

---

## RUNNING THE PROJECT

```bash
# Navigate to dev folder
cd "/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/dev_claude-opus-4-5-20251101_2025-12-18_204627"

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev -- -p 3005

# Build to verify no errors
npm run build
```

**Test URLs:**
- `http://localhost:3005/discovery/test-client`
- `http://localhost:3005/discovery/Jacqueline%20%22Jackie%22%20DeLeon`

---

## REMAINING TODO LIST

### Completed ✅
- [x] Create Supabase project and add credentials
- [x] Run schema.sql in Supabase SQL Editor
- [x] Fix module sidebar truncation
- [x] Fix fire popup not fading
- [x] Fix intermittent offline status
- [x] Copy logo to dev folder
- [x] Security audit
- [x] Accessibility audit
- [x] Performance audit

### Still TODO
- [ ] Verify all question text matches original JD-SPD documents verbatim
- [ ] Implement rate limiting (Vercel Edge Config + Upstash Redis)
- [ ] Add more gamification (achievements, leaderboards)
- [ ] End-to-end testing with real client data

---

## IMPORTANT NOTES

### Git/Deployment Safety
- All development is in `dev_claude-opus-4-5-20251101_2025-12-18_204627/` folder
- This folder is NOT part of the main website build
- Pushing to main branch will NOT affect the live website
- The live website is built from the root `app/` folder only

### Supabase Credentials
- **Credentials ARE configured in `.env.local`**
- `.env.local` is git-ignored (safe)
- Backup credentials in `SUPABASE_CONFIG.md` at repo root
- System falls back to localStorage if Supabase unavailable

---

## FOR CONTINUING AI MODELS

When resuming this project:

1. **Read this document first** - It contains all context
2. **Start dev server:** `npm run dev -- -p 3005`
3. **Test the questionnaire:** Visit `/discovery/test-client`
4. **Check sync status:** Should show "Synced" (green indicator)
5. **Verify build:** Run `npm run build` to ensure no regressions

### Key Technical Decisions
- Supabase Free Tier (500MB, unlimited API)
- localStorage as offline fallback
- Debounced sync (2 second delay)
- Retry logic: 3 attempts with exponential backoff (1s, 2s, 4s)
- Consecutive failure threshold: 2 before showing offline
- Combo system: 15-second window, max 3x multiplier
- Points: base 5, max 15 with full combo

### If You Encounter Issues
1. Clear `.next` cache folder: `rm -rf .next`
2. Restart dev server
3. Check browser console for errors
4. Verify `.env.local` exists with Supabase credentials
5. Check port availability: `lsof -ti:3005`

### Session History
- **Session 1 (Dec 18):** Initial build, gamification, localStorage
- **Session 2 (Dec 19):** Supabase config, bug fixes, sync refactor, audits
