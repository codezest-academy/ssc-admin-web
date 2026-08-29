# DevOps & CI/CD Practices

**Date:** 2026-08-29
**Status:** 🟢 Active

---

## 1. Dependency Management
- **Lockfile:** We use `package-lock.json` via standard NPM. The lockfile MUST be committed to version control.
- **Updates:** Dependencies should be audited and updated on a regular cadence (e.g., bi-weekly sprint cycles) using `npm audit`.
- **Vulnerability Scanning:** CI/CD will include steps (like `npm audit --audit-level=high` or Dependabot) to block PRs with critical vulnerabilities.

## 2. CI/CD Pipeline (GitHub Actions)
All Pull Requests targeting the `main` or `develop` branches must pass the foundational CI checks before merging is permitted.

### The Standard Workflow (`.github/workflows/ci.yml`)
Because Vercel automatically handles the build process (which includes `tsc -b` for type checking), our GitHub Action is strictly optimized to serve as a **Code Quality Gatekeeper**.

1. **Setup:** Install dependencies cleanly using `npm ci`.
2. **Linting:** Run `npm run lint` (ESLint) to enforce coding standards and design token usage.
3. **Testing:** Run `npm run test` (Vitest unit tests).
4. **Concurrency:** Outdated CI runs are automatically canceled if new commits are pushed to the same PR, saving Actions minutes.

## 3. Performance Budgets
To ensure the admin portal remains snappy even for users with large datasets:
- **Bundle Size:** Utilize Vite's chunk splitting. Vendor libraries (React, Zustand, UI framework) should be split into a separate vendor chunk.
- **Core Web Vitals:** We monitor LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift). 
- **Query Optimization:** React Query must be configured with sensible `staleTime` and `cacheTime` defaults to prevent spamming the backend API.

## 4. UI Component Documentation
- **Storybook:** We use Storybook (`npm run storybook`) for developing, documenting, and testing UI components in isolation.
- **Colocation:** Component stories (`.stories.tsx`) MUST be co-located alongside their component files in `src/components/ui/`.
- **Testing:** Storybook runs independently of the main vitest runner to prevent ESM module resolution conflicts.

## 5. Release Process
- Merge to `main` triggers a production build.
- Deployment is handled automatically (e.g., to Vercel, Netlify, or an S3/CloudFront bucket).
- Releases are tagged using Semantic Versioning.
