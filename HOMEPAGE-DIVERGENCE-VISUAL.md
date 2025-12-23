# Homepage Divergence: Visual Comparison

**Critical Finding:** Two completely different homepages exist in the codebase.

---

## Side-by-Side Comparison

```
┌─────────────────────────────────────┬─────────────────────────────────────┐
│   ROOT HOMEPAGE (/app/page.tsx)    │ PROTOTYPE (/prototype/app/page.tsx) │
├─────────────────────────────────────┼─────────────────────────────────────┤
│ 1. Hero (navy)                      │ 1. Hero (navy)                      │
│ 2. Trust Indicators (white)         │ 2. Trust Indicators (white)         │
│ 3. THE REAL CHALLENGE (sand-50) ❌  │ 3. Verified Proof (sand-50) ✓       │
│ 4. Verified Proof (white) ⚠️        │ 4. What We Do (navy)                │
│ 5. What We Do (navy)                │ 5. Transparent Pricing (sand-50)    │
│ 6. Transparent Pricing (sand-50)    │ 6. Client Truth Principle (navy)    │
│ 7. Client Truth Principle (navy)    │ 7. Why Southwest Resume (sand-50)   │
│ 8. Why Southwest Resume (sand-50)   │ 8. Our Process (white)              │
│ 9. Our Process (white)              │ 9. Final CTA (navy)                 │
│ 10. Final CTA (navy)                │                                     │
├─────────────────────────────────────┼─────────────────────────────────────┤
│ REVIEWS: HARDCODED                  │ REVIEWS: DYNAMIC                    │
│ • Always shows: Lisa + Carie        │ • Rotates: Carie ↔ Douglas          │
│ • Never changes                     │ • Changes daily                     │
│ • Code: Static JSX (lines 318-339)  │ • Code: getVerifiedProofReviews()   │
├─────────────────────────────────────┼─────────────────────────────────────┤
│ PROBLEM SECTION: EXISTS             │ PROBLEM SECTION: DOES NOT EXIST     │
│ • "The Real Challenge" (4 cards)    │ • No problem section at all         │
│ • Accusatory copy ❌                 │ • N/A                               │
│ • Added in Session 9                │ • Never added to prototype          │
└─────────────────────────────────────┴─────────────────────────────────────┘
```

---

## The Confusion Explained

### Scenario A: User Views Root Homepage
```
User sees:
- "The Real Challenge" section (thinks: "why is this here?")
- Lisa W. review (thinks: "this is the wrong review")
- Section order: Problem → Proof → Services → Pricing
```

### Scenario B: User Views Prototype Homepage
```
User sees:
- NO "The Real Challenge" section (thinks: "good, we removed it")
- Carie L. review today, Douglas tomorrow (thinks: "reviews keep changing")
- Section order: Proof → Services → Pricing
```

### Result: User Thinks We're Inconsistent
```
User's mental model:
- "We removed the problem section" (true in prototype, false in root)
- "The wrong review keeps appearing" (Lisa hardcoded in root, Lisa rotates in prototype)
- "The order keeps changing" (actually TWO DIFFERENT FILES)
```

---

## Review Rotation Visualization

### Root Homepage (STATIC)
```
┌──────────────────────────────────┐
│  ALWAYS SHOWS:                   │
│  • Lisa W.                       │
│  • Carie L.                      │
│                                  │
│  NEVER CHANGES                   │
└──────────────────────────────────┘
```

### Prototype Homepage (DYNAMIC)
```
Day 1 (Today, Dec 22):
┌──────────────────────────────────┐
│  FEATURED: Douglas (hidden)      │
│  PROOF SECTION:                  │
│  • Carie L.                      │
│  • Lisa W.                       │
└──────────────────────────────────┘

Day 2 (Tomorrow, Dec 23):
┌──────────────────────────────────┐
│  FEATURED: Carie (hidden)        │
│  PROOF SECTION:                  │
│  • Douglas                       │
│  • Lisa W.                       │
└──────────────────────────────────┘

Day 3 (Dec 24):
┌──────────────────────────────────┐
│  FEATURED: Douglas (hidden)      │
│  PROOF SECTION:                  │
│  • Carie L.                      │
│  • Lisa W.                       │
└──────────────────────────────────┘
```

