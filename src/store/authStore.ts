import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../Types/Auth.type";
// import { logoutUser } from "../api/auth.api";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (user) =>
        set({
          user,
          token: user.auth_token,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
