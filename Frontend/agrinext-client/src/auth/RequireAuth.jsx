import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { getDashboardPath } from "./authUtils";

export default function RequireAuth({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="px-6 py-20 text-center text-slate-600">Checking your session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to={getDashboardPath(user)} replace />;
  }

  return <Outlet />;
}
