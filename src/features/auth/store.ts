"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      setUserId: (userId) => set({ userId }),
      logout: () => set({ userId: null }),
    }),
    { name: "gamsung-auth" }
  )
);
