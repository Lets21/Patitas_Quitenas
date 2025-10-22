// src/app/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/app/auth";

type Role = "ADOPTANTE" | "FUNDACION" | "CLINICA" | "ADMIN";

type Props = {
  allowed: Role[];
  children: React.ReactElement;
};

const ADMIN_ROLES: Role[] = ["FUNDACION", "CLINICA", "ADMIN"];

export function ProtectedRoute({ allowed, children }: Props) {
  const { user, token } = useAuthStore();
  const loc = useLocation();

  const isAdminAllowed = allowed.some((r) => ADMIN_ROLES.includes(r));
  const loginPath = isAdminAllowed ? "/admin/login" : "/login";

  // No autenticado
  if (!token || !user) {
    return <Navigate to={loginPath} state={{ from: loc }} replace />;
  }

  // Autenticado pero sin permiso para esta ruta
  if (!allowed.includes(user.role)) {
    const pathByRole: Record<Role, string> = {
      ADOPTANTE: "/catalog",
      FUNDACION: "/fundacion",
      CLINICA: "/clinica",
      ADMIN: "/admin",
    };
    return <Navigate to={pathByRole[user.role]} replace />;
  }

  // Autenticado y con permiso
  return children;
}

export default ProtectedRoute;
