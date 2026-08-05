import api from "./index";

export interface AdminDashboardMetrics {
  totalStudents: number;
  totalQuestions: number;
  activeExams: number;
  totalAttempts: number;
}

export interface RecentSignup {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface RecentAttempt {
  id: string;
  attemptType: string;
  status: string;
  marksObtained: number | null;
  submittedAt: string | null;
  startedAt: string;
  student: {
    name: string;
    email: string;
  };
}

export interface AdminDashboardData {
  metrics: AdminDashboardMetrics;
  recentSignups: RecentSignup[];
  recentAttempts: RecentAttempt[];
}

export const getAdminDashboard = async (): Promise<AdminDashboardData> => {
  const response = await api.get("/analytics/admin/dashboard");
  return response.data.data;
};
