# Core Admin Web Architecture

**Date:** 2026-07-26
**Status:** 🔴 Planned
**Author:** CVS Charan

---

## Context

The `ssc-admin-web` is the internal dashboard used by `ADMIN` and `SUPER_ADMIN` roles to manage all platform content — subjects, chapters, lessons, questions, practice sets, mock tests — and to view student analytics.

---

## Decisions

### Stack Decisions
- **Framework:** React via Vite (Note: `ssc-client` uses Next.js, while this admin repo is strictly Vite).
- **State Management:** Zustand (for global UI state) & React Query (for server state and caching).
- **API Client:** Axios with typed wrappers matching the `ssc-api` route contract.
- **UI Library:** Tailwind CSS combined with accessible shadcn/ui components (strictly adhering to our semantic token system).
- **Auth:** Store JWT access token in memory; refresh token in httpOnly cookie (handled by API).

---

## Key Screens (Planned)

| Screen | Role |
|---|---|
| Dashboard / Analytics Overview | ADMIN, SUPER_ADMIN |
| Subject Management | ADMIN, SUPER_ADMIN |
| Chapter & Lesson Management | ADMIN, SUPER_ADMIN |
| Question Bank (CRUD + Bulk Import) | ADMIN, SUPER_ADMIN |
| Practice Set Builder | ADMIN, SUPER_ADMIN |
| Mock Test Builder | ADMIN, SUPER_ADMIN |
| Student Management | SUPER_ADMIN |
| Admin Management | SUPER_ADMIN |
| Leaderboard View | ADMIN, SUPER_ADMIN |

---

## Consequences

*(To be documented after architecture is finalized)*
