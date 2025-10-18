import type { IAuthActions, IAuthState, IUser } from "@packages/definitions";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState: IAuthState = {
  user: null, // The user object (IUser type)
  accessToken: null, // The JWT or session token string
  isAuthenticated: false, // Boolean flag for login status
};

export const authStore = create<IAuthState & IAuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      login: (accessToken, userData) => {
        set({
          accessToken,
          user: userData as IUser,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          ...initialState,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      setTokens: (accessToken) => {
        set({ accessToken });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
