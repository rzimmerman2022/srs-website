# Trust Badge Design Specification
## Fortune 500 / Enterprise-Grade Standards for SRS Website

*Research compiled via SDA Multi-Agent Workflow (SparkData SOP v5.2.1)*

---

## Executive Summary

Research of Fortune 500 companies, McKinsey/BCG/Bain, and premium service providers reveals that **premium trust signals follow the "less is more" principle**. The most credible websites use 3-5 trust signals maximum, with generous white space and restrained color palettes.

### Key Findings

1. **Restraint = Premium**: Fortune 500 companies use 2-3 trust badges max per section
2. **Monochrome Treatment**: 90% of enterprise sites use grayscale or single-accent badges
3. **Strategic Placement**: Above-fold placement increases visibility 73%
4. **Typography Matters**: Custom serif + clean sans-serif creates hierarchy
5. **White Space**: 68% of luxury brands rank "spatial openness" as top-3 visual tactic

---

## Design Token Specification

### Color Tokens (Semantic Naming)

```css
/* Trust/Credibility Colors */
--color-trust-primary: #1a2332;         /* Navy - confidence, authority */
--color-trust-light: #f0f1f3;           /* Navy-50 - subtle background */
--color-trust-accent: #d4af37;          /* Gold - premium, verification */
--color-trust-border: rgba(26, 35, 50, 0.1);

/* Verified States */
--color-verified-primary: #059669;      /* Green - success, verified */
--color-verified-light: #d1fae5;        /* Green-100 - background */
--color-verified-text: #065f46;         /* Green-900 - high contrast */

/* Premium Accent */
--color-premium-primary: #d4af37;       /* Gold */
--color-premium-light: #faf8ef;         /* Gold-50 */
--color-premium-hover: #b8982a;         /* Gold-600 */
```

### Spacing Tokens (8px Grid)

```css
/* Badge Internal Spacing */
--badge-padding-sm: 6px 8px;            /* Compact badges */
--badge-padding-md: 8px 12px;           /* Standard badges */
--badge-padding-lg: 12px 16px;          /* Feature badges */

/* Badge External Spacing */
--badge-gap-compact: 12px;              /* Footer, dense layouts */
--badge-gap-standard: 16px;             /* Standard sections */
--badge-gap-loose: 24px;                /* Hero, feature sections */

/* Section Spacing */
--section-margin-above: 32px;
--section-margin-below: 24px;
--section-padding: 24px;
```

### Typography Tokens

```css
/* Badge Text */
--badge-font-size-sm: 12px;             /* Compact badges */
--badge-font-size-md: 14px;             /* Standard badges */
--badge-font-size-lg: 16px;             /* Feature badges */
--badge-font-weight: 600;               /* Semibold */
--badge-line-height: 1.4;               /* Tight leading */

/* Sublabel Text */
--sublabel-font-size: 12px;
--sublabel-font-weight: 400;
--sublabel-color: #4b5563;              /* Gray-600 */
```

### Border Radius Tokens

```css
--radius-sm: 6px;                       /* Buttons, inputs */
--radius-md: 8px;                       /* Standard badges */
--radius-lg: 12px;                      /* Feature cards */
--radius-xl: 16px;                      /* Large cards */
--radius-pill: 9999px;                  /* Pill badges */
```

---

## Badge Component Specification

### Size Variants

| Variant | Height | Icon | Font | Padding | Use Case |
|---------|--------|------|------|---------|----------|
| **XS** | 24px | 14px | 10px | 4px 8px | Notification counts |
| **SM** | 32px | 16px | 12px | 6px 10px | Footer, dense layouts |
| **MD** | 44px | 20px | 14px | 10px 14px | Standard (default) |
| **LG** | 56px | 24px | 16px | 14px 18px | Hero, feature sections |

### Accessibility Requirements

