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

**Red (`--destructive`) = danger only:** Delete, logout, error states, inactive badges.

### 60-30-10 Rule

- **60%** — Neutral surfaces: `bg-background`, `bg-card`, `bg-sidebar`
- **30%** — Structure: `text-foreground`, `border-border`, `bg-muted`
- **10%** — Brand accent: `bg-primary`, `text-primary` — CTAs and active states only

See `theme-system.md` for full token reference.

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

### Status Badges

```
EASY   → bg-success/10 text-success
MEDIUM → bg-warning/10 text-warning
HARD   → bg-destructive/10 text-destructive
active → bg-success/10 text-success
inactive → bg-destructive/10 text-destructive
```
