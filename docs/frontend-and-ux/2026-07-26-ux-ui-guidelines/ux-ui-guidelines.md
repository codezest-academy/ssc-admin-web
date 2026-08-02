# UX/UI Guidelines — Admin Web

**Date:** 2026-07-26
**Updated:** 2026-07-28
**Status:** 🟢 Active
**Author:** CVS Charan

---

## Purpose

Defines the design principles, component conventions, and interaction patterns for the `ssc-admin-web` dashboard.

---

## Design Principles

1. **Clarity over cleverness** — Admin users need to work fast. Prioritize scannable tables, clear labels, and obvious actions.
2. **Consistent feedback** — Every action (create, update, delete) must show a toast/notification with success or error.
3. **Progressive disclosure** — Complex forms (e.g. Mock Test builder with sections + questions) should use step-by-step wizards.
4. **Role-aware UI** — Hide or disable controls that the current role cannot access. Never rely on the backend alone.

---

## Color & Theme

### Primary Brand Color

`--primary = oklch(0.55 0.20 275)` → **CodeZest Indigo**

Used for: active sidebar nav, primary CTA buttons, focus rings.
*Why Indigo?* It promotes focus, calm, and professional trust—essential for long study/admin sessions.

**Red (`--destructive`) = danger/error only:** Delete, logout, error states, inactive badges, and incorrect answers.
*Why not Red primary?* Red causes visual fatigue over long periods and signals "incorrect" in an exam context, which induces anxiety. Keep it strictly semantic.

### 60-30-10 Rule

- **60%** — Neutral surfaces: `bg-background`, `bg-card`, `bg-sidebar`
- **30%** — Structure: `text-foreground`, `border-border`, `bg-muted`
- **10%** — Brand accent: `bg-primary`, `text-primary` — CTAs and active states only

See `theme-system.md` for full token reference.

---

## Spacing Grid System

Admin relies on a **strict 8-point grid** to maintain horizontal and vertical rhythm.

- **Allowed values:** `8px`, `16px`, `24px`, `32px`, `48px`, `64px` etc. (e.g., `p-2`, `m-4`, `gap-6`).
- **Half-Step Exception:** `4px` (`p-1`, `gap-1`) is the **only permitted half-step**. Use it strictly for tight inline spacing, such as icon-to-text gaps within buttons or badge internal padding.
- **Banned:** All other off-grid values (`p-3`, `gap-5`, `m-7`) and arbitrary values (`p-[13px]`) are globally banned via ESLint. This prevents the UI from becoming disjointed.

---

## Layout Conventions

### Admin Shell

- **Sidebar**: Collapsible. Expanded = 256px (icon + label). Collapsed = 64px (icon only + tooltip). State persisted in `localStorage` key `ssc-admin-sidebar-collapsed`.
- **Top Bar**: Sticky 64px. Contains search, mode toggle, bell, avatar dropdown.
- **Main Content**: `p-6`, `bg-muted/10`.

### Tables vs Cards

| Pattern | When |
|---|---|
| **Table** | Dense admin data: Questions, Users, Attempts |
| **Card Grid** | Groupings: Subjects |
| **Single Card** | Editors, builders |

### Backgrounds & Gradients

- **Grid Pattern:** When applying a subtle dot grid pattern (`bg-grid-pattern`) to admin backgrounds, the opacity must be capped at a **strict ceiling of 2–4%**. It must be visually tested against dense data (like the Question Bank table) to ensure it introduces zero visual noise.
- **Gradients:** Ambient decorative gradients are **strictly forbidden** in the Admin UI.

---

## Icon System (Standardized — Lucide React only)

### Navigation

| Route | Icon |
|---|---|
| Dashboard | `LayoutDashboard` |
| Users | `Users` |
| Subjects | `BookOpen` |
| Question Bank | `HelpCircle` |
| Practice Sets | `ClipboardList` |
| Mock Tests | `FileCheck` |
| Attempts / Analytics | `BarChart3` |

### Actions (same on every page)

| Action | Icon |
|---|---|
| Create | `Plus` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| View | `Eye` |
| Back | `ArrowLeft` |
| Save | `Save` |
| Bulk Import | `FileUp` |
| Filter | `SlidersHorizontal` |
| Search | `Search` |
| Loading | `Loader2` |
| Drag Handle | `GripVertical` |

### Content Type Icons

| Content | Icon |
|---|---|
| Video Lesson | `PlayCircle` |
| Article | `FileText` |
| PDF | `FileBadge` |
| Chapter | `Layers` |

---

## Component Conventions

### Dialogs / Modals

Create and Edit open a **Dialog modal**. Exceptions: Question Editor, Practice Set Builder (dedicated pages due to complexity).

### Animations & Reduced Motion

- All animations (such as the `animate-progress-stripe` progress bar) must respect `prefers-reduced-motion: reduce`.
- The global `index.css` sets all animation durations to `0.01ms` when this flag is detected. Ensure custom keyframes do not override this accessibility safeguard.

### Status Badges

```
EASY   → bg-success/10 text-success
MEDIUM → bg-warning/10 text-warning
HARD   → bg-destructive/10 text-destructive
active → bg-success/10 text-success
inactive → bg-destructive/10 text-destructive
```
