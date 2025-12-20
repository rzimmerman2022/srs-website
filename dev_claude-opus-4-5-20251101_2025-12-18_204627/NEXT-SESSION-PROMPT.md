# Next Session Prompt - SRS Questionnaire Fixes

**Copy this entire prompt to start a new AI session:**

---

## Context

You are continuing work on the SRS (Southwest Resume Services) Strategic Placement Diagnostic Questionnaire system. This is a gamified client intake form built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Supabase.

**Project Location:** `/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/dev_claude-opus-4-5-20251101_2025-12-18_204627/`

## Required Reading (Do This First)

1. Read `AI-PASSDOWN.md` - Complete project status and master todo list
2. Read `AUDIT-REPORT.md` - Detailed findings from 4-agent security/performance/accessibility/code quality audit

## Current State

- ✅ Supabase configured and working
- ✅ Bug fixes applied (fire popup, sidebar, offline status)
- ✅ Sync hook refactored with retry logic
- ✅ 4-agent audit completed (findings documented)
- ⚠️ Documentation updated but NOT committed yet
- 🔴 Critical security issues found - DO NOT DEPLOY until fixed

## Your Task

Use the **SDA SOP Multi-Agent Workflow** to fix the issues found in the audit. Spawn 4 parallel subagents to handle different categories:

### Agent 1: Security Fixes (P0 - CRITICAL)

**Files to modify:**
- `lib/supabase/secure-schema.sql` - Fix RLS policies (lines 43-113)
- `app/api/questionnaire/[clientId]/route.ts` - Remove service key fallback (line 40-41), validate answers field (line 15-17)

**Tasks:**
1. Replace hardcoded `true` in RLS policies with proper client isolation
2. Remove `SUPABASE_SERVICE_ROLE_KEY` fallback - use only anon key
3. Replace `z.any()` with proper answer type validation
4. Add rate limiting comment with implementation path

### Agent 2: Performance Fixes (P1 - HIGH)

**Files to modify:**
- `hooks/useQuestionnaireSync.ts` - Fix event listener leak (lines 318-335)
- `components/questionnaire/QuestionCard.tsx` - Add React.memo wrapper

**Tasks:**
1. Fix event listener memory leak using refs instead of recreating on state change
2. Wrap QuestionCard in React.memo() to prevent unnecessary re-renders
3. Verify no other memory leaks in useEffect cleanup

### Agent 3: Accessibility Fixes (P1 - HIGH)

**Files to modify:**
- `components/questionnaire/QuestionCard.tsx` - Fix contrast, add fieldset
- `components/questionnaire/MilestoneModal.tsx` - Add focus trap
- `components/questionnaire/QuestionnaireContainer.tsx` - Add aria-labels

**Tasks:**
1. Replace `text-gray-500` with `text-gray-600` (6+ locations)
2. Replace `text-gray-400` with `text-gray-600` for placeholders
3. Wrap radio/checkbox groups in `<fieldset><legend>`
4. Add `aria-label` to sync status indicator dots
5. Add focus trap and Escape key handler to modal

### Agent 4: Code Quality Fixes (P2 - MEDIUM)

**Files to modify:**
- `app/api/questionnaire/[clientId]/route.ts` - Fix type coercion (line 198)
- `components/questionnaire/QuestionnaireContainer.tsx` - Fix race condition (lines 63-76)

**Tasks:**
1. Replace unsafe `(data as { id: string }).id` with type guard
2. Consider useReducer for atomic state updates
3. Add division-by-zero guard in progress calculation

## How to Spawn Subagents

Use the Task tool with `subagent_type="general-purpose"` for each agent:

```
Task(
  description="Security Fixes Agent",
  prompt="You are fixing security issues in the SRS Questionnaire. [detailed instructions]",
  subagent_type="general-purpose"
)
```

Launch all 4 agents in parallel in a single message for efficiency.

## After Fixes Complete

1. Run `npm run build` to verify no TypeScript errors
2. Run `npm run dev -- -p 3005` and test at `/discovery/test-client`
3. Update `AI-PASSDOWN.md` to mark completed items
4. Commit all changes with descriptive message

## Quick Start Commands

```bash
cd "/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/dev_claude-opus-4-5-20251101_2025-12-18_204627"
npm run dev -- -p 3005
# Test: http://localhost:3005/discovery/test-client
```

## Priority Order

If you can only do some fixes, prioritize in this order:

1. **P0 - Security** - RLS policies and service key (blocks production)
2. **P1 - Performance** - Event listener leak (causes memory issues)
3. **P1 - Accessibility** - Color contrast (WCAG compliance)
4. **P2 - Code Quality** - Type safety improvements

---

**End of prompt - copy everything above to start a new session**
