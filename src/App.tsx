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
import PracticeSetsPage from "./pages/practiceSets/index";
import PracticeSetEditor from "./pages/practiceSets/editor";
import PracticeSetBuilder from "./pages/practiceSets/builder";
import MockTestsPage from "./pages/mockTests/index";
import MockTestEditor from "./pages/mockTests/editor";
import MockTestBuilder from "./pages/mockTests/builder";
import ProductsPage from "./pages/products/index";
import ProductEditor from "./pages/products/editor";
import ProductBuilder from "./pages/products/builder";
import PurchasesPage from "./pages/purchases/index";
import UsersPage from "./pages/users/index";
import StaffPage from "./pages/staff/index";
import ProfilePage from "./pages/profile/index";
import DesignSystemLayout from "./pages/design-system/DesignSystemLayout";
import FeedbackPage from "./pages/feedback/index";
import CategoriesPage from "./pages/categories/index";
import ArticlesPage from "./pages/articles/index";
import ArticleEditor from "./pages/articles/editor";
import ErrorsIndex from "./pages/errors/index";
import ErrorDetail from "./pages/errors/detail";
import ErrorAnalytics from "./pages/errors/analytics";

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
          <Route path="/design-system" element={<DesignSystemLayout />} />
          
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            
            {/* RBAC Protected Content Management Routes */}
            <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "STAFF"]} />}>
              <Route path="subjects" element={<SubjectsPage />} />
              <Route path="subjects/:subjectSlug/chapters" element={<ChaptersPage />} />
              <Route path="chapters/:chapterId/lessons" element={<LessonsPage />} />
              <Route path="questions" element={<QuestionsPage />} />
              <Route path="questions/new" element={<QuestionEditor />} />
              <Route path="questions/:questionId" element={<QuestionEditor />} />
              <Route path="practice-sets" element={<PracticeSetsPage />} />
              <Route path="practice-sets/new" element={<PracticeSetEditor />} />
              <Route path="practice-sets/:id/edit" element={<PracticeSetEditor />} />
              <Route path="practice-sets/:id" element={<PracticeSetBuilder />} />
              <Route path="mock-tests" element={<MockTestsPage />} />
              <Route path="mock-tests/new" element={<MockTestEditor />} />
              <Route path="mock-tests/:id/edit" element={<MockTestEditor />} />
              <Route path="mock-tests/:id" element={<MockTestBuilder />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/new" element={<ProductEditor />} />
              <Route path="products/:id/edit" element={<ProductEditor />} />
              <Route path="products/:id" element={<ProductBuilder />} />
              <Route path="sales" element={<PurchasesPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="staff" element={<StaffPage />} />
              <Route path="feedback" element={<FeedbackPage />} />
              <Route path="chapters" element={<ChaptersPage />} />
              <Route path="lessons" element={<LessonsPage />} />
              
              {/* CMS Routes */}
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="articles" element={<ArticlesPage />} />
              <Route path="articles/new" element={<ArticleEditor />} />
              <Route path="articles/:id/edit" element={<ArticleEditor />} />

              {/* Error Reporting Routes */}
              <Route path="errors" element={<ErrorsIndex />} />
              <Route path="errors/analytics" element={<ErrorAnalytics />} />
              <Route path="errors/:id" element={<ErrorDetail />} />
            </Route>

            {/* Future Routes */}
            {/* <Route path="attempts" element={<Attempts />} /> */}

          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
