import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles = ["SUPER_ADMIN", "ADMIN", "STAFF"] }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // If the user role is not allowed (e.g. STUDENT), they shouldn't be here.
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
