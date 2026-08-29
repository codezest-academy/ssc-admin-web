# Security & Privacy Guidelines

**Date:** 2026-08-29
**Status:** 🟢 Active

---

## 1. Security Best Practices

### Cross-Site Scripting (XSS) Prevention
- Rely on React's automatic escaping of variables.
- NEVER use `dangerouslySetInnerHTML` unless explicitly dealing with sanitized content (e.g., using `DOMPurify` before rendering).
- For math and complex formulas, use the `<QuestionRenderer />` component as specified in the UI/UX rules.

### Content Security Policy (CSP)
- CSP headers should be set by the serving infrastructure or within the `index.html` meta tags to strictly control where scripts, styles, and assets can be loaded from.

### Secret Management
- NEVER commit secrets (API keys, passwords, database URLs) to the repository.
- Use `.env` files for local development. Make sure `.env` is in `.gitignore`.
- Use `.env.example` to document required variables without the values.
- In CI/CD and Production environments, inject secrets as Environment Variables directly.

---

## 2. Data Privacy & PII Handling

### Personally Identifiable Information (PII)
- In the admin dashboard, mask sensitive PII (like full phone numbers or passwords) by default if they must be displayed.
- **Never log PII** in frontend telemetry, error tracking (e.g., Sentry), or console logs.
- Sanitize payload data before sending error reports to external services.

### Data Retention & Caching
- Ensure that cached data in React Query containing PII is cleared on user logout.
- Do not store PII in `localStorage` or `sessionStorage` unless absolutely necessary and encrypted. Prefer keeping user session state in memory (Zustand).
