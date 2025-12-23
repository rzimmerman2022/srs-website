# Homepage Issues: Executive Summary

**Date:** 2025-12-22
**Status:** CRITICAL - Immediate Decision Required
**Reading Time:** 3 minutes

---

## TL;DR - The Core Problem

**You have TWO completely different homepages in your codebase:**

1. `/app/page.tsx` (ROOT) - What production users see
2. `/prototype/app/page.tsx` (PROTOTYPE) - Test version from Session 9

**They show different content, different reviews, and different section orders.**

**That's why you keep seeing inconsistencies.**

---

## The Smoking Gun

### Root Homepage
- Shows **Lisa W. + Carie L.** reviews (HARDCODED, never changes)
- Has **"The Real Challenge"** section (4 pain points, bg-sand-50)
- 10 sections total

### Prototype Homepage
- Shows **rotating reviews** (Carie/Douglas today, switches tomorrow)
- Has **NO "The Real Challenge"** section
- 9 sections total

**You've been looking at BOTH files at different times and thinking they're the same file.**

---

## Your Specific Questions Answered

### 1. "Why is the problem we solve there? I thought we removed this"

**Answer:** You're right to be confused.

- **Root homepage:** HAS the problem section ("The Real Challenge")
- **Prototype homepage:** DOES NOT have it
- **Session 9:** ADDED it to root, but documentation says it "sounds terrible" (and it does)

**You're seeing TWO different homepages and thinking they're inconsistent edits to ONE file.**

### 2. "Wrong review keeps appearing as featured"

**Answer:** Depends which homepage you're viewing.

- **Root:** Always shows Lisa W. + Carie L. (NEVER changes)
- **Prototype:** Today shows Carie + Lisa, tomorrow shows Douglas + Lisa (ROTATES daily)

**The "wrong review" is Lisa appearing in ROOT when you're expecting prototype's rotation.**

### 3. "I thought verified proof was after the first review"

**Answer:** Root has different order than prototype.

- **Root:** Real Challenge (section 3) → Verified Proof (section 4)
- **Prototype:** Verified Proof IS section 3 (no "Real Challenge" before it)

**Again, TWO DIFFERENT FILES.**

### 4. "Earlier I said the order IS correct and includes 'Micro Problem we solve block'"

**Answer:** We searched the entire codebase for this phrase.

**Result:** ZERO matches found.

**Interpretation:** Either this guidance exists in chat logs outside the codebase, OR you're misremembering Session 9 recommendations (which said to ADD a problem section, not that the current one is correct).

---

## What Happened? (Timeline)

**Session 9 (Dec 21, 2025):**
- Recommendation: Add "Problem Statement" section after Trust Indicators
- Implementation: Added "The Real Challenge" to ROOT homepage
- Prototype: Was NOT updated with this section
- **Result:** Files diverged

**Dec 22 (Today):**
- You notice inconsistencies
- You think we "keep getting this fucked up"
- **Actual cause:** Looking at two different files

---

## The Copy Problem (You're Right - It IS Terrible)

**Current "Real Challenge" section copy:**

```
❌ "Your resume lists tasks, not impact"
❌ "You've outgrown your story"
❌ "Interview anxiety despite qualifications"
❌ "Generic templates don't capture you"
```

