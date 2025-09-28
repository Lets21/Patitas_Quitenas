import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<User['profile']>) => void;
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
      updateProfile: (profileUpdate) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              profile: { ...user.profile, ...profileUpdate }
            }
          });
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);

export const hasRole = (allowedRoles: string[]) => {
  const { user } = useAuthStore.getState();
  return user && allowedRoles.includes(user.role);
};

export const requireAuth = () => {
  const { isAuthenticated } = useAuthStore.getState();
  return isAuthenticated;
};