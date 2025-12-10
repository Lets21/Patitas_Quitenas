import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, Stethoscope } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

const UDLA_LOGO = "/images/udlalogo.jpg"; // Clínica UDLA

export default function ClinicHeader() {
  const { user, logout } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN";
  const orgName = "UDLA Clínica";

  const first = (user?.profile?.firstName || "").trim();
  const last  = (user?.profile?.lastName  || "").trim();
  const userName = [first, last].filter(Boolean).join(" ");

  // Sección principal de Clínica (excluye solo /clinica/notificaciones)
  const inClinic =
    pathname.startsWith("/clinica") &&
    !pathname.startsWith("/clinica/notificaciones");

  const lvl1Base =
    "inline-flex items-center gap-2 text-[15px] leading-6 text-gray-600 hover:text-primary-700 transition-colors";
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
      {/* Fila 1 */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/clinica" className="flex items-center gap-3 select-none">
              <img
                src={UDLA_LOGO}
                alt="Clínica UDLA"
                className="h-9 w-auto object-contain"
                loading="eager"
              />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-gray-900">{orgName}</div>
                <div className="text-[11px] text-gray-500">Clínica Veterinaria</div>
              </div>
            </Link>
          </div>

          {/* Desktop user info and logout */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <Link 
                to="/admin"
                className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100 font-medium"
              >
                ← Volver al Panel Admin
              </Link>
            )}
            {userName && <span className="text-sm text-gray-600">{userName}</span>}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>

          {/* Mobile logout button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Fila 2: tabs */}
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Desktop tabs */}
          <div className="hidden md:flex items-stretch gap-6">
            <nav className="flex gap-6">
              <NavLink
                to="/clinica"
                end
                className={({ isActive }) =>
                  `${lvl1Base} ${tabLine} ${isActive || inClinic ? active : inactive}`
                }
              >
                <Stethoscope className="h-4 w-4" />
                Clínica
              </NavLink>

              <NavLink
                to="/clinica/notificaciones"
                className={({ isActive }) =>
                  `${lvl1Base} ${tabLine} ${isActive ? active : inactive}`
                }
              >
                <Bell className="h-4 w-4" />
                Notificaciones
              </NavLink>
            </nav>

            <div className="flex-1" />

            {/* Tabs internos solo en /clinica */}
            {inClinic && (
              <nav className="flex gap-6">
                <NavLink
                  to="/clinica"
                  end
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 text-sm leading-6 ${tabLine} ${
                      isActive ? active : inactive
                    } text-gray-600 hover:text-primary-700`
                  }
                >
                  Fichas Clínicas
                </NavLink>

                <NavLink
                  to="/clinica/solicitudes"
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 text-sm leading-6 ${tabLine} ${
                      isActive ? active : inactive
                    } text-gray-600 hover:text-primary-700`
                  }
                >
                  Solicitudes de Adopción
                </NavLink>
              </nav>
            )}
          </div>

          {/* Mobile tabs - horizontal scroll */}
          <div className="md:hidden overflow-x-auto">
            <nav className="flex gap-4 min-w-max py-3">
              <NavLink
                to="/clinica"
                end
                className={({ isActive }) =>
                  `${lvl1Base} ${tabLine} whitespace-nowrap ${isActive || inClinic ? active : inactive}`
                }
              >
                <Stethoscope className="h-4 w-4" />
                Clínica
              </NavLink>

              <NavLink
                to="/clinica/notificaciones"
                className={({ isActive }) =>
                  `${lvl1Base} ${tabLine} whitespace-nowrap ${isActive ? active : inactive}`
                }
              >
                <Bell className="h-4 w-4" />
                Notificaciones
              </NavLink>

              {/* Tabs internos solo en /clinica */}
              {inClinic && (
                <>
                  <NavLink
                    to="/clinica"
                    end
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 text-sm leading-6 ${tabLine} whitespace-nowrap ${
                        isActive ? active : inactive
                      } text-gray-600 hover:text-primary-700`
                    }
                  >
                    Fichas Clínicas
                  </NavLink>

                  <NavLink
                    to="/clinica/solicitudes"
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 text-sm leading-6 ${tabLine} whitespace-nowrap ${
                        isActive ? active : inactive
                      } text-gray-600 hover:text-primary-700`
                    }
                  >
                    Solicitudes de Adopción
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
