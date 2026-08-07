# SSC Admin Web

The admin portal for the SSC Competitive Exam Education Platform. 
Used by `SUPER_ADMIN` and `ADMIN` roles to manage users, syllabus content, mock tests, and view analytics.

## 🚀 Features
- **Dashboard:** Overview of active students, mock tests, and recent revenue.
- **Curriculum Management:** Create, Read, Update, Delete operations for Subjects, Chapters, and Lessons.
- **Exam Builders:** Interactive builders to assemble Questions into Practice Sets and Mock Tests.
- **Product Management:** Configure pricing and access tiers (`FREE`, `PRO`, `EXCLUSIVE`).
- **Dark Mode:** Built-in semantic dark mode supporting the brand theme.

## 🛠️ Tech Stack
- **Framework:** React (Vite)
- **State Management:** Zustand (for Auth), TanStack Query (React Query for server state)
- **Forms & Validation:** React Hook Form + Zod
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI (Customized to match strict brand theme)
- **API Client:** Axios (with JWT interceptors)

## 📋 Prerequisites
- **Node.js**: >= 18.x
- **npm** or **yarn**
- **Backend API**: Running instance of `ssc-api`

## ⚙️ Environment Variables
Create a `.env.local` file in the root. Key variables include:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Base URL for the backend API | Yes (default: `http://localhost:5000/api/v1`) |

## 🚀 Getting Started

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```
Open the provided local URL (usually `http://localhost:5173`) in your browser.

## 📜 Available Scripts
- `npm run dev` - Starts the Vite development server.
- `npm run build` - Compiles the React application for production.
- `npm run preview` - Previews the production build locally.
- `npm run lint` - Runs ESLint.
- `npm run typecheck` - Validates TypeScript types.

## 📂 Project Structure
```text
ssc-admin-web/
├── src/
│   ├── api/            # API client calls (Domain specific)
│   ├── components/     # Reusable React components (UI, Layouts)
│   ├── lib/            # Utilities (Axios client, Theme utils)
│   ├── pages/          # Application views / screens
│   ├── types/          # Global TypeScript definitions
│   └── App.tsx         # Main application routing entry
├── docs/               # Documentation & Architecture records
└── package.json
```

## 📚 Documentation
- [Core Architecture](docs/architecture-and-infrastructure/2026-07-26-core-architecture/core-architecture.md)
- [Theme System](docs/frontend-and-ux/2026-07-26-theme-system/theme-system.md)
- [Progress Tracker](docs/progress-and-planning/2026-07-26-master-progress-tracker/progress-tracker.md)

## 🤖 AI Assistant Guidelines
Please refer to [GEMINI.md](GEMINI.md) and [CLAUDE.md](CLAUDE.md) for strict architectural and typing rules (e.g., no `any` types allowed).
