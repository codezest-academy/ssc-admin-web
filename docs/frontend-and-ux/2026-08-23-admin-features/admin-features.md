# Admin Web Features — Page Reference

**Date:** 2026-08-23  
**Status:** ✅ Implemented  
**Applies to:** `ssc-admin-web`

This document details the administrative pages and features available in the SSC Admin Web Portal, covering their purpose, access control, and integration details.

---

## 1. Purchases Page
**Route:** `/purchases`  
**Location:** `src/pages/purchases/index.tsx`

**Overview:**
Displays a comprehensive list of all student transactions, subscriptions, and product sales. 

**Features:**
- **Metrics Widget:** Displays Total Revenue (sum of all `SUCCESS` transactions).
- **Data Table:** Shows Date, Student Details (Name, Email), Product (Name, Type), Amount Paid, Reference ID, and Status (Success, Pending, Failed).
- **Search & Filtering:** Client-side search filters by student name, email, product name, or payment reference ID.

**API Integration:**
- Calls `GET /purchases` (via `getAllPurchases` in `@/api/purchases`).

---

## 2. Staff Management Page
**Route:** `/staff`  
**Location:** `src/pages/staff/index.tsx`

**Overview:**
Allows `SUPER_ADMIN` and `ADMIN` users to manage administrative accounts. It filters out users with the `STUDENT` role, displaying only `ADMIN`, `SUPER_ADMIN`, and `STAFF`.

**Features:**
- **Role Management:** Change user roles between `ADMIN`, `STAFF`, and `STUDENT` (which effectively removes their admin access). `SUPER_ADMIN` accounts cannot be demoted via the UI.
- **Access Control:** Toggle user status (Activate / Deactivate). Deactivated staff cannot log into the admin portal.
- **Data Table:** Displays Name, Email, Role badge, Status badge, and Join date.

**API Integration:**
- `GET /users` (Filtered client-side for non-students)
- `PATCH /users/:id/role` (`updateUserRole`)
- `PATCH /users/:id/status` (`toggleUserStatus`)

---

## 3. System Health Dashboard
**Route:** `/system-health`  
**Location:** `src/pages/system-health/index.tsx`

**Overview:**
Real-time monitoring dashboard for backend infrastructure and APIs. 

**Features:**
- **Auto-Refresh:** Metrics are fetched every 5 seconds (`refetchInterval: 5000`).
- **Metrics Displayed:** Memory usage, uptime, active connections, database health, etc. (Detailed metrics depend on the `healthApi.getMetrics` payload).

**API Integration:**
- Calls the `/health` or `/metrics` endpoint via `healthApi.getMetrics`.

---

## 4. Feedback Inbox
**Route:** `/feedback`  
**Location:** `src/pages/feedback/index.tsx`

**Overview:**
Inbox for managing user-submitted feedback, including bug reports (Issues), feature requests, and testimonials.

**Features:**
- **Filtering:** Filter table by feedback type (`ALL`, `ISSUE`, `FEATURE_REQUEST`, `TESTIMONIAL`).
- **Triage:** Inline dropdown to change status (`OPEN`, `RESOLVED`, `IGNORED`).
- **Marketing Approval:** Toggle `isPublic` state for `TESTIMONIAL` feedback to approve them for display on the marketing site.

**API Integration:**
- `GET /feedback` (with optional `?type=` query param)
- `PATCH /feedback/:id` (updating status or isPublic)

---

## 5. Exam Notifications / Job Alerts Page
**Route:** `/notifications`  
**Location:** `src/pages/notifications/index.tsx`

**Overview:**
Full CRUD interface for managing Exam Notifications (Job Alerts) that surface to students on their dashboard and public SEO pages.

**Features:**
- **Creation & Editing Form:** Fields for Title, Organization, Vacancies, Notification Link, Logo URL, Application Start/End Dates.
- **Visibility Toggle:** `isActive` checkbox controls whether the alert is visible to students.
- **Data Table:** Lists all notifications with their current status and deadline.

**API Integration:**
- `GET /notifications?all=true`
- `POST /notifications`
- `PATCH /notifications/:id`
- `DELETE /notifications/:id`
