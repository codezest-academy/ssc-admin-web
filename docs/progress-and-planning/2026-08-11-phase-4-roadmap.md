# Phase 4 Roadmap: Operational Excellence (Admin Web)

**Date:** 2026-08-11
**Status:** Planning

With the MVP features (Phases 1-12) completed, `ssc-admin-web` requires enhancements to ensure content teams can operate efficiently without bugs or downtime.

## 1. Reliability & Testing
*   **End-to-End (E2E) Testing:**
    *   Integrate **Playwright** or **Cypress**.
    *   Write tests for critical admin flows: Creating a Question, Publishing a Practice Set, and Managing Feedback.
*   **Error Tracking:**
    *   Integrate **Sentry** for real-time frontend crash reporting.

## 2. Code Quality & Tooling
*   **Component Documentation (Storybook):**
    *   Integrate Storybook to document and visually test the Shadcn UI component library.
*   **CI/CD Pipeline:**
    *   Create GitHub Actions workflow (`.github/workflows/admin.yml`) to enforce `tsc -b`, `eslint`, and `vitest` on pull requests.

## 3. Product Features
*   **Content Localization Workflow:**
    *   If the client app supports Hindi (i18n), the admin dashboard needs UI enhancements to allow content creators to input both English and Hindi versions of Questions and Lessons simultaneously.
