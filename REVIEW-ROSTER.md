# Review Roster - Southwest Resume Services

**Single Source of Truth for Google Reviews Display Strategy**

Last Updated: 2025-12-22

---

## Overview

This document tracks all Google Business Profile reviews and their eligibility for public display based on FTC compliance, material connections, and strategic messaging.

**Total Reviews**: 6
**Eligible for Display**: 4
**Excluded (FTC/Material Connection)**: 2

---

## Full Review Roster

| Reviewer | Status | Best Excerpt | Strategic Use | Tags |
|----------|--------|--------------|---------------|------|
| **Jerome C.** | ✅ ELIGIBLE | "I had no shortage of accomplishments, but my resume simply wasn't telling the right story." | **HERO** - Featured quote rotation (primary) | `truth-gap`, `executive`, `method` |
| **Carie L.** | ✅ ELIGIBLE | "He knows the questions to ask and I felt that I was in great hands." | **HERO** - Featured quote rotation (secondary) | `method`, `trust`, `ip` |
| **Douglas H.** | ✅ ELIGIBLE | "I would recommend Southwest Resume Services 10/10 times to friends and colleagues looking to build their executive profile." | **Verified Proof** section | `executive`, `authority`, `quality` |
| **Lisa W.** | ✅ ELIGIBLE | "I was very impressed with the time and effort Ryan at Southwest Resume Services took to revise my current resume." | **Verified Proof** section | `process`, `quality` |
| **Jordyn G.** | ❌ EXCLUDED | "Ryan utilized AI to write a letter to my employer that gave me a raise!" | **Never display** - Material connection (girlfriend) + outcome claim | FTC risk |
| **Andrew B.** | ❌ EXCLUDED | "Changing careers halfway through my life was something I never thought I'd be doing..." | **Never display** - Material connection (intern) | FTC disclosure required |

---

## Usage Strategy

### Hero Section (Featured Quote)
**Rotation between Jerome and Carie ONLY**

- **Jerome C.** (36 words) - Strongest "Truth Gap" signal, executive-level authority
- **Carie L.** (14 words) - Cleanest method signal, scan-friendly brevity

**Current Implementation**: Hardcoded to **Carie** for scan-friendliness
**Alternative**: Daily rotation between Jerome and Carie based on `getFeaturedReview()` in `lib/reviews.ts`

### Verified Proof Section
**Always shows 2 reviews that are NOT featured in hero**

- **Douglas H.** - Executive authority, strong recommendation language
- **Lisa W.** - Process quality, attention to detail

**Logic**: Automatically excludes whichever review is featured in hero section

---

## Full Review Text (Verbatim from Google)

### Jerome C. ✅ ELIGIBLE
> "I had no shortage of accomplishments, but my resume simply wasn't telling the right story. Ryan's process helped me articulate my value in a way that actually reflects what I bring to the table. The difference was night and day."

**Why Eligible**: No material connection, authentic client experience
**Strategic Value**: Perfect articulation of the "Truth Gap" problem
**Word Count**: 36 words (medium length, executive-appropriate)

---

### Carie L. ✅ ELIGIBLE
> "He knows the questions to ask and I felt that I was in great hands."

**Why Eligible**: No material connection, authentic client experience
**Strategic Value**: Method-forward, IP signal ("knows the questions")
**Word Count**: 14 words (shortest, most scan-friendly)

---

### Douglas H. ✅ ELIGIBLE
> "Phenomenal experience. Ryan was beyond thorough and attentive. His commitment to his clients is unmatched. I would recommend Southwest Resume services 10/10 times to friends and colleagues looking to build their executive profile. I cannot say enough about Ryan and the services provided."

**Why Eligible**: No material connection, authentic client experience
**Strategic Value**: Executive-level endorsement, strong recommendation language
**Word Count**: 41 words (longest eligible review)
**Note**: Too long for hero section, ideal for Verified Proof

---

### Lisa W. ✅ ELIGIBLE
> "I was very impressed with the time and effort Ryan at Southwest Resume Services took to revise my current resume."

