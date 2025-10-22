// src/layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";

/**
 * Layout neutro para vistas de administración.
 * No renderiza sidebars ni menús; cada página/role
 * coloca su propio header (FoundationHeader, ClinicHeader, AdminHeader).
 *
 * Si quieres paddings/containers, házlo en cada página.
 */
export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Outlet />
    </div>
  );
}
