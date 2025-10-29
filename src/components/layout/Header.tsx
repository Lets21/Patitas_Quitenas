import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, BarChart3, ListChecks, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../lib/auth';
import { Button } from '../ui/Button';

/* ──────────────────────────────
   Mini chip de usuario (avatar + nombre + menú)
   ────────────────────────────── */
function UserChip({
  fullName,
  email,
  avatarUrl,
  onProfile,
  onRequests,
  onLogout,
}: {
  fullName: string;
  email?: string;
  avatarUrl?: string;
  onProfile: () => void;
  onRequests: () => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = (fullName || email || '?')
    .split(' ')
    .map(s => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="group flex items-center gap-2 rounded-full border border-black/10 bg-white px-2.5 py-1.5 shadow-sm hover:shadow transition"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-emerald-600/10 ring-1 ring-emerald-700/10">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="text-[12px] font-semibold text-emerald-800">{initials}</span>
          )}
        </span>
        <span className="hidden sm:flex min-w-0 flex-col text-left">
          <span className="truncate text-sm font-medium text-gray-900">{fullName}</span>
          {email && <span className="truncate text-[11px] text-gray-500">{email}</span>}
        </span>
        <ChevronDown className="ml-1 hidden sm:block h-4 w-4 text-gray-500 group-hover:text-gray-700" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-black/10 bg-white/95 backdrop-blur shadow-lg">
          <button
            onClick={() => { setOpen(false); onProfile(); }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-gray-50"
          >
            <User className="h-4 w-4 text-gray-600" />
            Mi perfil
          </button>
          <button
            onClick={() => { setOpen(false); onRequests(); }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-gray-50"
          >
            <ListChecks className="h-4 w-4 text-gray-600" />
            Mis solicitudes
          </button>
          <div className="my-1 h-px bg-gray-100" />
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────
   HEADER
   ────────────────────────────── */
export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    nav('/login');
  };

  const publicNavItems = [
    { to: '/', label: 'Inicio' },
    { to: '/catalog', label: 'Adoptar' },
    { to: '/about', label: 'Nosotros' },
  ];

  const getNavItemsByRole = () => {
    if (!user) return [];
    switch (user.role) {
      
      case 'FUNDACION':
        return [
          { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
          { to: '/animals', label: 'Animales' },
          { to: '/applications', label: 'Solicitudes' },
          { to: '/followups', label: 'Seguimientos' },
        ];
      case 'CLINICA':
        return [
          { to: '/clinical-dashboard', label: 'Dashboard', icon: BarChart3 },
          { to: '/clinical-records', label: 'Fichas Clínicas' },
        ];
      case 'ADMIN':
        return [
          { to: '/admin', label: 'Administración', icon: Settings },
          { to: '/analytics', label: 'Analíticas', icon: BarChart3 },
          { to: '/users', label: 'Usuarios' },
        ];
      default:
        return [];
    }
  };

  const fullName = `${user?.profile?.firstName ?? ''} ${user?.profile?.lastName ?? ''}`.trim() || 'Usuario';
  const email = user?.email || user?.profile?.email;
  // cambia esto si tu API trae otra key para foto
  const avatarUrl = user?.profile?.avatarUrl || user?.profile?.photoUrl;

  return (
    <header className="bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 select-none">
            <img
              src="/images/logo.png"
              alt="Huellitas Quiteñas"
              className="h-12 w-12 object-contain rounded-lg"
              loading="eager"
            />
            <span className="text-xl font-bold text-primary-600">Huellitas Quiteñas</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {publicNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-gray-700 hover:text-primary-500 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <div className="h-4 border-l border-gray-300" />
                {getNavItemsByRole().map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-500 transition-colors duration-200"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Auth Actions (desktop) */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <UserChip
                fullName={fullName}
                email={email}
                avatarUrl={avatarUrl}
                onProfile={() => nav('/profile')}
                onRequests={() => nav('/my-applications')}
                onLogout={handleLogout}
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Iniciar Sesión</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú de navegación"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {publicNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-gray-700 hover:text-primary-500 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-sm text-gray-600 mb-3">{fullName}</div>
                    {getNavItemsByRole().map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors duration-200 py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => { setIsMenuOpen(false); nav('/profile'); }}>
                    <User className="h-4 w-4 mr-1" />
                    Mi perfil
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setIsMenuOpen(false); nav('/my-applications'); }}>
                    <ListChecks className="h-4 w-4 mr-1" />
                    Mis solicitudes
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Salir
                  </Button>
                </>
              )}

              {!isAuthenticated && (
                <div className="border-t border-gray-200 pt-4 flex flex-col space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Registrarse
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
