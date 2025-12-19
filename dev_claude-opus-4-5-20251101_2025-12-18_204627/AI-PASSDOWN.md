# AI Model Passdown Document
## Strategic Placement Diagnostic Questionnaire System

**Last Updated:** December 19, 2025
**Project Location:** `c:\Projects\SRS - Website\dev_claude-opus-4-5-20251101_2025-12-18_204627\`

---

## PROJECT OVERVIEW

This is a gamified questionnaire system for Southwest Resume Service (SRS) that collects client information through an engaging, Duolingo-style experience. The questionnaire is used to gather career data for resume writing services.

### Key URLs
- **Development Server:** `http://localhost:3005` or `http://localhost:3006` (check available port)
- **Test Discovery Page:** `/discovery/jdeleon` (example client)
- **Live Website:** DO NOT deploy to live - this is isolated in the dev folder

### Tech Stack
- Next.js 15.5.9 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Supabase (for data persistence - NOT YET CONFIGURED, see below)

---

## CURRENT STATUS

### What's Working
1. **Questionnaire UI** - Glass morphism design with premium feel
2. **Gamification System** - Points, streaks, combos, milestones
3. **Local Storage** - Data saves to browser (fallback)
4. **Animations** - Spring animations, shimmer effects, floating fire
5. **Keyboard Navigation** - Enter key to continue

### What's In Progress / Needs Work

#### CRITICAL: Supabase Data Persistence
**STATUS: CODE COMPLETE, CREDENTIALS NOT CONFIGURED**

The code for server-side persistence is implemented but Supabase is NOT yet configured. The system will fall back to localStorage only until credentials are added.

**To configure Supabase:**
1. Go to https://app.supabase.com and create a FREE project (500MB storage, unlimited API calls)
2. Get your project credentials from Settings > API
3. Create `.env.local` in the dev folder with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Run the SQL schema in Supabase SQL Editor:
   - File: `lib/supabase/schema.sql`
   - This creates the `questionnaire_responses` and `response_history` tables

#### Module Sidebar Truncation Issue
**STATUS: NOT FIXED**
- Module titles in the sidebar truncate with "..."
- Need to investigate CSS/layout to show full module names
- Location: `components/questionnaire/ModuleNav.tsx`

#### Question Frame Verification
**STATUS: NOT STARTED**
- Need to verify all questions match the original JD-SPD document verbatim
- Reference docs copied to: `reference-docs/SparkData_SOP_v5.2.1_Gold_Standard_Final.docx`
- Location of questions: `lib/questionnaire/modules/` directory

---

## KEY FILES & ARCHITECTURE

### Components (`components/questionnaire/`)
| File | Purpose |
|------|---------|
| `QuestionnaireContainer.tsx` | Main orchestrator - handles state, navigation, gamification |
| `QuestionnaireDark.tsx` | Alternate dark theme version (similar structure) |
| `QuestionCard.tsx` | Individual question rendering |
| `ModuleNav.tsx` | Sidebar navigation (HAS TRUNCATION BUG) |
| `ProgressRing.tsx` | Circular progress indicator |
| `MilestoneModal.tsx` | Celebration modal for achievements |
| `PointsPopup.tsx` | Animated points popup (+5, +10, etc.) |

### Data Persistence (`lib/supabase/`)
| File | Purpose |
|------|---------|
| `client.ts` | Supabase client singleton |
| `types.ts` | TypeScript types for database |
| `schema.sql` | SQL to create tables (RUN IN SUPABASE DASHBOARD) |

### API Routes (`app/api/questionnaire/[clientId]/`)
| File | Purpose |
|------|---------|
| `route.ts` | GET/POST handlers for syncing questionnaire data |

### Hooks (`hooks/`)
| File | Purpose |
|------|---------|
| `useQuestionnaireSync.ts` | Manages local + server sync with offline support |

### Questionnaire Data (`lib/questionnaire/`)
| File | Purpose |
|------|---------|
| `types.ts` | TypeScript interfaces for questionnaire structure |
| `modules/` | Individual module definitions (questions) |

---

## BUG FIXES IMPLEMENTED (Dec 19, 2025)

### Critical Bugs Fixed
1. **Infinite Loop in QuestionnaireDark.tsx**
   - Caused by `milestones` in useEffect dependency array
   - Fixed by using separate `shownMilestones` state tracker

