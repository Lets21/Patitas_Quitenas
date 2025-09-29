// src/layouts/DashboardLayout.tsx (extracto)
import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";

type Role = "ADMIN" | "ADOPTANTE" | "FUNDACION" | "CLINICA";
type Item = { label: string; to: string; roles: Role[] };

const ITEMS: Item[] = [
  { label: "Fundación",   to: "/fundacion",   roles: ["FUNDACION"] },
  { label: "Clínica",     to: "/clinica",     roles: ["CLINICA"] },
  { label: "Analítica",   to: "/analitica",   roles: ["ADMIN","FUNDACION","CLINICA"] },
  { label: "Admin",       to: "/admin",       roles: ["ADMIN"] },
  { label: "Notificaciones", to: "/notificaciones", roles: ["ADMIN","FUNDACION","CLINICA","ADOPTANTE"] },
];

export default function DashboardLayout() {
  const { user } = useAuthStore();
  const role = user?.role as Role | undefined;

  const menu = ITEMS.filter(i => (role ? i.roles.includes(role) : false));

  return (
    <div className="flex">
      <aside className="w-64 p-4">
        <nav className="space-y-2">
          {menu.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded px-3 py-2 ${isActive ? "bg-primary-50 text-primary-700" : "hover:bg-gray-100"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
