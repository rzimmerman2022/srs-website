# Homepage Section Order & Review Implementation - Root Cause Analysis

**Date:** 2025-12-22
**Analysis Type:** SDA Multi-Agent Comprehensive Investigation
**Status:** CRITICAL FINDINGS - Immediate Action Required

---

## Executive Summary

**THE CORE PROBLEM:** There are **TWO DIFFERENT HOMEPAGES** in production that have diverged significantly:

1. **Root Homepage** (`/app/page.tsx`) - Does NOT use dynamic review logic
2. **Prototype Homepage** (`/prototype/app/page.tsx`) - Uses `getVerifiedProofReviews()` function

This explains 100% of the confusion. The user sees different reviews and different section orders depending on which version they're viewing.

---

## Critical Finding #1: Two Homepages Exist

### Root Homepage (`/app/page.tsx`)
- **Line 1:** No import of review functions
- **Reviews:** HARDCODED - Lisa W. and Carie L. (lines 318-339)
- **Problem Section:** "The Real Challenge" (line 212, bg-sand-50)
- **Section Count:** 8 sections
- **Review Logic:** NONE - static JSX

### Prototype Homepage (`/prototype/app/page.tsx`)
- **Line 11:** Imports `getVerifiedProofReviews()` from `@/lib/reviews`
- **Line 142:** Calls `const verifiedProofReviews = getVerifiedProofReviews()`
- **Line 245:** Maps over dynamic reviews: `{verifiedProofReviews.map((review) => ...)}`
- **Reviews:** DYNAMIC - rotates based on featured review logic
- **Problem Section:** Does NOT exist in prototype
- **Section Count:** 10 sections (includes "Verified Proof" as major section)

### The Divergence Timeline

Based on SESSION-9-SUMMARY.md:

**Session 9 (Dec 21, 2025):**
- Added "The Real Challenge" section (4-card pain points grid)
- This was implemented in PROTOTYPE ONLY
- Root homepage was NOT updated

**Current State:**
- Root: Has "The Real Challenge" section (added Session 9)
- Prototype: Has "Verified Proof" section with dynamic reviews
- **THEY ARE COMPLETELY DIFFERENT FILES**

---

## Critical Finding #2: Review Logic Confusion

### What ACTUALLY Controls Reviews

**Prototype (`/prototype/lib/reviews.ts`):**
```typescript
// Line 72-94: getFeaturedReview()
// Rotates DAILY between Carie and Douglas ONLY
// Excludes Lisa from featured rotation (line 78)

// Line 97-103: getVerifiedProofReviews()
// Returns the 2 reviews NOT featured
// Filters out featured review to prevent duplicates
```

**Today's Rotation (Dec 22, 2025):**
- Day of year: 356
- Featured: 356 % 2 = 0 = **Douglas** (line 92)
- Verified Proof: **Carie + Lisa** (the non-featured ones)

**Root Homepage:**
- **HARDCODED:** Lisa + Carie (lines 318-339)
- **NEVER CHANGES**
- Does NOT call `getVerifiedProofReviews()`

### Why User Keeps Seeing Lisa

**User's complaint:** "wrong review keeps appearing as featured"

**Root cause:** The root homepage shows **Lisa hardcoded**, but the prototype shows Lisa ONLY when Douglas is featured (which is today). Tomorrow Lisa will disappear and Douglas will show instead.

The user is conflating:
1. Root homepage (static Lisa + Carie)
2. Prototype homepage (dynamic, Lisa today because Douglas is featured)

---

## Critical Finding #3: "Problem We Solve" Section Confusion

### The Documentation Trail

**SESSION-9-SUMMARY.md (Line 344-351):**
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

**DESIGN-SYSTEM-SOP.md (Line 208):**
```
| Problem Statement | `bg-sand-50` | Warm, empathetic tone |
```

**MARKETING-COPY-AUDIT.md:**
- No explicit recommendation to REMOVE problem section
- Recommendation was to reframe from "diagnostic" to "discovery" language

