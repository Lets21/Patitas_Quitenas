import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import type { UserRole } from "@/types";

type Props = {
  allowed: UserRole[];          // roles permitidos para la ruta
  children: React.ReactNode;   
};

export const ProtectedRoute: React.FC<Props> = ({ allowed, children }) => {
  const { user } = useAuthStore();
  const location = useLocation();


  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

 
  if (!allowed.includes(user.role as UserRole)) {
    return <Navigate to="/" replace />;
  }

  
  return <>{children}</>;
};
