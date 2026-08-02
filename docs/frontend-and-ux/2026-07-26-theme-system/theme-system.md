# CodeZest — Theme System (Admin Web)

> **Written from a Principal UI/UX Engineering perspective.**
> This document is the single source of truth for how color, typography, spacing, and visual identity work in the `ssc-admin-web` dashboard used by `ADMIN` and `SUPER_ADMIN` roles.

---

## Table of Contents

1. [Why This Matters for an Education Admin Portal](#1-why-this-matters-for-an-education-admin-portal)
2. [The Design Token Hierarchy](#2-the-design-token-hierarchy)
3. [The 60-30-10 Rule (Admin Context)](#3-the-60-30-10-rule-admin-context)
4. [Token Reference: What Every Variable Means](#4-token-reference-what-every-variable-means)
5. [Subject Color System](#5-subject-color-system)
6. [Semantic Status Colors](#6-semantic-status-colors)
7. [Typography System](#7-typography-system)
8. [The Golden Rules for Developers](#8-the-golden-rules-for-developers)
9. [Common Mistakes and How to Fix Them](#9-common-mistakes-and-how-to-fix-them)
10. [Audit Checklist](#10-audit-checklist)
11. [Accessibility Contract](#11-accessibility-contract)
12. [Component Token Contracts](#12-component-token-contracts)
13. [Enforcement & Tooling](#13-enforcement--tooling)
14. [Governance & Ownership](#14-governance--ownership)

---

## 1. Why This Matters for an Education Admin Portal

The `ssc-admin-web` is a **content operations interface**, not a marketing page. Content editors, exam curators, and platform admins use this dashboard for extended periods — creating questions, building mock tests, reviewing student performance, and managing the question bank.

| Environment | Challenge | Design Response |
|:---|:---|:---|
| Long content editing sessions | Eye fatigue from bright UIs | Muted backgrounds, soft contrast, dark mode support |
| Question bank with 1000s of records | Dense data tables | Clear hierarchy, sticky headers, compact row density |
| Mock test builder (multi-section) | Complex drag-and-drop forms | Step-by-step wizards, visual section indicators |
| Bulk question import & review | Rapidly scanning many items | Status badges with distinct semantic colors |
| Analytics dashboards | Reading charts and percentages | Chart token system, readable at-a-glance |
| Admin vs Super Admin access | Different capability sets | Role-aware UI that hides unauthorized controls |

**The goal:** The admin interface should feel professional, calm, and data-dense — an internal tool that trusts its operators, not a consumer app trying to delight.

### The Education Platform Psychology: Indigo vs. Red
A common design trap is attempting to port high-energy, conversion-heavy designs (like Restaurant POS systems or E-commerce sites) to educational platforms. In marketing, **Red** stimulates urgency, appetite, and clicks.

In an **Educational Context** (Code Zest Academy):
1. **Red = Danger/Wrong:** In exams, red universally means "Incorrect". If primary buttons and active states are red, it induces subconscious anxiety.
2. **Visual Fatigue:** Students and admins stare at these dashboards for hours. Bright, warm colors cause eye strain faster than cool colors.
3. **Indigo = Trust & Focus:** Educational institutions and pro-tools rely on Blues and Indigos to promote calm, focused, deep work.

**Decision (2026-07-28):** **CodeZest Indigo** is the absolute single primary brand color. Red is strictly semantic (Destructive actions and incorrect answers only).

---

## 2. The Design Token Hierarchy

The industry-standard 3-tier token approach — the same pattern used across Shopify Polaris, Atlassian, and Material Design 3.

```
Tier 1: Primitives (Raw values — never used directly in components)
  └── oklch(0.55 0.20 275)         — a specific indigo
  └── oklch(0.65 0.15 160)         — a specific green
  └── oklch(0.75 0.17 75)          — a specific amber

Tier 2: Alias Tokens (Semantic meaning — defined in index.css)
  └── --primary     = oklch(0.55 0.20 275)    ← CodeZest brand indigo (Focus/Trust)
  └── --success     = oklch(0.65 0.15 160)
  └── --warning     = oklch(0.75 0.17 75)
  └── --destructive = oklch(0.5987 0.1978 21.78) ← Semantic Red ONLY

Tier 3: Component Usage (Tailwind utility classes)
  └── bg-primary, text-primary, border-primary
  └── bg-success, text-success
  └── bg-destructive, text-destructive
```

**Why this matters:** When the CodeZest brand evolves, we update one value at `Tier 2`. Every button, active state, and focus ring across the entire admin app instantly reflects the change — without touching a single component.

---

## 3. The 60-30-10 Rule (Admin Context)

```
60% — Dominant surface (bg-background, bg-card, bg-sidebar)
       Neutral. Low saturation. This is the data canvas.
       In dark mode: deep slate-like tone, not pure black.

30% — Structure and typography (text-foreground, border-border, bg-muted)
       Provides hierarchy, separates sections, readable text.

10% — Brand accent (bg-primary, text-primary, border-primary)
       CTA buttons, active nav items, focus rings, key actions.
       This is where CodeZest indigo lives.
```

### What this looks like in practice

**Correct** — A question management page:
- Card surface (`bg-card`) for the question list
- Muted table headers (`bg-muted`)
- Only the "Add Question" button and active sidebar item use `bg-primary`

**Wrong** — Over-branded admin page:
- Section headers in `bg-primary/20` with `text-primary` title text
- Subject tags all colored `text-primary`
- Status badges using `text-indigo-600`

Admin interfaces demand restraint. Brand color signals action. When everything is brand-colored, nothing is.

---

## 4. Token Reference: What Every Variable Means

All tokens are defined in `src/index.css` and aliased via `@theme inline` to Tailwind.

### Core Structural Tokens

| CSS Variable | Tailwind Class | When to Use |
|:---|:---|:---|
| `--background` | `bg-background` | Main page canvas, layout wrapper |
| `--foreground` | `text-foreground` | All primary body text |
| `--card` | `bg-card` | Cards, panels, data tables, form containers |
| `--card-foreground` | `text-card-foreground` | Text inside card surfaces |
| `--popover` | `bg-popover` | Dropdowns, tooltips, command palettes, dialogs |
| `--popover-foreground` | `text-popover-foreground` | Text inside popover surfaces |
| `--muted` | `bg-muted` | Table headers, tag backgrounds, secondary panels |
| `--muted-foreground` | `text-muted-foreground` | Captions, hints, placeholder text, secondary labels |
| `--border` | `border-border` | All card outlines, dividers, table borders |
| `--input` | (input bg) | Input field and select backgrounds |
| `--ring` | `ring-ring` | Focus rings on all interactive elements |

### Brand / Interactive Tokens

| CSS Variable | Tailwind Class | When to Use |
|:---|:---|:---|
| `--primary` | `bg-primary` | Primary CTA buttons, active nav, toggle-on states |
| `--primary` | `text-primary` | Links, active labels, key icon highlights |
| `--primary` | `border-primary` | Active card borders, highlighted input borders |
| `--primary-foreground` | `text-primary-foreground` | Text on `bg-primary` surfaces (computed for contrast) |
| `--accent` | `bg-accent` | Hover states on secondary surfaces |
| `--accent-foreground` | `text-accent-foreground` | Text on `bg-accent` hover surfaces |

### Semantic Status Tokens

| CSS Variable | Tailwind Class | Meaning in Admin Context |
|:---|:---|:---|
| `--success` | `bg-success`, `text-success` | Published, active, approved, student passed |
| `--success-foreground` | `text-success-foreground` | Text on `bg-success` badges |
| `--warning` | `bg-warning`, `text-warning` | Draft, pending review, upcoming, in-progress |
| `--warning-foreground` | `text-warning-foreground` | Text on `bg-warning` banners |
| `--info` | `bg-info`, `text-info` | Informational tooltips, metadata callouts |
| `--info-foreground` | `text-info-foreground` | Text on `bg-info` surfaces |
| `--destructive` | `bg-destructive`, `text-destructive` | Inactive, deleted, student failed, error |
| `--destructive-foreground` | `text-destructive-foreground` | Text on `bg-destructive` surfaces |

### Sidebar Tokens (Isolated)

The sidebar has its own token family so it can be independently styled (e.g., dark sidebar with light content area).

| CSS Variable | Tailwind Class |
|:---|:---|
| `--sidebar` | `bg-sidebar` |
| `--sidebar-foreground` | `text-sidebar-foreground` |
| `--sidebar-primary` | `bg-sidebar-primary` |
| `--sidebar-primary-foreground` | `text-sidebar-primary-foreground` |
| `--sidebar-accent` | `bg-sidebar-accent` |
| `--sidebar-accent-foreground` | `text-sidebar-accent-foreground` |
| `--sidebar-border` | `border-sidebar-border` |

### Chart Tokens

For all analytics dashboards and Recharts data visualizations.

| Token | Usage in Admin |
|:---|:---|
| `--chart-1` | Primary data series (e.g., total attempts) |
| `--chart-2` | Secondary series (e.g., correct answers) |
| `--chart-3` | Tertiary series (e.g., incorrect answers) |
| `--chart-4` | Quaternary series (e.g., skipped) |
| `--chart-5` | Quinary series (e.g., pass rate) |

---

## 5. Subject Color System

The SSC exam has 5 core subjects. Each subject gets a **dedicated, non-primary color** drawn from the chart token family. This creates visual differentiation in the question bank, practice set builder, and analytics dashboards without using the brand primary color.

```
Subject → Token         → Primitive Color
─────────────────────────────────────────────────────────
Quantitative Aptitude   → --subject-quant   → oklch(0.72 0.17 55)    Amber/Orange
English Language        → --subject-english → oklch(0.62 0.15 240)   Sky Blue
General Awareness       → --subject-ga      → oklch(0.58 0.18 295)   Violet/Purple
Reasoning               → --subject-reason  → oklch(0.63 0.15 155)   Emerald Green
General Science         → --subject-science → oklch(0.60 0.15 205)   Cyan/Teal
```

### How to Use Subject Colors

```tsx
// Subject badge / pill on a question card
<span className="bg-subject-quant/10 text-subject-quant border border-subject-quant/20 rounded-full px-2 py-0.5 text-xs font-medium">
  Quantitative Aptitude
</span>

// Subject icon in subject management table
<div className="h-8 w-8 rounded-lg bg-subject-english/10 flex items-center justify-center">
  <BookOpenIcon className="text-subject-english h-4 w-4" />
</div>
```

### Rules for Subject Colors

- **Only use them for subject identification** — not for arbitrary decoration
- **Never use raw palette classes** for subjects (`text-amber-600`, `text-sky-500`)
- **Respect the `/10` tint standard** for backgrounds, `/20` for hover states
- **Dark mode values** are defined in `index.css` — do not override manually

---

## 6. Semantic Status Colors

Never use raw Tailwind palette classes for operational states.

| State | Wrong ❌ | Correct ✅ |
|:---|:---|:---|
| Published / Active | `text-emerald-600 bg-emerald-500/10` | `text-success bg-success/10` |
| Draft / Pending Review | `text-amber-600 bg-amber-500/10` | `text-warning bg-warning/10` |
| Informational callout | `text-blue-600 bg-blue-500/10` | `text-info bg-info/10` |
| Inactive / Deleted | `text-rose-600 bg-rose-500/10` | `text-destructive bg-destructive/10` |
| Secondary / Disabled | `text-slate-500 bg-slate-100` | `text-muted-foreground bg-muted` |

### Content Lifecycle Status Reference

This is the canonical mapping for all content entities (Subject, Chapter, Lesson, Question, PracticeSet, MockTest):

| `isActive` Value | Status Label | Token |
|:---|:---|:---|
| `true` | Published / Active | `text-success bg-success/10` |
| `false` | Inactive / Archived | `text-destructive bg-destructive/10` |
| Draft state (future) | Draft | `text-warning bg-warning/10` |

---

## 7. Typography System

### Font Stack

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
}
```

- **Inter** — primary UI font. Clear, neutral, optimized for data-dense interfaces.
- **JetBrains Mono** — for question text containing code/math expressions, answer keys, and question IDs.

### Type Scale

| Token | Size | Weight | Use |
|:---|:---|:---|:---|
| `text-xs` | 12px | 400 | Captions, table footnotes, help text |
| `text-sm` | 14px | 400/500 | Table body, form labels, badge text |
| `text-base` | 16px | 400 | Body content, form field values |
| `text-lg` | 18px | 600 | Card titles, section headings |
| `text-xl` | 20px | 600/700 | Page titles |
| `text-2xl` | 24px | 700 | Dashboard stat numbers |
| `text-3xl+` | 30px+ | 700 | Reserved — use sparingly in admin context |

### Math & Question Formatting

Questions may contain mathematical expressions. Use `font-mono` class for numerical answer options and code-like content:

```tsx
// Question option with numerical value
<span className="font-mono text-sm">(A) 144</span>

// Inline math notation (when LaTeX rendering is not available)
<code className="font-mono bg-muted px-1 py-0.5 rounded text-sm">x² + 2x + 1</code>
```

> **Future consideration:** Integrate KaTeX or MathJax for proper LaTeX rendering in question text. When implemented, create a `QuestionRenderer` component that handles both HTML and LaTeX content safely.

---

## 8. The Golden Rules for Developers

### Rule 1: Never hardcode a color

```tsx
// ❌ NEVER
<div className="bg-slate-50 text-slate-900 border-slate-200" />
<div className="text-indigo-600 bg-indigo-100" />
<div className="text-emerald-600 bg-emerald-500/10" />

// ✅ ALWAYS
<div className="bg-background text-foreground border-border" />
<div className="text-primary bg-primary/10" />
<div className="text-success bg-success/10" />
```

### Rule 2: Never use `dark:` variant alongside semantic tokens

```tsx
// ❌ Broken — fighting against the token system
<div className="bg-white dark:bg-zinc-900" />

// ✅ Correct — tokens handle dark mode automatically
<div className="bg-card" />
```

### Rule 3: Respect the 60-30-10 distribution

```tsx
// ❌ Over-branded
<div className="bg-primary/20 border-primary rounded-xl">
  <h2 className="text-primary font-bold">Question Bank</h2>
  <p className="text-primary/70">2,340 questions</p>
  <Button className="bg-primary">Add Question</Button>
</div>

// ✅ Correct — primary reserved for the CTA only
<div className="bg-card border-border rounded-xl">
  <h2 className="text-foreground font-semibold">Question Bank</h2>
  <p className="text-muted-foreground">2,340 questions</p>
  <Button className="bg-primary">Add Question</Button>
</div>
```

### Rule 4: Subject colors are for subject identification only

```tsx
// ❌ Wrong — using subject color as generic decoration
<div className="text-subject-quant font-bold">Section Title</div>

// ✅ Correct — subject color tied to subject identity
<Badge className="bg-subject-quant/10 text-subject-quant">Quantitative Aptitude</Badge>
```

### Rule 5: No decorative gradients on operational pages

Gradients and glow effects belong on the student client app (sparingly) and landing pages. The admin interface must be **flat, focused, and scannable**. No `gradient-to-br`, no `blur-xl` decorative circles.

### Rule 6: All interactive elements must have visible focus rings

The `--ring` token is set globally. Never suppress `outline-none` unless you replace it with a custom `ring` class:

```tsx
// ❌ Kills keyboard accessibility
<button className="outline-none">...</button>

// ✅ Replaces with accessible ring
<button className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">...</button>
```

---

## 9. Common Mistakes and How to Fix Them

### Mistake: Page canvas doesn't switch to dark mode

**Cause:** `bg-white` or `bg-slate-50` hardcoded on the layout.

**Fix:** Replace `bg-white` → `bg-background`, `bg-slate-50` → `bg-muted/40`.

---

### Mistake: Question difficulty badge looks wrong in dark mode

**Cause:** Raw palette used — `text-green-600 bg-green-100`.

**Fix:** Map difficulty to semantic tokens:
```tsx
const difficultyStyles = {
  EASY:   'bg-success/10 text-success',
  MEDIUM: 'bg-warning/10 text-warning',
  HARD:   'bg-destructive/10 text-destructive',
};
```

---

### Mistake: Subject filter shows wrong color after theme change

**Cause:** Subject color defined inline as `style={{ color: '#f59e0b' }}`.

**Fix:** Use the subject token class: `text-subject-quant`. Define subject → token mapping as a constant:

```typescript
// src/lib/subjectTokens.ts
export const SUBJECT_TOKEN_MAP: Record<string, string> = {
  'quantitative-aptitude': 'subject-quant',
  'english-language':      'subject-english',
  'general-awareness':     'subject-ga',
  'reasoning':             'subject-reason',
  'general-science':       'subject-science',
};
```

---

### Mistake: Analytics chart colors don't match the rest of the UI

**Cause:** Recharts `fill` prop using hex strings or raw palette names.

**Fix:** Read chart tokens from CSS variables at runtime:

```typescript
// src/lib/chartColors.ts
export function getChartColors(): string[] {
  const root = getComputedStyle(document.documentElement);
  return [1, 2, 3, 4, 5].map(n =>
    root.getPropertyValue(`--chart-${n}`).trim()
  );
}
```

---

## 10. Audit Checklist

Use on every PR touching the admin UI:

```
[ ] No hardcoded hex colors in JSX className or style props
[ ] No raw Tailwind palette classes (emerald, amber, rose, indigo, slate, zinc, sky...)
[ ] No dark: variant used alongside semantic tokens
[ ] Status labels use success / warning / info / destructive tokens
[ ] Difficulty badges use success (easy) / warning (medium) / destructive (hard)
[ ] Subject colors use --subject-* tokens, never raw palette
[ ] Text on primary backgrounds uses text-primary-foreground
[ ] Chart data uses --chart-1 through --chart-5
[ ] Sidebar items use sidebar-* token family
[ ] No outline-none without a focus-visible ring replacement
[ ] No decorative gradients or blur-xl circles on operational pages
[ ] Dark mode tested by toggling class="dark" on <html>
```

---

## 11. Accessibility Contract

### Text Contrast Requirements (WCAG 2.1 AA)

| Use Case | Minimum Ratio | Enforcement |
|:---|:---|:---|
| Normal text (< 18px) | 4.5:1 | Semantic tokens designed to meet this |
| Large text (≥ 18px bold) | 3:1 | Manually verified per component |
| UI components and icons | 3:1 | Semantic tokens provide sufficient contrast |

### Touch Targets

Admin is primarily a desktop interface, but tablet support for on-site management must be preserved.

| Element | Minimum Size | Status |
|:---|:---|:---|
| Primary action buttons | 40 × 36px | ✅ Enforced via `h-9`/`h-10` Button variants |
| Icon-only action buttons | 36 × 36px | ⚠️ Audit required — some use `h-8 w-8` |
| Table row actions | 32px height minimum | ⚠️ Compact table density needs review |
| Sidebar nav items | 40px height minimum | ✅ Enforced via padding |

### Reduced Motion

```css
/* Add to src/index.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

> **Status:** Not yet implemented. Must be added before launch. ⚠️

---

## 12. Component Token Contracts

| Component | Allowed Tokens | Forbidden |
|:---|:---|:---|
| `Button` (primary) | `--primary`, `--primary-foreground`, `--ring` | Raw palette |
| `Button` (destructive) | `--destructive`, `--destructive-foreground` | `rose-*`, `red-*` |
| `Badge` (content status) | `--success`, `--warning`, `--destructive` | `emerald-*`, `amber-*` |
| `Badge` (difficulty) | `--success` (easy), `--warning` (medium), `--destructive` (hard) | Raw palette |
| `Badge` (subject) | `--subject-*` family | Raw palette, `--primary` |
| Sidebar nav items | `--sidebar-*` family only | `--primary` directly |
| Card surfaces | `--card`, `--card-foreground`, `--border` | `bg-white`, `bg-zinc-*` |
| Charts | `--chart-1` through `--chart-5` | Raw palette, hex strings |
| Input fields | `--input`, `--ring`, `--border`, `--destructive` | Raw palette |
| Dialog / Modal | `--popover`, `--border`, `--muted` | Brand tokens |
| Toast / Notification | `--popover`, `--destructive` (for errors) | Brand tokens |
| Skeleton loaders | `--muted` | Raw palette |

---

## 13. Enforcement & Tooling

### ESLint Rule: No Raw Palette Classes

```javascript
// eslint.config.js — add this rule
{
  rules: {
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'Literal[value=/\\b(bg|text|border|ring|fill|stroke)-(slate|zinc|gray|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/]',
        message:
          '[Theme] Raw Tailwind palette class detected. Use semantic tokens (bg-primary, text-success, bg-muted, text-subject-quant) instead. See docs/frontend-and-ux/theme-system.md.',
      },
    ],
  },
}
```

### Grep Audit Commands

```bash
# Find all raw palette class violations in the admin UI
grep -rn '\(bg\|text\|border\)-\(emerald\|amber\|rose\|indigo\|slate\|zinc\|blue\|green\|red\)' src/

# Find any hardcoded hex colors in JSX
grep -rn '#[0-9a-fA-F]\{3,6\}' src/ --include='*.tsx' --include='*.ts'

# Find any inline style color overrides
grep -rn 'style=.*color' src/ --include='*.tsx'
```

---

## 14. Governance & Ownership

### Token Ownership

| Token Family | Owner | Change Requires |
|:---|:---|:---|
| Core structural tokens | Platform UI lead | Full team sign-off |
| Semantic status tokens | Platform UI lead | UI lead approval |
| Subject color tokens (`--subject-*`) | Platform UI lead | UI lead approval |
| Sidebar tokens | Platform UI lead | UI lead approval |
| Chart tokens | Feature team | UI lead review |

### Adding a New Token

1. Open a GitHub Discussion titled `[Token RFC] --token-name`
2. State the problem — why no existing token is sufficient
3. Propose the name — follow `--{category}-{modifier}` convention
4. Propose OKLCH values for light and dark mode
5. Identify all consumers (components that will use it)
6. UI lead approves → merged into `index.css`

---

## Related Documents

- [UX/UI Guidelines (Admin)](./ux-ui-guidelines.md) — Page layouts, component patterns, interaction conventions
- [Global Enums Reference](../database-and-schema/2026-07-26-global-enums/global-enums.md) — Status values and subject enums from the API
- [Master Progress Tracker](../progress-and-planning/2026-07-26-master-progress-tracker/progress-tracker.md) — Phase status

---

## 15. The Design System Documentation Hub

The interactive reference for all these tokens is available at `/design-system` within the app.
This is a **production-ready documentation site layout** featuring industry-standard tooling:

- **Interactive Token Editor**: A sidebar that allows designers and developers to dynamically adjust `--primary` hue, chroma, border radius, and fonts with live real-time WCAG contrast checking. Enables rapid prototyping and CSS variable export.
- **Visual Token Governance (Do / Don't)**: Dedicated sections outlining strict visual contracts and anti-patterns for using raw Tailwind colors versus semantic tokens.
- **Dual-Theme Previews**: Component blocks wrapped in a `ThemePreview` component that explicitly forces `.light` on one side and `.dark` on the other, ensuring developers can verify contrast instantly without manually toggling the global theme.
- **Modular Sections**: The hub is split into distinct logical sections (`Colors`, `PagePatterns`, `Governance`, etc.) ensuring the code remains maintainable.
- **Page Patterns**: Composed layouts like data tables, sidebar navigation, and forms to demonstrate how tokens work together in reality.

**Always refer to `/design-system` as the absolute source of truth when reviewing PRs.**
