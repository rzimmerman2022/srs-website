# AI Handoff - Session 5: Fix 120 Staging Audit Findings

**Created:** December 20, 2025
**Purpose:** Complete handoff for next AI session to fix all 120 audit findings
**Methodology:** SDA SOP Multi-Agent Workflow

---

## Executive Summary

The staging folder was audited by **8 parallel agents** (4 for marketing website, 4 for questionnaire system). This handoff contains **all 120 issues** that need to be fixed before the staging folder can replace the production root.

### Quick Stats

| System | Critical | High | Medium | Low | Total |
|--------|----------|------|--------|-----|-------|
| Marketing Website | 6 | 12 | 14 | 20 | **52** |
| Questionnaire System | 8 | 12 | 20 | 28 | **68** |
| **TOTAL** | **14** | **24** | **34** | **48** | **120** |

---

## Project Structure

```
/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/
├── staging/                    ← WHERE ALL FIXES GO
│   ├── app/                    ← Next.js pages
│   │   ├── page.tsx            ← Marketing: Home
│   │   ├── services/           ← Marketing: Services
│   │   ├── about/              ← Marketing: About
│   │   ├── contact/            ← Marketing: Contact
│   │   ├── faq/                ← Marketing: FAQ
│   │   ├── process/            ← Marketing: Process
│   │   ├── results/            ← Marketing: Results
│   │   ├── discovery/[clientId]/ ← Questionnaire: Client intake page
│   │   └── api/questionnaire/  ← Questionnaire: API endpoint
│   ├── components/
│   │   ├── layout/             ← Marketing: Header, Footer
│   │   ├── sections/           ← Marketing: Hero, ServiceGrid, etc.
│   │   ├── ui/                 ← Shared: Button, Input, Card
│   │   └── questionnaire/      ← Questionnaire: All components
│   ├── hooks/                  ← Questionnaire: useQuestionnaireSync
│   ├── lib/
│   │   ├── supabase/           ← Questionnaire: Database
│   │   └── questionnaire/      ← Questionnaire: Data, utils
│   ├── public/                 ← Static assets
│   └── next.config.ts          ← Next.js configuration
├── app/                        ← PRODUCTION (do not modify)
├── components/                 ← PRODUCTION (do not modify)
├── STAGING-AUDIT-REPORT.md     ← Consolidated audit report
├── DEV-QUESTIONNAIRE-AUDIT-REPORT.md ← Original questionnaire audit
├── WEBSITE-AUDIT-REPORT.md     ← Original website audit
└── CHANGELOG.md                ← Session history
```

---

## MASTER TODO LIST: All 120 Issues

### PART 1: MARKETING WEBSITE (52 Issues)

#### Security Issues (7)

| ID | Priority | Issue | File | Fix |
|----|----------|-------|------|-----|
| W-SEC-01 | HIGH | Missing Content Security Policy | `staging/next.config.ts` | Add CSP header: `default-src 'self'; script-src 'self' 'unsafe-inline'` |
| W-SEC-02 | HIGH | Missing X-Frame-Options header | `staging/next.config.ts` | Add `X-Frame-Options: DENY` |
| W-SEC-03 | MEDIUM | Missing X-Content-Type-Options | `staging/next.config.ts` | Add `X-Content-Type-Options: nosniff` |
| W-SEC-04 | MEDIUM | Missing Referrer-Policy header | `staging/next.config.ts` | Add `Referrer-Policy: strict-origin-when-cross-origin` |
| W-SEC-05 | LOW | Form input sanitization | `staging/components/sections/ContactForm.tsx` | Sanitize error message display |
| W-SEC-06 | LOW | File upload size validation | `staging/components/sections/ContactForm.tsx` | Add max 5MB validation |
| W-SEC-07 | LOW | HTTPS enforcement | Hosting level | Verify Vercel forces HTTPS |

#### Accessibility Issues (11)

