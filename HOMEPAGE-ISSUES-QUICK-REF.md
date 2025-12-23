# Homepage Issues: Quick Reference Card

**Date:** 2025-12-22

---

## User's Exact Complaints → Root Causes

### 1. "Why is the problem we solve there? I thought we removed this"

**Root Cause:**
```
You're looking at /app/page.tsx (ROOT) which HAS the section.
Sometimes you look at /prototype/app/page.tsx which DOESN'T.

Two different files = two different experiences.
```

**The section EXISTS in:**
- ✅ Root homepage (/app/page.tsx, lines 209-290)

**The section DOES NOT EXIST in:**
- ❌ Prototype homepage (/prototype/app/page.tsx)

**Your memory is correct:** Session 9 ADDED this section, you didn't remove it.

**Why it sounds terrible:** Copy is accusatory, violates MARKETING-COPY-AUDIT.md principles.

---

### 2. "Wrong review keeps appearing as featured"

**Root Cause:**
```
ROOT: Hardcoded Lisa + Carie (never changes)
PROTOTYPE: Dynamic rotation (changes daily)

You see Lisa in root and think "wrong review"
You see different reviews in prototype each day
```

**Today's state (Dec 22, 2025):**

| Homepage | Featured | Verified Proof Section |
|----------|----------|------------------------|
| **Root** | None (no featured logic) | Lisa W. + Carie L. (hardcoded) |
| **Prototype** | Douglas (hidden) | Carie L. + Lisa W. (dynamic) |

**Tomorrow (Dec 23, 2025):**

| Homepage | Featured | Verified Proof Section |
|----------|----------|------------------------|
| **Root** | None | Lisa W. + Carie L. (same, never changes) |
| **Prototype** | Carie (hidden) | Douglas + Lisa W. (rotated) |

**Why Lisa keeps appearing:**
- Root: She's hardcoded
- Prototype: She's NEVER featured (always in proof section)

**The "wrong" review is probably Lisa when you want Carie featured.**

---

### 3. "I thought verified proof was after the first review"

**Root Cause:**
```
ROOT: Section 3 = "Real Challenge", Section 4 = "Verified Proof"
PROTOTYPE: Section 3 = "Verified Proof" (no "Real Challenge" before it)

Different section orders in different files.
```

**Root Homepage Order:**
```
1. Hero
2. Trust Indicators
3. The Real Challenge  ← "first review" section?
4. Verified Proof      ← This comes AFTER section 3
```

**Prototype Homepage Order:**
```
1. Hero
2. Trust Indicators
3. Verified Proof      ← This IS section 3 (no section before it)
```

**Your memory:** Verified Proof should be section 3 (matches prototype, not root).

---

### 4. "Contradictory guidance - earlier I said the order IS correct"

**Root Cause:**
```
We searched entire codebase for "Micro 'Problem we solve' block"
Result: ZERO matches found.

Either:
1. This guidance is in chat logs (not in code)
2. You're thinking of Session 9 recommendations
3. Misremembering what was said

Session 9 said to ADD problem section, not that current version is correct.
```

**What SESSION-9-SUMMARY.md actually says:**

Line 236-239:
```
### Priority 4: Add Problem Statement Section
**Action:** Insert after Trust Indicators
**Content:** "If you're struggling with [pain points]..." section
**Benefit:** Meets users at awareness stage
```

**This says to ADD it, not that it's currently correct.**

**What MARKETING-COPY-AUDIT.md says:**

Lines 223-235:
```
### DON'T:
- Use absolute statements: "you cannot," "you systematically"
- Sound condescending: "value you cannot see in yourself"
- Diagnose the reader: "your Truth Gap," "your pattern"
```

**Current "Real Challenge" copy VIOLATES all these rules.**

---

## Quick Diagnosis Tool

**If you see this, you're looking at ROOT:**
- "The Real Challenge" section exists (4 pain point cards)
- Lisa W. + Carie L. reviews (always the same)
- 10 sections total
- File: `/app/page.tsx`

**If you see this, you're looking at PROTOTYPE:**
- No "Real Challenge" section
- Reviews change daily (Carie/Douglas rotation)
- 9 sections total
- File: `/prototype/app/page.tsx`

---

## The Files Compared

```
┌──────────────────────────┬──────────────────────────┐
│  /app/page.tsx (ROOT)    │  /prototype/app/page.tsx │
├──────────────────────────┼──────────────────────────┤
│ Line 1: No review import │ Line 11: Import reviews  │
│ Lines 209-290: Problem   │ NO PROBLEM SECTION       │
│ Lines 318-339: Hardcoded │ Line 245: Dynamic        │
│ reviews (Lisa + Carie)   │ reviews (rotation)       │
│ 10 sections              │ 9 sections               │
└──────────────────────────┴──────────────────────────┘
```

---

## What Session 9 Actually Implemented

**From SESSION-9-SUMMARY.md (lines 344-351):**

```
#### 1. Problem Statement Section Added
- Location: After Trust Indicators (new Section 3)
- Content: 4 pain points with navy/gold icon styling
- Pain Points:
  - "Your resume lists tasks, not impact"
  - "You've outgrown your story"
  - "Interview anxiety despite qualifications"
  - "Generic templates don't capture you"
```

**This was ADDED to root, NOT removed.**

**But the COPY is problematic** (accusatory, diagnostic).

**Your instinct is correct:** The way it's written sounds terrible.

---

## Copy Problems Breakdown

