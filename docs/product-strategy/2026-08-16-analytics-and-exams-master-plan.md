# Master Specification: Analytics, Exams, & System Monitoring

This document serves as the comprehensive blueprint for the missing pillars of the platform. By documenting everything here, we can systematically track the required backend, admin, and client-side developments.

---

## Pillar 1: Advanced Analytics & Tracking (Industry Best Practices)

### 1.1 User Analytics (Student Progress)
**Goal:** Track student mastery, engagement, and performance over time.
*   **Backend Requirements:**
    *   API endpoint to fetch aggregated student performance: `/api/analytics/users/:userId`.
    *   Metrics required: Syllabus completion %, time spent per question, subject-wise percentiles, historical test score trend.
*   **Admin UI:**
    *   Add an "Analytics" tab to the User Details page (`/users/:id`).
    *   Visualizations: Radar chart for subject mastery, Line chart for score progression.
*   **Client UI:**
    *   "My Progress" dashboard showing the same metrics to the student.

### 1.2 Staff Analytics (Productivity & Quality)
**Goal:** Monitor content creator velocity and content quality.
*   **Backend Requirements:**
    *   Schema update: Ensure `createdBy` and `updatedBy` fields exist on Questions, Articles, Mock Tests, etc.
    *   API endpoint: `/api/analytics/staff/:staffId`.
    *   Metrics required: Weekly content creation counts, error/report rates on created content.
*   **Admin UI:**
    *   Add an "Analytics" tab to the Staff Details page (`/staff/:id`).
    *   Visualizations: Bar charts for weekly velocity, KPI cards for error rates.

### 1.3 Leadership Tracking (Leaderboards)
**Goal:** Contextual and time-bound leaderboards to motivate students.
*   **Backend Requirements:**
    *   API endpoint: `/api/leaderboard`.
    *   Query parameters: `timeframe` (weekly, monthly), `examId` (target exam context).
    *   Metrics: Standardized percentile scoring.
*   **Admin UI:**
    *   New `/leaderboard` page to view and moderate global and exam-specific rankings.
*   **Client UI:**
    *   New `/leaderboard` page where students can see their rank relative to peers for their Target Exam.

---

## Pillar 2: Target Exams & Syllabus Architecture

### 2.1 Backend Schema & APIs
**Goal:** Structure content around specific exams (e.g., SSC CGL, SSC CHSL) rather than generic subject buckets.
*   **Database Tables:**
    *   `TargetExam`: `id`, `name`, `description`, `isActive`.
    *   `SyllabusNode`: Mapping table linking `examId` -> `subjectId` -> `chapterId` with a `weightage` (importance factor).
*   **API Endpoints:**
    *   CRUD operations for `/api/exams`.
    *   Endpoints to fetch and modify the syllabus tree `/api/exams/:id/syllabus`.

### 2.2 Admin Portal UI (`ssc-admin-web`)
*   **Target Exams Management (`/exams`):** Data table to create, edit, and deactivate Target Exams.
*   **Syllabus Builder (`/exams/:id/syllabus`):** A visual drag-and-drop or tree-based UI to construct the syllabus by linking existing Subjects and Chapters to the Exam and assigning weightages.

### 2.3 Client Portal UI (`ssc-client`)
*   **Onboarding Flow:** New users must select their "Target Exam(s)" upon signup.
*   **Syllabus Tracker (`/syllabus`):** A dedicated page showing the official syllabus for their Target Exam, overlaid with their personal completion progress (e.g., "Quant: 40% Mastered").

---

## Pillar 3: System Health & Server Monitoring

### 3.1 Backend Requirements
**Goal:** Expose system health and performance metrics.
*   **API Endpoints:**
    *   `/api/health/metrics`: Expose CPU usage, Memory load, Active WebSocket connections, and Database connection pool status.
    *   `/api/health/latency`: Average API response times.

### 3.2 Admin Portal UI (`ssc-admin-web`)
*   **System Dashboard (`/system-health`):** A new page restricted to `SUPER_ADMIN`.
*   **Visualizations:** 
    *   Real-time line charts for CPU/Memory load.
    *   KPI cards for active users and current latency.
    *   Integration of the existing Crash Reports (`/errors/analytics`) into this centralized DevOps view.

## Pillar 4: Freemium Model & Marketing Hooks

### 4.1 Navbar "Upgrade" Button Logic
**Goal:** Promote subscriptions without annoying paying users.
*   **Target Audience:** The `Upgrade` button in the navbar (e.g., `FloatingNav.tsx`) should **ONLY** be displayed to users whose `subscriptionTier` is `FREE`.
*   **Implementation:** Wrap the `Upgrade` button logic with a check: `user.subscriptionTier === 'FREE'`. Users with `PRO` or `LIFETIME` tiers will have a cleaner navbar without the upsell.

### 4.2 Action Modals & Paywalls (Marketing Strategy)
**Goal:** Convert free users to paid users by intercepting high-value actions with context-aware marketing modals (Paywalls).
*   **When to trigger Action Modals:**
    1.  **Premium Mock Tests:** When a free user attempts to start a mock test marked as `isPremium`.
    2.  **Advanced Analytics Depth:** Free users can see basic stats (total tests, accuracy), but clicking into "Subject-wise Weaknesses" or "Historical Trends" triggers a paywall modal.
    3.  **Daily Limits (Freemium Hook):** Allow free users to use the "Daily 10-Min Target" or Custom Practice Generator *once* per day. If they try a second time, trigger an "Upgrade to unlock unlimited practice" modal.
*   **UI Implementation:**
    *   Create a reusable `<PaywallModal />` component.
    *   The modal should dynamically accept `featureName` and display the specific benefits they are missing out on (e.g., "Unlock Advanced Analytics with Pro").