| ID | Priority | Issue | File | Fix |
|----|----------|-------|------|-----|
| W-A11Y-01 | CRITICAL | Color contrast failure (gray-600) | `staging/app/page.tsx` | Change `text-gray-600` to `text-gray-700` |
| W-A11Y-02 | CRITICAL | Color contrast failure | `staging/app/about/page.tsx` | Change `text-gray-600` to `text-gray-700` |
| W-A11Y-03 | CRITICAL | Color contrast failure | `staging/app/services/page.tsx` | Change `text-gray-600` to `text-gray-700` |
| W-A11Y-04 | HIGH | Missing form validation feedback | `staging/components/sections/ContactForm.tsx` | Add `aria-invalid` and field-specific errors |
| W-A11Y-05 | HIGH | Heading hierarchy violations | Multiple pages | Ensure proper h1 → h2 → h3 hierarchy |
| W-A11Y-06 | HIGH | Insufficient focus indicators | `staging/components/layout/Header.tsx` | Add visible focus rings |
| W-A11Y-07 | MEDIUM | Touch targets < 44x44px | `staging/components/layout/Header.tsx` | Increase mobile menu button size |
| W-A11Y-08 | MEDIUM | Mobile menu lacks keyboard nav | `staging/components/layout/Header.tsx` | Add Escape key, focus trap |
| W-A11Y-09 | MEDIUM | Decorative icons not hidden | Multiple components | Add `aria-hidden="true"` to decorative icons |
| W-A11Y-10 | LOW | "Learn More" links lack context | Multiple pages | Add `aria-label` with destination |
| W-A11Y-11 | LOW | Missing aria-current="page" | `staging/components/layout/Header.tsx` | Add to active nav link |

#### Performance Issues (15)

| ID | Priority | Issue | File | Fix |
|----|----------|-------|------|-----|
| W-PERF-01 | CRITICAL | 1.7MB unoptimized logo | `staging/public/assets/logos/srs-logo.png` | Compress to WebP, ~10KB |
| W-PERF-02 | CRITICAL | Missing og-image.jpg | `staging/public/og-image.jpg` | Create 1200x630px brand image |
| W-PERF-03 | CRITICAL | Images unoptimized config | `staging/next.config.ts` | Remove `images: { unoptimized: true }` |
| W-PERF-04 | HIGH | Google Analytics blocking render | `staging/app/layout.tsx` | Change to `strategy="lazyOnload"` |
| W-PERF-05 | HIGH | No lazy loading on images | Multiple pages | Add `loading="lazy"` to below-fold |
| W-PERF-06 | HIGH | No priority on hero images | `staging/components/sections/Hero.tsx` | Add `priority` to above-fold images |
| W-PERF-07 | HIGH | Missing image sizes attribute | Multiple Image components | Add proper `sizes` attribute |
| W-PERF-08 | MEDIUM | No code splitting | `staging/app/page.tsx` (567 lines) | Use `dynamic()` for below-fold sections |
| W-PERF-09 | MEDIUM | Font loading not optimized | `staging/app/layout.tsx` | Add `preload: true`, preconnect |
| W-PERF-10 | MEDIUM | No caching strategy | `staging/next.config.ts` | Add cache headers for static assets |
| W-PERF-11 | MEDIUM | Mobile menu layout shift | `staging/components/layout/Header.tsx` | Use CSS transforms instead |
| W-PERF-12 | LOW | Large page components | `staging/app/page.tsx` | Consider component extraction |
| W-PERF-13 | LOW | Unused CSS | Global styles | Audit and remove unused styles |
| W-PERF-14 | LOW | No resource hints | `staging/app/layout.tsx` | Add dns-prefetch for external resources |
| W-PERF-15 | LOW | No image srcset | Image components | Add responsive srcset |

#### Code Quality Issues (19)

