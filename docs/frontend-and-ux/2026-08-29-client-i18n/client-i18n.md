# Client-Side i18n Strategy

**Date:** 2026-08-29
**Status:** 🟢 Active

---

## Context
While the primary audience for the admin dashboard uses English, a scalable internationalization (i18n) strategy is required if localized support teams or subject-matter experts (SMEs) in other languages are onboarded.

## Stack
- **Library:** `react-i18next`
- **Backend:** `i18next-http-backend` (loads translations lazily)

## 1. Directory Structure
Translations should live outside the React source to avoid increasing the initial bundle size.
```text
public/
  locales/
    en/
      common.json
      subjects.json
    hi/
      common.json
      subjects.json
```

## 2. Usage Patterns
- Never hardcode user-facing string constants inside components.
- Use the `useTranslation` hook for functional components.

```tsx
import { useTranslation } from 'react-i18next';

export function DashboardHeader() {
  const { t } = useTranslation('common');
  
  return <h1>{t('dashboard.welcomeMessage')}</h1>;
}
```

## 3. Formatting and Plurals
- Rely on `i18next` built-in pluralization and interpolation formats instead of writing custom utility functions for strings.

## 4. Routing Integration
- If locale routing is required (e.g., `/en/dashboard` vs `/hi/dashboard`), integrate the locale state with the React router context so URL sharing preserves the language.
