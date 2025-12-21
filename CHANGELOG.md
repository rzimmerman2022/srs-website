# Changelog

All notable changes to the SRS Website project will be documented in this file.

---

## [2025-12-19] Session 4: Security Audit Fixes + Questionnaire System

### Security Fixes (P0 - Critical)

- **Fixed RLS Policy Bypass** - Added security warnings and documentation in `secure-schema.sql` for proper authentication when auth is implemented
- **Removed Service Role Key Fallback** - API route now only uses anon key to respect RLS policies
- **Added Strict Zod Validation** - Replaced `z.any()` with constrained types:
  - Strings (max 1000 chars)
  - Arrays of strings (max 50 items)
  - Numbers (for sliders)
  - Objects (for multi-select)
  - Null values
- **Added Type Guards** - `isValidResponseData()` function for safe type coercion

### Performance Fixes (P1)

- **Fixed Event Listener Memory Leak** - Used refs pattern in `useQuestionnaireSync.ts` to prevent listener accumulation
- **Added React.memo** - Wrapped `QuestionCard` component to prevent unnecessary re-renders

### Accessibility Fixes (P1 - WCAG 2.1 AA)

- **Fixed Color Contrast** - Changed `text-gray-500` to `text-gray-600` for AA compliance
- **Added Form Grouping** - Wrapped radio/checkbox groups in `<fieldset>` with `<legend>`
- **Added Focus Trap** - Modal now traps focus and handles Escape key
- **Added ARIA Labels** - Sync status indicators now have proper labels

### Code Quality Fixes (P2)

- **Added Division Guards** - Prevented division by zero in progress calculations
- **Documented Race Conditions** - Added TODO comments for future useReducer refactor
- **Fixed 400 API Errors** - Corrected clientId prop passing (was using clientName)

### UX Improvements

- **Scroll-to-Top Navigation** - Page now scrolls to top when navigating between questions
- **Responsive Design** - Full mobile/tablet/desktop optimization with touch-friendly inputs

### Documentation

- **Updated README.md** - Added Discovery Questionnaire section with:
  - Client access URLs
  - Supabase dashboard instructions
  - SQL queries for viewing/exporting data
  - Data protection overview
  - Environment variables
- **Created AUDIT-REPORT.md** - Full multi-agent audit findings
- **Created SUPABASE_DATA_INTEGRITY_AUDIT.md** - Data protection verification
- **Updated AI-PASSDOWN.md** - Comprehensive developer handoff documentation

### Files Changed

| File | Changes |
|------|---------|
| `app/api/questionnaire/[clientId]/route.ts` | Zod validation, type guards, removed service key |
| `components/questionnaire/QuestionCard.tsx` | React.memo, contrast, fieldset/legend |
| `components/questionnaire/QuestionnaireContainer.tsx` | Scroll-to-top, aria-labels, division guards |
| `components/questionnaire/MilestoneModal.tsx` | Focus trap, dialog role, Escape handler |
| `hooks/useQuestionnaireSync.ts` | Event listener refs pattern |
| `lib/supabase/secure-schema.sql` | Security warnings, RLS documentation |
| `app/discovery/[clientId]/page.tsx` | Added clientId prop |

---

## [2025-12-18] Session 3: Multi-Agent Audit

- Conducted comprehensive 4-agent parallel audit
- Identified 3 critical, 12 high, 10 medium, 2 low priority issues
- Created detailed AUDIT-REPORT.md

---

## [2025-12-18] Session 2: Questionnaire System Implementation

- Built Strategic Placement Diagnostic Questionnaire
- Integrated Supabase for data persistence
- Implemented dual-layer storage (localStorage + cloud)
- Created responsive dark-theme UI
- Added progress tracking with milestone celebrations

---

## [Initial] Session 1: Marketing Website

- Built complete marketing website with Next.js 15
- Implemented all pages (Home, Services, Process, Results, About, FAQ, Contact)
- Added SEO optimization, responsive design, accessibility
- Deployed to Vercel at southwestresumes.com