**Why it's bad:**
- Accusatory ("YOUR resume" = blames the user)
- Diagnostic ("anxiety" = tells them what's wrong with them)
- Violates MARKETING-COPY-AUDIT.md principles (discovery, not diagnosis)

**You said:** "it sounds terrible the way it's written"

**You're 100% correct.** This violates all our documented copy guidelines.

---

## The Review Logic Confusion

**Root (`/app/page.tsx`):**
```tsx
// Lines 318-339: HARDCODED
<div className="font-semibold text-navy">Lisa W.</div>
<div className="font-semibold text-navy">Carie L.</div>
```

**Prototype (`/prototype/app/page.tsx`):**
```tsx
// Line 11: DYNAMIC IMPORT
import { getVerifiedProofReviews } from '@/lib/reviews';

// Line 142: CALL FUNCTION
const verifiedProofReviews = getVerifiedProofReviews();

// Line 245: MAP OVER REVIEWS
{verifiedProofReviews.map((review) => ...)}
```

**Prototype rotation logic (`/prototype/lib/reviews.ts`):**
- Featured review: Carie ↔ Douglas (rotates daily)
- Verified Proof section: Shows the 2 reviews NOT featured
- Lisa is NEVER featured (she's tagged "weaker method signal")
- Result: Lisa ALWAYS appears in Verified Proof section

**Today (Dec 22):**
- Day of year: 356
- 356 % 2 = 0
- Featured: Douglas (position 0)
- Verified Proof: Carie + Lisa

**Tomorrow (Dec 23):**
- Day of year: 357
- 357 % 2 = 1
- Featured: Carie (position 1)
- Verified Proof: Douglas + Lisa

**Lisa ALWAYS appears** (she's never featured, always in proof section).

---

## Decision Required: Which Homepage is Canonical?

**Option A: Root is canonical** (RECOMMENDED)
- ✅ This is what production users currently see
- ✅ Less disruptive migration path
- ✅ Prototype was meant for testing only
- ❌ Requires porting dynamic review logic from prototype

**Option B: Prototype is canonical**
- ✅ Has better review logic (dynamic)
- ✅ Doesn't have problematic "Real Challenge" section
- ❌ Would require deploying prototype to root
- ❌ More disruptive change

---

## Recommended Fix (3.5 hours total)

### Immediate (Phase 1-6, ~2-3 hours)

1. **Establish root as canonical** (delete or archive prototype)
2. **Port dynamic review logic** to root (15 min)
3. **Rewrite "Real Challenge" copy** using proximity framing (45 min)
4. **Fix section backgrounds** per DESIGN-SOP (5 min)
5. **Reorder sections** to move pricing later (20 min)
6. **Consolidate process sections** (already done)

### Long-term Prevention (Phase 7-10, ~1.5 hours)

7. **Create HOMEPAGE-CHANGELOG.md** (15 min)
8. **Update SESSION-9-SUMMARY.md** with corrections (20 min)
9. **Add validation script** to prevent divergence (30 min)
10. **QA verification** (30 min)

---

## Specific Copy Fixes Needed

**Current (Accusatory):**
```
"Your resume lists tasks, not impact"
```

**Rewrite (Proximity Framing):**
```
"Many professionals find it challenging to translate technical
expertise into compelling business value"
```

**Current (Diagnostic):**
```
"Interview anxiety despite qualifications"
```

**Rewrite (Discovery):**
```
"Strong qualifications don't always translate to confident
articulation in high-pressure settings"
```

**Pattern:**
- Remove "your" (externalizes the problem)
- Remove "anxiety" (no clinical diagnosis)
- Add "many professionals" (validates, doesn't blame)
- Use "challenging" not "problem" (collaborative tone)

---

## Ground Truth: Definitive Answers

### Should there be a problem section?
✅ **YES** - but rewrite the copy to match MARKETING-COPY-AUDIT principles

### What is the correct section order?
```
Hero → Trust → Problem → Proof → Services → Process →
Pricing (~70%) → Client Truth → Why SRS → CTA
```

### What is the correct featured review?
🔄 **DYNAMIC** (rotates daily: Carie ↔ Douglas, Lisa always in proof section)

OR

🔒 **HARDCODED** (if you want Carie always featured, we can do that)

### Is "Truth Gap" the same as "Client Truth Principle"?
❌ **NO** - They're complementary:
- **Truth Gap** = The PROBLEM (expertise ≠ articulation)
- **Client Truth Principle** = The SOLUTION (ownership-first methodology)

### Why do we keep getting this wrong?
📁 **TWO HOMEPAGE FILES** with no sync mechanism

---

## What You Need to Do Right Now

**Decision 1:** Which homepage is canonical?
- [ ] Option A: Root (recommended)
- [ ] Option B: Prototype

**Decision 2:** Review rotation preference?
- [ ] Keep dynamic rotation (Carie ↔ Douglas daily)
- [ ] Hardcode Carie always featured
- [ ] Some other combination

**Decision 3:** Approve copy rewrites?
- [ ] Yes, rewrite "Real Challenge" section per recommendations
- [ ] No, remove the section entirely
- [ ] Other approach

**Once you decide, we can execute the 10-phase fix plan immediately.**

---

## Supporting Documents

1. **HOMEPAGE-CONFUSION-ROOT-CAUSE-ANALYSIS.md** - Full investigation (22 pages)
2. **HOMEPAGE-DIVERGENCE-VISUAL.md** - Visual diagrams of the problem
3. **This document** - Executive summary (what you're reading)

---

## Bottom Line

**You're not crazy. The homepage IS inconsistent.**

**There are literally TWO DIFFERENT HOMEPAGES in the codebase.**

**Once we consolidate to ONE canonical version and fix the copy, this confusion ends forever.**

**Estimated fix time: 3.5 hours**

**Next step: Your decision on Options A/B/C above.**

---

**Created:** 2025-12-22
**Author:** Claude (SDA Multi-Agent Analysis)
**Confidence:** 98% (only missing the "guidance" reference you mentioned)