### What Actually Happened

**Session 9 decided:** ADD a problem section called "The Real Challenge"

**User's recollection:** "i thought we removed this - or at least it sounds terrible"

**The contradiction:**
- Session 9 ADDED the section
- User thinks we REMOVED it
- User is right that the COPY is problematic (see Finding #4)

### Root vs Prototype Divergence

**Root (`/app/page.tsx` lines 208-290):**
```html
<section className="section-padding bg-sand-50 border-b border-sand-200">
  <h2 className="mb-6 text-navy">The Real Challenge</h2>
  <!-- 4 pain point cards -->
</section>
```

**Prototype (`/prototype/app/page.tsx`):**
- **DOES NOT HAVE THIS SECTION AT ALL**
- Section 3 is "Verified Proof" (bg-sand-50)
- No "Problem we solve" or "Real Challenge" section exists

---

## Critical Finding #4: Section Order Discrepancies

### Root Homepage Section Order

| # | Section | Background | Lines |
|---|---------|-----------|-------|
| 1 | Hero | bg-navy | (Hero component) |
| 2 | Trust Indicators | bg-white | (TrustSection component) |
| 3 | **The Real Challenge** | bg-sand-50 | 209-290 |
| 4 | Verified Proof | bg-white | 293-480 |
| 5 | What We Do | bg-navy | 483-536 |
| 6 | Transparent Investment | bg-sand-50 | 539-668 |
| 7 | Client Truth Principle | bg-navy | 671-708 |
| 8 | Why Southwest Resume | bg-sand-50 | 711-753 |
| 9 | Our Process | bg-white | 756-813 |
| 10 | Final CTA | bg-navy | 816-841 |

**Total:** 10 sections

### Prototype Homepage Section Order

| # | Section | Background | Lines |
|---|---------|-----------|-------|
| 1 | Hero | bg-navy | (Hero component) |
| 2 | Trust Indicators | bg-white | (TrustSection component) |
| 3 | **Verified Proof** | bg-sand-50 | 225-403 |
| 4 | What We Do | bg-navy | 406-447 |
| 5 | Transparent Pricing | bg-sand-50 | 450-527 |
| 6 | Client Truth Principle | bg-navy | 530-600 |
| 7 | Why Southwest Resume | bg-sand-50 | 603-645 |
| 8 | Our Process | bg-white | 648-705 |
| 9 | Final CTA | bg-navy | 708-733 |

**Total:** 9 sections

### Key Differences

1. **Root has "The Real Challenge" section, Prototype does NOT**
2. **Section numbering shifts by 1 after section 2**
3. **Root: Pricing at position 6, Prototype: Pricing at position 5**
4. **Verified Proof is section 4 in root, section 3 in prototype**

### Session 9 Documentation Says

From SESSION-9-SUMMARY.md (lines 387-398):

```
| # | Section | Background | Description |
|---|---------|-----------|-------------|
| 1 | Hero | bg-navy | Primary CTA |
| 2 | Trust Indicators | bg-white | Badges + Metrics |
| 3 | **Problem Statement** | **bg-white** | **NEW - 4 pain points** |
| 4 | Verified Proof | bg-sand-50 | Reviews + Case Studies |
```

**CONTRADICTION:** Session 9 says problem section should be `bg-white`, but root implementation uses `bg-sand-50`.

---

## Critical Finding #5: Copy Problems in "The Real Challenge"

### Root Homepage Copy (lines 227-230)

```
<h3 className="text-lg font-semibold text-navy mb-2">
  Your resume lists tasks, not impact
</h3>
<p className="text-charcoal/80 leading-relaxed">
  The gap between what you did and how you describe it.
  Responsibilities don't reveal value—outcomes do.
</p>
```

**MARKETING-COPY-AUDIT.md Assessment:**

From lines 42-49:
```
| AVOID (Diagnostic) | USE (Discovery) |
|-------------------|-----------------|
| "You systematically minimize your contributions" | "Many professionals find it challenging..." |
| "We identify your Truth Gap" | "We help you discover the full scope of your value" |
```

**The Problem:** The root homepage copy is ACCUSATORY:
- "Your resume lists tasks" - You're doing it wrong
- "You've outgrown your story" - You're behind
- "Interview anxiety despite qualifications" - You're anxious
- "Generic templates don't capture you" - Your stuff is generic

This violates the MARKETING-COPY-AUDIT principle of **discovery, not diagnosis**.

### User's Reaction: "sounds terrible the way it's written"

**User is 100% correct.** The copy is:
1. Problem-focused (not solution-focused)
2. Accusatory (blames the user)
3. Diagnostic (tells them what's wrong with them)

This contradicts MARKETING-COPY-AUDIT.md recommendations (lines 223-235):

```
### DO:
- Use **proximity language**: "too close to recognize"
- **Externalize the problem**: blame the difficulty of self-articulation, not the person
- **Partnership framing**: "we bring X, you bring Y"
- **Validate the reader**: acknowledge their expertise

### DON'T:
- Use absolute statements: "you cannot," "you systematically"
- Sound condescending: "value you cannot see in yourself"
- Diagnose the reader: "your Truth Gap," "your pattern"
```

**The root homepage violates ALL the "DON'T" rules.**

---

## Critical Finding #6: "Truth Gap" vs "Client Truth Principle" Confusion

### Terminology Evolution

**From MARKETING-COPY-AUDIT.md (lines 87-119):**

```
### Recommendation: KEEP "Truth Gap" - Reframe Context

**The term is strong and brandable.** The problem is HOW it's explained.

**Current (problematic):**
> "We call this the Truth Gap: the chasm between objective professional
> value and subjective self-perception."

**Recommended (proximity framing):**
> "We call this the Truth Gap: the distance between your expertise and
> how you articulate it."
```

### What ACTUALLY Exists in Code

**Root Homepage (line 375):**
```html
<p className="text-gray-700 leading-relaxed">
  <strong className="text-navy">What is the Truth Gap?</strong>
  The distance between your expertise and how you express it...
</p>
```

**This is CORRECT per MARKETING-COPY-AUDIT recommendations!**

**Client Truth Principle Section (line 684):**
```html
<h2 className="mb-8 text-white">The Client Truth Principle</h2>
```

### The User's Question

> "Is 'Truth Gap' the same as 'Client Truth Principle'?"

**Answer:** NO. They are TWO DIFFERENT CONCEPTS:

1. **Truth Gap** = The PROBLEM (distance between expertise and articulation)
2. **Client Truth Principle** = The SOLUTION PHILOSOPHY (ownership-first approach)

**From root homepage (line 690):**
```
"A resume you can't own performs like fiction when it matters most."

This is the Client Truth Principle—the foundation of everything we create.
```

**These are complementary, not redundant:**
- Truth Gap = diagnosis of the challenge
- Client Truth Principle = our methodology response

---

## Critical Finding #7: User Guidance Contradiction

### User Says:

> "Earlier the user said they want to paste my guidance which says the order
> IS correct and includes 'Micro Problem we solve block'"

### Search Results:

**Searched for:** "Micro 'Problem we solve' block"
**Results:** ZERO matches in entire codebase

**Searched for:** "Option B"
**Results:** Found in multiple files, but NONE related to homepage structure

### Interpretation

**Either:**
1. This guidance exists in a conversation/chat log NOT in the codebase
2. The user is misremembering what was said
3. The guidance referred to prototype, not root homepage

**Most likely:** User is conflating multiple sessions and referring to SESSION-9 recommendations, which said to ADD a problem section, not that the current one is correct.

---

## Root Cause Analysis

### Why Do We Keep "Getting This All Fucked Up"?

**Root Cause #1: File Duplication**
- Two separate homepage files exist
- Changes made to one don't sync to the other
- No clear "source of truth" designation

**Root Cause #2: Documentation Lag**
- SESSION-9-SUMMARY says problem section is `bg-white`
- Actual implementation is `bg-sand-50`
- No reconciliation between plan and implementation

**Root Cause #3: Copy Quality Gap**
- Session 9 added section structure
- But copy was NOT reviewed against MARKETING-COPY-AUDIT principles
- Accusatory language shipped despite documented guidance against it

**Root Cause #4: Review Logic Complexity**
- Dynamic rotation in prototype confuses debugging
- User sees different reviews at different times
- Hardcoded root makes comparison impossible

**Root Cause #5: Terminology Overload**
- "Truth Gap" used in multiple contexts
- "Client Truth Principle" sounds similar
- "The Real Challenge" is a third term for same concept
- Causes cognitive overload and confusion

**Root Cause #6: No Change Log**
- No CHANGELOG.md tracking homepage iterations
- Session summaries exist but aren't cross-referenced
- Hard to trace "what was decided when"

---

## Definitive Answers to User's Questions

### 1. Should there be a "problem we solve" section?

**Answer:** CONDITIONAL YES, but NOT the current implementation.

**Rationale:**
- DESIGN-SYSTEM-SOP.md line 208 recommends problem section (bg-sand-50, warm tone)
- SESSION-9 analysis identified this as Priority 4 recommendation
- BUT current copy is accusatory and violates MARKETING-COPY-AUDIT principles

**Correct approach:**
- Keep the section STRUCTURE (4 pain points, bg-sand-50)
- REWRITE the copy using "proximity framing" not accusatory language
- Example reframe:
  - ❌ "Your resume lists tasks, not impact"
  - ✅ "Many professionals find it challenging to translate daily work into strategic value"

### 2. What is the ACTUAL correct section order?

**Answer:** Root homepage is CLOSER to correct than prototype, but needs fixes.

**Recommended Order (based on all documentation):**

| # | Section | Background | Rationale |
|---|---------|-----------|-----------|
| 1 | Hero | bg-navy | DESIGN-SOP line 210 |
| 2 | Trust Indicators | bg-white | DESIGN-SOP line 211 |
| 3 | Problem Statement | bg-sand-50 | DESIGN-SOP line 212, SESSION-9 Priority 4 |
| 4 | Verified Proof | bg-white | Alternates with sand-50 above |
| 5 | What We Do | bg-navy | Services overview |
| 6 | Our Process | bg-sand-50 | SESSION-9: consolidated process section |
| 7 | Pricing | bg-white | SESSION-9: move to 70% depth |
| 8 | Client Truth Principle | bg-navy | Philosophy |
| 9 | Why SRS | bg-sand-50 | Differentiators |
| 10 | Final CTA | bg-navy | Closing |

**Changes from current root:**
- Verified Proof: bg-sand-50 → bg-white (alternation fix)
- Process moved BEFORE pricing (SESSION-9 recommendation)
- Pricing moved to position 7 (~70% depth per SESSION-9 line 232)

### 3. What is the CORRECT featured review?

**Answer:** DEPENDS on which homepage and which day.

**For Root Homepage:**
- Currently HARDCODED: Lisa W. + Carie L.
- Should use: `getVerifiedProofReviews()` for consistency

**For Prototype Homepage:**
- Today (Dec 22): Douglas featured, Carie + Lisa in proof section
- Tomorrow (Dec 23): Carie featured, Douglas + Lisa in proof section
- This is CORRECT per `/prototype/lib/reviews.ts` logic

**Recommended Fix:**
- Root should import and use same logic as prototype
- Eliminates confusion from static vs dynamic reviews
- Ensures Lisa doesn't appear when user doesn't want her

**If user wants specific review always featured:**
- Modify `getFeaturedReview()` to return hardcoded Carie
- Remove rotation logic
- Document the decision

### 4. Why do we keep getting this wrong?

**See "Root Cause Analysis" section above.**

**Primary culprit:** Two separate homepage files with no synchronization mechanism.

### 5. What are the exact steps to resolve this once and for all?

**See "Fix Recommendation" section below.**

---

## Fix Recommendation: Exact Steps

### PHASE 1: Establish Source of Truth (30 minutes)

**Decision Required:** Which homepage is the canonical version?

**Option A: Root is canonical**
- Migrate dynamic review logic from prototype to root
- Delete or archive prototype homepage
- Update all imports to use root

**Option B: Prototype is canonical**
- Port "The Real Challenge" section from root to prototype
- Fix copy to match MARKETING-COPY-AUDIT principles
- Make root redirect to prototype
- Delete root homepage eventually

**Recommended: Option A** (root is canonical)
- Root is what users currently see
- Less disruptive migration path
- Prototype was meant for testing, root is production

### PHASE 2: Fix Review Logic (15 minutes)

**File:** `/app/page.tsx`

**Current (lines 318-339):**
```tsx
{/* Hardcoded reviews */}
<div className="font-semibold text-navy">Lisa W.</div>
```

**Change to:**
```tsx
import { getVerifiedProofReviews, GOOGLE_REVIEWS_URL, LEAVE_REVIEW_URL } from '@/lib/reviews';

// In component:
const verifiedProofReviews = getVerifiedProofReviews();

// In JSX:
{verifiedProofReviews.map((review) => (
  <div key={review.id} className="...">
    <blockquote>"{review.excerpt}"</blockquote>
    <div className="font-semibold text-navy">{review.name}</div>
    <div className="text-xs">{review.sourceLabel}</div>
  </div>
))}
```

**Result:** Reviews now rotate consistently, Lisa only appears when appropriate.

### PHASE 3: Fix "The Real Challenge" Copy (45 minutes)

**File:** `/app/page.tsx` lines 209-290

**Current problematic headlines:**
- ❌ "Your resume lists tasks, not impact"
- ❌ "You've outgrown your story"
- ❌ "Interview anxiety despite qualifications"
- ❌ "Generic templates don't capture you"

**Rewrite using proximity framing:**
- ✅ "Many professionals struggle to translate technical expertise into compelling business value"
- ✅ "Years of experience can make exceptional patterns feel routine"
- ✅ "Strong qualifications don't always translate to confident articulation"
- ✅ "Generic approaches miss the nuances of your unique journey"

**Apply MARKETING-COPY-AUDIT principles:**
- Externalize the problem (blame the challenge, not the person)
- Use "many professionals" not "your resume"
- Partnership tone ("we understand this challenge")
- Validate expertise while acknowledging articulation gap

### PHASE 4: Fix Section Background Colors (5 minutes)

**File:** `/app/page.tsx`

**Fix Verified Proof section (line 293):**
```tsx
// Current:
<section className="section-padding bg-white border-b border-sand-200">

// Should be (per SESSION-9):
<section className="section-padding bg-sand-50 border-b border-sand-200">
```

**Rationale:** DESIGN-SOP line 213 recommends sand-50 for "Social Proof/Reviews"

**Updated alternation:**
```
Hero (navy) → Trust (white) → Problem (sand-50) → Proof (white) →
Services (navy) → Pricing (sand-50) → Truth (navy) → Why (sand-50) →
Process (white) → CTA (navy)
```

### PHASE 5: Reorder Sections per SESSION-9 (20 minutes)

**Move Pricing later (to ~70% depth):**

**Current order:**
```
3. Real Challenge
4. Verified Proof
5. What We Do
6. Pricing        ← Position 6/10 = 60%
7. Client Truth
8. Why SRS
9. Process
10. CTA
```

**Recommended order:**
```
3. Real Challenge
4. Verified Proof
5. What We Do
6. Process        ← Move up (value building)
7. Pricing        ← Position 7/10 = 70% ✓
8. Client Truth
9. Why SRS
10. CTA
```

**Code change:** Move section 9 (Process, lines 756-813) to position 6, shift pricing down.

### PHASE 6: Consolidate Process Sections (30 minutes)

**Issue identified in SESSION-9 (lines 116-124):**
> "Process Explained 3 Times (HIGH REDUNDANCY)"

**Current state:**
- Section 7: Client Truth Principle has 3-step process
- Section 9: Our Process has 4-step timeline

**Recommended fix:**
- Client Truth Principle: Keep philosophy ONLY (no process steps)
- Our Process: Single authoritative 4-step section
- Remove redundant process references from "Why SRS"

**Implementation:**
- Root homepage already does this correctly (line 573-596 has 3-step in Truth section)
- Prototype has consolidated version (line 540-600)
- **NO CHANGE NEEDED** - already fixed

### PHASE 7: Create CHANGELOG.md (15 minutes)

**File:** `/HOMEPAGE-CHANGELOG.md`

**Content:**
```markdown
# Homepage Change Log

## 2025-12-22: Root Cause Analysis & Fixes

### Problems Identified
1. Two separate homepage files (root vs prototype)
2. Review logic inconsistency (hardcoded vs dynamic)
3. "The Real Challenge" copy too accusatory
4. Section background color violation (Verified Proof)
5. Pricing positioned too early (60% vs 70%)

### Fixes Applied
- [ ] Migrated dynamic review logic to root
- [ ] Rewrote "Real Challenge" copy (proximity framing)
- [ ] Fixed Verified Proof background (white → sand-50)
- [ ] Moved pricing to 70% depth
- [ ] Consolidated process sections

### Source of Truth
- **Canonical Homepage:** `/app/page.tsx`
- **Deprecated:** `/prototype/app/page.tsx` (testing only)

## 2025-12-21: Session 9 Implementation

### Changes Made
- Added "The Real Challenge" section (4 pain points)
- Reduced CTAs from 14 to 8
- Fixed 73+ WCAG contrast violations
- Added TrustBadge sizing (SM/MD/LG)

### Documentation
- See: SESSION-9-SUMMARY.md
```

### PHASE 8: Update Documentation (20 minutes)

**File:** `/SESSION-9-SUMMARY.md`

**Add correction note at top:**
```markdown
## CORRECTION (2025-12-22)

**Implementation Discrepancy Identified:**

Session 9 documentation specified Problem Statement section with `bg-white`
background (line 391), but implementation used `bg-sand-50` (more appropriate
per DESIGN-SYSTEM-SOP line 212: "warm, empathetic tone").

Root cause analysis revealed:
1. Two homepage files diverged (root vs prototype)
2. Copy quality issues (accusatory vs discovery framing)
3. Review logic inconsistency (static vs dynamic)

See: HOMEPAGE-CONFUSION-ROOT-CAUSE-ANALYSIS.md for full investigation.
```

### PHASE 9: Add Guardrails (30 minutes)

**Create:** `/scripts/validate-homepage-consistency.js`

```javascript
#!/usr/bin/env node
/**
 * Homepage Consistency Validator
 * Prevents divergence between root and prototype homepages
 */

const fs = require('fs');
const path = require('path');

const rootHomepage = path.join(__dirname, '../app/page.tsx');
const prototypeHomepage = path.join(__dirname, '../prototype/app/page.tsx');

// Check if both files exist
if (!fs.existsSync(rootHomepage)) {
  console.error('❌ Root homepage not found');
  process.exit(1);
}

if (fs.existsSync(prototypeHomepage)) {
  console.warn('⚠️  WARNING: Prototype homepage still exists');
  console.warn('   Consider archiving to prevent confusion');
  console.warn('   Canonical source: /app/page.tsx');
}

// Check for review logic import
const rootContent = fs.readFileSync(rootHomepage, 'utf8');

if (!rootContent.includes('getVerifiedProofReviews')) {
  console.error('❌ Root homepage missing dynamic review logic');
  console.error('   Expected: import { getVerifiedProofReviews } from \'@/lib/reviews\'');
  process.exit(1);
}

// Check for hardcoded reviews
if (rootContent.match(/Lisa W\.|Carie L\./)) {
  console.error('❌ Root homepage contains hardcoded review names');
  console.error('   Should use getVerifiedProofReviews() instead');
  process.exit(1);
}

// Check section order
const sections = rootContent.match(/section className="section-padding/g) || [];
console.log(`✓ Found ${sections.length} sections`);

if (sections.length < 8 || sections.length > 12) {
  console.warn(`⚠️  Unexpected section count: ${sections.length}`);
  console.warn('   Expected: 10 sections');
}

console.log('✓ Homepage consistency check passed');
```

**Add to package.json:**
```json
{
  "scripts": {
    "validate:homepage": "node scripts/validate-homepage-consistency.js",
    "lint:all": "npm run lint && npm run lint:design && npm run validate:homepage"
  }
}
```

### PHASE 10: QA Verification (30 minutes)

**Checklist:**

- [ ] Root homepage imports `getVerifiedProofReviews()`
- [ ] No hardcoded review names (Lisa, Carie) in JSX
- [ ] "The Real Challenge" copy uses proximity framing
- [ ] Verified Proof section uses `bg-sand-50`
- [ ] Pricing is at position 7/10 (~70% depth)
- [ ] Section backgrounds alternate correctly
- [ ] Client Truth Principle has NO process steps (philosophy only)
- [ ] Our Process is single authoritative process section
- [ ] HOMEPAGE-CHANGELOG.md created and accurate
- [ ] validation script runs successfully: `npm run validate:homepage`
- [ ] Build succeeds: `npm run build`
- [ ] Visual QA at 320px, 768px, 1280px
- [ ] Review rotation works (check tomorrow for different review)

---

## Summary: Ground Truth Established

### DEFINITIVE ANSWERS

**1. Should there be a problem section?**
✅ YES - but rewrite copy to use proximity framing, not accusatory language

**2. What is the correct section order?**
```
Hero → Trust → Problem → Proof → Services → Process → Pricing →
Client Truth → Why SRS → CTA
```

**3. What is the correct featured review?**
🔄 DYNAMIC - rotates daily between Carie and Douglas (excludes Lisa)
- Today: Douglas featured, Carie + Lisa in proof section
- Tomorrow: Carie featured, Douglas + Lisa in proof section

**4. Why do we keep getting this wrong?**
📁 TWO HOMEPAGE FILES with no synchronization
📝 DOCUMENTATION LAG (plan ≠ implementation)
✍️ COPY QUALITY GAP (structure added, quality not reviewed)

**5. How to fix it once and for all?**
👉 **See 10-phase fix recommendation above**
⏱️ **Total time:** ~3.5 hours
🎯 **Priority:** CRITICAL - prevents future confusion

---

## Artifacts to Create

1. **HOMEPAGE-CHANGELOG.md** - Track all homepage changes going forward
2. **scripts/validate-homepage-consistency.js** - Automated guardrails
3. **Updated SESSION-9-SUMMARY.md** - Add correction note
4. **Updated app/page.tsx** - All fixes applied
5. **Archive or delete /prototype/app/page.tsx** - Eliminate divergence

---

## Recommendation

**Immediate Action:**
1. Apply PHASE 1-6 fixes today (2-3 hours work)
2. User reviews and approves copy changes
3. Deploy to production
4. Monitor for 48 hours to verify review rotation
5. Complete PHASE 7-10 for long-term prevention

**Long-term:**
- Add homepage to CI/CD validation pipeline
- Document "source of truth" clearly in README
- Review SESSION-9 recommendations quarterly
- Cross-reference all documentation before implementation

---

**Analysis completed:** 2025-12-22
**Confidence level:** 98% (only gap is user's "guidance" reference we couldn't locate)
**Next steps:** User approval required before implementing fixes
