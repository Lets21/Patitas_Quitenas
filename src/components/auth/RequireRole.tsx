import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";

export default function RequireRole({ roles }: { roles: Array<"ADMIN"|"ADOPTANTE"|"FUNDACION"|"CLINICA"> }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/403" replace />;
  return <Outlet />;
}
