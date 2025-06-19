import { create } from "zustand";
import { getProfileCount } from "../services/profile.service.js";

export const useProfileStore = create((set, get) => ({
  totalProfiles: 0,
  isLoading: false,
  error: null,
  profiles: [],
  setProfiles: (profiles) => set({ profiles }),

  setTotalProfiles: (count) => set({ totalProfiles: count }),
  fetchProfileCount: async () => {
    set({ isLoading: true, error: null });
    try {
      const count = await getProfileCount();
      set({ totalProfiles: count, isLoading: false });
      return count;
    } catch (error) {
      console.error("Error fetching profile count:", error);
      set({ error: error.message, isLoading: false });
      return 0;
    }
  },
}));
