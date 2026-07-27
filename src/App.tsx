import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import SubjectsPage from "./pages/subjects/index";
import ChaptersPage from "./pages/chapters/index";
import LessonsPage from "./pages/lessons/index";
import QuestionsPage from "./pages/questions/index";
import QuestionEditor from "./pages/questions/editor";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* RBAC Protected Content Management Routes */}
            <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "STAFF"]} />}>
              <Route path="subjects" element={<SubjectsPage />} />
              <Route path="subjects/:subjectSlug/chapters" element={<ChaptersPage />} />
              <Route path="chapters/:chapterId/lessons" element={<LessonsPage />} />
              <Route path="questions" element={<QuestionsPage />} />
              <Route path="questions/new" element={<QuestionEditor />} />
              <Route path="questions/:questionId" element={<QuestionEditor />} />
            </Route>

            {/* Future Routes */}
            {/* <Route path="users" element={<Users />} /> */}
            {/* <Route path="attempts" element={<Attempts />} /> */}
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