| ID | Priority | Issue | File | Fix |
|----|----------|-------|------|-----|
| W-CQ-01 | HIGH | Index-based keys in lists | `staging/app/page.tsx` | Add unique IDs to data arrays |
| W-CQ-02 | HIGH | Index-based keys | `staging/app/results/page.tsx` | Add unique IDs |
| W-CQ-03 | HIGH | Index-based keys | `staging/app/services/page.tsx` | Add unique IDs |
| W-CQ-04 | MEDIUM | Deprecated substr() usage | `staging/components/ui/Input.tsx:30` | Change to `substring()` or `useId()` |
| W-CQ-05 | MEDIUM | Unused gradient prop | `staging/components/sections/Hero.tsx:28` | Remove prop or implement |
| W-CQ-06 | MEDIUM | Hardcoded Formspree URL | `staging/components/sections/ContactForm.tsx:21` | Move to env variable |
| W-CQ-07 | MEDIUM | Missing error type annotations | Catch blocks | Add proper error typing |
| W-CQ-08 | MEDIUM | TODO comments in production | Multiple files | Resolve or remove TODOs |
| W-CQ-09 | LOW | Duplicate CTA section code | Multiple pages | Extract to shared component |
| W-CQ-10 | LOW | No global error boundary | `staging/app/layout.tsx` | Add ErrorBoundary wrapper |
| W-CQ-11 | LOW | Inconsistent button variants | UI components | Standardize variant naming |
| W-CQ-12 | LOW | Magic numbers in styles | Multiple components | Extract to constants |
| W-CQ-13 | LOW | Long component files | `staging/app/page.tsx` | Consider splitting |
| W-CQ-14 | LOW | Missing JSDoc comments | Public components | Add documentation |
| W-CQ-15 | LOW | Inconsistent imports | Multiple files | Standardize import order |
| W-CQ-16 | LOW | Unused variables | Various files | Remove or use |
| W-CQ-17 | LOW | Console.log statements | Various files | Remove for production |
| W-CQ-18 | LOW | Backup files (.bak) | Repository | Delete backup files |
| W-CQ-19 | LOW | SVG icon duplication | 3+ files | Create centralized icon library |

---

### PART 2: QUESTIONNAIRE SYSTEM (68 Issues)

#### Security Issues (8)

| ID | Priority | Issue | File | Fix |
|----|----------|-------|------|-----|
| Q-SEC-01 | CRITICAL | No rate limiting on API | `staging/app/api/questionnaire/[clientId]/route.ts` | Implement Upstash Redis rate limiting |
| Q-SEC-02 | HIGH | RLS policies too permissive | `staging/lib/supabase/secure-schema.sql` | Implement client token authentication |
| Q-SEC-03 | HIGH | PII unencrypted in localStorage | `staging/hooks/useQuestionnaireSync.ts` | Encrypt with crypto-js AES |
| Q-SEC-04 | MEDIUM | CSRF Referer header fallback | `staging/middleware.ts` | Add Origin header fallback |
| Q-SEC-05 | MEDIUM | Error message information leakage | `staging/app/api/questionnaire/[clientId]/route.ts` | Sanitize error responses |
| Q-SEC-06 | LOW | JSON.parse without validation | `staging/hooks/useQuestionnaireSync.ts` | Wrap in try-catch with validation |
| Q-SEC-07 | LOW | Missing client-side sanitization | `staging/lib/questionnaire/utils.ts` | Add input sanitization |
| Q-SEC-08 | LOW | No request deduplication | API route | Add request deduplication |

#### Accessibility Issues (24)

