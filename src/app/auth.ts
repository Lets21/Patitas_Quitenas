import { create } from "zustand";
import { persist } from "zustand/middleware";

/** ===== Tipos ===== */
export type Role = "ADOPTANTE" | "FUNDACION" | "CLINICA" | "ADMIN";

export interface User {
  id: string;
  email: string;
  role: Role;
  profile: {
    firstName: string;
    lastName: string;
  };
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Métodos del store
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

/** ===== Store ===== */
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
        const current = get().user;
        if (current) set({ user: { ...current, ...userData } });
      },
    }),
    { name: "auth-storage" }
  )
);

/** ===== Helpers exportados ===== */
export const isAuthenticated = () => useAuthStore.getState().isAuthenticated;

export const getCurrentUser = () => useAuthStore.getState().user;

export const getCurrentUserRole = (): Role | null =>
  useAuthStore.getState().user?.role ?? null;

export const hasRole = (roles: Role[]) => {
  const u = getCurrentUser();
  return !!u && roles.includes(u.role);
};

export const isAdminRole = (r: Role) => r === "FUNDACION" || r === "CLINICA" || r === "ADMIN";

/** Redirección por rol (útil en login) */
export const getRedirectPath = (role: Role) => {
  switch (role) {
    case "ADOPTANTE":
      return "/catalog"; // o "/"
    case "FUNDACION":
      return "/fundacion";
    case "CLINICA":
      return "/clinica";
    case "ADMIN":
      return "/admin";
    default:
      return "/";
  }
};
