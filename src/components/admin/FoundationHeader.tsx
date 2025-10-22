import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

const PAE_LOGO = "/images/paelogo.png"; // Fundación PAE

export default function FoundationHeader() {
  const { user, logout } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const orgName = ((user as any)?.organization?.name ?? "PAE").trim();

  const first = (user?.profile?.firstName || "").trim();
  const last  = (user?.profile?.lastName  || "").trim();
  const userName = [first, last].filter(Boolean).join(" ");

  // Sección principal de Fundación (excluye solo /notificaciones)
  const inFoundation =
    pathname.startsWith("/fundacion") &&
    !pathname.startsWith("/notificaciones");

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
            <Link to="/fundacion" className="flex items-center gap-3 select-none">
              <img
                src={PAE_LOGO}
                alt="Fundación PAE"
                className="h-9 w-auto object-contain"
                loading="eager"
              />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-gray-900">{orgName}</div>
                <div className="text-[11px] text-gray-500">Fundación</div>
              </div>
            </Link>
          </div>

          {/* Desktop user info and logout */}
          <div className="hidden md:flex items-center gap-3">
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
                to="/fundacion"
                end
                className={({ isActive }) =>
                  `${lvl1Base} ${tabLine} ${isActive || inFoundation ? active : inactive}`
                }
              >
                Fundación
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

            {/* Tabs internos solo en /fundacion */}
            {inFoundation && (
              <nav className="flex gap-6">
                <NavLink
                  to="/fundacion"
                  end
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 text-sm leading-6 ${tabLine} ${
                      isActive ? active : inactive
                    } text-gray-600 hover:text-primary-700`
                  }
                >
                  Perros Registrados
                </NavLink>

                <NavLink
                  to="/fundacion/solicitudes"
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
                to="/fundacion"
                end
                className={({ isActive }) =>
                  `${lvl1Base} ${tabLine} whitespace-nowrap ${isActive || inFoundation ? active : inactive}`
                }
              >
                Fundación
              </NavLink>

              <NavLink
                to="/notificaciones"
                className={({ isActive }) =>
                  `${lvl1Base} ${tabLine} whitespace-nowrap ${isActive ? active : inactive}`
                }
              >
                <Bell className="h-4 w-4" />
                Notificaciones
              </NavLink>

              {/* Tabs internos solo en /fundacion */}
              {inFoundation && (
                <>
                  <NavLink
                    to="/fundacion"
                    end
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 text-sm leading-6 ${tabLine} whitespace-nowrap ${
                        isActive ? active : inactive
                      } text-gray-600 hover:text-primary-700`
                    }
                  >
                    Perros Registrados
                  </NavLink>

                  <NavLink
                    to="/fundacion/solicitudes"
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