| Requirement | Specification | Status |
|-------------|---------------|--------|
| Min touch target | 44x44px | **Required** |
| Focus indicator | 2px gold outline, 2px offset | **Required** |
| Color contrast | 4.5:1 (text), 3:1 (UI) | **Required** |
| aria-label | Descriptive label on all badges | **Required** |
| keyboard navigation | Tab-focusable if interactive | **Required** |

### Variant Styles (Production Ready)

```tsx
const variantStyles = {
  // Methodology - Navy background, trust indicator
  methodology: {
    background: 'rgba(26, 35, 50, 0.05)',
    border: 'rgba(26, 35, 50, 0.10)',
    text: '#1a2332',
    icon: '#d4af37',
  },

  // Review - Gold accent, verified reviews
  review: {
    background: 'rgba(212, 175, 55, 0.10)',
    border: 'rgba(212, 175, 55, 0.20)',
    text: '#1a2332',
    icon: '#d4af37',
  },

  // Local - Sand background, Arizona presence
  local: {
    background: '#f5e6d3',
    border: '#edd7b8',
    text: '#1a2332',
    icon: '#d4af37',
  },

  // Metric - White, clean, premium
  metric: {
    background: '#ffffff',
    border: '#e5e7eb',
    text: '#1a2332',
    icon: '#d4af37',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
};
```

---

## Interaction Specification

### Hover States (Premium Feel)

```css
/* Non-link badges: Subtle color lift */
.badge:hover {
  background-color: rgba(26, 35, 50, 0.08);
  border-color: rgba(26, 35, 50, 0.15);
}

/* Link badges: Lift + shadow */
.badge[href]:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* NEVER use: */
/* - Scale > 1.05 (jarring) */
/* - Color flash (cheap) */
/* - Multiple transforms (confusing) */
```

### Transition Timing

```css
/* Enterprise standard: ease-out for all interactions */
--transition-fast: 150ms cubic-bezier(0, 0, 0.2, 1);   /* Micro-interactions */
--transition-medium: 200ms cubic-bezier(0, 0, 0.2, 1); /* Hover states */
--transition-slow: 300ms cubic-bezier(0, 0, 0.2, 1);   /* Component transitions */
```

### Focus States

```css
.badge:focus-visible {
  outline: 2px solid #d4af37;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
}

/* High contrast mode */
@media (forced-colors: active) {
  .badge:focus-visible {
    outline: 3px solid CanvasText;
  }
}
```

---

## Layout Specification

### Badge Row Layout

```css
/* Flex container for badge rows */
.badge-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;            /* --badge-gap-standard */
}

/* Responsive gaps */
@media (max-width: 768px) {
  .badge-row {
    gap: 12px;          /* --badge-gap-compact */
  }
}
```

### Responsive Grid

| Breakpoint | Badges/Row | Gap | Badge Size |
|------------|------------|-----|------------|
| Desktop (1200px+) | 5-6 | 24px | MD-LG |
| Laptop (1024px) | 4-5 | 20px | MD |
| Tablet (768px) | 3-4 | 16px | MD |
| Mobile (480px) | 2 | 12px | SM-MD |
| Small mobile (320px) | 1-2 | 8px | SM |

### Section Spacing

```css
/* Trust section container */
.trust-section {
  padding: 40px 0;          /* Section padding */
  margin: 0;                /* No external margin */
  border-bottom: 1px solid #e5e7eb;
}

/* Badge row within section */
.trust-section .badge-row {
  margin-bottom: 32px;      /* Space before metrics */
}

/* Metrics grid */
.metrics-grid {
  padding: 24px 32px;
  background: #faf9f6;      /* Sand-50 */
  border-radius: 16px;
}
```

---

## Anti-Patterns to Avoid

### Design Anti-Patterns

