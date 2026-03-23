import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RoleRoute({ allowedRole }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== allowedRole) {
    const redirect =
      currentUser.role === "faculty"
        ? "/faculty/dashboard"
        : currentUser.role === "admin"
          ? "/admin/dashboard"
          : currentUser.role === "parent"
            ? "/parent/dashboard"
          : "/student/dashboard";
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}