**Why Eligible**: No material connection, authentic client experience
**Strategic Value**: Process quality, attention to detail
**Word Count**: 19 words
**Note**: Weaker method signal than Jerome/Carie, best for supporting proof

---

### Jordyn G. ❌ EXCLUDED
> "I had an amazing experience! My resume looks flawless and Ryan utilized AI to write a letter to my employer that gave me a raise! Highly recommend."

**Why Excluded**:
1. Material connection (girlfriend) - FTC requires disclosure
2. Outcome claim ("gave me a raise") - Creates liability exposure

**FTC Risk Level**: HIGH
**Action**: Never display publicly without material connection disclosure

---

### Andrew B. ❌ EXCLUDED
> "Changing careers halfway through my life was something I never thought I'd be doing and Southwest Resume Services helped me find a clear pathway to my goal. The attention to detail they gave my case was out of this world and their process is so straightforward. Highly recommend!"

**Why Excluded**: Material connection (former intern)

**FTC Risk Level**: MEDIUM
**Action**: Never display publicly without material connection disclosure

---

## Implementation Notes

### Current Display Pattern (as of 2025-12-22)
1. **Homepage Hero** (TrustSection): Carie (hardcoded)
2. **Homepage Verified Proof**: Douglas + Lisa
3. **Total Reviews Displayed**: 3 of 4 eligible
4. **Rating Display**: 5.0 stars, 5 total reviews (includes excluded reviews in count)

### Code References
- **Review Data**: `/prototype/lib/reviews.ts` (and `/lib/reviews.ts` in root)
- **Hero Display**: `/prototype/components/sections/TrustSection.tsx`
- **Verified Proof**: `/prototype/components/sections/VerifiedProof.tsx`
- **Homepage**: `/prototype/app/page.tsx`

---

## FTC Compliance Notes

### Material Connection Definition
Per FTC 16 CFR Part 255: A material connection exists when there is a relationship between endorser and business that might affect the credibility of the endorsement.

**Examples in our context:**
- Family members (Jordyn)
- Current/former employees (Andrew)
- Compensated reviewers
- Friends with ongoing business relationships

### Disclosure Requirements
If displaying reviews with material connections, must include:
- Clear and conspicuous disclosure
- Placed where consumers can't miss it
- Specific about nature of relationship

**Our Policy**: Exclude reviews with material connections entirely rather than rely on disclosure

---

## Review Rotation Strategy

### Option A: Hardcoded Featured Quote (CURRENT)
**Pros**: Guaranteed scan-friendly length, no risk of long quote appearing
**Cons**: Less variety, doesn't leverage Jerome's strong Truth Gap signal

### Option B: Smart Rotation (ALTERNATIVE)
**Logic**:
```typescript
// Rotate daily between Jerome and Carie only
const strongSignals = ['jerome', 'carie'];
const dayOfYear = calculateDayOfYear();
const featuredIndex = dayOfYear % 2;
return strongSignals[featuredIndex];
```

**Pros**: Leverages both strongest reviews, daily variety
**Cons**: Jerome's 36 words may reduce scannability on some days

### Decision Log
- 2025-12-22: Switched to Option A (hardcoded Carie) for guaranteed scan-friendliness

---

## Future Reviews Management

### When New Reviews Arrive
1. Add to `lib/reviews.ts` with `eligible: false` initially
2. Evaluate for material connections
3. Evaluate for outcome claims or FTC risk
4. Tag appropriately (`method`, `executive`, `trust`, etc.)
5. Determine strategic placement (hero vs. proof vs. exclude)
6. Update this roster document

### Rating Count Updates
When review count changes, update in ONE place:
- `lib/reviews.ts` → `export const REVIEW_COUNT = X;`

This propagates to:
- Homepage hero section
- Structured data schema
- Any other rating displays

---

## Contact Information

**Google Business Profile**: Southwest Resume Services
**Location**: Phoenix Metro, Arizona
**Review Management**: Ryan Zimmerman (owner)

---

*This document serves as the strategic reference for all review-related decisions. When in doubt about which review to display where, refer to this roster.*