2. **Memory Leaks in PointsPopup.tsx**
   - setTimeout calls without cleanup
   - Fixed by storing timer refs and clearing in cleanup function

3. **Race Condition in Auto-Save**
   - Auto-save ran before localStorage was loaded
   - Fixed by adding `if (!isDataLoaded) return;` guard

4. **Streak Reset Bug**
   - `awardedQuestions.current.clear()` erased all earned points on skip
   - Fixed by only resetting streak counter, not clearing the Set

### UI/UX Enhancements
1. Enhanced glass morphism with depth and gradients
2. Combo multiplier system (up to 3x points)
3. Encouragement messages every 5 questions
4. Growing fire effect for streak display
5. Animated progress bar with shimmer
6. Keyboard navigation (Enter to continue)
7. Sync status indicator (Synced/Syncing/Offline)

---

## AUDIT FINDINGS (From 4 Specialist Agents)

### UI/UX Designer Audit (Score: 5.5/10)
- Glass morphism needed enhancement (DONE)
- Animations needed spring curves (DONE)
- Accessibility reduced motion support (DONE)

### Code Quality Audit
- Found CRITICAL infinite loops (FIXED)
- Found memory leaks (FIXED)
- Found race conditions (FIXED)

### Data Persistence Audit
- localStorage is CRITICAL risk for data loss
- Recommended Supabase Free Tier (IMPLEMENTED, needs credentials)
- Created sync hook with offline fallback

### Gamification Expert Audit
- Recommended combos (IMPLEMENTED)
- Recommended achievements (MILESTONE system exists)
- Recommended encouragement messages (IMPLEMENTED)

---

## RUNNING THE PROJECT

```bash
# Navigate to dev folder
cd "c:\Projects\SRS - Website\dev_claude-opus-4-5-20251101_2025-12-18_204627"

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# Server will start on http://localhost:3005 (or next available port)
```

**IMPORTANT:** Before the last push, the dev server was killed but NOT restarted.
The next AI model should:
1. Start the dev server with `npm run dev`
2. Visit `/discovery/jdeleon` to test the questionnaire
3. Verify the sync status indicator works (should show "Synced" or "Offline" if Supabase not configured)
4. Test that localStorage fallback is working

---

## REMAINING TODO LIST

1. [ ] **User Action:** Create Supabase project and add credentials to `.env.local`
2. [ ] **User Action:** Run `lib/supabase/schema.sql` in Supabase SQL Editor
3. [ ] Fix module sidebar truncation (titles cut off with "...")
4. [ ] Verify all question text matches original JD-SPD documents verbatim
5. [ ] Test full questionnaire flow end-to-end with server sync
6. [ ] Consider adding more gamification (achievements, leaderboards)

---

## IMPORTANT NOTES

### Git/Deployment Safety
- All development is in `dev_claude-opus-4-5-20251101_2025-12-18_204627/` folder
- This folder is NOT part of the main website build
- Pushing to main branch will NOT affect the live website
- The live website is built from the root `app/` folder only

### Supabase Credentials
- **NO credentials are currently configured**
- The system gracefully falls back to localStorage when Supabase is not available
- Credentials should be stored in `.env.local` (git-ignored)
- See `.env.example` for the required environment variables

### Reference Documents
Located in `reference-docs/` folder:
- `SparkData_SOP_v5.2.1_Gold_Standard_Final.docx` - Main reference for question text
- `SparkData_IDE_Quick_Prompts_v2.2.docx`
- `SparkData_CEO_Memo_AI_Development_Framework_v5.2.1.docx`
- `SparkData_Risk_Tier_Table_v2.2.docx`

---

## FOR CONTINUING AI MODELS

When resuming this project:

1. **Read this document first** - It contains all context
2. **Check the dev server** - Run `npm run dev` in the dev folder
3. **Test the questionnaire** - Visit `/discovery/jdeleon`
4. **Check Supabase status** - Look for "Synced" indicator in UI
5. **Reference the audit findings** - Bugs have been fixed but verify
6. **Use the SparkData docs** - For question text verification

Key technical decisions made:
- Using Supabase Free Tier for 500MB free storage
- Keeping localStorage as fallback for offline support
- Debounced sync (2 second delay) to reduce API calls
- Combo system: 15-second window, max 3x multiplier
- Points: base 5, max 15 with full combo

If you encounter issues:
1. Clear `.next` cache folder
2. Restart dev server
3. Check browser console for errors
4. Verify Supabase credentials in `.env.local`
