# Phase 4 Roadmap: Operational Excellence (Admin Web)

**Date:** 2026-08-12  
**Status:** 🟡 In Progress  
**Last Updated:** 2026-08-12

With MVP features (Phases 1–11) complete, `ssc-admin-web` is now in a production-readiness sprint focused on error handling, UX polish, and operational stability.

---

## 1. ✅ UX Polish: Completed

### 1a. Question Editor Enhancements
**Status:** ✅ Complete

- Added `pyqYear`, `pyqShift`, `pyqDate` fields to Question Editor for granular PYQ metadata tracking.
- Upgraded `distractorRationale` (Trap Explanation) to use `<RichTextEditor />` with full KaTeX math support.

### 1b. Token Refresh Queue
**Status:** ✅ Complete

Axios interceptor now queues all concurrent requests during a token refresh cycle, preventing race conditions and duplicate 401 redirects on SPA page loads.

---

## 2. ✅ Error Handling: Industry Standard Implementation

**Status:** ✅ Complete (2026-08-16)

### Current State (Problems Identified)
- Only `Dashboard.tsx` checks `isError` from React Query. All other 13+ pages skip it entirely.
- When checked, error state renders plain text: `<div>Error loading data...</div>`
- No retry mechanism — user must hard-refresh the browser to recover from API failures.

### Target State (Industry Best Practice)

#### 2a. Create `<ErrorState />` Component
**[NEW]** `src/components/ui/error-state.tsx`

Reusable error UI card component with:
- `icon` prop (default: `ServerCrash` from lucide-react)
- `title` and `description` props
- `onRetry?: () => void` — renders a "Try Again" button that calls React Query's `refetch()`
- Follows "Great Flattening" design paradigm (flat card, `rounded-xl`, semantic tokens only)

#### 2b. Add `isError` + `<ErrorState onRetry={refetch} />` to all pages

All pages using `useQuery` must follow this pattern:
```tsx
// BEFORE
if (isError) return <div>Error loading data...</div>;

// AFTER
if (isError) return (
  <ErrorState
    title="Failed to load questions"
    description="There was a problem connecting to the server."
    onRetry={() => refetch()}
  />
);
```

**Pages to fix:**

| Page | Fix |
|---|---|
| `pages/Dashboard.tsx` | Replace plain text with `<ErrorState onRetry={refetch} />` |
| `pages/subjects/index.tsx` | Add `isError` check + `<ErrorState />` |
| `pages/chapters/index.tsx` | Same |
| `pages/lessons/index.tsx` | Same |
| `pages/mockTests/index.tsx` | Same |
| `pages/mockTests/editor.tsx` | Same |
| `pages/mockTests/builder.tsx` | Same |
| `pages/products/index.tsx` | Same |
| `pages/products/builder.tsx` | Same |
| `pages/products/editor.tsx` | Same |
| `pages/users/index.tsx` | Same |
| `pages/feedback/index.tsx` | Same |
| `pages/purchases/index.tsx` | Same |
| `pages/categories/index.tsx` | Same |
| `pages/articles/index.tsx` | Same |

---

## 3. ✅ Feature Additions (Pillar 2 & 3)

**Status:** ✅ Complete (2026-08-16)

### 3a. Exam & Syllabus Builder
- Built `/exams` page with full `TargetExam` CRUD (list, create, edit, delete).
- Built `/exams/:id/syllabus` recursive `SyllabusNode` tree editor — supports nested sections/topics.
- Syllabus is versioned by `year` and linked to a specific `TargetExam`.

### 3b. System Health Dashboard
- Built `/system-health` page with real-time metrics (auto-refreshes every 5s).
- Displays CPU load averages (1m/5m), system memory, Node.js heap usage, API latency, DB and Redis liveness status.
- Created `src/api/health.ts` client; registered route in `App.tsx`.

---

## 4. Future: Quality & Tooling

- **E2E Testing (Playwright):** Core admin flows — Create Question, Publish Practice Set, Manage Feedback.
- **Sentry Integration:** Real-time frontend error tracking and alerting.
- **Storybook:** Component documentation for the design system.
- **CI/CD (GitHub Actions):** Enforce `tsc -b` + `eslint` + `vitest` on all pull requests.
- **Hindi Content Workflow:** If client app supports bilingual i18n, admin needs simultaneous EN/HI input fields for Questions and Lessons.