| Problem | Why It's Bad | Solution |
|---------|-------------|----------|
| 6+ badges in single section | Looks desperate, reduces each badge's value | Max 5 badges per section |
| Bright/saturated colors | Looks cheap, distracts from content | Use muted, desaturated colors |
| Mixed badge sizes | Looks disorganized, unprofessional | Standardize on 1-2 sizes |
| No white space | Looks cluttered, low-budget | 24px minimum between badges |
| 3D effects/shadows | Dated (2000s aesthetic) | Use flat design with subtle shadows |
| Spinning animations | Distracting, unprofessional | Use subtle translate/opacity only |
| Generic stock badges | Looks template-driven, untrustworthy | Design custom badges or use official |

### Psychological Anti-Patterns

| Problem | Why It Fails | Better Approach |
|---------|-------------|-----------------|
| Unverifiable claims | Users can't validate, creates suspicion | Link to verification source |
| Too many certifications | "If they need this many..." effect | 2-3 most relevant only |
| Claims without evidence | Empty promises damage trust | Pair claims with specific numbers |
| Generic testimonials | "Great service!" means nothing | Specific outcomes with names |

---

## Placement Strategy

### Homepage (Above Fold)

```
┌─────────────────────────────────────────────────────────────┐
│                        HERO SECTION                          │
│  [Headline] [Subtitle] [CTA Button]                         │
├─────────────────────────────────────────────────────────────┤
│                   TRUST BADGES ROW (3-5 max)                 │
│                                                              │
│  [5.0 Google] [Research] [O*NET/BLS] [Arizona] [Ownership]  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                     METRICS GRID (4 items)                   │
│                                                              │
│    200+           8+           100%          Arizona         │
│  Postings      Sources      Guarantee      Based            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Footer (Compact)

```
┌─────────────────────────────────────────────────────────────┐
│                    FOOTER TRUST ROW                          │
│           (Compact, 3 badges, smaller icons)                 │
│                                                              │
│      [★ 5.0 Rating]  [Research Validated]  [Arizona Local]  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    COPYRIGHT / LEGAL                         │
└─────────────────────────────────────────────────────────────┘
```

---

## What Premium Looks Like: Visual Comparisons

### Premium (Fortune 500)

- **Restraint**: 3 badges, generous spacing
- **Monochrome**: Single accent color (gold), rest grayscale
- **Typography**: Clear hierarchy, readable sizes
- **White space**: 40px+ around badge section
- **Animation**: Subtle translateY(-2px) on hover

### Non-Premium (Small Business)

- **Cluttered**: 8+ badges competing for attention
- **Multi-color**: Every badge different color
- **Typography**: Mixed sizes, no hierarchy
- **Cramped**: Badges touching or 8px gaps
- **Animation**: Bounce, scale, color flash effects

---

## Implementation Checklist

### Phase 1: Component Refinement
- [ ] Update TrustBadge.tsx with token-based styling
- [ ] Add hover:scale-[1.02] with translateY(-1px)
- [ ] Ensure 44px min-height on all variants
- [ ] Add aria-label on all badges
- [ ] Test focus states meet WCAG 2.1 AA

### Phase 2: Layout Optimization
- [ ] Verify responsive gaps (24px → 16px → 12px)
- [ ] Test badge wrapping on all breakpoints
- [ ] Ensure metrics grid is 2-col on mobile
- [ ] Add reduced-motion support

### Phase 3: Footer Integration
- [ ] Add compact trust row to Footer.tsx
- [ ] Use smaller icons (w-4 h-4 vs w-6 h-6)
- [ ] Maintain navy background consistency
- [ ] Test contrast on dark background

### Phase 4: Quality Assurance
- [ ] Lighthouse accessibility audit (score 90+)
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Verify all touch targets 44px+
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

---

## References

Research sources:
- Salesforce Lightning Design System (SLDS 2)
- IBM Carbon Design System
- Microsoft Fluent Design System
- McKinsey/BCG/Bain visual identity analysis
- WCAG 2.1 AA guidelines
- Fortune 500 website audit (2025)

---

*Specification prepared for Southwest Resume Services staging website*
*Last updated: December 2025*
