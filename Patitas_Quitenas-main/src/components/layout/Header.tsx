import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart, User, LogOut, Settings, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../lib/auth';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const publicNavItems = [
    { to: '/', label: 'Inicio' },
    { to: '/catalog', label: 'Adoptar' },
    { to: '/about', label: 'Nosotros' },
  ];

  const getNavItemsByRole = () => {
    if (!user) return [];

    switch (user.role) {
      case 'ADOPTANTE':
        return [
          { to: '/profile', label: 'Mi Perfil', icon: User },
          { to: '/my-applications', label: 'Mis Solicitudes' },
        ];
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

  return (
    <header className="bg-base shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-500 p-2 rounded-xl">
              <Heart className="h-6 w-6 text-white fill-current" />
            </div>
            <span className="text-xl font-bold text-primary-500">AdoptaQuito</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Public Navigation */}
            {publicNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-gray-700 hover:text-primary-500 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}

            {/* Authenticated Navigation */}
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

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user?.profile.firstName} {user?.profile.lastName}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Salir
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
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
                    <div className="text-sm text-gray-600 mb-3">
                      {user?.profile.firstName} {user?.profile.lastName}
                    </div>
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