| ID | Priority | Issue | File | Fix |
|----|----------|-------|------|-----|
| Q-A11Y-01 | CRITICAL | Color contrast dark theme | `staging/app/discovery/[clientId]/page.tsx:30` | Change `text-gray-400` to `text-gray-200` |
| Q-A11Y-02 | ~~INVALID~~ | ~~Color contrast in components~~ | ~~QuestionnaireDark.tsx~~ | **ARCHIVED - Skip this item** |
| Q-A11Y-03 | CRITICAL | Missing form labels | Text inputs, textarea | Add `aria-label={question.question}` |
| Q-A11Y-04 | CRITICAL | Missing fieldset/legend | Radio groups | Wrap in proper semantic structure |
| Q-A11Y-05 | CRITICAL | Progress bar missing ARIA | Progress component | Add `role="progressbar"`, aria-value* |
| Q-A11Y-06 | CRITICAL | Modal focus trap incomplete | `staging/components/questionnaire/MilestoneModal.tsx` | Prevent Tab outside modal |
| Q-A11Y-07 | CRITICAL | Native alert() usage | `staging/app/discovery/[clientId]/page.tsx` | Replace with accessible modal |
| Q-A11Y-08 | HIGH | Skip link missing | `staging/app/discovery/[clientId]/page.tsx` | Add skip to main content link |
| Q-A11Y-09 | HIGH | Progress updates not announced | Progress component | Add aria-live region |
| Q-A11Y-10 | HIGH | Focus indicator contrast | Input components | Improve focus ring visibility |
| Q-A11Y-11 | HIGH | "Why asking" button ARIA | Question explanations | Add aria-expanded, aria-controls |
| Q-A11Y-12 | HIGH | Module nav missing step count | `staging/components/questionnaire/ModuleNav.tsx` | Add "Step X of Y" |
| Q-A11Y-13 | MEDIUM | Submit errors not associated | Error display | Link errors to specific fields |
| Q-A11Y-14 | MEDIUM | Sync status not announced | Sync indicator | Add sr-only announcements |
| Q-A11Y-15 | MEDIUM | Points popup not announced | `staging/components/questionnaire/PointsPopup.tsx` | Add aria-live="polite" |
| Q-A11Y-16 | MEDIUM | Milestone celebration inaccessible | MilestoneModal | Add proper ARIA |
| Q-A11Y-17 | MEDIUM | Question navigation confusing | Navigation buttons | Improve button labels |
| Q-A11Y-18 | MEDIUM | Slider lacks value announcement | Slider inputs | Add aria-valuetext |
| Q-A11Y-19 | MEDIUM | Checkbox group semantics | Multi-select questions | Use proper grouping |
| Q-A11Y-20 | LOW | Animation reduces motion | Animations | Respect prefers-reduced-motion |
| Q-A11Y-21 | LOW | Loading state not announced | Loading spinner | Add aria-busy |
| Q-A11Y-22 | LOW | Error recovery instructions | Error states | Provide clear guidance |
| Q-A11Y-23 | LOW | Touch target size on mobile | Buttons | Ensure 44x44px minimum |
| Q-A11Y-24 | LOW | High contrast mode support | All components | Test and fix high contrast |

#### Performance Issues (27)

| ID | Priority | Issue | File | Fix |
|----|----------|-------|------|-----|
| Q-PERF-01 | HIGH | Race condition in state init | `staging/components/questionnaire/QuestionnaireContainer.tsx:67-80` | Use useReducer for atomic updates |
| Q-PERF-02 | HIGH | Blocking localStorage operations | `staging/hooks/useQuestionnaireSync.ts:88-94` | Debounce writes (500ms) |
| Q-PERF-03 | HIGH | Expensive progress recalculation | `staging/components/questionnaire/QuestionnaireContainer.tsx:115-124` | Track count incrementally |
| Q-PERF-04 | MEDIUM | Missing timeout cleanup | `staging/components/questionnaire/PointsPopup.tsx:48` | Fix dependency array |
| Q-PERF-05 | MEDIUM | Inefficient JSON parsing | Initial load | Parse once, cache result |
| Q-PERF-06 | MEDIUM | Unnecessary QuestionCard re-renders | `staging/components/questionnaire/QuestionCard.tsx` | Verify memo effectiveness |
| Q-PERF-07 | MEDIUM | Supabase client not code-split | Supabase import | Dynamic import (~50KB savings) |
| Q-PERF-08 | MEDIUM | Milestone modal timer leak | `staging/components/questionnaire/MilestoneModal.tsx` | Proper cleanup on unmount |
| Q-PERF-09 | MEDIUM | Combo decay timer recreated | Timer logic | Use useRef for timer |
| Q-PERF-10 | MEDIUM | Progress bar layout thrashing | Progress animation | Use transform instead |
| Q-PERF-11 | MEDIUM | Keyboard listener re-registered | `staging/components/questionnaire/QuestionnaireContainer.tsx` | Move to useEffect with stable deps |
| Q-PERF-12 | LOW | Large questionnaire data in bundle | `staging/lib/questionnaire/` | Move to API/database |
| Q-PERF-13 | LOW | No request deduplication | API calls | Dedupe identical requests |
| Q-PERF-14 | LOW | Animation frame not cancelled | Animations | Cancel on unmount |
| Q-PERF-15 | LOW | Multiple setState in handlers | Event handlers | Batch updates |
| Q-PERF-16 | LOW | Object creation in render | Inline objects | Memoize or extract |
| Q-PERF-17 | LOW | Array methods chain | Data processing | Combine operations |
| Q-PERF-18 | LOW | No virtual scrolling | Long lists | Consider virtualization |
| Q-PERF-19 | LOW | Heavy component not lazy | MilestoneModal | Dynamic import |
| Q-PERF-20 | LOW | PointsPopup not lazy | PointsPopup | Dynamic import |
| Q-PERF-21 | LOW | Sync debounce could be longer | Sync timing | Consider 1000ms |
| Q-PERF-22 | LOW | No stale-while-revalidate | Data fetching | Add SWR pattern |
| Q-PERF-23 | LOW | Initial render hydration | SSR mismatch | Fix hydration issues |
| Q-PERF-24 | LOW | Bundle size not analyzed | Build process | Add bundle analyzer |
| Q-PERF-25 | LOW | No preloading of next question | Navigation | Preload adjacent data |
| Q-PERF-26 | LOW | CSS not purged | Tailwind | Verify purge config |
| Q-PERF-27 | LOW | No service worker | Offline support | Consider PWA features |

