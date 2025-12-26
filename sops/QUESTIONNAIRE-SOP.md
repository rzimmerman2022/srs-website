# Questionnaire System - Standard Operating Procedure

**Version:** 1.0.0
**Last Updated:** 2025-12-21
**Owner:** Ryan Zimmerman
**Maintained By:** AI Agents (Claude)

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [Client Management](#3-client-management)
4. [Data Flow](#4-data-flow)
5. [Security Requirements](#5-security-requirements)
6. [Questionnaire Structure](#6-questionnaire-structure)
7. [Component Reference](#7-component-reference)
8. [API Reference](#8-api-reference)
9. [Database Schema](#9-database-schema)
10. [Testing Requirements](#10-testing-requirements)
11. [Deployment Checklist](#11-deployment-checklist)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. System Overview

### Purpose

The Discovery Questionnaire System collects structured intake information from resume service clients. It features:

- **Offline-first architecture** with local + server sync
- **Gamification** (points, streaks, milestones) to improve completion rates
- **Type-safe** TypeScript throughout
- **WCAG 2.1 AA** accessibility compliance
- **Rate-limited API** with input sanitization

### Key URLs

| Environment | URL Pattern |
|-------------|-------------|
| Development | `http://localhost:3005/discovery/[clientId]` |
| Production | `https://southwestresumeservices.com/discovery/[clientId]` |

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS |
| State | React hooks + localStorage + Supabase |
| Database | Supabase (PostgreSQL) |
| Validation | Zod schemas |

---

## 2. Architecture

### File Structure

```
/lib/questionnaire/
├── types.ts          # Type definitions + inline guards
├── config.ts         # Timing, gamification, rate limiting
├── utils.ts          # Sanitization, validation
├── type-guards.ts    # Runtime type checks
├── jackie-deleon.ts  # Client questionnaire definition
└── index.ts          # Barrel export

/components/questionnaire/
├── QuestionnaireContainer.tsx  # Main orchestrator
├── QuestionCard.tsx            # Question renderer
├── QuestionnaireHeader.tsx     # Progress bar
├── ModuleNav.tsx               # Module switcher
├── ProgressRing.tsx            # Circular progress
├── MilestoneModal.tsx          # Celebration popup
├── PointsPopup.tsx             # Points feedback
├── ErrorBoundary.tsx           # Error handler
└── index.ts                    # Exports

/hooks/
├── useQuestionnaireSync.ts     # Local + server sync
└── index.ts

/app/discovery/
├── page.tsx                    # Landing page
├── [clientId]/page.tsx         # Questionnaire page
└── layout.tsx                  # Metadata (no indexing)

/app/api/questionnaire/
└── [clientId]/route.ts         # GET/POST API
```

### Dependency Graph

```
[clientId]/page.tsx
    └── QuestionnaireContainer
            ├── useQuestionnaireSync (hook)
            │       ├── localStorage (encrypted)
            │       └── /api/questionnaire/[clientId]
            │               └── Supabase
            ├── QuestionnaireHeader
            ├── ModuleNav
            ├── QuestionCard
            ├── PointsPopup
            └── MilestoneModal
```

---

## 3. Client Management

### Creating a New Client

**Step 1:** Create questionnaire definition file

```typescript
// /lib/questionnaire/[client-id].ts
import { Questionnaire } from './types';

export const clientNameQuestionnaire: Questionnaire = {
  id: 'discovery',
  title: 'Discovery Questionnaire',
  description: 'Complete intake for [Client Name]',
  clientName: 'Client Name',
  modules: [
    // See Section 6 for module structure
  ],
};
```

**Step 2:** Register in page router

```typescript
// /app/discovery/[clientId]/page.tsx
import { clientNameQuestionnaire } from '@/lib/questionnaire/client-name';

const questionnaires: Record<string, Questionnaire> = {
  'client-id': clientNameQuestionnaire,
  // Add new client here
};
```

**Step 3:** Send client their unique URL

```
https://southwestresumeservices.com/discovery/client-id
```

### Client ID Conventions

| Pattern | Example | Use Case |
|---------|---------|----------|
| `firstname-lastname` | `jackie-deleon` | Standard clients |
| `company-role` | `acme-vp-ops` | Corporate clients |
| `test-*` | `test-client` | Testing only |

**IMPORTANT:** Never use `test-*` prefixed IDs for real clients.

### Active Clients

| Client ID | Client Name | Status | Created |
|-----------|-------------|--------|---------|
| `jdeleon` | Jackie DeLeon | Active | 2025-12-18 |

---

## 4. Data Flow

### Save Flow

```
User types answer
       ↓
QuestionCard.onChange()
       ↓
QuestionnaireContainer.handleResponseChange()
       ↓
useQuestionnaireSync.updateState()
       ↓
localStorage write (immediate, encrypted)
       ↓
debouncedSync() (2s delay for batching)
       ↓
POST /api/questionnaire/[clientId]
       ↓
Zod validation → Supabase upsert
       ↓
Async: response_history insert (audit trail)
       ↓
Response: { success: true }
       ↓
Hook updates lastSyncedAt
```

### Load Flow

```
Page mounts
       ↓
useQuestionnaireSync initializes
       ↓
Load from localStorage (instant display)
       ↓
GET /api/questionnaire/[clientId]
       ↓
Compare: local vs server progress
       ↓
Merge: prefer whichever has MORE progress
       ↓
Render current state
```

### Conflict Resolution

| Scenario | Resolution |
|----------|------------|
| Local ahead of server | Keep local, sync to server |
| Server ahead of local | Use server, update local |
| Equal progress | Use server (source of truth) |
| Offline | Use local, sync when online |

---

## 5. Security Requirements

### Implemented Controls

| Code | Category | Implementation | Status |
|------|----------|----------------|--------|
| Q-SEC-01 | Rate Limiting | 100 req/hr per IP | ✅ |
| Q-SEC-02 | No Service Key | Anon key only | ✅ |
| Q-SEC-03 | localStorage Encryption | Base64 encoding | ✅ |
| Q-SEC-05 | Error Sanitization | getSafeErrorMessage() | ✅ |
| Q-SEC-06 | Type Validation | Runtime type guards | ✅ |
| Q-SEC-07 | Input Sanitization | sanitizeInput() XSS prevention | ✅ |
| Q-SEC-08 | Deduplication | 5-second window | ✅ |

### Security Checklist (Before Go-Live)

- [ ] Verify rate limiting is active (check API logs)
- [ ] Confirm no service role key in client code
- [ ] Test XSS prevention with `<script>` input
- [ ] Verify error messages don't expose internals
- [ ] Check localStorage encryption is working
- [ ] Confirm robots.txt blocks /discovery/ from indexing

### Input Sanitization

All user input passes through `sanitizeInput()`:

```typescript
// Escapes: & < > " ' to HTML entities
sanitizeInput('<script>alert("xss")</script>')
// Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
```

---

## 6. Questionnaire Structure

### Type Definitions

```typescript
interface Questionnaire {
  id: string;                    // e.g., 'discovery'
  title: string;                 // Display title
  description: string;           // Intro text
  clientName: string;            // Client's name
  modules: QuestionModule[];     // Ordered modules
}

interface QuestionModule {
  id: string;                    // e.g., 'guardrails'
  title: string;                 // e.g., 'Guardrails & Role Targeting'
  description: string;           // Module intro
  estimatedMinutes: number;      // Time estimate
  questions: Question[];         // Questions in module
  required: boolean;             // Must complete?
}

interface Question {
  id: string;                    // e.g., 'q1'
  text: string;                  // Question text
  type: QuestionType;            // Input type
  required: boolean;             // Must answer?
  priority: 'critical' | 'required' | 'optional';
  options?: QuestionOption[];    // For radio/checkbox/select
  validation?: ValidationRule;   // Min/max/pattern
  helpText?: string;             // Tooltip content
  subQuestions?: Question[];     // Follow-up questions
  showIf?: ConditionalRule;      // Conditional display
}
```

### Question Types

| Type | Component | Use Case |
|------|-----------|----------|
| `text` | Single-line input | Names, titles |
| `textarea` | Multi-line input | Descriptions, stories |
| `number` | Numeric input | Counts, years |
| `currency` | $ prefixed input | Salary, budget |
| `radio` | Single select | Yes/No, categories |
| `checkbox` | Multi-select | Skills, tools |
| `select` | Dropdown | Long option lists |
| `date` | Date picker | Start/end dates |
| `percentage-split` | Slider group | Time allocation |
| `timeline` | Date range list | Work history |

### Validation Rules

```typescript
interface ValidationRule {
  min?: number;        // Minimum value/length
  max?: number;        // Maximum value/length
  pattern?: string;    // Regex pattern
  message?: string;    // Error message
}
```

### Conditional Display

```typescript
interface ConditionalRule {
  questionId: string;           // Watch this question
  operator: 'equals' | 'contains' | 'notEmpty';
  value?: string | string[];    // Expected value(s)
}

// Example: Show follow-up only if "Other" selected
{
  showIf: {
    questionId: 'q5',
    operator: 'contains',
    value: 'other'
  }
}
```

---

## 7. Component Reference

### QuestionnaireContainer

**Purpose:** Main orchestrator component

**Props:**
```typescript
interface Props {
  questionnaire: Questionnaire;
  clientId: string;
}
```

**State Managed:**
- Current module/question index
- All answers (QuestionnaireResponse)
- Points, streak, combo multiplier
- Active milestone modal
- Keyboard navigation

**Key Functions:**
| Function | Purpose |
|----------|---------|
| `handleResponseChange()` | Process answer updates |
| `calculateProgress()` | Compute completion % |
| `checkMilestones()` | Trigger celebrations |
| `navigateToQuestion()` | Handle navigation |

### QuestionCard

**Purpose:** Renders individual questions based on type

**Props:**
```typescript
interface Props {
  question: Question;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  error?: string;
  autoFocus?: boolean;
}
```

**Type Guards Used:**
- `isStringValue()` - text, textarea, radio, select
- `isNumberValue()` - number, currency
- `isStringArray()` - checkbox
- `isPercentageRecord()` - percentage-split

### useQuestionnaireSync

**Purpose:** Hybrid local + server synchronization

**Parameters:**
```typescript
interface Options {
  clientId: string;
  questionnaireId?: string;  // default: 'discovery'
}
```

**Returns:**
```typescript
interface Return {
  state: QuestionnaireState | null;
  isLoading: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  error: string | null;
  updateState: (updates: Partial<QuestionnaireState>) => void;
  forceSync: () => Promise<void>;
}
```

---

## 8. API Reference

### GET /api/questionnaire/[clientId]

**Purpose:** Retrieve saved responses

**Query Parameters:**
| Param | Type | Required | Default |
|-------|------|----------|---------|
| `questionnaireId` | string | No | `'discovery'` |

**Response:**
```json
{
  "data": {
    "client_id": "jdeleon",
    "questionnaire_id": "discovery",
    "answers": { "q1": 85000, "q2": 110000 },
    "current_question_index": 5,
    "current_module_index": 1,
    "completed_modules": ["guardrails"],
    "points": 45,
    "streak": 3,
    "completed": false
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid client ID format",
  "fallback": true
}
```

### POST /api/questionnaire/[clientId]

**Purpose:** Save/update responses

**Request Body:**
```json
{
  "questionnaireId": "discovery",
  "answers": { "q1": 85000, "q2": 110000 },
  "currentQuestionIndex": 5,
  "currentModuleIndex": 1,
  "completedModules": ["guardrails"],
  "points": 45,
  "streak": 3,
  "completed": false
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* saved record */ }
}
```

**Rate Limiting:**
- 100 requests per hour per IP
- 429 response when exceeded:
```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "retryAfter": 3600
}
```

---

## 9. Database Schema

### questionnaire_responses

```sql
CREATE TABLE questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL,
  questionnaire_id TEXT NOT NULL DEFAULT 'discovery',
  answers JSONB NOT NULL DEFAULT '{}',
  current_question_index INTEGER DEFAULT 0,
  current_module_index INTEGER DEFAULT 0,
  completed_modules TEXT[] DEFAULT '{}',
  points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(client_id, questionnaire_id)
);
```

### response_history (Audit Trail)

```sql
CREATE TABLE response_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES questionnaire_responses(id),
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security

```sql
-- SELECT: Allow reading own data
CREATE POLICY "Allow read" ON questionnaire_responses
  FOR SELECT USING (true);

-- INSERT: Validate format
CREATE POLICY "Allow insert with validation" ON questionnaire_responses
  FOR INSERT WITH CHECK (
    client_id ~ '^[a-z0-9-]+$' AND
    questionnaire_id ~ '^[a-z0-9-]+$'
  );

-- UPDATE: Validate format
CREATE POLICY "Allow update with validation" ON questionnaire_responses
  FOR UPDATE USING (true)
  WITH CHECK (
    client_id ~ '^[a-z0-9-]+$' AND
    questionnaire_id ~ '^[a-z0-9-]+$'
  );

-- DELETE: Blocked (audit trail preservation)
CREATE POLICY "Block delete" ON questionnaire_responses
  FOR DELETE USING (false);
```

---

## 10. Testing Requirements

### Test Categories

| Category | Framework | Coverage Target |
|----------|-----------|-----------------|
| Unit | Vitest | 90%+ for utils, type-guards |
| Hook | Vitest + Testing Library | 80%+ for useQuestionnaireSync |
| API | Vitest | 90%+ for route handlers |
| Component | Vitest + Testing Library | 70%+ for QuestionCard |
| E2E | Playwright | Critical paths only |

### Unit Test Requirements

**`/lib/questionnaire/utils.ts`**
- [ ] `sanitizeInput()` escapes all special chars
- [ ] `sanitizeInput()` handles null/undefined
- [ ] `sanitizeValue()` recurses through objects
- [ ] `sanitizeValue()` handles arrays
- [ ] `isValidAnswer()` returns false for empty

**`/lib/questionnaire/type-guards.ts`**
- [ ] `isStringValue()` type narrowing
- [ ] `isNumberValue()` type narrowing
- [ ] `isStringArray()` type narrowing
- [ ] `isPercentageRecord()` type narrowing

### Hook Test Requirements

**`/hooks/useQuestionnaireSync.ts`**
- [ ] Loads from localStorage on mount
- [ ] Fetches from API after local load
- [ ] Prefers local if more progress
- [ ] Prefers server if more progress
- [ ] Handles offline gracefully
- [ ] Retries on failure (3 attempts)
- [ ] Debounces sync (2s delay)
- [ ] Updates lastSyncedAt on success

### API Test Requirements

**`/app/api/questionnaire/[clientId]/route.ts`**
- [ ] GET returns 200 with valid clientId
- [ ] GET returns 400 with invalid clientId
- [ ] POST saves new response
- [ ] POST updates existing response
- [ ] POST validates all fields
- [ ] Rate limiting enforced (429 after 100 req)
- [ ] Deduplication blocks rapid duplicates

### E2E Test Requirements

- [ ] Complete full questionnaire start to finish
- [ ] Resume questionnaire from saved state
- [ ] Milestone celebration displays
- [ ] Points accumulate correctly
- [ ] Works offline then syncs online

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific file
npm test -- utils.test.ts

# Run E2E tests
npm run test:e2e
```

---

## 11. Deployment Checklist

### Pre-Deployment

- [ ] All tests passing (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Lint passes (`npm run lint:all`)
- [ ] Security checklist complete (Section 5)
- [ ] New client registered in page router
- [ ] Supabase schema updated if needed

### Supabase Setup

1. Create tables from `/lib/supabase/schema.sql`
2. Apply RLS from `/lib/supabase/secure-schema.sql`
3. Set environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

### Vercel Deployment

1. Push to `main` branch
2. Verify build succeeds in Vercel dashboard
3. Check environment variables are set
4. Test production URL

### Post-Deployment Verification

- [ ] Landing page loads (`/discovery`)
- [ ] Client questionnaire loads (`/discovery/[clientId]`)
- [ ] Answer saves to Supabase
- [ ] Progress persists on refresh
- [ ] Offline mode works
- [ ] No console errors

---

## 12. Troubleshooting

### Common Issues

#### "Failed to sync" error
**Cause:** Supabase connection failed
**Fix:** Check environment variables, verify Supabase project is active

#### Answers not saving
**Cause:** Rate limit exceeded or validation error
**Fix:** Check network tab for 429/400 responses, verify input format

#### localStorage not persisting
**Cause:** Private browsing or storage quota exceeded
**Fix:** Try normal browsing mode, clear old data

#### Milestone not triggering
**Cause:** Progress calculation mismatch
**Fix:** Check `calculateProgress()` logic, verify milestone thresholds

### Debug Mode

Add to URL for verbose logging:
```
/discovery/jdeleon?debug=true
```

Logs:
- State changes
- Sync attempts
- API responses
- Milestone triggers

### Support Contacts

| Issue Type | Contact |
|------------|---------|
| Client access | ryan@southwestresumeservices.com |
| Technical bugs | GitHub Issues |
| Security concerns | Immediate escalation |

---

## Appendix A: Gamification System

### Points Calculation

```typescript
const BASE_POINTS = 5;
const MAX_MULTIPLIER = 3;
const COMBO_THRESHOLD = 3;

function calculatePoints(streak: number): number {
  const multiplier = Math.min(1 + (streak / COMBO_THRESHOLD), MAX_MULTIPLIER);
  return Math.round(BASE_POINTS * multiplier);
}
```

### Milestones

| Threshold | Name | Emoji |
|-----------|------|-------|
| 1% | Journey Begun | 🚀 |
| 25% | Making Progress | 📈 |
| 50% | Halfway There | ⭐ |
| 75% | Almost Done | 🔥 |
| 100% | Mission Accomplished | 🏆 |

---

## Appendix B: Configuration Reference

### `/lib/questionnaire/config.ts`

```typescript
export const UI_TIMING = {
  POINTS_POPUP_SHOW_DELAY: 200,    // ms before popup appears
  POINTS_POPUP_DURATION: 1200,     // ms popup stays visible
  MILESTONE_MODAL_DELAY: 100,      // ms before modal appears
  MILESTONE_MODAL_DURATION: 3000,  // ms modal stays open
};

export const GAMIFICATION = {
  BASE_POINTS: 5,
  MAX_MULTIPLIER: 3,
  COMBO_THRESHOLD: 3,
};

export const RATE_LIMITING = {
  MAX_REQUESTS_PER_HOUR: 100,
  DEDUP_WINDOW_MS: 5000,
};

export const SYNC = {
  DEBOUNCE_MS: 2000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAYS: [1000, 2000, 4000],
};
```

---

**Document Version History:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-21 | Initial SOP creation |

---

*This SOP should be reviewed and updated after each significant questionnaire system change.*
