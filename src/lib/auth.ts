import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "ADMIN" | "ADOPTANTE" | "FUNDACION" | "CLINICA";
type User = {
  _id?: string; id?: string;
  email: string;
  role: Role;
  profile: { firstName: string; lastName: string; phone?: string; address?: string };
  status: "ACTIVE" | "SUSPENDED";
};

type AuthState = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: "auth-storage" }
  )
);

export function getRedirectPath(role: "ADMIN"|"ADOPTANTE"|"FUNDACION"|"CLINICA") {
  switch (role) {
    case "CLINICA": return "/clinica";
    case "FUNDACION": return "/fundacion";
    case "ADMIN": return "/admin";
    default: return "/adoptar";
  }
}