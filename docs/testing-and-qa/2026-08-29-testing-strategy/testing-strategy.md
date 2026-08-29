# Testing Strategy

**Date:** 2026-08-29
**Status:** 🟢 Active

---

## 1. Unit Testing
We use **Vitest** for unit and integration testing of utility functions, hooks, and complex standalone components.
- **Location:** Colocate test files with the implementation (e.g., `utils/math.ts` and `utils/math.test.ts`).
- **Focus:** Test pure logic, state transitions in custom hooks, and utility parsing. Do not obsess over testing pure UI rendering unless it involves complex conditional logic.

## 2. End-to-End (E2E) Testing
We use **Playwright** for E2E testing of critical admin flows.
- **Location:** Store in the root `e2e/` directory.
- **Key Flows to Test:**
  - Authentication (Login/Logout).
  - RBAC verification (e.g., an `ADMIN` cannot access a `SUPER_ADMIN` route).
  - CRUD operations for Subjects, Chapters, and Questions.
  - Creation of a Practice Set and Mock Test.

## 3. Role-Based Access Testing
Ensure that authorization logic is heavily tested.
- **Unit level:** Test the `useAuth` / `hasRole` hooks with mocked JWT payloads.
- **E2E level:** Have Playwright login as different user types and verify that forbidden elements are absent from the DOM and protected routes redirect correctly.

## 4. CI Integration
All pull requests must pass:
1. `tsc -b` (Type checking)
2. `eslint` (Linting)
3. `vitest run` (Unit tests)

E2E tests will run nightly against a staging environment.
