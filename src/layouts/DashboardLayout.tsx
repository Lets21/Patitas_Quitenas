import { Outlet, NavLink } from "react-router-dom";
import Header from "@/components/layout/Header";

export default function DashboardLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <div className="grid grid-cols-[260px_1fr] flex-1">
        <aside className="border-r bg-white p-4 space-y-2">
          <nav className="flex flex-col gap-2 text-sm">
            <NavLink to="/fundacion">Fundación</NavLink>
            <NavLink to="/clinica">Clínica</NavLink>
            <NavLink to="/analitica">Analítica</NavLink>
            <NavLink to="/admin">Admin</NavLink>
            <NavLink to="/notificaciones">Notificaciones</NavLink>
          </nav>
        </aside>
        <main className="p-6 bg-[#F8F7F5]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
