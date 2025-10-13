import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/app/auth";
import { isAdminRole } from "@/app/auth";

type Props = {
  allowed: Array<"ADOPTANTE" | "FUNDACION" | "CLINICA" | "ADMIN">;
  children: React.ReactElement;
};

export function ProtectedRoute({ allowed, children }: Props) {
  const { user, token } = useAuthStore();
  const loc = useLocation();

  if (!token || !user) {
    // si la ruta es para admin, mándalo al login de admin
    const toAdminLogin = allowed.some(isAdminRole);
    return <Navigate to={toAdminLogin ? "/admin/login" : "/login"} state={{ from: loc }} replace />;
  }

  if (!allowed.includes(user.role)) {
    // logueado pero sin permisos → llévalo a su home por rol
    const pathByRole: Record<string, string> = {
      ADOPTANTE: "/catalog",
      FUNDACION: "/fundacion",
      CLINICA: "/clinica",
      ADMIN: "/admin",
    };
    return <Navigate to={pathByRole[user.role]} replace />;
  }

  return children;
}