#### Code Quality Issues (9)

| ID | Priority | Issue | File | Fix |
|----|----------|-------|------|-----|
| Q-CQ-01 | HIGH | Race condition state init | `staging/components/questionnaire/QuestionnaireContainer.tsx` | Refactor to useReducer |
| Q-CQ-02 | HIGH | Streak reset bug | `staging/components/questionnaire/QuestionnaireContainer.tsx:274-278` | Only reset combo, not total points |
| Q-CQ-03 | MEDIUM | Incomplete dependency arrays | `staging/components/questionnaire/PointsPopup.tsx:19-48` | Add missing deps |
| Q-CQ-04 | MEDIUM | Unsafe type assertions | Various files | Add runtime validation |
| Q-CQ-05 | MEDIUM | Hardcoded timeout values | Timer constants | Move to config/env |
| Q-CQ-06 | LOW | Division by zero risk | `staging/components/questionnaire/QuestionnaireDark.tsx` | Add guards (partially done) |
| Q-CQ-07 | LOW | Console statements | Multiple files | Remove or add logging utility |
| Q-CQ-08 | LOW | Inconsistent memoization | Component patterns | Standardize approach |
| Q-CQ-09 | LOW | Missing PropTypes | Components | Add or rely on TypeScript |

---

## Recommended Agent Strategy

### Option A: 4 Agents by Priority (Recommended)

| Agent | Focus | Issues | Est. Hours |
|-------|-------|--------|------------|
| Agent 1 | All CRITICAL (14) | W-SEC-01/02, W-A11Y-01/02/03, W-PERF-01/02/03, Q-SEC-01, Q-A11Y-01-07 | 4-5 |
| Agent 2 | All HIGH (24) | W-SEC-*, W-A11Y-04-06, W-PERF-04-07, W-CQ-01-03, Q-SEC-02/03, Q-A11Y-08-12, Q-PERF-01-03, Q-CQ-01/02 | 5-6 |
| Agent 3 | All MEDIUM (34) | All MEDIUM issues | 4-5 |
| Agent 4 | All LOW (48) | All LOW issues | 4-5 |

### Option B: 8 Agents by System + Category

| Agent | Focus | Issues |
|-------|-------|--------|
| Agent 1 | Website Security + Headers | W-SEC-01 to W-SEC-07 |
| Agent 2 | Website Accessibility | W-A11Y-01 to W-A11Y-11 |
| Agent 3 | Website Performance | W-PERF-01 to W-PERF-15 |
| Agent 4 | Website Code Quality | W-CQ-01 to W-CQ-19 |
| Agent 5 | Questionnaire Security | Q-SEC-01 to Q-SEC-08 |
| Agent 6 | Questionnaire Accessibility | Q-A11Y-01 to Q-A11Y-24 |
| Agent 7 | Questionnaire Performance | Q-PERF-01 to Q-PERF-27 |
| Agent 8 | Questionnaire Code Quality | Q-CQ-01 to Q-CQ-09 |

