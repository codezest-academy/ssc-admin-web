# UX/UI Guidelines — Admin Web

**Date:** 2026-07-26
**Updated:** 2026-08-09
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

`--primary = oklch(0.52 0.26 265)` → **CodeZest Royal Indigo**

Used for: active sidebar nav, primary CTA buttons, focus rings.
*Why Indigo?* It promotes focus, calm, and professional trust—essential for long study/admin sessions.

**Red (`--destructive`) = danger/error only:** Delete, logout, error states, inactive badges, and incorrect answers.
*Why not Red primary?* Red causes visual fatigue over long periods and signals "incorrect" in an exam context, which induces anxiety. Keep it strictly semantic.

### 60-30-10 Rule

- **60%** — Neutral surfaces: `bg-background`, `bg-card`, `bg-sidebar`
- **30%** — Structure: `text-foreground`, `border-border`, `bg-muted`
- **10%** — Brand accent: `bg-primary`, `text-primary` — CTAs and active states only

See `theme-system.md` for full token reference and the new "Academy Warm" palette constraints.

---

## Spacing Grid System

Admin relies on a **strict 8-point grid** to maintain horizontal and vertical rhythm.

- **Allowed values:** `8px`, `16px`, `24px`, `32px`, `48px`, `64px` etc. (e.g., `p-2`, `m-4`, `gap-6`).
- **Half-Step Exception:** `4px` (`p-1`, `gap-1`) is the **only permitted half-step**. Use it strictly for tight inline spacing, such as icon-to-text gaps within buttons or badge internal padding.
- **Banned:** All other off-grid values (`p-3`, `gap-5`, `m-7`) and arbitrary values (`p-[13px]`) are globally banned via ESLint. This prevents the UI from becoming disjointed.

---

## Layout Conventions

### Admin Shell: Floating Panels

The entire layout leverages floating panels for crisp visual separation.

- **App Shell**: `app-shell-floating` wraps the viewport with `p-3 gap-3 flex h-screen` and `bg-background` (warm ivory).
- **Sidebar**: `sidebar-floating`. Solid white panel (`bg-sidebar`), clear border (`border-sidebar-border`). Expanded = 256px (`w-64`). Collapsed = 64px (`w-16`). Persists in `localStorage` (`ssc-admin-sidebar-collapsed`).
- **Navbar**: `navbar-floating`. Top-right floating bar (`h-14`) containing search, mode toggle, bell, and avatar.
- **Main Content**: `content-floating`. Flex-1 scrollable pane holding the core page views.
- **Mobile**: Sidebar becomes a `Sheet` component triggered by a hamburger menu in the navbar.

### Tables vs Cards

| Pattern | When |
|---|---|
| **Table** | Dense admin data: Questions, Users, Attempts |
| **Card Grid** | Groupings: Subjects |
| **Single Card** | Editors, builders |

### Backgrounds & Gradients

- **No Ambient Gradients:** Ambient decorative gradients are **strictly forbidden** in the Admin UI.
- **Flat Panels:** Rely on background colors (`bg-card`, `bg-sidebar`) and subtle borders, not shadows or gradients, for visual separation.

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

- All animations must respect `prefers-reduced-motion: reduce`.
- The global `index.css` sets all animation durations to `0.01ms` when this flag is detected. Ensure custom keyframes do not override this accessibility safeguard.

### Status Badges (Text on Tint)

Always use the `-text-on-tint` tokens for text sitting on a `/10` tinted background.

```
EASY   → bg-success/10 text-success
MEDIUM → bg-warning/10 text-warning-text-on-tint
HARD   → bg-destructive/10 text-destructive
active → bg-success/10 text-success
inactive → bg-destructive/10 text-destructive
```


## 7. Error Handling & Feedback Collection (Industry Best Practices)

To minimize friction and maximize telemetry context, our application must adhere to the following standards:

### 7.1 Zero-Friction Crash Reporting
When a fatal error occurs (Error Boundaries), the user is inherently frustrated.
- **Rule:** Provide an **immediate, inline text area** asking, "Help us fix this. What were you doing right before the crash?"
- **Banned:** Hiding the feedback form behind a "Click here to report" button or modal.
- **Telemetry:** Silently capture the route path, error fingerprint, and stack trace alongside the user's message. Never ask the user for technical details.

### 7.2 Omnipresent Support Widget
For non-fatal issues (e.g., content typos, feature suggestions), users must be able to report issues from anywhere.
- **Rule:** Utilize a Floating Action Button (FAB) anchored to the bottom-right corner of the screen (`fixed bottom-6 right-6`).
- **Interaction:** The FAB should open a lightweight popover offering categorized feedback (e.g., "Report Bug", "Suggest Feature") mapped to our backend `FeedbackType` enum.
- **Context:** Submissions must retain the current page's URL context automatically.
