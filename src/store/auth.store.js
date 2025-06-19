import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  getUserProfile,
  loginWithEmailAndPassword,
} from "../services/auth.service";

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      logout: () => set({ user: null }),
      login: async (email, password) => {
        const data = await loginWithEmailAndPassword(email, password);
        if (data) {
          let userId = data.user.id;
          let user = await getUserProfile(userId);
          set({ user: user });
          return { user: user };
        } else {
          return { user: null };
        }
      },
      clearUser: () => set({ user: null }),
      setUser: (user) => set({ user }),
      isAuthenticated: () => {
        // get session from supabase
        const session = get().user;
        return session !== null && session !== undefined;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
