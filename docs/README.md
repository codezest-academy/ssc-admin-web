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
- [2026-08-29: Role-Based Access Control & Auth Patterns](architecture-and-infrastructure/2026-08-29-rbac-and-auth-patterns/rbac-and-auth.md)
- [2026-08-29: Security & Privacy Guidelines](architecture-and-infrastructure/2026-08-29-security-and-privacy/security-guidelines.md)
- [2026-08-29: ADR Process & Template](architecture-and-infrastructure/2026-08-29-adr-process/adr-template.md)

---

### 🎨 Frontend & UX
Guidelines for UI/UX, styling system, theming, component library choices, and page layouts.

- [2026-07-26: Theme System — Single Source of Truth ← **READ FIRST**](frontend-and-ux/2026-07-26-theme-system/theme-system.md)
- [2026-07-26: UX/UI Guidelines](frontend-and-ux/2026-07-26-ux-ui-guidelines/ux-ui-guidelines.md)
- [2026-08-29: Form Validation Strategies](frontend-and-ux/2026-08-29-form-validation/form-validation.md)
- [2026-08-29: Accessibility (a11y) Guidelines](frontend-and-ux/2026-08-29-accessibility-protocols/a11y-guidelines.md)
- [2026-08-29: Client-Side i18n Strategy](frontend-and-ux/2026-08-29-client-i18n/client-i18n.md)

---

### 🗄️ Database & Schema
Documentation mirroring schema decisions from the API repository that impact the admin frontend (e.g. enums, statuses, roles).

- [2026-07-26: Global Enums & Role Reference](database-and-schema/2026-07-26-global-enums/global-enums.md)

---

### 🧪 Testing & QA
Admin panel testing strategies, E2E test plans, role-based access testing.

- [2026-08-29: Testing Strategy](testing-and-qa/2026-08-29-testing-strategy/testing-strategy.md)

---

### 🛠️ DevOps & Tooling
Infrastructure, CI/CD, dependency management, and observability.

- [2026-08-29: DevOps Practices & CI/CD](devops-and-tooling/2026-08-29-ci-cd-and-dependencies/devops-practices.md)

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