**Pattern:** Lisa ALWAYS appears in prototype (she's never featured, always in proof section)

---

## Copy Quality Comparison

### Root: "The Real Challenge" Section

```
❌ CURRENT (Accusatory):
┌────────────────────────────────────────────────┐
│ "Your resume lists tasks, not impact"         │
│                                                │
│ "You've outgrown your story"                   │
│                                                │
│ "Interview anxiety despite qualifications"     │
│                                                │
│ "Generic templates don't capture you"          │
└────────────────────────────────────────────────┘
Problems:
• Blames the user ("YOUR resume")
• Diagnostic tone ("anxiety," "generic")
• Violates MARKETING-COPY-AUDIT principles
```

```
✅ RECOMMENDED (Proximity Framing):
┌────────────────────────────────────────────────┐
│ "Many professionals struggle to translate      │
│  expertise into compelling business value"     │
│                                                │
│ "Years of experience can make patterns         │
│  feel routine instead of exceptional"          │
│                                                │
│ "Strong qualifications don't always            │
│  translate to confident articulation"          │
│                                                │
│ "Generic approaches miss the nuances of        │
│  your unique professional journey"             │
└────────────────────────────────────────────────┘
Benefits:
• Externalizes the problem (not "you," but "many professionals")
• Validates expertise while acknowledging challenge
• Partnership tone (we understand this)
```

---

## Background Color Violation

### Root Homepage: Verified Proof Section

```
CURRENT:
┌────────────────────────────────────────────────┐
│ Section 3: The Real Challenge                  │
│ Background: bg-sand-50 ✓                       │
└────────────────────────────────────────────────┘
          ↓
┌────────────────────────────────────────────────┐
│ Section 4: Verified Proof                      │
│ Background: bg-white ⚠️                        │
└────────────────────────────────────────────────┘

PROBLEM: Should be bg-sand-50 per DESIGN-SYSTEM-SOP
```

```
RECOMMENDED:
┌────────────────────────────────────────────────┐
│ Section 3: The Real Challenge                  │
│ Background: bg-sand-50 ✓                       │
└────────────────────────────────────────────────┘
          ↓
┌────────────────────────────────────────────────┐
│ Section 4: Verified Proof                      │
│ Background: bg-white ✓ (alternates correctly)  │
└────────────────────────────────────────────────┘
          ↓
┌────────────────────────────────────────────────┐
│ Section 5: What We Do                          │
│ Background: bg-navy ✓                          │
└────────────────────────────────────────────────┘

DESIGN-SYSTEM-SOP (line 213):
"Social Proof/Reviews: bg-sand-50 - Human, testimonial warmth"
```

**WAIT - CONTRADICTION FOUND:**

SESSION-9 says Verified Proof should be `bg-sand-50`, but root implementation is `bg-white`.

Which is correct?

**Answer:** Both are defensible, but SESSION-9 recommendation (bg-sand-50) is stronger because:
- Reviews are "warm, human" content (fits sand-50 semantics)
- Creates better visual rhythm (sand → white → navy vs sand → sand → navy)

---

## Session 9 Plan vs Reality

### SESSION-9-SUMMARY.md Says (lines 387-398)

```
PLANNED:
| # | Section              | Background | Description          |
|---|----------------------|------------|----------------------|
| 1 | Hero                 | bg-navy    | Primary CTA          |
| 2 | Trust Indicators     | bg-white   | Badges + Metrics     |
| 3 | Problem Statement    | bg-white   | NEW - 4 pain points  |
| 4 | Verified Proof       | bg-sand-50 | Reviews + Studies    |
```

### Root Homepage Actually Has

```
ACTUAL:
| # | Section              | Background  | Matches Plan? |
|---|----------------------|-------------|---------------|
| 1 | Hero                 | bg-navy     | ✓             |
| 2 | Trust Indicators     | bg-white    | ✓             |
| 3 | The Real Challenge   | bg-sand-50  | ❌ (plan: white) |
| 4 | Verified Proof       | bg-white    | ❌ (plan: sand-50) |
```

**BACKGROUNDS ARE SWAPPED!**

Session 9 plan said:
- Problem: white
- Proof: sand-50

Implementation did:
- Problem: sand-50
- Proof: white

**Which is more correct?**

DESIGN-SYSTEM-SOP semantic guidance (lines 208-218):
- Problem Statement: bg-sand-50 (warm, empathetic tone) ✓
- Social Proof: bg-sand-50 (human, testimonial warmth) ✓

**Both should probably be sand-50!** But that violates alternation rule.

**Resolution:**
- Problem: bg-sand-50 ✓ (empathetic, current is correct)
- Proof: bg-white ✓ (alternates, current is correct)
- Session 9 plan had colors backwards

---

## File Structure Comparison

```
/app/page.tsx (ROOT - PRODUCTION)
├── Lines: 845 total
├── Imports review functions: ❌ NO
├── Reviews: Hardcoded (Lisa + Carie)
├── Problem section: ✓ EXISTS (lines 209-290)
├── Section count: 10
└── Last modified: Unknown

/prototype/app/page.tsx (PROTOTYPE - TESTING)
├── Lines: 737 total
├── Imports review functions: ✓ YES (line 11)
├── Reviews: Dynamic via getVerifiedProofReviews()
├── Problem section: ❌ DOES NOT EXIST
├── Section count: 9
└── Last modified: Session 9 (Dec 21)
```

---

## The "Truth Gap" vs "Client Truth Principle" Question

### User Asked: "Are these the same thing?"

```
┌─────────────────────────────────────────────────────────────┐
│                      TRUTH GAP                              │
│                                                             │
│  Definition: The distance between your expertise and        │
│              how you express it                             │
│                                                             │
│  Type: PROBLEM (the challenge clients face)                 │
│                                                             │
│  Used in: Verified Proof section explanation (line 375)    │
│           Case study titles ("The Truth Gap, Closed")      │
│                                                             │
│  Copy: "What is the Truth Gap? The distance between your   │
│         expertise and how you express it. When you're      │
│         close to your work, patterns of excellence become  │
│         invisible—that's not a flaw, it's perspective."    │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    (CLIENT FACES)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              CLIENT TRUTH PRINCIPLE                          │
│                                                             │
│  Definition: A resume you can't own performs like fiction   │
│              when it matters most                           │
│                                                             │
│  Type: SOLUTION PHILOSOPHY (our methodology response)       │
│                                                             │
│  Used in: Section 7 (dedicated philosophy section)         │
│                                                             │
│  Copy: "This is the Client Truth Principle—the foundation  │
│         of everything we create. In interviews, only       │
│         genuine ownership translates to confident          │
│         delivery."                                         │
└─────────────────────────────────────────────────────────────┘
```

**ANSWER:** NO, they are complementary concepts, not the same.

**Relationship:**
```
Truth Gap (problem) → Client Truth Principle (solution) → Ownership (outcome)
```

---

## Bottom Line: Why User is Confused

```
┌───────────────────────────────────────────────────────────┐
│  USER MENTAL MODEL                                        │
│  (What they THINK is happening)                           │
├───────────────────────────────────────────────────────────┤
│  • One homepage exists                                    │
│  • We removed the problem section                         │
│  • Reviews keep changing unexpectedly                     │
│  • Section order keeps shifting around                    │
│  • "Truth Gap" and "Client Truth" are the same thing      │
└───────────────────────────────────────────────────────────┘
                            ↓
                    REALITY CHECK
                            ↓
┌───────────────────────────────────────────────────────────┐
│  ACTUAL REALITY                                           │
│  (What is ACTUALLY happening)                             │
├───────────────────────────────────────────────────────────┤
│  • TWO homepages exist (root + prototype)                 │
│  • Problem section EXISTS in root, MISSING in prototype   │
│  • Root: static reviews, Prototype: rotating reviews      │
│  • Different files = different section orders             │
│  • Truth Gap = problem, Client Truth = solution           │
└───────────────────────────────────────────────────────────┘
```

---

## Visualization: Daily Review Rotation (Prototype Only)

```
MONDAY (Day of Year % 2 = 0):
┌─────────────────────────────┐
│ FEATURED (Not Visible):     │
│ • Douglas                   │
│                             │
│ VERIFIED PROOF SECTION:     │
│ • Carie L.                  │
│ • Lisa W.                   │
└─────────────────────────────┘

TUESDAY (Day of Year % 2 = 1):
┌─────────────────────────────┐
│ FEATURED (Not Visible):     │
│ • Carie L.                  │
│                             │
│ VERIFIED PROOF SECTION:     │
│ • Douglas                   │
│ • Lisa W.                   │
└─────────────────────────────┘

WEDNESDAY (Day of Year % 2 = 0):
┌─────────────────────────────┐
│ FEATURED (Not Visible):     │
│ • Douglas                   │
│                             │
│ VERIFIED PROOF SECTION:     │
│ • Carie L.                  │
│ • Lisa W.                   │
└─────────────────────────────┘
```

**Pattern:** Lisa ALWAYS appears (never featured), Carie ↔ Douglas rotate daily.

**Root homepage:** No rotation, always Lisa + Carie.

---

## The Fix: Consolidation Strategy

### BEFORE (Current State)

```
/app/page.tsx                    /prototype/app/page.tsx
┌────────────────┐              ┌────────────────┐
│ 10 sections    │              │ 9 sections     │
│ Static reviews │              │ Dynamic reviews│
│ Has problem    │              │ No problem     │
│ section        │              │ section        │
└────────────────┘              └────────────────┘
       ↓                                ↓
   USER SEES                        USER SEES
   DIFFERENT                        DIFFERENT
   CONTENT                          CONTENT
       ↓                                ↓
┌──────────────────────────────────────────────┐
│         CONFUSION & FRUSTRATION              │
│  "Why does it keep changing?"                │
│  "I thought we removed that section?"        │
│  "Wrong review appearing again"              │
└──────────────────────────────────────────────┘
```

### AFTER (Proposed Fix)

```
/app/page.tsx (SINGLE SOURCE OF TRUTH)
┌─────────────────────────────────────┐
│ 10 sections                         │
│ Dynamic reviews (from lib/reviews)  │
│ Problem section (REWRITTEN copy)    │
│ Correct backgrounds                 │
│ Optimal section order               │
└─────────────────────────────────────┘
              ↓
         USER SEES
        CONSISTENT
         CONTENT
              ↓
┌─────────────────────────────────────┐
│      CLARITY & CONFIDENCE           │
│  "This is exactly what we planned"  │
│  "Reviews rotate as expected"       │
│  "Copy is professional & kind"      │
└─────────────────────────────────────┘

/prototype/app/page.tsx
┌─────────────────────────────────────┐
│         ARCHIVED OR DELETED         │
│  (No longer causes confusion)       │
└─────────────────────────────────────┘
```

---

## Next Steps

1. **User decision:** Which homepage is canonical? (Recommend: root)
2. **Apply fixes:** Implement 10-phase plan from root cause analysis
3. **Archive prototype:** Prevent future divergence
4. **Add validation:** Automated checks prevent regression
5. **Document:** CHANGELOG tracks all future changes

---

**Created:** 2025-12-22
**Purpose:** Visual aid for understanding homepage divergence
**See also:** HOMEPAGE-CONFUSION-ROOT-CAUSE-ANALYSIS.md (full investigation)
