# Role-Based Access Control (RBAC) & Auth Patterns

**Date:** 2026-08-29
**Status:** 🟢 Active

---

## Context
This document outlines the standard patterns for handling authentication and role-based access control within the admin frontend.

## 1. Authentication Flow
- **Tokens:** Access tokens (JWT) are stored in memory. Refresh tokens are stored in `httpOnly` cookies managed by the API.
- **Initialization:** On app load, the frontend hits a `/me` or `/refresh` endpoint to hydrate the user session into global state (Zustand).
- **Interceptors:** Axios interceptors automatically attach the in-memory token to requests and handle 401 Unauthorized responses by attempting a token refresh.

## 2. RBAC Implementation
We have two main admin roles: `ADMIN` and `SUPER_ADMIN`.

### Route Protection
Routes are protected using an `<AccessGate />` or similar Higher Order Component (HOC) / layout wrapper that checks the user's role against an `allowedRoles` array.
- If unauthorized, redirect to a `/forbidden` or `/unauthorized` route, or simply hide the link from the sidebar.

### UI Component Hiding / Disabling
For fine-grained control (e.g., hiding a "Delete User" button for standard `ADMIN`s):
- Use a custom hook like `useHasRole(['SUPER_ADMIN'])`.
- Wrap the component in a conditional render.
- **Never rely purely on UI hiding; the API must always validate the role.**

```tsx
// Example Pattern
const { hasRole } = useAuth();

if (!hasRole(['SUPER_ADMIN'])) return null;
return <Button variant="destructive">Delete Project</Button>;
```
