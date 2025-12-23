# Questionnaire System - Standard Operating Procedure

**Version:** 1.0
**Last Updated:** December 22, 2025
**Author:** Southwest Resume Services Engineering

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Data Flow](#3-data-flow)
4. [File Structure](#4-file-structure)
5. [Database Schema](#5-database-schema)
6. [Questionnaire Definition (Source of Truth)](#6-questionnaire-definition-source-of-truth)
7. [Progress Calculation](#7-progress-calculation)
8. [Adding a New Client Questionnaire](#8-adding-a-new-client-questionnaire)
9. [Client-Facing Flow](#9-client-facing-flow)
10. [Admin Dashboard Flow](#10-admin-dashboard-flow)
11. [API Reference](#11-api-reference)
12. [Troubleshooting](#12-troubleshooting)
13. [Glossary](#13-glossary)

---

## 1. System Overview

The SRS Questionnaire System is a gamified career discovery tool that:

- Collects structured information from clients via interactive questionnaires
- Tracks progress with points, streaks, and milestones
- Syncs data in real-time to Supabase (cloud database)
- Displays progress and responses in the admin dashboard

### Key Principles

1. **Source of Truth**: The questionnaire DEFINITION (in code) determines total questions
2. **Dual Storage**: Responses saved to both localStorage (backup) and Supabase (primary)
3. **Required vs Optional**: Only REQUIRED questions count toward completion percentage
4. **Real-time Sync**: Changes sync to database within 2 seconds (debounced)

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           QUESTIONNAIRE SYSTEM                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   QUESTIONNAIRE     │     │      CLIENT         │     │       ADMIN         │
│    DEFINITION       │     │   DISCOVERY PAGE    │     │     DASHBOARD       │
│  (Source of Truth)  │     │                     │     │                     │
├─────────────────────┤     ├─────────────────────┤     ├─────────────────────┤
│                     │     │                     │     │                     │
│ lib/questionnaire/  │────▶│ /discovery/[clientId]│     │ /admin/clients/     │
│ jackie-deleon.ts    │     │                     │     │ /admin/questionnaires│
│                     │     │ QuestionnaireContainer    │                     │
│ - 9 modules         │     │ useQuestionnaireSync│     │ Shows: 6/21 (29%)   │
│ - 28 questions      │     │                     │     │                     │
│ - 21 required       │     └──────────┬──────────┘     └──────────┬──────────┘
│ - 7 optional        │                │                           │
│                     │                │ POST                      │ GET
└─────────────────────┘                │                           │
                                       ▼                           ▼
                       ┌───────────────────────────────────────────────────────┐
                       │                    SUPABASE DATABASE                   │
                       ├───────────────────────────────────────────────────────┤
                       │                                                       │
                       │  questionnaire_responses                              │
                       │  ┌─────────────────────────────────────────────────┐  │
                       │  │ id: uuid                                        │  │
                       │  │ client_id: "jdeleon"                            │  │
                       │  │ questionnaire_id: "jackie-deleon-dec-2025"      │  │
                       │  │ answers: { "q1": "$55000", "q2": "$70000", ... } │  │
                       │  │ current_question_index: 5                       │  │
                       │  │ current_module_index: 1                         │  │
                       │  │ points: 45                                      │  │
                       │  │ completed: false                                │  │
                       │  │ updated_at: "2025-12-22T..."                    │  │
                       │  └─────────────────────────────────────────────────┘  │
                       │                                                       │
                       │  response_history (audit trail)                       │
                       │  ┌─────────────────────────────────────────────────┐  │
                       │  │ id: uuid                                        │  │
                       │  │ response_id: (references questionnaire_responses)│  │
                       │  │ snapshot: { ... previous state ... }            │  │
                       │  │ created_at: timestamp                           │  │
                       │  └─────────────────────────────────────────────────┘  │
                       │                                                       │
                       └───────────────────────────────────────────────────────┘
```

---

## 3. Data Flow

### 3.1 Client Answering Questions

```
Step 1: Client opens /discovery/jdeleon
        ↓
Step 2: QuestionnaireContainer loads questionnaire definition from memory
        ↓
Step 3: useQuestionnaireSync hook loads existing data from:
        - First: Supabase (GET /api/questionnaire/jdeleon)
        - Fallback: localStorage (if Supabase fails)
        ↓
Step 4: Client answers question
        ↓
Step 5: React state updates immediately (instant feedback)
        ↓
Step 6: After 2000ms debounce, sync triggers:
        - POST /api/questionnaire/jdeleon → Supabase upsert
        - Save to localStorage (encrypted backup)
        ↓
Step 7: Server saves to questionnaire_responses table
        Server also saves snapshot to response_history (audit trail)
```

### 3.2 Admin Viewing Progress

```
Step 1: Admin opens /admin/clients/jdeleon
        ↓
Step 2: Page calls GET /api/admin/clients/jdeleon
        ↓
Step 3: API fetches from questionnaire_responses table
        ↓
Step 4: API looks up questionnaire DEFINITION to get total questions
        (CRITICAL: This is how we know there are 21 required questions)
        ↓
Step 5: API calculates: answered / total_required * 100 = progress %
        ↓
Step 6: Returns: { answered: 6, total: 21, progress: 29 }
```

---

## 4. File Structure

```
/lib/questionnaire/
├── types.ts                    # TypeScript types for questionnaire system
├── jackie-deleon.ts           # Jackie DeLeon's questionnaire definition
└── utils.ts                   # Helper functions

/app/discovery/
└── [clientId]/
    └── page.tsx               # Client-facing questionnaire page

/app/api/questionnaire/
└── [clientId]/
    └── route.ts               # API: GET/POST client responses

/app/api/admin/questionnaires/
└── route.ts                   # API: GET all questionnaires (admin)

/app/api/admin/clients/
└── [clientId]/
    └── route.ts               # API: GET single client details

/hooks/
└── useQuestionnaireSync.ts    # React hook for syncing questionnaire state

/components/questionnaire/
├── QuestionnaireContainer.tsx # Main questionnaire UI
├── QuestionCard.tsx           # Individual question component
├── ModuleNav.tsx              # Module navigation
└── PointsPopup.tsx            # Gamification feedback
```

---

## 5. Database Schema

### questionnaire_responses

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `client_id` | TEXT | Client identifier (e.g., "jdeleon") |
| `questionnaire_id` | TEXT | Questionnaire identifier |
| `answers` | JSONB | All answers as key-value pairs |
| `current_question_index` | INT | Current position within module |
| `current_module_index` | INT | Current module being answered |
| `points` | INT | Gamification points earned |
| `streak` | INT | Consecutive answers count |
| `combo` | INT | Combo multiplier (0-3) |
| `shown_milestones` | INT[] | Milestones already shown to user |
| `completed` | BOOLEAN | Whether questionnaire is fully done |
| `created_at` | TIMESTAMP | When response was created |
| `updated_at` | TIMESTAMP | Last update time |

### response_history

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `response_id` | UUID | Foreign key to questionnaire_responses |
| `snapshot` | JSONB | Full state at time of save |
| `created_at` | TIMESTAMP | When snapshot was taken |

---

## 6. Questionnaire Definition (Source of Truth)

The questionnaire definition file is the **single source of truth** for:
- Total number of questions
- Which questions are required vs optional
- Question types, options, and validation
- Module structure and ordering

### Example: Jackie DeLeon Questionnaire

**File:** `lib/questionnaire/jackie-deleon.ts`

```typescript
export const jackieDeleonQuestionnaire: Questionnaire = {
  id: 'jackie-deleon-dec-2025',
  clientName: 'Jacqueline "Jackie" DeLeon',
  clientId: 'jdeleon',
  title: 'Career Transition Discovery Questionnaire',

  modules: [
    // MODULE 1: Guardrails (REQUIRED)
    {
      id: 'guardrails',
      title: 'Guardrails & Role Targeting',
      required: true,  // <-- All questions in this module count as required
      questions: [
        { id: 'q1-salary-floor', required: true, ... },
        { id: 'q2-salary-target', required: true, ... },
        { id: 'q3-remote-tolerance', required: true, ... },
        { id: 'q4-primary-lane', required: true, ... },
      ]
    },
    // ... modules 2-6 are also required ...

    // MODULE 7: STAR Stories (OPTIONAL)
    {
      id: 'achievements',
      title: 'STAR Achievement Stories',
      required: false,  // <-- These don't count toward completion %
      questions: [ ... ]
    },
    // ... modules 8-9 are also optional ...
  ]
};
```

### Question Count Breakdown

| Module | Title | Required | Questions |
|--------|-------|----------|-----------|
| 1 | Guardrails & Role Targeting | Yes | 4 |
| 2 | UR/PA Workflow | Yes | 4 |
| 3 | Volume, Metrics & Performance | Yes | 5 |
| 4 | Tools & Systems | Yes | 2 |
| 5 | Credentials & Eligibility | Yes | 2 |
| 6 | Chronology Integrity | Yes | 4 |
| 7 | STAR Achievement Stories | No | 7 |
| 8 | Leadership & Preferences | No | 4 |
| 9 | Proof Artifacts | No | 2 |
| **TOTAL** | | | **28** |
| **Required Only** | | | **21** |

---

## 7. Progress Calculation

### Formula

```
Progress % = (answered_questions / total_required_questions) * 100
```

### Code Implementation

**File:** `app/api/admin/questionnaires/route.ts` (and `app/api/admin/clients/[clientId]/route.ts`)

```typescript
// Questionnaire registry - maps client_id to definition
const QUESTIONNAIRES: Record<string, Questionnaire> = {
  'jdeleon': jackieDeleonQuestionnaire,
  'jackie-deleon-dec-2025': jackieDeleonQuestionnaire,
};

function getQuestionnaireStats(clientId: string) {
  const questionnaire = QUESTIONNAIRES[clientId];
  if (!questionnaire) return { totalRequired: 0, totalAll: 0 };

  let totalRequired = 0;
  let totalAll = 0;

  for (const module of questionnaire.modules) {
    for (const question of module.questions) {
      totalAll++;
      // Question is required if: explicitly required OR in a required module
      if (question.required || module.required) {
        totalRequired++;
      }
    }
  }

  return { totalRequired, totalAll };
}

// In computeQuestionnaireStats():
const { totalRequired } = getQuestionnaireStats(clientId);
const answeredCount = Object.keys(answers).filter(k => answers[k]).length;
const progressPercentage = Math.round((answeredCount / totalRequired) * 100);
```

### Example Calculation

```
Jackie DeLeon:
- Total required questions: 21
- Answered questions: 6
- Progress: 6 / 21 * 100 = 28.57% → rounded to 29%
```

---

## 8. Adding a New Client Questionnaire

### Step-by-Step Guide

#### Step 1: Create the Questionnaire Definition

Create a new file: `lib/questionnaire/new-client.ts`

```typescript
import { Questionnaire } from './types';

export const newClientQuestionnaire: Questionnaire = {
  id: 'new-client-jan-2026',
  clientName: 'New Client Name',
  clientId: 'newclient',  // This is the URL slug: /discovery/newclient
  title: 'Career Discovery Questionnaire',
  packageType: 'Standard Package',

  modules: [
    {
      id: 'basics',
      title: 'Basic Information',
      required: true,
      estimatedMinutes: 5,
      questions: [
        {
          id: 'q1',
          type: 'text',
          question: 'What is your current job title?',
          required: true,
        },
        // Add more questions...
      ]
    },
    // Add more modules...
  ]
};
```

#### Step 2: Register in API Routes

**File:** `app/api/admin/questionnaires/route.ts`

```typescript
import { newClientQuestionnaire } from '@/lib/questionnaire/new-client';

const QUESTIONNAIRES: Record<string, Questionnaire> = {
  'jdeleon': jackieDeleonQuestionnaire,
  'jackie-deleon-dec-2025': jackieDeleonQuestionnaire,
  'newclient': newClientQuestionnaire,           // ADD THIS
  'new-client-jan-2026': newClientQuestionnaire, // ADD THIS
};
```

**File:** `app/api/admin/clients/[clientId]/route.ts`

```typescript
import { newClientQuestionnaire } from '@/lib/questionnaire/new-client';

const QUESTIONNAIRES: Record<string, Questionnaire> = {
  'jdeleon': jackieDeleonQuestionnaire,
  'jackie-deleon-dec-2025': jackieDeleonQuestionnaire,
  'newclient': newClientQuestionnaire,           // ADD THIS
  'new-client-jan-2026': newClientQuestionnaire, // ADD THIS
};
```

#### Step 3: Update Discovery Page (if needed)

**File:** `app/discovery/[clientId]/page.tsx`

The discovery page should already be dynamic, but verify it loads the correct questionnaire:

```typescript
// The page uses clientId from URL params
// Make sure your new questionnaire is accessible
```

#### Step 4: Test

1. Open `/discovery/newclient` - should show questionnaire
2. Answer some questions - should save to Supabase
3. Open `/admin/clients/newclient` - should show correct progress

---

## 9. Client-Facing Flow

### URL Structure

```
/discovery/[clientId]

Examples:
- /discovery/jdeleon
- /discovery/newclient
```

### User Experience

1. **Welcome Screen**: Shows intro text, package type, estimated time
2. **Module Navigation**: Progress bar showing completed modules
3. **Question Cards**: One question at a time with:
   - Question text
   - "Why we're asking" expandable section
   - Input field (varies by question type)
   - Points earned indicator
4. **Gamification**:
   - Points for each answer (+5 base, +2 streak bonus, +3 combo bonus)
   - Milestone celebrations at 25%, 50%, 75%, 100%
   - Visual feedback for streaks
5. **Completion**: Thank you screen with summary

### Question Types

| Type | Description | Example |
|------|-------------|---------|
| `text` | Single line input | Job title |
| `textarea` | Multi-line input | STAR story |
| `number` | Numeric input | Years of experience |
| `currency` | Dollar amount | Salary floor |
| `radio` | Single select | Remote preference |
| `checkbox` | Multi select | Tools used |
| `date` | Date picker | Start date |
| `percentage-split` | Allocate percentages | Caseload breakdown |
| `timeline` | Date range | Employment history |

---

## 10. Admin Dashboard Flow

### Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/admin` | Overview stats |
| All Questionnaires | `/admin/questionnaires` | List all responses |
| All Clients | `/admin/clients` | List all clients |
| Client Detail | `/admin/clients/[clientId]` | Single client view |
| Activity Log | `/admin/activity` | Recent activity |

### Client Detail Page Shows

- **Summary Stats**: Total points, questionnaires, completion rate
- **Questionnaire Cards**: Each with progress bar, points, status
- **Activity Timeline**: Recent updates with timestamps
- **Quick Actions**: View details, download responses

---

## 11. API Reference

### Client APIs

#### GET /api/questionnaire/[clientId]

Retrieves existing questionnaire response for a client.

**Request:**
```
GET /api/questionnaire/jdeleon
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "client_id": "jdeleon",
    "questionnaire_id": "jackie-deleon-dec-2025",
    "answers": { "q1": "$55000", "q2": "$70000" },
    "current_question_index": 5,
    "current_module_index": 1,
    "points": 45,
    "completed": false
  }
}
```

#### POST /api/questionnaire/[clientId]

Creates or updates questionnaire response.

**Request:**
```json
{
  "questionnaireId": "jackie-deleon-dec-2025",
  "answers": { "q1": "$55000", "q2": "$70000", "q3": "remote-preferred" },
  "currentQuestionIndex": 2,
  "currentModuleIndex": 0,
  "points": 30,
  "streak": 3,
  "combo": 1,
  "shownMilestones": [0],
  "completed": false
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... updated response ... }
}
```

### Admin APIs

#### GET /api/admin/questionnaires

Lists all questionnaire responses with computed stats.

**Query Parameters:**
- `status`: "all" | "completed" | "in_progress"
- `search`: Search by client_id
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset

**Response:**
```json
{
  "questionnaires": [
    {
      "id": "uuid",
      "client_id": "jdeleon",
      "questionnaire_id": "jackie-deleon-dec-2025",
      "completed": false,
      "progress_percentage": 29,
      "total_questions": 21,
      "answered_questions": 6,
      "points": 45,
      "created_at": "2025-12-19T...",
      "updated_at": "2025-12-22T..."
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

#### GET /api/admin/clients/[clientId]

Gets detailed client information with all questionnaires.

**Response:**
```json
{
  "client": {
    "client_id": "jdeleon",
    "questionnaires": [
      {
        "id": "uuid",
        "questionnaire_id": "jackie-deleon-dec-2025",
        "completed": false,
        "progress_percentage": 29,
        "answered_questions": 6,
        "total_questions": 21,
        "points": 45
      }
    ],
    "activity_history": [
      {
        "event_type": "updated",
        "timestamp": "2025-12-22T...",
        "questionnaire_id": "jackie-deleon-dec-2025"
      }
    ],
    "summary": {
      "total_questionnaires": 1,
      "completed_questionnaires": 0,
      "total_points": 45,
      "first_activity": "2025-12-19T...",
      "last_activity": "2025-12-22T..."
    }
  }
}
```

---

## 12. Troubleshooting

### Issue: Progress shows 100% when incomplete

**Cause:** The API is not looking up the questionnaire definition.

**Solution:** Ensure the `QUESTIONNAIRES` registry includes the client's questionnaire:

```typescript
const QUESTIONNAIRES: Record<string, Questionnaire> = {
  'jdeleon': jackieDeleonQuestionnaire,
  // Add missing client here
};
```

### Issue: Client data not saving

**Cause:** Supabase connection issue or rate limiting.

**Checks:**
1. Verify `.env.local` has correct Supabase keys (must start with `eyJ...`)
2. Check browser console for API errors
3. Check server logs for rate limit messages

### Issue: Admin dashboard shows stale data

**Cause:** Browser caching or API caching.

**Solution:**
1. Hard refresh the page (Cmd+Shift+R)
2. Clear `.next` folder and restart dev server
3. Check that client is hitting the API (not cached response)

### Issue: New questionnaire not showing in admin

**Cause:** Not registered in both API route files.

**Solution:** Add to BOTH:
- `app/api/admin/questionnaires/route.ts`
- `app/api/admin/clients/[clientId]/route.ts`

### Issue: .next cache errors (routes-manifest.json not found)

**Cause:** Corrupted Next.js build cache.

**Solution:**
```bash
rm -rf .next
npm run dev
```

---

## 13. Glossary

| Term | Definition |
|------|------------|
| **Client** | A person filling out a questionnaire (e.g., Jackie DeLeon) |
| **client_id** | URL-safe identifier (e.g., "jdeleon") |
| **Module** | A group of related questions (e.g., "Guardrails") |
| **Required Module** | All questions in this module count toward completion |
| **Optional Module** | Questions don't count toward completion % |
| **Progress %** | answered_required / total_required * 100 |
| **Points** | Gamification score (5 base + streak + combo bonuses) |
| **Streak** | Consecutive questions answered without leaving |
| **Combo** | Multiplier (0-3) that increases with streak |
| **Milestone** | Achievement unlocked at 25%, 50%, 75%, 100% |
| **Questionnaire Definition** | The code file that defines all questions (source of truth) |
| **questionnaire_responses** | Database table storing client answers |
| **response_history** | Audit trail of all changes |
| **Upsert** | Insert or update (creates if doesn't exist, updates if does) |
| **Debounce** | Wait before saving (2000ms) to batch rapid changes |

---

## Quick Reference Card

### For Developers

```
Add new questionnaire:
1. Create lib/questionnaire/[client].ts
2. Add to QUESTIONNAIRES in app/api/admin/questionnaires/route.ts
3. Add to QUESTIONNAIRES in app/api/admin/clients/[clientId]/route.ts
4. Test at /discovery/[clientId]
```

### For Support

```
Client can't access questionnaire:
→ Check URL: /discovery/[clientId]
→ Verify questionnaire exists in lib/questionnaire/

Admin sees wrong progress:
→ Restart dev server: rm -rf .next && npm run dev
→ Check QUESTIONNAIRES registry includes client

Data not saving:
→ Check browser console for errors
→ Verify Supabase keys in .env.local (must be JWT format: eyJ...)
```

---

**Document End**

*This SOP is maintained in the project repository at `/QUESTIONNAIRE-SYSTEM-SOP.md`*
