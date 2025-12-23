# Next Session Prompt - SRS Questionnaire Fixes

**Copy this entire prompt to start a new AI session:**

---

## Context

You are continuing work on the SRS (Southwest Resume Services) Strategic Placement Diagnostic Questionnaire system. This is a gamified client intake form built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Supabase.

**Project Location:** `/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/staging/`

## Required Reading (Do This First)

1. Read `AI-PASSDOWN.md` - Complete project status and master todo list
2. Read `AUDIT-REPORT.md` - Detailed findings from 4-agent audit

## Current State

- ✅ Supabase configured and working (data syncing)
- ✅ Bug fixes applied (fire popup, sidebar, offline status)
- ✅ Sync hook refactored with retry logic (timeout, exponential backoff)
- ✅ 4-agent audit completed (findings documented)
- 🔴 **Critical security issues found - DO NOT DEPLOY until fixed**

## Your Task

Use the **SDA SOP Multi-Agent Workflow** to fix all issues. Spawn **5 parallel subagents**:

---

### Agent 1: Security Fixes (P0 - CRITICAL - BLOCKS PRODUCTION)

**Files to modify:**
- `lib/supabase/secure-schema.sql` - Fix RLS policies (lines 43-113)
- `app/api/questionnaire/[clientId]/route.ts` - Remove service key fallback, validate inputs

**Tasks:**
1. Replace hardcoded `true` in ALL RLS policies with proper client isolation
2. Remove `SUPABASE_SERVICE_ROLE_KEY` fallback (line 40-41) - use only anon key
3. Replace `z.any()` with proper answer type validation (line 15-17):
   ```typescript
   answers: z.record(
     z.string().regex(/^[a-zA-Z0-9_-]+$/),
     z.union([z.string().max(1000), z.array(z.string()).max(50)])
   ).optional().default({})
   ```
4. Fix unsafe type coercion `(data as { id: string }).id` (line 198) - use type guard
5. Add rate limiting TODO with clear implementation path

**Verify:** Build passes, API still works

---

### Agent 2: Performance Fixes (P1 - HIGH)

**Files to modify:**
- `hooks/useQuestionnaireSync.ts` - Fix event listener leak (lines 318-335)
- `components/questionnaire/QuestionCard.tsx` - Add React.memo
- `components/questionnaire/QuestionnaireContainer.tsx` - Fix excessive re-renders

**Tasks:**
1. Fix event listener memory leak - use refs instead of recreating on state change:
   ```typescript
   const stateRef = useRef(state);
   useEffect(() => { stateRef.current = state; }, [state]);
   // Then use stateRef.current in event handlers
   ```
2. Wrap `QuestionCard` in `React.memo()` to prevent unnecessary re-renders
3. Fix useEffect missing dependency (`updateSyncState` in QuestionnaireContainer.tsx:92)
4. Consider separating sync state from UI state to reduce re-render cascade

**Verify:** No memory leaks in long sessions, smoother animations

---

### Agent 3: Accessibility Fixes (P1 - HIGH)

**Files to modify:**
- `components/questionnaire/QuestionCard.tsx` - Contrast, fieldset, ARIA
- `components/questionnaire/MilestoneModal.tsx` - Focus trap, role, Escape
- `components/questionnaire/QuestionnaireContainer.tsx` - ARIA labels
- `app/globals.css` - Reduced motion support

**Tasks:**
1. **Color Contrast** - Replace ALL instances:
   - `text-gray-500` → `text-gray-600` or `text-gray-700`
   - `text-gray-400` → `text-gray-600` (especially placeholders)

