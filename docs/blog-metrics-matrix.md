# Blog Quality Metrics Matrix

## Current State vs Gold Standard Comparison

| Metric | Gold Standard | Current State | Gap | Priority |
|--------|--------------|---------------|-----|----------|
| **Line Length** | 50-75 chars (600-700px) | 896px (max-w-4xl) | TOO WIDE | CRITICAL |
| **Paragraph Length** | 2-4 sentences | 1-3 sentences | PASS | - |
| **Font Size** | 16-18px | 18px (prose-lg) | PASS | - |
| **Line Height** | 1.4-1.6em | 1.625 (relaxed) | PASS | - |
| **Words Between H2s** | Max 300 | ~210-280 avg | PASS | - |
| **Visual Break Frequency** | Every 150-300 words | Every ~200 words | PASS | - |
| **Word Count** | 1,500-2,500 | 1,475-2,090 | PASS | - |
| **Callout Boxes** | 1-2 per article | 1-2 per article | PASS | - |
| **CTA Boxes** | Mid-article | 1 per article | PASS | - |
| **Images** | 1 per 150-300 words | 0 IMAGES | CRITICAL |
| **Reading Time** | Display at top | NOT SHOWN | HIGH |
| **Table of Contents** | For 2000+ words | NOT PRESENT | MEDIUM |
| **Progress Indicator** | For long content | NOT PRESENT | LOW |
| **Paragraph Spacing** | Clear visual breaks | Needs improvement | HIGH |

## Critical Issues Identified

### 1. Content Width Too Wide (CRITICAL)
- Current: `max-w-4xl` = 896px
- Optimal: 600-700px = `max-w-2xl` (672px) or custom 650px
- Impact: Lines too long, reduces readability, causes eye strain

### 2. No Images (CRITICAL)
- Gold standard: 1 image every 150-300 words
- Current: 0 images in any blog post
- Impact: Wall of text appearance, lower engagement, less shareable

### 3. Missing Reading Time (HIGH)
- Users expect estimated read time at article start
- Helps users decide engagement level
- Easy to implement

### 4. Paragraph Spacing Still Dense (HIGH)
- Despite 1-3 sentence paragraphs, visual density is high
- Need larger margins between paragraphs
- Need larger margins around callout/CTA boxes

## Recommended Fixes

### Fix 1: Reduce Content Width
```css
/* Change from max-w-4xl (896px) to max-w-2xl (672px) */
max-w-2xl mx-auto
```

### Fix 2: Increase Paragraph Spacing
```css
.prose p {
  margin-bottom: 2rem !important; /* Was 1.5rem */
}

.prose h2 {
  margin-top: 3.5rem !important; /* Was 2.5rem */
  margin-bottom: 1.5rem !important;
}
```

### Fix 3: Add Reading Time Component
```tsx
const readingTime = Math.ceil(post.content.split(/\s+/).length / 265);
// Display: "X min read"
```

### Fix 4: Improve Callout Box Prominence
```css
.callout-box {
  margin: 3rem 0 !important; /* Was 2rem */
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
```

## Action Items
1. [ ] Reduce max-width from 4xl to 2xl
2. [ ] Increase paragraph bottom margin to 2rem
3. [ ] Increase H2 top margin to 3.5rem
4. [ ] Add reading time display
5. [ ] Add box-shadow to callout boxes
6. [ ] Add images to blog posts (future task)