### Pain Point 1 (Current)
```
❌ "Your resume lists tasks, not impact"
```
**Problem:** Accusatory (blames "YOUR resume")

**Fix:**
```
✅ "Many professionals find it challenging to translate daily
   responsibilities into strategic business value"
```

### Pain Point 2 (Current)
```
❌ "You've outgrown your story"
```
**Problem:** Condescending (tells them they're behind)

**Fix:**
```
✅ "Years of experience can make exceptional patterns feel
   routine instead of remarkable"
```

### Pain Point 3 (Current)
```
❌ "Interview anxiety despite qualifications"
```
**Problem:** Diagnostic (labels them with "anxiety")

**Fix:**
```
✅ "Strong qualifications don't always translate to confident
   articulation in high-pressure settings"
```

### Pain Point 4 (Current)
```
❌ "Generic templates don't capture you"
```
**Problem:** Implies they're using generic templates

**Fix:**
```
✅ "One-size-fits-all approaches miss the nuances of your
   unique professional journey"
```

---

## Review Logic Explained

**Prototype (`/prototype/lib/reviews.ts`):**

```javascript
// Line 72-94: getFeaturedReview()
// Rotates between Carie and Douglas ONLY
// Lisa is excluded (line 78: "weaker method signal")

const strongSignals = eligible.filter(
  r => r.id === 'carie' || r.id === 'douglas'
);

// Line 86-92: Daily rotation
const dayOfYear = Math.floor(diff / oneDay);
const featuredIndex = dayOfYear % strongSignals.length;
return strongSignals[featuredIndex];

// Line 97-103: getVerifiedProofReviews()
// Returns the 2 reviews NOT featured
return eligible.filter(r => r.id !== featured.id).slice(0, 2);
```

**Result:**
- Featured rotates: Carie ↔ Douglas
- Lisa is NEVER featured (always in proof section)
- Today (356 % 2 = 0): Douglas featured, Carie + Lisa in proof
- Tomorrow (357 % 2 = 1): Carie featured, Douglas + Lisa in proof

**Root has NONE of this logic** (static JSX).

---

## Section Order: Documented vs Actual

### SESSION-9 Said (lines 387-398)

| # | Section | Background | Notes |
|---|---------|-----------|-------|
| 1 | Hero | bg-navy | ✓ |
| 2 | Trust | bg-white | ✓ |
| 3 | **Problem** | **bg-white** | ❌ Actual: bg-sand-50 |
| 4 | **Verified Proof** | **bg-sand-50** | ❌ Actual: bg-white |

**BACKGROUNDS ARE SWAPPED IN IMPLEMENTATION!**

### DESIGN-SYSTEM-SOP Says (lines 208-218)

| Section Type | Recommended | Why |
|--------------|-------------|-----|
| Problem Statement | `bg-sand-50` | Warm, empathetic tone |
| Social Proof/Reviews | `bg-sand-50` | Human, testimonial warmth |

**Both should be sand-50 per DESIGN-SOP, but that violates alternation rule.**

**Current implementation is more correct than Session 9 plan:**
- Problem: bg-sand-50 ✓ (empathetic tone)
- Proof: bg-white ✓ (alternates with sand-50)

---

## "Truth Gap" vs "Client Truth Principle"

**These are TWO DIFFERENT CONCEPTS:**

### Truth Gap
```
Type: PROBLEM
Definition: Distance between expertise and articulation
Used in: Verified Proof section, case study titles
Example: "What is the Truth Gap? The distance between your
         expertise and how you express it."
```

### Client Truth Principle
```
Type: SOLUTION PHILOSOPHY
Definition: Ownership-first resume methodology
Used in: Dedicated section (Section 7)
Example: "A resume you can't own performs like fiction when
         it matters most."
```

**Relationship:**
```
Truth Gap (problem) → Client Truth Principle (solution) → Ownership (outcome)
```

**They're complementary, not redundant.**

---

## Immediate Actions Needed

### Decision 1: Which homepage is canonical?
- [ ] Root (recommended - less disruptive)
- [ ] Prototype (has better review logic)

### Decision 2: Review display preference?
- [ ] Dynamic rotation (Carie ↔ Douglas daily)
- [ ] Hardcode Carie always featured
- [ ] Keep root's static Lisa + Carie

### Decision 3: Problem section fate?
- [ ] Rewrite copy (proximity framing)
- [ ] Remove section entirely
- [ ] Keep as-is (not recommended)

---

## Fix Timeline

**Phase 1-6 (Immediate):** 2-3 hours
- Consolidate to one homepage
- Port dynamic review logic
- Rewrite problem section copy
- Fix background colors
- Reorder sections

**Phase 7-10 (Prevention):** 1.5 hours
- Create changelog
- Add validation scripts
- Update documentation
- QA verification

**Total:** 3.5 hours to fix permanently

---

## Supporting Documents

1. **HOMEPAGE-FIX-EXECUTIVE-SUMMARY.md** - Start here (3-min read)
2. **HOMEPAGE-CONFUSION-ROOT-CAUSE-ANALYSIS.md** - Full investigation
3. **HOMEPAGE-DIVERGENCE-VISUAL.md** - Visual diagrams
4. **This document** - Quick reference for your specific complaints

---

**Bottom line:** You're right. It IS fucked up. TWO DIFFERENT HOMEPAGES exist. Fix = consolidate to one, rewrite copy, add validation.

---

**Created:** 2025-12-22
**Purpose:** Quick answers to user's exact questions
