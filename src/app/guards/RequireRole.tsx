// src/app/guards/RequireRole.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";

type Role = "ADMIN" | "ADOPTANTE" | "FUNDACION" | "CLINICA";

export default function RequireRole({ allowed }: { allowed: Role[] }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(user.role as Role)) return <Navigate to="/403" replace />;
  return <Outlet />;
}