---

## Key Files Quick Reference

### Must Modify (P0/P1)

```
staging/next.config.ts                              ← Security headers, image config
staging/public/assets/logos/srs-logo.png            ← Compress to WebP
staging/public/og-image.jpg                         ← CREATE (missing)
staging/app/layout.tsx                              ← GA loading, fonts
staging/app/page.tsx                                ← Contrast, keys, lazy loading
staging/app/discovery/[clientId]/page.tsx           ← alert(), contrast, skip link
staging/app/api/questionnaire/[clientId]/route.ts   ← Rate limiting
staging/hooks/useQuestionnaireSync.ts               ← Encrypt localStorage
staging/components/questionnaire/QuestionCard.tsx   ← Focus indicators, ARIA
staging/components/questionnaire/QuestionnaireContainer.tsx ← useReducer, streak bug
staging/components/questionnaire/MilestoneModal.tsx ← Focus trap, timer cleanup
staging/components/questionnaire/ModuleNav.tsx      ← ARIA labels
staging/components/sections/ContactForm.tsx         ← Validation, env var
staging/components/layout/Header.tsx                ← Focus, keyboard nav
staging/middleware.ts                               ← CSRF fallback
staging/lib/supabase/secure-schema.sql              ← RLS policies
```

---

## Code Snippets for Common Fixes

### Security Headers (next.config.ts)

```typescript
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ]
  }];
}
```

### Rate Limiting (API route)

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 h'),
});

// In handler:
const identifier = request.headers.get('x-forwarded-for') ?? 'anonymous';
const { success } = await ratelimit.limit(identifier);
if (!success) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
}
```

### localStorage Encryption

```typescript
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || 'fallback-key';

function encryptData(data: object): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
}

function decryptData(encrypted: string): object | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    return null;
  }
}
```

### Focus Indicators

```typescript
// Add to input/button classes:
className="... focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy"

// For dark theme:
className="... focus-within:ring-2 focus-within:ring-gold"
```

---

## Verification Checklist

After all fixes, run these checks:

### Build & Lint
```bash
cd staging
npm run build        # No errors
npm run lint         # No errors
npm run type-check   # No errors (if script exists)
```

### Security
- [ ] Scan with https://securityheaders.com/
- [ ] Test rate limiting with load testing tool
- [ ] Verify CSRF protection with Postman
- [ ] Test localStorage encryption

### Accessibility
- [ ] Lighthouse accessibility: 90+
- [ ] Keyboard-only navigation test
- [ ] Screen reader test (VoiceOver/NVDA)
- [ ] Color contrast analyzer (WebAIM)

### Performance
- [ ] Lighthouse performance: 90+
- [ ] Verify images < 100KB each
- [ ] Check Core Web Vitals
- [ ] Test on 3G throttled connection

---

## Related Documents

- [STAGING-AUDIT-REPORT.md](./STAGING-AUDIT-REPORT.md) - Consolidated audit findings
- [DEV-QUESTIONNAIRE-AUDIT-REPORT.md](./DEV-QUESTIONNAIRE-AUDIT-REPORT.md) - Original questionnaire audit
- [WEBSITE-AUDIT-REPORT.md](./WEBSITE-AUDIT-REPORT.md) - Original website audit
- [CHANGELOG.md](./CHANGELOG.md) - Session history
- [README.md](./README.md) - Project documentation

---

## Session Goal

**Fix all 120 issues in the staging folder so it can be deployed to production.**

Priority order:
1. Critical (14) - Must fix
2. High (24) - Should fix
3. Medium (34) - Nice to have
4. Low (48) - Tech debt

Estimated total effort: **11-16 hours**

---

*Handoff prepared by Claude Opus 4.5 - Session 4*
*Ready for SDA SOP Multi-Agent Workflow execution*
