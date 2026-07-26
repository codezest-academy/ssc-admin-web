# SSC Admin Web

The admin portal for the SSC Competitive Exam Education Platform. 
Used by `SUPER_ADMIN` and `ADMIN` roles to manage users, syllabus content, mock tests, and view analytics.

## Tech Stack
- **Framework:** React (Vite)
- **State Management:** Zustand (for Auth), TanStack Query (React Query for server state)
- **Forms & Validation:** React Hook Form + Zod
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI (Customized to match strict brand theme)
- **API Client:** Axios (with JWT interceptors)

## Getting Started

1. Install dependencies
```bash
npm install
```

2. Configure environment variables (create a `.env.local` if needed)
```bash
VITE_API_URL=http://localhost:5000/api/v1
```

3. Start development server
```bash
npm run dev
```

## Documentation
- [Core Architecture](docs/architecture-and-infrastructure/2026-07-26-core-architecture/core-architecture.md)
- [Theme System](docs/frontend-and-ux/2026-07-26-theme-system/theme-system.md)
- [Progress Tracker](docs/progress-and-planning/2026-07-26-master-progress-tracker/progress-tracker.md)
