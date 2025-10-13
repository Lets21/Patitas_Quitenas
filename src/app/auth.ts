// src/app/auth.ts
import { create } from "zustand";

export type Role = "ADOPTANTE" | "FUNDACION" | "CLINICA" | "ADMIN";

export type AuthUser = {
  id?: string;   // preferido en el front
  _id?: string;  // viene del backend
  email: string;
  role: Role;
  profile?: {
    firstName?: string;
    lastName?: string;
  };
};

type AuthState = {
  user?: AuthUser;
  token?: string;
  setAuthLocal: (p: { user: any; token: string }) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  token: undefined,
  setAuthLocal: ({ user, token }) =>
    set({
      user: {
        id: user.id ?? user._id,
        _id: user._id ?? user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      token,
    }),
  clear: () => set({ user: undefined, token: undefined }),
}));

export const isAdminRole = (r?: Role) => r === "FUNDACION" || r === "CLINICA" || r === "ADMIN";