2. **ARIA Labels** - Add to ALL interactive elements:
   - Progress bars need `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
   - Sync status dots need `aria-label` ("Synced", "Syncing", "Offline")
   - All buttons need descriptive `aria-label` if icon-only

3. **Form Grouping** - Wrap radio/checkbox groups:
   ```tsx
   <fieldset>
     <legend className="sr-only">{question.question}</legend>
     {/* inputs */}
   </fieldset>
   ```

4. **Modal Accessibility**:
   - Add `role="dialog"` and `aria-modal="true"`
   - Implement focus trap (focus stays inside modal)
   - Add Escape key to close modal
   - Restore focus to trigger element on close

5. **Reduced Motion** - Add to globals.css:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

6. **Focus Management** - When navigating between questions, move focus to new question

**Verify:** Test with screen reader, keyboard-only navigation

---

### Agent 4: Responsive Design (P1 - DESKTOP/TABLET/MOBILE)

**Files to modify:**
- `components/questionnaire/QuestionnaireContainer.tsx`
- `components/questionnaire/ModuleNav.tsx`
- `components/questionnaire/QuestionCard.tsx`
- All questionnaire components

**Tasks:**
1. **Mobile (< 640px)**:
   - Sidebar should be collapsible drawer (hamburger menu)
   - Touch targets minimum 44x44px
   - Sync status visible (currently `hidden sm:flex`)
   - Full-width question cards
   - Larger tap targets on radio/checkbox inputs

2. **Tablet (640px - 1024px)**:
   - Sidebar can be narrower but still visible
   - Comfortable touch targets
   - Good balance of content and navigation

3. **Desktop (> 1024px)**:
   - Current layout should work well
   - Sidebar fully expanded
   - Keyboard navigation fully functional

4. **Test at these breakpoints:**
   - 320px (small phone)
   - 375px (iPhone SE)
   - 768px (iPad portrait)
   - 1024px (iPad landscape / small laptop)
   - 1440px (desktop)

**Verify:** Test at ALL breakpoints, no horizontal scroll, no cut-off content

---

### Agent 5: Code Quality Fixes (P2 - MEDIUM)

**Files to modify:**
- `components/questionnaire/QuestionnaireContainer.tsx` - Race condition, size
- `components/questionnaire/QuestionCard.tsx` - Extract shared component
- `components/questionnaire/QuestionnaireDark.tsx` - Extract shared component

**Tasks:**
1. **Race Condition** - Replace multiple setState calls with useReducer (lines 63-76)
2. **Code Duplication** - Extract shared `QuestionInput.tsx` component (~250 lines duplicated)
3. **Error Boundaries** - Verify ErrorBoundary.tsx wraps all questionnaire components
4. **Remove console.log** - Clean up any debug logging
5. **Add division-by-zero guard** in progress calculation
6. **Break down QuestionnaireContainer** - It's 700+ lines, consider splitting

**Verify:** Build passes, no TypeScript errors

---

## How to Spawn Subagents

Use the Task tool with `subagent_type="general-purpose"` for each agent. Launch all 5 in parallel in a SINGLE message:

```
// In ONE message, call Task 5 times:
Task(description="Security Fixes Agent", prompt="...", subagent_type="general-purpose")
Task(description="Performance Fixes Agent", prompt="...", subagent_type="general-purpose")
Task(description="Accessibility Fixes Agent", prompt="...", subagent_type="general-purpose")
Task(description="Responsive Design Agent", prompt="...", subagent_type="general-purpose")
Task(description="Code Quality Fixes Agent", prompt="...", subagent_type="general-purpose")
```

## After All Agents Complete

1. **Verify build:** `npm run build`
2. **Test all breakpoints:**
   - `npm run dev -- -p 3005`
   - Test at 320px, 375px, 768px, 1024px, 1440px
   - Visit `/discovery/test-client`
3. **Test accessibility:**
   - Tab through entire questionnaire
   - Test with screen reader if available
   - Check reduced motion with browser DevTools
4. **Update documentation:**
   - Mark completed items in `AI-PASSDOWN.md`
   - Update `AUDIT-REPORT.md` with fixes applied
5. **Commit all changes** with descriptive message

## Quick Start Commands

```bash
cd "/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/staging"
npm run dev -- -p 3005
# Test: http://localhost:3005/discovery/test-client
```

## Priority Order (If Limited Time)

1. **P0 - Security** - RLS policies and service key (BLOCKS PRODUCTION)
2. **P1 - Performance** - Event listener leak (causes memory issues)
3. **P1 - Accessibility** - Color contrast + ARIA (WCAG compliance)
4. **P1 - Responsive** - Mobile layout (user experience)
5. **P2 - Code Quality** - Type safety, duplication

## What's Already Done

- ✅ Fire popup animation fix
- ✅ Sidebar title truncation fix
- ✅ Offline status sync refactor (retry logic, timeout, backoff)
- ✅ Logo copied to dev folder
- ✅ Supabase configured and working
- ✅ SQL schema run

## Supabase Info

- **URL:** `https://aougseszcvzgxwniossn.supabase.co`
- **Credentials:** In `.env.local` (already configured)
- **Tables:** `questionnaire_responses`, `response_history`
- **Status:** Working, but RLS policies insecure

---

**End of prompt - copy everything above to start a new session**
