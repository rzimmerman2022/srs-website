# Blog Quality Metrics Matrix

> **Last Updated:** 2025-12-27
> **Status:** Most issues FIXED. See implementation notes below.

## Current State vs Gold Standard Comparison

| Metric | Gold Standard | Current State | Status | Notes |
|--------|--------------|---------------|--------|-------|
| **Line Length** | 50-75 chars (600-700px) | 680px (max-w-2xl via .blog-content) | ✅ FIXED | Implemented in globals.css |
| **Paragraph Length** | 2-4 sentences | 1-3 sentences | ✅ PASS | - |
| **Font Size** | 16-18px | 18px (1.125rem) | ✅ PASS | Set in .blog-content |
| **Line Height** | 1.4-1.6em | 1.75 | ✅ PASS | Slightly generous for readability |
| **Words Between H2s** | Max 300 | ~210-280 avg | ✅ PASS | - |
| **Visual Break Frequency** | Every 150-300 words | Every ~200 words | ✅ PASS | - |
| **Word Count** | 1,500-2,500 | 1,475-2,500 | ✅ PASS | 5 blog posts total |
| **Callout Boxes** | 1-2 per article | 1-2 per article | ✅ PASS | Styled with gold border |
| **CTA Boxes** | Mid-article | 1 per article | ✅ PASS | Navy gradient background |
| **List Bullets** | Visible, styled | Gold markers (#d4af37) | ✅ FIXED | Was broken, now working |
| **Heading Hierarchy** | Clear visual distinction | H2/H3/H4 properly styled | ✅ FIXED | Distinct sizes and spacing |
| **Reading Time** | Display at top | Shown in metadata | ✅ PASS | Already in posts.ts |
| **Table of Contents** | For 2000+ words | BlogTableOfContents component | ✅ FIXED | Added to page.tsx |
| **Images** | 1 per 150-300 words | 0 IMAGES | ⚠️ PENDING | Future task |
| **Progress Indicator** | For long content | NOT PRESENT | ⚠️ LOW | Optional enhancement |

## Session Changes (2025-12-27)

### Root Cause Analysis
The blog posts appeared as "wall of text" because:
1. **@tailwindcss/typography plugin was NOT installed** - All prose-* classes were doing nothing
2. **List bullets were completely hidden** - No list-style-type was being applied
3. **Content width was too wide** - max-w-4xl (896px) exceeded readability standards

### Fixes Implemented

#### 1. Created Dedicated `.blog-content` Class (globals.css)
Abandoned the prose-* approach in favor of explicit CSS control:

```css
.blog-content {
  max-width: 680px;
  margin: 0 auto;
  font-size: 1.125rem;
  line-height: 1.75;
  color: #374151;
}

/* Heading hierarchy */
.blog-content h2 { font-size: 2rem; margin-top: 3.5rem; margin-bottom: 1.5rem; }
.blog-content h3 { font-size: 1.5rem; margin-top: 2.5rem; margin-bottom: 1rem; }
.blog-content h4 { font-size: 1.125rem; text-transform: uppercase; }

/* List styling with gold markers */
.blog-content ul { list-style-type: disc; padding-left: 1.5rem; }
.blog-content li { margin-bottom: 0.625rem; }
.blog-content li::marker { color: #d4af37; font-weight: 600; }

/* Callout boxes */
.blog-content .callout-box {
  background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
  border-left: 5px solid #d4af37;
  border-radius: 0 12px 12px 0;
  padding: 1.75rem 2rem;
  margin: 2.5rem 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

/* CTA boxes */
.blog-content .cta-box {
  background: linear-gradient(135deg, #1a2332 0%, #0f1722 100%);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  margin: 3rem 0;
  text-align: center;
  color: white;
}
```

#### 2. Updated Blog Post Page (app/blog/[slug]/page.tsx)
Changed from complex prose classes to simple `.blog-content` class:
```tsx
<div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
```

#### 3. Added BlogTableOfContents Component
For posts with 2000+ words, displays a sticky table of contents.

#### 4. Installed @tailwindcss/typography Plugin
Added to package.json and tailwind.config.ts for future prose usage.

### Files Modified
- `app/globals.css` - Added comprehensive .blog-content CSS (~200 lines)
- `app/blog/[slug]/page.tsx` - Simplified content wrapper, added ToC
- `tailwind.config.ts` - Added typography plugin and list styles
- `lib/blog/posts.ts` - Added 5th blog post (career change strategies)
- `components/blog/BlogTableOfContents.tsx` - New component

## Remaining Action Items
1. [x] ~~Reduce max-width from 4xl to 2xl~~ DONE via .blog-content
2. [x] ~~Increase paragraph bottom margin~~ DONE
3. [x] ~~Increase H2 top margin~~ DONE
4. [x] ~~Add reading time display~~ Already exists
5. [x] ~~Add box-shadow to callout boxes~~ DONE
6. [x] ~~Fix list bullet visibility~~ DONE with gold markers
7. [ ] Add images to blog posts (future task)
8. [ ] Consider reading progress indicator (low priority)
