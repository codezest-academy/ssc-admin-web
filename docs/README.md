# SSC Admin Web Documentation

Welcome to the documentation for the **SSC Exam Platform — Admin Web Repository**.
This folder contains Architecture Decision Records (ADRs), UX/UI guidelines, and implementation plans for the admin dashboard used by `ADMIN` and `SUPER_ADMIN` roles.

## 📂 Documentation Structure

To prevent documentation fatigue, we organize files by **Domain (Topic) → Chronological Order**.
Deprecated or superseded decisions are moved to the `archive/` folder.

---

### 🏛️ Architecture & Infrastructure
Decisions regarding the core frontend architecture, state management, API client integration, and RBAC implementation.

- [2026-07-26: Core Admin Web Architecture](architecture-and-infrastructure/2026-07-26-core-architecture/core-architecture.md)

---

### 🎨 Frontend & UX
Guidelines for UI/UX, styling system, theming, component library choices, and page layouts.

- [2026-07-26: Theme System — Single Source of Truth ← **READ FIRST**](frontend-and-ux/2026-07-26-theme-system/theme-system.md)
- [2026-07-26: UX/UI Guidelines](frontend-and-ux/2026-07-26-ux-ui-guidelines/ux-ui-guidelines.md)

---

### 🗄️ Database & Schema
Documentation mirroring schema decisions from the API repository that impact the admin frontend (e.g. enums, statuses, roles).

- [2026-07-26: Global Enums & Role Reference](database-and-schema/2026-07-26-global-enums/global-enums.md)

---

### 🧪 Testing & QA
Admin panel testing strategies, E2E test plans, role-based access testing.

*(No entries yet — add the first one when testing begins)*

---

### 📈 Progress & Planning
High-level roadmap, epic tracking, and phase status for the AI assistant and developers.

- [2026-07-26: Master Progress Tracker ← **START HERE**](progress-and-planning/2026-07-26-master-progress-tracker/progress-tracker.md)

---

### 📦 Archive
*(Superseded or deprecated decisions live in `docs/archive/`)*

---

## Rule of Thumb for Adding New Docs

1. Pick the correct domain folder (or create one if it doesn't fit).
2. Create a folder named `YYYY-MM-DD-short-topic-name`.
3. Add your markdown file inside.
4. Update this `README.md` to link to your new file.
5. Update the **Master Progress Tracker** if phases changed.
