// src/app/guards/RequireAuth.tsx
import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";

export default function RequireAuth() {
  const { user } = useAuthStore();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
