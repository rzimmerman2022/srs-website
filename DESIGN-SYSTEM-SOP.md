# Design System Standard Operating Procedure (SOP)

## Enterprise-Grade Web Design Quality Standards

**Based on:** Fortune 500 Design Systems (Google Material, IBM Carbon, Salesforce Lightning, Microsoft Fluent, Apple HIG, Atlassian, Shopify Polaris)

**Purpose:** Ensure consistent, measurable quality across all web pages

---

## Table of Contents

1. [Design Tokens](#1-design-tokens)
2. [Spacing System](#2-spacing-system)
3. [Typography Scale](#3-typography-scale)
4. [Color System](#4-color-system)
5. [Grid System](#5-grid-system)
6. [Responsive Design Framework](#6-responsive-design-framework)
7. [Component Standards](#7-component-standards)
8. [Accessibility Requirements](#8-accessibility-requirements)
9. [Performance Metrics](#9-performance-metrics)
10. [Motion/Animation](#10-motionanimation)
11. [Quality Assurance Checklist](#11-quality-assurance-checklist)
12. [Testing Procedures](#12-testing-procedures)

---

## 1. Design Tokens

Design tokens are the single source of truth for design decisions. They ensure consistency across all pages and components.

### Token Hierarchy (3-Tier System)

```
Primitive Tokens → Semantic Tokens → Component Tokens
     ↓                   ↓                  ↓
  Raw values      Contextual meaning    Specific usage
  (colors, px)    (primary, danger)     (button-bg)
```

### Implementation

```css
:root {
  /* Primitive Tokens */
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;
  --spacing-4: 16px;
  --spacing-6: 24px;

  /* Semantic Tokens */
  --color-primary: var(--color-blue-500);
  --color-primary-hover: var(--color-blue-600);
  --spacing-section: var(--spacing-6);

  /* Component Tokens */
  --button-bg: var(--color-primary);
  --button-bg-hover: var(--color-primary-hover);
  --button-padding: var(--spacing-4);
}
```

---

## 2. Spacing System

### Base Unit: 8px

All spacing uses multiples of 8px (with 4px for fine adjustments).

| Token | Value | Tailwind | Use Case |
|-------|-------|----------|----------|
| `--space-1` | 4px | `p-1` | Fine adjustments, icon gaps |
| `--space-2` | 8px | `p-2` | Tight spacing, inline elements |
| `--space-3` | 12px | `p-3` | Small gaps |
| `--space-4` | 16px | `p-4` | Standard element spacing |
| `--space-5` | 20px | `p-5` | Medium spacing |
| `--space-6` | 24px | `p-6` | Card padding, grid gaps |
| `--space-8` | 32px | `p-8` | Large card padding |
| `--space-10` | 40px | `p-10` | Section headers |
| `--space-12` | 48px | `p-12` | Section spacing |
| `--space-14` | 56px | `p-14` | Large section spacing |
| `--space-16` | 64px | `p-16` | Section padding (mobile) |
| `--space-20` | 80px | `p-20` | Section padding (tablet) |
| `--space-24` | 96px | `p-24` | Section padding (desktop) |

### Section Spacing Standards

| Section Type | Mobile | Tablet | Desktop | Tailwind |
|--------------|--------|--------|---------|----------|
| Hero | 48-64px | 64-80px | 80-96px | `py-12 md:py-16 lg:py-20` |
| Primary Content | 48-64px | 56-64px | 64-80px | `py-12 md:py-14 lg:py-16` |
| Secondary Content | 40-48px | 48-56px | 56-64px | `py-10 md:py-12 lg:py-14` |
| Compact | 32-40px | 40-48px | 48-56px | `py-8 md:py-10 lg:py-12` |

### Content Spacing

| Element | Spacing | Tailwind |
|---------|---------|----------|
| Section intro to content | 48px | `mb-12` |
| Heading to description | 16-24px | `mb-4` to `mb-6` |
| Description to content | 32px | `mb-8` |
| Card grid gap | 24-32px | `gap-6` to `gap-8` |
| CTA wrapper | 48px | `mt-12` |

### Industry Standards

- **Between sections:** 64-96px (NOT 192px)
- **Content density:** 60-70% of viewport should be content
- **Mobile:** Reduce spacing by ~25% from desktop

---

## 3. Typography Scale

### Font Size Scale (Major Third Ratio: 1.25)

| Level | Size | Line Height | Weight | Tailwind |
|-------|------|-------------|--------|----------|
| Display | 48-72px | 1.1 | 700 | `text-5xl` to `text-7xl` |
| H1 | 36-48px | 1.2 | 700 | `text-4xl` to `text-5xl` |
| H2 | 30-36px | 1.25 | 600 | `text-3xl` to `text-4xl` |
| H3 | 24-30px | 1.3 | 600 | `text-2xl` to `text-3xl` |
| H4 | 20-24px | 1.35 | 600 | `text-xl` to `text-2xl` |
| Body Large | 18-20px | 1.5 | 400 | `text-lg` to `text-xl` |
| Body | 16px | 1.5-1.6 | 400 | `text-base` |
| Small | 14px | 1.5 | 400 | `text-sm` |
| Caption | 12px | 1.4 | 400 | `text-xs` |

### Typography Rules

- **Minimum body text:** 16px (accessibility requirement)
- **Line length:** 45-75 characters (optimal: 50-60)
- **Line height for body:** 1.5× font size minimum (WCAG 1.4.12)
- **Heading line height:** 1.1-1.35 (shorter content)
- **Letter spacing:** 0.12× font size minimum for accessibility
- **Word spacing:** 0.16× font size minimum for accessibility

### Contextual Typography Rules (CRITICAL)

**The 16px minimum applies to PRIMARY BODY CONTENT only.** Smaller sizes are VALID for specific UI contexts:

| Context | Allowed Size | Rationale | Pattern to Match |
|---------|--------------|-----------|------------------|
| **Primary body text** | 16px+ (`text-base`) | User must read this content | Paragraphs, descriptions |
| **Dense list items with icons** | 14px (`text-sm`) | Icons provide visual anchor | `<li className="flex items-center gap-2 text-sm">` |
| **Labels/tags** | 12-14px (`text-xs`/`text-sm`) | Short, scannable | `uppercase tracking-wider text-sm` |
| **Captions/metadata** | 12-14px (`text-xs`/`text-sm`) | Secondary information | Timestamps, counts, attributions |
| **Price tags** | 14px (`text-sm`) | Part of larger visual hierarchy | `$150` in pricing cards |
| **Badge sublabels** | 12px (`text-xs`) | Paired with larger primary text | TrustBadge sublabel |
| **Navigation items** | 14px (`text-sm`) | Short text, clear context | Header/footer links |
| **Form helper text** | 12-14px | Secondary to input | Error messages, hints |

**VIOLATIONS (always wrong):**

| Pattern | Why It's Wrong | Fix |
|---------|----------------|-----|
| `<p className="text-sm">Long paragraph...</p>` | Primary content too small | Use `text-base` |
| `text-sm` on 3+ sentences | Body text, not label | Use `text-base` |
| `text-xs` on any paragraph | Unreadable body content | Use `text-base` minimum |
| `text-sm` without visual anchor | No icon/context to aid scanning | Use `text-base` or add icon |

**VALID (not violations):**

| Pattern | Why It's Valid | Keep As-Is |
|---------|----------------|------------|
| `<li className="flex items-center gap-2 text-sm">` | Icon anchored list | ✓ |
| `<span className="text-sm font-semibold">$150</span>` | Price tag in hierarchy | ✓ |
| `<p className="text-xs text-gray-500">Last updated...</p>` | Metadata/caption | ✓ |
| `<span className="uppercase tracking-wider text-sm">Section Label</span>` | Section label | ✓ |
| `<span className="text-xs">{sublabel}</span>` paired with larger text | Badge sublabel | ✓ |

---

## 4. Color System

### Section Background Visual Rhythm (CRITICAL)

**Alternating Rhythm Rule:** Adjacent sections MUST NOT share the same background color. This creates clear visual boundaries and helps users understand content hierarchy.

#### Approved Background Palette

| Background | Tailwind Class | Use Case |
|------------|----------------|----------|
| **Navy** | `bg-navy` | Hero, CTA, philosophy/trust sections (high emphasis) |
| **White** | `bg-white` | Content sections, lists, forms (neutral) |
| **Sand-50** | `bg-sand-50` | Proof sections, pricing, secondary content (warm neutral) |

#### Visual Rhythm Pattern

For long-form landing pages, follow this alternating pattern:

```
Navy → White → Sand-50 → Navy → Sand-50 → White → Navy
  ↑      ↑        ↑        ↑       ↑        ↑       ↑
Hero  Content  Content   CTA   Content  Content  Final CTA
```

**Rule of Thumb:**
- **Navy sections:** Maximum 3-4 per page (hero, philosophy, CTA, final CTA)
- **White/Sand alternation:** Light backgrounds should alternate with each other
- **Never:** Two `bg-white` sections back-to-back
- **Never:** Two `bg-sand-50` sections back-to-back
- **Allowed:** `bg-navy` can follow any light background

#### Semantic Section Backgrounds

| Section Type | Recommended Background | Why |
|--------------|------------------------|-----|
| Hero | `bg-navy` | Maximum visual impact, establishes brand |
| Trust/Metrics | `bg-white` | Clean, credibility feel |
| Problem Statement | `bg-sand-50` | Warm, empathetic tone |
| Social Proof/Reviews | `bg-sand-50` | Human, testimonial warmth |
| Services/Features | `bg-navy` | Premium, bold presentation |
| Pricing | `bg-sand-50` | Approachable, not intimidating |
| Philosophy/Values | `bg-navy` | Authority, brand depth |
| Process/How It Works | `bg-white` | Clear, step-by-step clarity |
| Final CTA | `bg-navy` | Strong closing, action-oriented |

#### Z-Pattern and F-Pattern Considerations

Per [Interaction Design Foundation research](https://www.interaction-design.org/literature/article/repetition-pattern-and-rhythm):
- **Alternating rhythm** breaks monotony while maintaining cohesion
- Visual rhythm organizes content and intuitively guides navigation
- Strategic spacing between sections enhances usability

Per [UX best practices](https://99designs.com/blog/tips/visual-hierarchy-landing-page-designs/):
- Z-pattern works for pages with less text and more visuals (landing pages)
- Background color changes create natural "breakpoints" that reset the eye
- Each section should feel like a distinct "card" in the page flow

---

### Contrast Requirements (WCAG 2.1)

| Content Type | Level AA | Level AAA |
|--------------|----------|-----------|
| Normal text (<18px) | 4.5:1 | 7:1 |
| Large text (≥18px or ≥14px bold) | 3:1 | 4.5:1 |
| UI components & graphics | 3:1 | 3:1 |
| Focus indicators | 3:1 | 3:1 |

### Color Token Structure

```css
:root {
  /* Brand Colors */
  --color-navy: #1a2332;
  --color-gold: #d4af37;

  /* Neutral Scale */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;  /* Use sparingly - contrast issues */
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;  /* Minimum for text on white */
  --color-gray-700: #374151;  /* Preferred for body text */
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Semantic Colors */
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-700);  /* NOT gray-600 */
  --color-text-muted: var(--color-gray-600);
  --color-text-on-dark: #ffffff;
  --color-text-on-dark-muted: var(--color-gray-200);  /* NOT gray-400 */
}
```

### Color Rules

1. **Never use `text-gray-400`** on dark backgrounds (fails contrast)
2. **Never use `text-gray-600`** for important body text on white (use `gray-700`)
3. **Always test** with WebAIM Contrast Checker
4. **Provide alternatives** for color-blind users (don't rely on color alone)

---

## 5. Grid System

### Column Structure

| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| Mobile (0-639px) | 4 | 16px | 16px |
| Tablet (640-1023px) | 8 | 24px | 24px |
| Desktop (1024px+) | 12 | 24-32px | 32-64px |

### Container Max Widths

| Size | Max Width | Use Case |
|------|-----------|----------|
| `max-w-4xl` | 896px | Narrow content (blog, FAQ) |
| `max-w-5xl` | 1024px | Standard content |
| `max-w-6xl` | 1152px | Wide content |
| `max-w-7xl` | 1280px | Full-width sections |

### Grid Gap Standards

| Content Type | Gap | Tailwind |
|--------------|-----|----------|
| Dense cards (metrics) | 16px | `gap-4` |
| Standard cards | 24px | `gap-6` |
| Large cards | 32px | `gap-8` |
| Team/portfolio | 48px | `gap-12` |

---

## 6. Responsive Design Framework

### Mobile-First Approach (Required)

All components MUST use mobile-first responsive design. This means:
- Base styles target mobile screens (0-639px)
- Progressive enhancement adds complexity at larger breakpoints
- Never use `max-width` media queries in Tailwind (use `sm:`, `md:`, `lg:` instead)

### Breakpoint Strategy

| Breakpoint | Width | Tailwind | Primary Purpose |
|------------|-------|----------|-----------------|
| **Mobile** | 0-639px | (default) | Base styles, single column, vertical stacking |
| **Tablet (sm)** | 640px+ | `sm:` | Button groups horizontal, 2-column layouts |
| **Tablet (md)** | 768px+ | `md:` | 2-column grids, larger padding, typography scale |
| **Desktop (lg)** | 1024px+ | `lg:` | 3-4 column grids, sidebars, full navigation |
| **Wide (xl)** | 1280px+ | `xl:` | Reserved for ultra-wide optimizations |
| **2XL** | 1536px+ | `2xl:` | Rarely used; max container widths |

### Breakpoint Usage Rules

1. **Primary breakpoints:** Focus on `sm:`, `md:`, `lg:`
2. **Avoid xl/2xl** unless specifically optimizing for wide screens
3. **Consistency:** All similar components should use the same breakpoint for the same behavior

### Standard Responsive Patterns

#### Grid Layouts

```tsx
// 2-Column Layout (Standard)
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">

// 3-Column Layout (Feature cards, services)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// 4-Column Layout (Pricing, metrics)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// 12-Column Complex (Sidebar + Content)
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
  <aside className="hidden lg:block lg:col-span-4">...</aside>
  <main className="lg:col-span-8">...</main>
</div>
```

#### Flex Direction

```tsx
// Button groups (horizontal on tablet+)
<div className="flex flex-col sm:flex-row items-center justify-center gap-6">

// Navigation items (vertical mobile, horizontal desktop)
<div className="flex flex-col lg:flex-row items-center gap-4">

// Footer columns
<div className="flex flex-col md:flex-row justify-between gap-8">
```

#### Visibility Patterns

```tsx
// Mobile-only element
<div className="sm:hidden">Mobile menu</div>

// Tablet+ element
<div className="hidden sm:block">Desktop nav</div>

// Desktop-only sidebar
<nav className="hidden lg:block lg:sticky lg:top-28">Sidebar</nav>

// Mobile alternative for desktop sidebar
<div className="lg:hidden">Mobile module selector</div>
```

### Responsive Spacing Scale

| Purpose | Mobile | Tablet (sm/md) | Desktop (lg) | Tailwind Pattern |
|---------|--------|----------------|--------------|------------------|
| **Container padding** | 16px | 24px | 32px | `px-4 sm:px-6 lg:px-8` |
| **Section padding** | 48-64px | 64-80px | 80-96px | `py-12 md:py-16 lg:py-20` |
| **Card padding** | 16px | 24px | 32px | `p-4 sm:p-6 md:p-8` |
| **Grid gaps (standard)** | 16px | 24px | 32px | `gap-4 sm:gap-6 lg:gap-8` |
| **Grid gaps (dense)** | 12px | 16px | 24px | `gap-3 sm:gap-4 lg:gap-6` |
| **Element spacing** | 8px | 12px | 16px | `space-y-2 sm:space-y-3 lg:space-y-4` |

### Responsive Typography Scale

| Element | Mobile | Tablet (md) | Desktop (lg) | Tailwind Pattern |
|---------|--------|-------------|--------------|------------------|
| **H1 (Hero)** | 36px | 48px | 60px | `text-4xl md:text-5xl lg:text-6xl` |
| **H2 (Section)** | 24px | 30px | 36px | `text-2xl md:text-3xl lg:text-4xl` |
| **H3 (Card title)** | 18px | 20px | 24px | `text-lg md:text-xl lg:text-2xl` |
| **H4 (Subtitle)** | 16px | 18px | 20px | `text-base md:text-lg lg:text-xl` |
| **Body** | 16px | 16px | 16px | `text-base` (no scaling needed) |
| **Small text** | 12px | 14px | 14px | `text-xs sm:text-sm` |

### Touch Target Requirements

All interactive elements MUST meet these minimum sizes:

```tsx
// Button (all sizes must be 44px+)
<button className="min-h-[44px] min-w-[44px] px-6 py-3">

// Icon button
<button className="w-[44px] h-[44px] flex items-center justify-center">

// Navigation link
<a className="min-h-[44px] flex items-center px-2">

// Form input
<input className="min-h-[44px] px-4 py-3" />
```

### Component-Level Responsive Guidelines

#### Navigation

```tsx
// Mobile: Hamburger menu, vertical list
// Desktop: Horizontal nav bar

// Mobile menu button (lg:hidden)
<button className="lg:hidden min-h-[44px] min-w-[44px]" aria-label="Toggle menu">

// Desktop nav (hidden lg:flex)
<nav className="hidden lg:flex lg:items-center lg:gap-8">

// Mobile menu dropdown
<div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
```

#### Sidebars

```tsx
// Desktop: Sticky sidebar
// Mobile: Collapsible or horizontal scroll

<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
  {/* Sidebar: hidden on mobile, sticky on desktop */}
  <aside className="hidden lg:block">
    <div className="sticky top-28">
      <ModuleNav />
    </div>
  </aside>

  {/* Mobile alternative: horizontal module selector */}
  <div className="lg:hidden mb-6">
    <MobileModuleNav />
  </div>

  {/* Main content */}
  <main className="lg:col-span-3">...</main>
</div>
```

#### Cards

```tsx
// Responsive card with scaling padding
<div className="card p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4">
    Card Title
  </h3>
  <p className="text-sm sm:text-base text-gray-700">
    Card description with responsive text sizing.
  </p>
</div>
```

#### Progress/Status Indicators

```tsx
// Desktop: Full status with text
<div className="hidden sm:flex items-center gap-2 text-sm text-green-600">
  <div className="w-2 h-2 bg-green-500 rounded-full" />
  Synced to cloud
</div>

// Mobile: Icon only (saves space)
<div className="sm:hidden">
  <div className="w-2 h-2 bg-green-500 rounded-full" title="Synced" />
</div>
```

### Utility Classes for Responsive Design

Add these to `globals.css` for consistent patterns:

```css
@layer components {
  /* Grid Patterns */
  .grid-responsive-2 {
    @apply grid grid-cols-1 md:grid-cols-2 gap-8;
  }

  .grid-responsive-3 {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8;
  }

  .grid-responsive-4 {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
  }

  /* Responsive Card Padding */
  .card-padding {
    @apply p-4 sm:p-6 md:p-8;
  }

  /* Button Group (flex row on tablet+) */
  .button-group {
    @apply flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6;
  }

  /* Container variants */
  .container-narrow {
    @apply max-w-4xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .container-wide {
    @apply max-w-6xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  /* Responsive section padding */
  .section-responsive {
    @apply py-12 md:py-16 lg:py-20;
  }

  /* Touch target compliance */
  .touch-target {
    @apply min-h-[44px] min-w-[44px];
  }
}
```

### Responsive Design Checklist

Before deploying any page/component:

#### Breakpoint Verification
- [ ] Tested at 320px (iPhone SE)
- [ ] Tested at 375px (iPhone 12/13)
- [ ] Tested at 768px (iPad)
- [ ] Tested at 1024px (Small laptop)
- [ ] Tested at 1280px (Desktop)
- [ ] Tested at 1440px (Large monitor)

#### Mobile-First Compliance
- [ ] Base styles work without any breakpoint prefixes
- [ ] Uses `sm:`, `md:`, `lg:` for progressive enhancement
- [ ] No `max-width` media query workarounds

#### Layout Verification
- [ ] Grid columns collapse properly (3→2→1)
- [ ] Flex direction changes at correct breakpoint
- [ ] No horizontal scroll at any breakpoint
- [ ] Sidebars have mobile alternatives

#### Touch Target Compliance
- [ ] All buttons are 44x44px minimum
- [ ] All links have adequate tap area
- [ ] Form inputs are 44px+ height
- [ ] Icon buttons have proper sizing

#### Content Visibility
- [ ] Hidden content has mobile alternative
- [ ] No content lost between breakpoints
- [ ] Status indicators work on all sizes

#### Typography
- [ ] Text is readable at all breakpoints
- [ ] Headings scale appropriately
- [ ] Line lengths stay 45-75 characters

---

## 7. Component Standards

### Button Specifications

| Property | Value |
|----------|-------|
| Min height | 44px (touch target) |
| Min width | 44px (touch target) |
| Padding | 12-16px vertical, 24-32px horizontal |
| Border radius | 8-12px |
| Font weight | 500-600 |
| Focus ring | 2px offset, brand color |

### Card Specifications

| Property | Value |
|----------|-------|
| Padding | 24-32px (`p-6` to `p-8`) |
| Border radius | 12-16px |
| Shadow | Subtle (`shadow-md` or `shadow-lg`) |
| Hover state | Slight lift or shadow increase |

### Form Input Specifications

| Property | Value |
|----------|-------|
| Min height | 44-48px |
| Padding | 12-16px |
| Border | 1px solid gray-300 |
| Focus border | 2px solid brand color |
| Border radius | 6-8px |
| Label spacing | 8px above input |
| Error text | 4px below input |

### Icon Specifications

| Size | Use Case | Touch Padding |
|------|----------|---------------|
| 16px | Inline with small text | N/A |
| 20px | Inline with body text | N/A |
| 24px | Standard UI icons | 12px (48px total) |
| 32px | Feature icons | 8px (48px total) |
| 48px | Hero/feature highlights | 0px |

---

## 8. Accessibility Requirements

### WCAG 2.1 Level AA Compliance (Required)

#### Keyboard Navigation
- [ ] All interactive elements focusable via Tab
- [ ] Logical tab order (left-to-right, top-to-bottom)
- [ ] Visible focus indicators on all elements
- [ ] Skip links for navigation
- [ ] Escape closes modals/dropdowns
- [ ] Arrow keys navigate within components

#### Screen Reader Support
- [ ] Semantic HTML structure (header, main, nav, footer)
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Alt text on all images
- [ ] ARIA labels on interactive elements
- [ ] Live regions for dynamic content (`aria-live`)
- [ ] Form labels associated with inputs

#### Visual Accessibility
- [ ] 4.5:1 contrast ratio for text
- [ ] 3:1 contrast ratio for large text and UI
- [ ] Don't convey info by color alone
- [ ] Minimum 16px body text
- [ ] Support `prefers-reduced-motion`
- [ ] Support `prefers-color-scheme`

#### Touch Accessibility
- [ ] Minimum 44×44px touch targets
- [ ] 8px minimum spacing between targets
- [ ] No hover-only interactions on mobile

---

## 9. Performance Metrics

### Core Web Vitals (2025 Thresholds)

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤2.5s | 2.5-4s | >4s |
| **INP** (Interaction to Next Paint) | ≤200ms | 200-500ms | >500ms |
| **CLS** (Cumulative Layout Shift) | ≤0.1 | 0.1-0.25 | >0.25 |

### Lighthouse Score Targets

| Category | Minimum | Target |
|----------|---------|--------|
| Performance | 80 | 90+ |
| Accessibility | 90 | 100 |
| Best Practices | 90 | 100 |
| SEO | 90 | 100 |

### Asset Size Budgets

| Asset Type | Budget |
|------------|--------|
| HTML | <50KB |
| CSS | <100KB |
| JavaScript (initial) | <200KB |
| Images (hero) | <200KB |
| Images (thumbnails) | <50KB |
| Fonts | <100KB total |
| Logo | <50KB |

### Image Requirements

| Type | Max Size | Format | Resolution |
|------|----------|--------|------------|
| Hero images | 200KB | WebP/AVIF | 2x for retina |
| Content images | 100KB | WebP | 2x for retina |
| Thumbnails | 30KB | WebP | 2x for retina |
| Icons | SVG preferred | SVG/PNG | Vector |
| OG Image | 300KB | JPG | 1200×630px |

---

## 10. Motion/Animation

### Duration Standards

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Micro-interactions | 150-200ms | `ease-out` |
| Hover effects | 200ms | `ease-in-out` |
| Fade in/out | 200-300ms | `ease-out` |
| Slide/transform | 300-400ms | `ease-out` |
| Page transitions | 400-500ms | `ease-in-out` |
| Complex sequences | 500-700ms | Custom bezier |

### Easing Functions

```css
:root {
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Reduced Motion (Required)

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 11. Quality Assurance Checklist

### Pre-Launch Checklist (Per Page)

#### Spacing & Layout
- [ ] Section padding follows standard (`py-12 md:py-14 lg:py-16` or similar)
- [ ] Content spacing uses 8px grid multiples
- [ ] No excessive whitespace (>96px between sections)
- [ ] Grid gaps are consistent with similar pages
- [ ] Container max-widths are appropriate
- [ ] Mobile spacing is ~25% tighter than desktop

#### Typography
- [ ] Body text is minimum 16px
- [ ] Line length is 45-75 characters
- [ ] Line height is 1.5× for body text
- [ ] Heading hierarchy is semantic (h1 → h2 → h3)
- [ ] Font weights are consistent

#### Colors & Contrast
- [ ] All text passes WCAG AA contrast (4.5:1)
- [ ] Large text passes 3:1 contrast
- [ ] UI components pass 3:1 contrast
- [ ] No gray-400 on dark backgrounds
- [ ] Focus indicators are visible

#### Components
- [ ] Buttons have 44px minimum touch target
- [ ] Form inputs have 44px minimum height
- [ ] Cards have consistent padding
- [ ] Icons are appropriately sized
- [ ] Hover states are implemented

#### Accessibility
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] Tab order is logical
- [ ] Focus states are visible
- [ ] Skip links work
- [ ] Reduced motion is supported

#### Performance
- [ ] Images are optimized (<200KB hero, <100KB content)
- [ ] No layout shift on load (CLS < 0.1)
- [ ] Page loads in <2.5s (LCP)
- [ ] Interactions respond in <200ms (INP)

---

## 12. Testing Procedures

### Industry Gold Standard: Automated Design System Testing

Based on Fortune 500 practices (IBM Carbon, Salesforce Lightning) and industry leaders:

**Three-Tier Testing Strategy:**

| Tier | Tool | What It Catches | When |
|------|------|-----------------|------|
| **1. Linting (Static)** | ESLint + Stylelint | Wrong class names, invalid tokens, accessibility | On save |
| **2. Component Testing** | Storybook + Chromatic | Visual regressions, component behavior | On PR |
| **3. Integration Testing** | Lighthouse CI | Performance, accessibility, SEO | On deploy |

### Tier 1: ESLint Custom Rules for Design System

Install dependencies:
```bash
npm install -D eslint-plugin-jsx-a11y @axe-core/react
```

Create `.eslintrc.design-system.js`:
```javascript
module.exports = {
  plugins: ['jsx-a11y'],
  rules: {
    // Accessibility
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/interactive-supports-focus': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/mouse-events-have-key-events': 'error',
    'jsx-a11y/no-autofocus': 'warn',
    'jsx-a11y/no-redundant-roles': 'warn',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/tabindex-no-positive': 'error',
  },
};
```

### Tier 2: Storybook + Chromatic Visual Testing

Setup:
```bash
npx storybook@latest init
npm install -D chromatic
```

Configure `chromatic.config.json`:
```json
{
  "projectToken": "<project-token>",
  "buildScriptName": "build-storybook",
  "exitOnceUploaded": true,
  "onlyChanged": true,
  "externals": ["**/*.md"]
}
```

Add to `package.json`:
```json
{
  "scripts": {
    "chromatic": "chromatic --project-token=${CHROMATIC_PROJECT_TOKEN}",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### Tier 3: Lighthouse CI

```json
// lighthouse-ci.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "interactive": ["error", {"maxNumericValue": 3000}]
      }
    }
  }
}
```

### Design Token Validation Script

Create `scripts/validate-design-tokens.js`:
```javascript
#!/usr/bin/env node
/**
 * Design Token Validator
 * Validates that code follows design system rules contextually
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const config = {
  // Patterns that make text-sm VALID
  validTextSmPatterns: [
    /flex\s+items-center.*gap-\d.*text-sm/,  // Icon-anchored lists
    /uppercase.*tracking-wider.*text-sm/,    // Labels
    /text-sm.*font-(semibold|bold)/,         // Price tags, badges
    /text-xs.*text-gray-\d{3}/,              // Captions
  ],

  // Patterns that are ALWAYS violations
  contrastViolations: [
    /text-charcoal\/[5-6]0/,  // 50-60% opacity fails contrast
    /text-gray-[4-5]00/,       // gray-400/500 often fail
  ],

  // Patterns that need review
  needsReview: [
    /text-charcoal\/70/,       // Borderline
    /text-gray-600/,           // Borderline on white
  ],
};

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check for text-sm without valid context
    if (line.includes('text-sm')) {
      const isValid = config.validTextSmPatterns.some(pattern => pattern.test(line));
      if (!isValid && (line.includes('<p') || line.includes('className="text-sm"'))) {
        // Potential violation - needs context check
        issues.push({
          line: lineNum,
          type: 'review',
          message: 'text-sm on potential body content - verify context',
          code: line.trim(),
        });
      }
    }

    // Check for contrast violations
    config.contrastViolations.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({
          line: lineNum,
          type: 'error',
          message: 'Color contrast violation - fails WCAG 4.5:1',
          code: line.trim(),
        });
      }
    });

    // Check for needs-review patterns
    config.needsReview.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({
          line: lineNum,
          type: 'warning',
          message: 'Borderline contrast - verify with WebAIM',
          code: line.trim(),
        });
      }
    });
  });

  return issues;
}

// Run validation
const files = glob.sync('app/**/*.tsx').concat(glob.sync('components/**/*.tsx'));
let totalErrors = 0;
let totalWarnings = 0;

files.forEach(file => {
  const issues = validateFile(file);
  if (issues.length > 0) {
    console.log(`\n${file}:`);
    issues.forEach(issue => {
      const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : '🔍';
      console.log(`  ${icon} Line ${issue.line}: ${issue.message}`);
      if (issue.type === 'error') totalErrors++;
      if (issue.type === 'warning') totalWarnings++;
    });
  }
});

console.log(`\n${'='.repeat(50)}`);
console.log(`Errors: ${totalErrors} | Warnings: ${totalWarnings}`);
process.exit(totalErrors > 0 ? 1 : 0);
```

Add to `package.json`:
```json
{
  "scripts": {
    "lint:design": "node scripts/validate-design-tokens.js",
    "lint:all": "npm run lint && npm run lint:design"
  }
}
```

### GitHub Actions Workflow

Create `.github/workflows/design-system-qa.yml`:
```yaml
name: Design System QA

on:
  pull_request:
    paths:
      - 'app/**'
      - 'components/**'
      - 'styles/**'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run lint:design

  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build-storybook
      - run: npx chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }}

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: './lighthouse-ci.json'
          uploadArtifacts: true
```

### Sources

- [Chromatic Visual Testing](https://www.chromatic.com/storybook) - Industry standard for visual regression
- [ESLint jsx-a11y Plugin](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) - Accessibility linting
- [Storybook for Next.js](https://storybook.js.org/docs/get-started/frameworks/nextjs) - Component testing
- [Linting Design Tokens with Stylelint](https://www.michaelmang.dev/blog/linting-design-tokens-with-stylelint/) - Token validation
- [ESLint Custom Rules](https://eslint.org/docs/latest/extend/custom-rules) - Building custom rules
- [IBM Carbon Design System](https://carbondesignsystem.com/) - Fortune 500 reference

### Manual Testing Matrix

| Test | Tool | Frequency |
|------|------|-----------|
| Lighthouse audit | Chrome DevTools | Every deploy |
| Contrast check | WebAIM | Every page |
| Keyboard nav | Manual | Every page |
| Screen reader | VoiceOver/NVDA | Major changes |
| Mobile usability | Real devices | Every page |
| Visual regression | Percy/Chromatic | Every PR |

### Responsive Breakpoint Testing

| Breakpoint | Width | Device Example |
|------------|-------|----------------|
| Mobile S | 320px | iPhone SE |
| Mobile M | 375px | iPhone 12/13 |
| Mobile L | 425px | Large phones |
| Tablet | 768px | iPad |
| Laptop | 1024px | Small laptop |
| Desktop | 1280px | Standard monitor |
| Large | 1440px | Large monitor |
| XL | 1920px | Full HD |

### Testing Checklist Per Breakpoint

- [ ] Layout doesn't break
- [ ] Text is readable
- [ ] Touch targets are 44px+
- [ ] Images are appropriately sized
- [ ] Navigation is usable
- [ ] Forms are functional
- [ ] No horizontal scroll

---

## Appendix: Quick Reference

### Tailwind Spacing Cheat Sheet

```
p-1  = 4px    p-8  = 32px   p-16 = 64px
p-2  = 8px    p-10 = 40px   p-20 = 80px
p-3  = 12px   p-12 = 48px   p-24 = 96px
p-4  = 16px   p-14 = 56px
p-6  = 24px
```

### Standard Section Padding

```tsx
// Hero sections
className="py-12 md:py-16 lg:py-20"

// Primary content
className="py-12 md:py-14 lg:py-16"

// Secondary content
className="py-10 md:py-12 lg:py-14"

// Compact sections
className="py-8 md:py-10 lg:py-12"
```

### Standard Content Spacing

```tsx
// Section intro
<div className="max-w-3xl mx-auto text-center mb-12">

// Card grids
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// CTA wrapper
<div className="text-center mt-12">
```

---

## Document Info

**Version:** 1.1
**Created:** 2025-12-20
**Updated:** 2025-12-20 (Added Section 6: Responsive Design Framework)
**Based on:** Fortune 500 Design Systems Research
**Sources:**
- Google Material Design 3
- IBM Carbon Design System
- Salesforce Lightning (SLDS)
- Microsoft Fluent Design
- Apple Human Interface Guidelines
- Atlassian Design System
- Shopify Polaris
- WCAG 2.1 Guidelines
- Core Web Vitals Standards

---

**Usage:** Apply this SOP to every new page, component, or modification. Run the QA checklist before merging any changes.
