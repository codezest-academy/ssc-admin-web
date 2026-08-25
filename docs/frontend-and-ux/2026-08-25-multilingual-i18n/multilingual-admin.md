# Multilingual Admin: Translation Management

**Date:** 2026-08-25
**Status:** 🔴 Not Started — Approved Plan
**Applies to:** `ssc-admin-web`
**Depends on:** [ssc-api multilingual doc](../../../../../ssc-api/docs/architecture-and-infrastructure/2026-08-25-multilingual-i18n/multilingual-i18n.md) — API endpoints must exist first.

---

## 1. Purpose

The batch translation script (`scripts/translate-content.ts` in `ssc-api`) auto-translates all questions and lessons using Sarvam AI. However, AI translation of exam content carries risk — a wrongly translated question stem or option can make the correct answer ambiguous.

This admin page gives the content team the ability to:
1. **Review** AI-generated translations before they are considered "verified"
2. **Edit** any translation inline
3. **Approve** (mark `isVerified = true`) verified translations
4. **Re-translate** a single question if the AI output was poor
5. **Monitor** overall translation coverage and verification progress

---

## 2. New Admin Page: `/translations`

**Access:** `ADMIN` and `SUPER_ADMIN` only (same as other content pages).

### 2a. Translation Stats Header

```
┌──────────────────────────────────────────────────────────────────┐
│  Translation Coverage                                            │
│                                                                  │
│  HI  ████████████░░░░  780 / 1,000 translated  |  320 verified  │
│  TE  ████████████░░░░  780 / 1,000 translated  |  150 verified  │
└──────────────────────────────────────────────────────────────────┘
```

Fetched from `GET /api/v1/admin/translation-stats`.

### 2b. Filter Bar

```
[Subject ▼] [Chapter ▼] [Locale: HI | TE] [Status: All | Unverified | Verified] [Search...]
```

### 2c. Translation Review Table

Each row shows one question with its translations side-by-side:

```
┌────────┬────────────────────────────┬───────────────────────────┬──────────┬──────────────┐
│ #      │ English (source)           │ Hindi / Telugu             │ Verified │ Actions       │
├────────┼────────────────────────────┼───────────────────────────┼──────────┼──────────────┤
│ Q-001  │ Who discovered             │ रेडियोधर्मिता की खोज       │  [ ✓ ]   │ Edit | Re-AI  │
│        │ radioactivity?             │ किसने की?                  │          │               │
│        │ A. Curie B. Bohr           │ A. क्यूरी B. बोह्र           │          │               │
│        │ C. Becquerel D. Hahn       │ C. बेकरेल D. हान            │          │               │
├────────┼────────────────────────────┼───────────────────────────┼──────────┼──────────────┤
│ Q-002  │ What is E = mc²?           │ (no translation yet)       │  [ - ]   │ Translate Now │
└────────┴────────────────────────────┴───────────────────────────┴──────────┴──────────────┘
```

- **Verified toggle:** `isVerified` checkbox — click to toggle (calls `PATCH /api/v1/admin/questions/:id/translations/:locale`)
- **Edit button:** Opens an inline edit drawer with full question + options + explanation text areas
- **Re-AI button:** Calls `POST /api/v1/admin/questions/:id/translations/:locale/regenerate` to re-run Sarvam on this single question
- **Translate Now:** Appears for questions with no translation yet

---

## 3. Files to Create / Modify

### [NEW] `src/pages/translations/index.tsx`

Main translation management page. Uses `useQuery` to fetch paginated translation list from the API.

### [NEW] `src/api/translations.ts`

API client functions:
```typescript
export const translationsApi = {
  getStats: () => api.get('/admin/translation-stats'),
  list: (params: TranslationListParams) => api.get('/admin/translations', { params }),
  update: (questionId: string, locale: string, data: UpdateTranslationInput) =>
    api.patch(`/admin/questions/${questionId}/translations/${locale}`, data),
  regenerate: (questionId: string, locale: string) =>
    api.post(`/admin/questions/${questionId}/translations/${locale}/regenerate`),
};
```

### [MODIFY] `src/App.tsx`

Add the route:
```tsx
<Route path="/translations" element={<TranslationsPage />} />
```

### [MODIFY] `src/components/layout/Sidebar.tsx`

Add nav item under the "Content" section:
```tsx
{ label: 'Translations', icon: Languages, path: '/translations' }
```

---

## 4. Design Rules (Follows Admin Theme System)

- All surfaces: `bg-card`, `bg-background`
- Badges: `text-success bg-success/10` (verified), `text-warning bg-warning/10` (unverified/pending)
- Table: same component as existing admin tables (`rounded-xl`, flat cards)
- No gradients
- Script font rendering: embed `Noto Sans Devanagari` and `Noto Sans Telugu` via Google Fonts import in `index.css` or `App.tsx` — needed so Hindi/Telugu text renders correctly in the admin UI

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600&family=Noto+Sans+Telugu:wght@400;500;600&display=swap');
```

---

## 5. Verification Workflow

Recommended rollout for a content team:

```
1. Run batch script (all AI, isVerified=false)
2. Admin filters: Locale=HI, Status=Unverified, Subject=History
3. Review each row — if translation looks correct, check Verified
4. If wrong: click Edit → fix inline → save → check Verified
5. Once a chapter is 100% verified, it goes live in Hindi for students
```

The API serves AI-generated translations even if `isVerified=false` (graceful rollout). The admin can choose to hold back unverified content by coordinating with the API team to add `isVerified` gating if required.

---

## 6. Progress Tracker

| Task | Status |
|---|---|
| `src/api/translations.ts` | 🔴 Not Started |
| `src/pages/translations/index.tsx` | 🔴 Not Started |
| Add `/translations` route in `App.tsx` | 🔴 Not Started |
| Add `Translations` nav item in Sidebar | 🔴 Not Started |
| Noto fonts import for admin | 🔴 Not Started |
