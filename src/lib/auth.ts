import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  role: 'ADOPTANTE' | 'FUNDACION' | 'CLINICA' | 'ADMIN';
  profile: {
    firstName: string;
    lastName: string;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Utility functions
export const isAuthenticated = () => {
  return useAuthStore.getState().isAuthenticated;
};

export const getCurrentUser = () => {
  return useAuthStore.getState().user;
};

export const getCurrentUserRole = (): string | null => {
  const authStore = useAuthStore.getState();
  return authStore.user?.role || null;
};

export const hasRole = (roles: string[]) => {
  const user = getCurrentUser();
  return user ? roles.includes(user.role) : false;
};

export const getRedirectPath = (role: string) => {
  switch (role) {
    case 'ADOPTANTE':
      return '/'; // Página principal con catálogo
    case 'FUNDACION':
      return '/fundacion';
    case 'CLINICA':
      return '/clinica';
    case 'ADMIN':
      return '/admin';
    default:
      return '/';
  }
};