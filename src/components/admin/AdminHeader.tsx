import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, Shield, BarChart3 } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

const ADMIN_LOGO = "/images/adminlogo.jpg";

export function AdminHeader() {
  const { logout } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Determinar si estamos en la sección de admin
  const inAdmin = pathname.startsWith("/admin");
  const inAnalytics = pathname.startsWith("/analitica");

  const lvl1Base = "inline-flex items-center gap-2 text-[15px] leading-6 text-gray-600 hover:text-primary-700 transition-colors";
  const tabLine = "py-3 border-b-2";
  const active = "border-primary-600 text-primary-700";
  const inactive = "border-transparent";

  const handleLogout = async () => {
    try {
      await Promise.resolve(logout());
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      {/* Fila 1: Logo y user info */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-3 select-none">
              <img
                src={ADMIN_LOGO}
                alt="Admin Panel"
                className="h-9 w-auto object-contain"
                loading="eager"
              />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-gray-900">Panel de Administración</div>
                <div className="text-[11px] text-gray-500"></div>
              </div>
            </Link>
          </div>

          {/* Desktop user info */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
              <Shield className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">ADMIN</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>

          {/* Mobile logout */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Fila 2: Navigation tabs */}
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Desktop tabs */}
          <div className="hidden md:flex items-stretch gap-6">
            <nav className="flex gap-6">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `${lvl1Base} ${tabLine} ${isActive || inAdmin ? active : inactive}`
                }
              >
                <Shield className="h-4 w-4" />
                Administración
              </NavLink>

              <NavLink
                to="/analitica"
                className={({ isActive }) =>
                  `${lvl1Base} ${tabLine} ${isActive || inAnalytics ? active : inactive}`
                }
              >
                <BarChart3 className="h-4 w-4" />
                Analítica
              </NavLink>

              <NavLink
                to="/notificaciones"
                className={({ isActive }) =>
                  `${lvl1Base} ${tabLine} ${isActive ? active : inactive}`
                }
              >
                <Bell className="h-4 w-4" />
                Notificaciones
              </NavLink>
            </nav>

            <div className="flex-1" />

            {/* Sub-tabs cuando estamos en /admin */}
            {inAdmin && (
              <nav className="flex gap-6">
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) =>
                    `${lvl1Base} ${tabLine} ${isActive ? active : inactive}`
                  }
                >
                  Resumen
                </NavLink>

                <NavLink
                  to="/admin/usuarios"
                  className={({ isActive }) =>
                    `${lvl1Base} ${tabLine} ${isActive ? active : inactive}`
                  }
                >
                  Usuarios
                </NavLink>

                <NavLink
                  to="/admin/sistema"
                  className={({ isActive }) =>
                    `${lvl1Base} ${tabLine} ${isActive ? active : inactive}`
                  }
                >
                  Sistema
                </NavLink>

                <NavLink
                  to="/admin/contactos"
                  className={({ isActive }) =>
                    `${lvl1Base} ${tabLine} ${isActive ? active : inactive}`
                  }
                >
                  Mensajes
                </NavLink>
              </nav>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden py-3">
            <nav className="flex flex-col gap-2">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `${lvl1Base} py-2 px-3 rounded-lg ${isActive ? 'bg-primary-50 text-primary-700' : ''}`
                }
              >
                <Shield className="h-4 w-4" />
                Administración
              </NavLink>

              <NavLink
                to="/analitica"
                className={({ isActive }) =>
                  `${lvl1Base} py-2 px-3 rounded-lg ${isActive ? 'bg-primary-50 text-primary-700' : ''}`
                }
              >
                <BarChart3 className="h-4 w-4" />
                Analítica
              </NavLink>

              <NavLink
                to="/notificaciones"
                className={({ isActive }) =>
                  `${lvl1Base} py-2 px-3 rounded-lg ${isActive ? 'bg-primary-50 text-primary-700' : ''}`
                }
              >
                <Bell className="h-4 w-4" />
                Notificaciones
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
