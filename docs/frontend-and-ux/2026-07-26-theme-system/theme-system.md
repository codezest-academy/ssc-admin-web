# CodeZest — Theme System (Admin Web)

> **Written from a Principal UI/UX Engineering perspective.**
> This document is the single source of truth for how color, typography, spacing, and visual identity work in the `ssc-admin-web` dashboard used by `ADMIN` and `SUPER_ADMIN` roles.
>
> **Last updated: 2026-08-09** — Academy Warm palette, floating layout system, text-on-tint tokens, accessibility pass.

---

## Table of Contents

1. [Why This Matters for an Education Admin Portal](#1-why-this-matters-for-an-education-admin-portal)
2. [The Design Token Hierarchy](#2-the-design-token-hierarchy)
3. [The 60-30-10 Rule (Admin Context)](#3-the-60-30-10-rule-admin-context)
4. [Token Reference: What Every Variable Means](#4-token-reference-what-every-variable-means)
5. [Subject Color System](#5-subject-color-system)
6. [Semantic Status Colors](#6-semantic-status-colors)
7. [Typography System](#7-typography-system)
8. [Layout System: Floating Panels](#8-layout-system-floating-panels)
9. [The Golden Rules for Developers](#9-the-golden-rules-for-developers)
10. [Common Mistakes and How to Fix Them](#10-common-mistakes-and-how-to-fix-them)
11. [Audit Checklist](#11-audit-checklist)
12. [Accessibility Contract](#12-accessibility-contract)
13. [Component Token Contracts](#13-component-token-contracts)
14. [Enforcement & Tooling](#14-enforcement--tooling)
15. [Governance & Ownership](#15-governance--ownership)

---

## 1. Why This Matters for an Education Admin Portal

The `ssc-admin-web` is a **content operations interface**, not a marketing page. Content editors, exam curators, and platform admins use this dashboard for extended periods — creating questions, building mock tests, reviewing student performance, and managing the question bank.

| Environment | Challenge | Design Response |
|:---|:---|:---|
| Long content editing sessions | Eye fatigue from bright UIs | Warm ivory background, soft contrast, dark mode support |
| Question bank with 1000s of records | Dense data tables | Clear hierarchy, sticky headers, compact row density |
| Mock test builder (multi-section) | Complex drag-and-drop forms | Step-by-step wizards, visual section indicators |
| Bulk question import & review | Rapidly scanning many items | Status badges with distinct semantic colors |
| Analytics dashboards | Reading charts and percentages | Chart token system, readable at-a-glance |
| Admin vs Super Admin access | Different capability sets | Role-aware UI that hides unauthorized controls |

**The goal:** The admin interface should feel professional, warm, and data-dense — an internal tool that trusts its operators, not a consumer app trying to delight.

### The Education Platform Psychology: Indigo vs. Red

In an **Educational Context** (Code Zest Academy):
1. **Red = Danger/Wrong:** In exams, red universally means "Incorrect". Primary buttons in red induce subconscious anxiety.
2. **Visual Fatigue:** Students and admins stare at these dashboards for hours. Bright, warm colors cause eye strain faster than cool colors.
3. **Indigo = Trust & Focus:** Educational institutions and pro-tools rely on Blues and Indigos to promote calm, focused, deep work.

**Decision (2026-07-28, reaffirmed 2026-08-09):** **CodeZest Indigo** (`oklch(0.52 0.26 265)`) is the absolute single primary brand color. Red is strictly semantic (Destructive actions and incorrect answers only).

---

## 2. The Design Token Hierarchy

The industry-standard 3-tier token approach — the same pattern used across Shopify Polaris, Atlassian, and Material Design 3.

```
Tier 1: Primitives (Raw values — never used directly in components)
  └── oklch(0.52 0.26 265)         — brand royal indigo
  └── oklch(0.60 0.16 155)         — success emerald
  └── oklch(0.68 0.17 75)          — warning amber

Tier 2: Alias Tokens (Semantic meaning — defined in index.css)
  └── --primary     = oklch(0.52 0.26 265)    ← CodeZest brand indigo (Focus/Trust)
  └── --success     = oklch(0.60 0.16 155)
  └── --warning     = oklch(0.68 0.17 75)
  └── --destructive = oklch(0.55 0.22 25)     ← Semantic Red ONLY

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
       Warm ivory in light mode. Deep navy in dark mode.
       This is the data canvas.

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

All tokens are defined in `src/index.css` inside `@layer base { :root {} .dark {} }` and aliased via `@theme` to Tailwind.

### Palette: "Academy Warm"

The current palette (as of 2026-08-09) is **Academy Warm** — a purposeful shift from the cold grey/slate palette to a warm ivory + deep navy system.

| Mode | Background | Foreground | Primary |
|:---|:---|:---|:---|
| Light | `oklch(0.97 0.005 85)` — warm ivory | `oklch(0.14 0.025 265)` — deep navy | `oklch(0.52 0.26 265)` — royal indigo |
| Dark | `oklch(0.15 0.03 265)` — deep navy | `oklch(0.97 0.01 265)` — near-white | `oklch(0.68 0.22 265)` — luminous indigo |

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
| `--primary-foreground` | `text-primary-foreground` | Text on `bg-primary` surfaces |
| `--accent` | `bg-accent` | Hover states on secondary surfaces |
| `--accent-foreground` | `text-accent-foreground` | Text on `bg-accent` hover surfaces |

### Semantic Status Tokens

| CSS Variable | Tailwind Class | Meaning in Admin Context |
|:---|:---|:---|
| `--success` | `bg-success`, `text-success` | Published, active, approved, student passed |
| `--warning` | `bg-warning`, `text-warning` | Draft, pending review, upcoming, in-progress |
| `--info` | `bg-info`, `text-info` | Informational tooltips, metadata callouts |
| `--destructive` | `bg-destructive`, `text-destructive` | Inactive, deleted, student failed, error |

### Text-on-Tint Tokens (AA-Compliant)

> **Critical rule:** Do NOT use `text-success`, `text-warning`, `text-info`, `text-destructive`, or `text-subject-*` directly on their corresponding `/10` tinted backgrounds. These pairings fail WCAG AA contrast. Use the dedicated `-text-on-tint` tokens instead.

| Token | Tailwind Class | Use Case |
|:---|:---|:---|
| `--warning-text-on-tint` | `text-warning-text-on-tint` | Badge text on `bg-warning/10` backgrounds |
| `--info-text-on-tint` | `text-info-text-on-tint` | Badge text on `bg-info/10` backgrounds |
| `--subject-quant-text-on-tint` | `text-subject-quant-text-on-tint` | Label on `bg-subject-quant/10` |
| `--subject-english-text-on-tint` | `text-subject-english-text-on-tint` | Label on `bg-subject-english/10` |
| `--subject-ga-text-on-tint` | `text-subject-ga-text-on-tint` | Label on `bg-subject-ga/10` |
| `--subject-reason-text-on-tint` | `text-subject-reason-text-on-tint` | Label on `bg-subject-reason/10` |
| `--subject-science-text-on-tint` | `text-subject-science-text-on-tint` | Label on `bg-subject-science/10` |

> **Note for `success` and `destructive`:** The base `text-success` and `text-destructive` tokens are already dark enough to pass AA on their `/10` tints — no separate `-text-on-tint` token is needed for these two.

### Sidebar Tokens (Isolated)

The sidebar has its own token family so it can be independently styled without affecting the main content area.

**Light Mode:** Solid white panel with warm grey border (Notion/Craft approach).
**Dark Mode:** Deep navy panel, consistent with the overall dark palette.

| CSS Variable | Tailwind Class | Light Value | Dark Value |
|:---|:---|:---|:---|
| `--sidebar` | `bg-sidebar` | `oklch(1 0.002 85)` — white panel | `oklch(0.12 0.04 265)` — deep navy |
| `--sidebar-foreground` | `text-sidebar-foreground` | `oklch(0.25 0.03 265)` — dark navy | `oklch(0.90 0.02 265)` — near-white |
| `--sidebar-primary` | `bg-sidebar-primary` | `oklch(0.52 0.26 265)` — brand indigo | `oklch(0.60 0.20 265)` |
| `--sidebar-primary-foreground` | `text-sidebar-primary-foreground` | `oklch(1 0 0)` — white | `oklch(0.13 0.03 265)` — dark |
| `--sidebar-accent` | `bg-sidebar-accent` | `oklch(0.94 0.01 265)` — hover tint | `oklch(0.20 0.04 265)` |
| `--sidebar-accent-foreground` | `text-sidebar-accent-foreground` | `oklch(0.25 0.03 265)` | `oklch(0.90 0.02 265)` |
| `--sidebar-border` | `border-sidebar-border` | `oklch(0.85 0.01 85)` — warm grey | `oklch(0.23 0.04 265)` |

### Chart Tokens

For all analytics dashboards and Recharts data visualizations.

> **Important:** Chart hues are intentionally disjoint from both the `--primary` brand hue and all `--subject-*` hues to prevent false visual associations. Do not adjust these to match brand colors.

| Token | Usage in Admin |
|:---|:---|
| `--chart-1` | Primary data series (e.g., total attempts) |
| `--chart-2` | Secondary series (e.g., correct answers) |
| `--chart-3` | Tertiary series (e.g., incorrect answers) |
| `--chart-4` | Quaternary series (e.g., skipped) |
| `--chart-5` | Quinary series (e.g., pass rate) |

---

## 5. Subject Color System

The SSC exam has 5 core subjects. Each subject gets a **dedicated, non-primary color**. Subject colors use the OKLCH hue wheel to ensure perceptual uniformity — no one subject feels visually heavier than another.

```
Subject → Token           → Primitive Color
─────────────────────────────────────────────────────────
Quantitative Aptitude   → --subject-quant   → oklch(0.72 0.17 55)    Amber/Orange
English Language        → --subject-english → oklch(0.62 0.15 240)   Sky Blue
General Awareness       → --subject-ga      → oklch(0.58 0.18 295)   Violet/Purple
Reasoning               → --subject-reason  → oklch(0.63 0.15 155)   Emerald Green
General Science         → --subject-science → oklch(0.60 0.15 205)   Cyan/Teal
```

### How to Use Subject Colors

```tsx
// ✅ Correct — subject badge on a question card
<span className="bg-subject-quant/10 text-subject-quant-text-on-tint rounded-full px-2 py-0.5 text-xs font-medium">
  Quantitative Aptitude
</span>

// ✅ Correct — subject icon in a table
<div className="h-8 w-8 rounded-lg bg-subject-english/10 flex items-center justify-center">
  <BookOpenIcon className="text-subject-english-text-on-tint h-4 w-4" />
</div>

// ❌ Wrong — using the base token as text on its own tint (fails WCAG AA)
<span className="bg-subject-quant/10 text-subject-quant">
  Quantitative Aptitude
</span>
```

### Rules for Subject Colors

- **Only use them for subject identification** — not for arbitrary decoration
- **Never use raw palette classes** for subjects (`text-amber-600`, `text-sky-500`)
- **Always use `-text-on-tint` variant** for text/icons on `/10` tinted backgrounds
- **Respect the `/10` tint standard** for backgrounds
- **Dark mode values** are defined in `index.css` — do not override manually

---

## 6. Semantic Status Colors

Never use raw Tailwind palette classes for operational states.

| State | Wrong ❌ | Correct ✅ |
|:---|:---|:---|
| Published / Active | `text-emerald-600 bg-emerald-500/10` | `text-success bg-success/10` |
| Draft / Pending Review | `text-amber-600 bg-amber-500/10` | `text-warning-text-on-tint bg-warning/10` |
| Informational callout | `text-blue-600 bg-blue-500/10` | `text-info-text-on-tint bg-info/10` |
| Inactive / Deleted | `text-rose-600 bg-rose-500/10` | `text-destructive bg-destructive/10` |
| Secondary / Disabled | `text-slate-500 bg-slate-100` | `text-muted-foreground bg-muted` |

### Content Lifecycle Status Reference

| `isActive` Value | Status Label | Token |
|:---|:---|:---|
| `true` | Published / Active | `text-success bg-success/10` |
| `false` | Inactive / Archived | `text-destructive bg-destructive/10` |
| Draft state | Draft | `text-warning-text-on-tint bg-warning/10` |

---

## 7. Typography System

### Font Stack

```css
/* index.html — Google Fonts preload */
Inter: weights 300–800 (body, UI)
Plus Jakarta Sans: weights 600–800 (display headings)

/* src/index.css @theme */
--font-sans:    "Inter", ui-sans-serif, system-ui, sans-serif;
--font-display: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;

/* src/index.css @layer base */
body {
  font-family: var(--font-sans);
  font-size: 14px; /* Standard admin dense size */
}
h1, h2 {
  font-family: var(--font-display); /* Plus Jakarta Sans for headings */
}
```

- **Inter** — primary UI font. Clear, neutral, optimized for data-dense interfaces.
- **Plus Jakarta Sans** — display headings (`h1`, `h2`). Adds warmth and brand personality without sacrificing readability.

### Type Scale

| Token | Size | Weight | Use |
|:---|:---|:---|:---|
| `text-xs` | 12px | 500 | Label/Meta: Captions, table footnotes, help text |
| `text-sm` | 14px | 400/500 | Body/UI: Table body, form labels, badge text (90% of UI) |
| `text-base` | 16px | 600 | Subheading: Card titles, section headings |
| `text-xl` | 20px | 600 | Page titles |
| `text-2xl` | 24px | 700 | **Exception:** Only inside StatCard/metric components |
| `text-3xl+` | N/A | N/A | **Banned.** Do not use in admin UI. |

### Math & Question Formatting

```tsx
// Question option with numerical value
<span className="font-mono text-sm">(A) 144</span>

// LaTeX rendering — ALWAYS use QuestionRenderer, never custom parsers
import { QuestionRenderer } from "@/components/ui/question-renderer";
<QuestionRenderer content={htmlString} />
```

---

## 8. Layout System: Floating Panels

The admin shell uses a **floating panel layout** where each major UI zone is its own independently rounded, bordered card floating over the page background.

### Panel Structure

```
bg-background (warm ivory canvas) — fills the entire screen
  └── app-shell-floating (p-3 gap-3 flex h-screen)
        ├── aside.sidebar-floating        ← Sidebar panel
        └── div (flex-col gap-3 flex-1)
              ├── header.navbar-floating  ← Top navbar panel
              └── div.content-floating   ← Main content panel
```

### Floating Panel Utilities

Defined in `src/index.css` under `@layer utilities`:

| Class | Applied to | Styles |
|:---|:---|:---|
| `app-shell-floating` | Root layout wrapper | `p-3 gap-3 flex h-screen` |
| `sidebar-floating` | `<aside>` | `rounded-xl border border-sidebar-border overflow-hidden shrink-0` |
| `navbar-floating` | `<header>` | `rounded-xl border border-border bg-card flex-shrink-0` |
| `content-floating` | Main content `<div>` | `rounded-xl border border-border/80 bg-card flex-1 overflow-auto` |

### Sidebar Sizing

- **Expanded:** `w-64` (256px) — icon + label
- **Collapsed:** `w-16` (64px) — icon only, with tooltip on hover
- **State:** Persisted in `localStorage` key `ssc-admin-sidebar-collapsed`
- **Mobile:** Hidden on `< md`. A `Sheet` drawer (shadcn) is opened via a hamburger button in the navbar.

### Active Nav Item Pattern

```tsx
// Active item uses sidebar-nav-active class — defined in index.css
// Pattern: 10% primary tint bg + left accent stripe + primary text color
<Link className="sidebar-nav-active">Dashboard</Link>

// Inactive item
<Link className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
  Users
</Link>
```

---

## 9. The Golden Rules for Developers

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

### Rule 3: Use `-text-on-tint` tokens for text on tinted backgrounds

```tsx
// ❌ Fails WCAG AA — base token is too light on its own tint
<span className="bg-warning/10 text-warning">Draft</span>

// ✅ Passes AA — dedicated dark token for legibility on tint
<span className="bg-warning/10 text-warning-text-on-tint">Draft</span>
```

### Rule 4: Subject colors are for subject identification only

```tsx
// ❌ Wrong — using subject color as generic decoration
<div className="text-subject-quant font-bold">Section Title</div>

// ✅ Correct — subject color tied to subject identity, with -text-on-tint
<Badge className="bg-subject-quant/10 text-subject-quant-text-on-tint">
  Quantitative Aptitude
</Badge>
```

### Rule 5: No decorative gradients on operational pages

Gradients belong on the student client app and landing pages. The admin interface must be **flat, focused, and scannable**. No `gradient-to-br`, no `blur-xl` decorative circles, no glassmorphism on data-dense surfaces.

### Rule 6: All interactive elements must have visible focus rings

```tsx
// ❌ Kills keyboard accessibility
<button className="outline-none">...</button>

// ✅ Replaces with accessible ring
<button className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  ...
</button>
```

### Rule 7: Elevation uses borders exclusively (The Great Flattening)

The "Great Flattening" dictates that elevation must come from borders, not shadows. To maintain a highly structured, corporate EdTech aesthetic (like Coursera or modern `shadcn/ui`), we strictly forbid decorative drop shadows on cards and layout containers.
- **Light mode:** Cards at `bg-card` (white) sit over `bg-background` (white) or `bg-muted` (slate). Primary separation comes exclusively from `border-border` (1px solid). No `shadow-md` or `shadow-sm` on structural elements. Drop shadows are reserved *only* for floating interactive elements like popovers and dropdowns.
- **Dark mode:** Cards at `oklch(0.18)` over background `oklch(0.15)`. `border-border` does 100% of the elevation work.

### Rule 8: Use QuestionRenderer for any LaTeX content

```tsx
// ❌ Never use dangerouslySetInnerHTML for math content
<div dangerouslySetInnerHTML={{ __html: question.content }} />

// ✅ Always use QuestionRenderer — handles KaTeX, hydration, and styling
import { QuestionRenderer } from "@/components/ui/question-renderer";
<QuestionRenderer content={question.content} />
```

---

## 10. Common Mistakes and How to Fix Them

### Mistake: Page canvas doesn't switch to dark mode

**Cause:** `bg-white` or `bg-slate-50` hardcoded on the layout.

**Fix:** Replace `bg-white` → `bg-background`, `bg-slate-50` → `bg-muted/40`.

---

### Mistake: Difficulty badge looks wrong in dark mode

**Cause:** Raw palette used — `text-green-600 bg-green-100`.

**Fix:**
```tsx
const difficultyStyles = {
  EASY:   'bg-success/10 text-success',
  MEDIUM: 'bg-warning/10 text-warning-text-on-tint',
  HARD:   'bg-destructive/10 text-destructive',
};
```

---

### Mistake: Subject badge text is too low-contrast

**Cause:** Using `text-subject-quant` on `bg-subject-quant/10` — the base token is a mid-chroma value that fails AA on its own tint.

**Fix:** Use `text-subject-quant-text-on-tint` for any text/icon on a `bg-subject-*/10` surface.

---

### Mistake: Subject filter shows wrong color after theme change

**Cause:** Subject color defined inline as `style={{ color: '#f59e0b' }}`.

**Fix:** Use subject token classes with a constant mapping:

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

### Mistake: Analytics chart colors don't match the UI

**Cause:** Recharts `fill` prop using hex strings.

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

## 11. Audit Checklist

Use on every PR touching the admin UI:

```
[ ] No hardcoded hex colors in JSX className or style props
[ ] No raw Tailwind palette classes (emerald, amber, rose, indigo, slate, zinc, sky...)
[ ] No dark: variant used alongside semantic tokens
[ ] Status labels use success / warning-text-on-tint / info-text-on-tint / destructive tokens
[ ] Difficulty badges use success (easy) / warning-text-on-tint (medium) / destructive (hard)
[ ] Subject colors use --subject-*-text-on-tint for text on /10 tint backgrounds
[ ] Text on primary backgrounds uses text-primary-foreground
[ ] Chart data uses --chart-1 through --chart-5
[ ] Sidebar items use sidebar-* token family
[ ] No outline-none without a focus-visible ring replacement
[ ] No decorative gradients or blur-xl circles on operational pages
[ ] Dark mode tested by toggling class="dark" on <html>
[ ] QuestionRenderer used for all LaTeX/math content
```

---

## 12. Accessibility Contract

### Text Contrast Requirements (WCAG 2.1 AA)

| Use Case | Minimum Ratio | Status |
|:---|:---|:---|
| Normal text (< 18px) | 4.5:1 | ✅ All semantic token pairs verified |
| Large text (≥ 18px bold) | 3:1 | ✅ Manually verified per component |
| UI components and icons | 3:1 | ✅ Semantic tokens provide sufficient contrast |

#### Key verified pairs (2026-08-09)

| Pair | Ratio | Result |
|:---|:---|:---|
| `sidebar-foreground` on `sidebar` (light) | ~14:1 | ✅ AAA |
| `sidebar-foreground` on `sidebar` (dark) | ~12:1 | ✅ AAA |
| `sidebar-primary-foreground` on `sidebar-primary` (light active) | ~8.5:1 | ✅ AAA |
| `sidebar-primary-foreground` on `sidebar-primary` (dark active) | ~5.2:1 | ✅ AA |
| `warning-text-on-tint` on `warning/10` | ~10.4:1 | ✅ AAA |
| `info-text-on-tint` on `info/10` | ~8.2:1 | ✅ AAA |
| `primary-foreground` on `primary` (dark mode) | ~6.8:1 | ✅ AA |

### Touch Targets

Admin is primarily a desktop interface, but tablet support is required.

| Element | Minimum Size | Status |
|:---|:---|:---|
| Primary action buttons | 40 × 36px | ✅ Enforced via `h-9`/`h-10` Button variants |
| Icon-only action buttons | 36 × 36px | ⚠️ Audit required — some use `h-8 w-8` |
| Table row actions | 32px height minimum | ⚠️ Compact table density needs review |
| Sidebar nav items | 40px height minimum | ✅ Enforced via padding |

### Reduced Motion

```css
/* Already in src/index.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Status:** ✅ Implemented.

---

## 13. Component Token Contracts

| Component | Allowed Tokens | Forbidden |
|:---|:---|:---|
| `Button` (primary) | `--primary`, `--primary-foreground`, `--ring` | Raw palette |
| `Button` (destructive) | `--destructive`, `--destructive-foreground` | `rose-*`, `red-*` |
| `Badge` (content status) | `--success`, `--warning-text-on-tint`, `--destructive` | `emerald-*`, `amber-*` |
| `Badge` (difficulty) | `--success` (easy), `--warning-text-on-tint` (medium), `--destructive` (hard) | Raw palette |
| `Badge` (subject) | `--subject-*-text-on-tint` on `bg-subject-*/10` | Raw palette, `--primary` |
| Sidebar nav items | `--sidebar-*` family only | `--primary` directly |
| Card surfaces | `--card`, `--card-foreground`, `--border` | `bg-white`, `bg-zinc-*` |
| Charts | `--chart-1` through `--chart-5` | Raw palette, hex strings |
| Input fields | `--input`, `--ring`, `--border`, `--destructive` | Raw palette |
| Dialog / Modal | `--popover`, `--border`, `--muted` | Brand tokens |
| Skeleton loaders | `--muted` | Raw palette |
| Math content | `QuestionRenderer` component | `dangerouslySetInnerHTML`, custom parsers |

---

## 14. Enforcement & Tooling

### ESLint Rule: No Raw Palette Classes

```javascript
// eslint.config.js
{
  rules: {
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'Literal[value=/\\b(bg|text|border|ring|fill|stroke)-(slate|zinc|gray|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/]',
        message:
          '[Theme] Raw Tailwind palette class detected. Use semantic tokens (bg-primary, text-success, bg-muted, text-subject-quant-text-on-tint) instead. See docs/frontend-and-ux/2026-07-26-theme-system/theme-system.md.',
      },
    ],
  },
}
```

### Grep Audit Commands

```bash
# Find all raw palette class violations
grep -rn '\(bg\|text\|border\)-\(emerald\|amber\|rose\|indigo\|slate\|zinc\|blue\|green\|red\)' src/

# Find hardcoded hex colors in JSX
grep -rn '#[0-9a-fA-F]\{3,6\}' src/ --include='*.tsx' --include='*.ts'

# Find any inline style color overrides
grep -rn 'style=.*color' src/ --include='*.tsx'

# Find subject token misuse (base token on tinted bg)
grep -rn 'text-subject-\(quant\|english\|ga\|reason\|science\)[^-]' src/ --include='*.tsx'
```

### Component Documentation (Storybook)

All new UI components added to `src/components/ui/` **MUST** be documented in Storybook.
- **Colocation:** Create a `.stories.tsx` file directly next to the component (e.g., `error-state.stories.tsx`).
- **Variants:** Ensure you document all major states (e.g., Default, Active, Disabled, Error).
- **Run local:** `npm run storybook`

---

## 15. Governance & Ownership

### Token Ownership

| Token Family | Owner | Change Requires |
|:---|:---|:---|
| Core structural tokens | Platform UI lead | Full team sign-off |
| Semantic status tokens | Platform UI lead | UI lead approval |
| Text-on-tint tokens (`--*-text-on-tint`) | Platform UI lead | UI lead approval |
| Subject color tokens (`--subject-*`) | Platform UI lead | UI lead approval |
| Sidebar tokens | Platform UI lead | UI lead approval |
| Chart tokens | Feature team | UI lead review |

### Adding a New Token

1. Open a GitHub Discussion titled `[Token RFC] --token-name`
2. State the problem — why no existing token is sufficient
3. Propose the name — follow `--{category}-{modifier}` convention
4. Propose OKLCH values for light and dark mode, with contrast ratios
5. Identify all consumers (components that will use it)
6. UI lead approves → merged into `index.css`

---

## Related Documents

- [UX/UI Guidelines (Admin)](../2026-07-26-ux-ui-guidelines/ux-ui-guidelines.md) — Page layouts, component patterns, interaction conventions
- [UX Architecture & Standards](../2026-08-03-ux-architecture-and-standards/ux-ui-guidelines.md) — Design paradigms, grid system, card anatomy
- [Global Enums Reference](../../database-and-schema/2026-07-26-global-enums/global-enums.md) — Status values and subject enums from the API
- [Master Progress Tracker](../../progress-and-planning/2026-07-26-master-progress-tracker/progress-tracker.md) — Phase status
