import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Spinner from "@/components/ui/Spinner";

export default function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream">
        <Spinner label="Loading CampusFind…" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.role === "admin" || user.role === "staff" ? "/admin" : "/"} replace />;
  }

  return <Outlet />;
}
