# SSC Admin Web

The admin portal for the SSC Competitive Exam Education Platform.  
Used by `SUPER_ADMIN` and `ADMIN` roles to manage curriculum, questions, tests, users, and products.

## 🚀 Features
- **Dashboard:** Real-time platform overview — student count, active exams, question bank size, test attempts.
- **Curriculum Management:** Full CRUD for Subjects, Chapters, and Lessons with drag-and-drop reordering.
- **Question Bank:** Rich MCQ editor with KaTeX math support, PYQ metadata (`pyqYear`, `pyqShift`, `pyqDate`), distractors, and `<RichTextEditor />` for explanations.
- **Practice Set & Mock Test Builders:** Drag-and-drop builders for assembling Questions into timed exams with sections.
- **Product Management:** Configure pricing tiers (`FREE`, `PRO`, `EXCLUSIVE`) and Razorpay-backed products.
- **Student Management:** View registered students, subscription tiers, and activity (SUPER_ADMIN).
- **Feedback Inbox:** Review and respond to student-submitted content feedback.
- **Exam & Syllabus Builder:** Create and manage `TargetExam` entries and build year-specific, hierarchical `SyllabusNode` trees with a recursive tree editor.
- **System Health Dashboard:** Real-time DevOps dashboard (`/system-health`) — live CPU load, memory usage, API latency, DB and Redis liveness. Auto-refreshes every 5 seconds.
- **File Uploads:** Direct-to-Cloudflare-R2 presigned URL upload for media assets.
- **Dark Mode:** Full semantic dark mode via the brand design system.

## 🛠️ Tech Stack
- **Framework:** React (Vite)
- **State Management:** Zustand (auth), TanStack Query / React Query (server state with caching + `refetch`)
- **Forms & Validation:** React Hook Form + Zod
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI (customized to "Great Flattening" design paradigm)
- **Rich Text:** Tiptap WYSIWYG with KaTeX extension
- **Drag & Drop:** @hello-pangea/dnd
- **API Client:** Axios (with JWT interceptors + token refresh queue)

## 📋 Prerequisites
- **Node.js**: >= 18.x
- **bun** (preferred) or npm
- **Backend API**: Running instance of `ssc-api`

## ⚙️ Environment Variables
Create a `.env.local` file in the root:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Base URL for the backend API | Yes (default: `http://localhost:5000/api/v1`) |

## 🚀 Getting Started

1. **Install dependencies**
```bash
bun install
```

2. **Start development server**
```bash
bun run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📜 Available Scripts
- `bun run dev` - Starts the Vite development server.
- `bun run build` - Compiles TypeScript and builds for production.
- `bun run typecheck` - Validates TypeScript types (also run on commit via Husky).
- `bun run lint` - Runs ESLint.

## 📂 Project Structure
```text
ssc-admin-web/
├── src/
│   ├── api/            # Domain-specific API client calls (questions, subjects, etc.)
│   ├── components/
│   │   ├── layout/     # AppShell, Sidebar, TopBar
│   │   └── ui/         # Shared UI: EmptyState (planned), Skeleton, RichTextEditor, ...
│   ├── lib/            # axios.ts, utils.ts
│   ├── pages/          # Application views (Dashboard, Subjects, Questions, etc.)
│   ├── store/          # Zustand stores (auth)
│   ├── types/          # Global TypeScript interfaces
│   └── App.tsx         # Root routing (React Router v6)
├── docs/               # Architecture & planning docs
└── package.json
```

## 📚 Documentation
- [Core Architecture](docs/architecture-and-infrastructure/2026-07-26-core-architecture/core-architecture.md)
- [Theme System](docs/frontend-and-ux/2026-07-26-theme-system/theme-system.md)
- [UX/UI Guidelines](docs/frontend-and-ux/2026-08-03-ux-architecture-and-standards/ux-ui-guidelines.md)
- [Phase 4 Roadmap](docs/progress-and-planning/2026-08-12-phase-4-roadmap.md)
- [Progress Tracker](docs/progress-and-planning/2026-07-26-master-progress-tracker/progress-tracker.md)

## 🤖 AI Assistant Guidelines
Refer to [GEMINI.md](GEMINI.md) for strict design system rules.  
No `any` types. No raw Tailwind colors. Use semantic tokens only. Cards must use `rounded-xl`. No gradients on admin pages.

## 🆕 Recent Updates (2026-08-12)
- **PYQ Metadata:** Added `pyqShift` and `pyqDate` fields to the Question Editor for granular PYQ tracking.
- **RichTextEditor Explanations:** Upgraded `distractorRationale` field to use `<RichTextEditor />` for full KaTeX math support.
- **Token Refresh Queue:** Axios interceptor now queues concurrent requests during token refresh to prevent race conditions.
- **Skeleton UI:** Loading states use `<Skeleton />` components across all major data-fetching pages.
