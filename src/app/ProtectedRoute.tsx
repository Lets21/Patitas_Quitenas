import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import type { UserRole } from "@/types";

type Props = {
  allowed: UserRole[];          // roles permitidos para la ruta
  children: React.ReactNode;    // lo que se renderiza si pasa el check
};

export const ProtectedRoute: React.FC<Props> = ({ allowed, children }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  // No autenticado -> a login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Autenticado pero sin rol permitido -> a inicio (ajusta si luego pones /403)
  if (!allowed.includes(user.role as UserRole)) {
    return <Navigate to="/" replace />;
  }

  // OK
  return <>{children}</>;
};
