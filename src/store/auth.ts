import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/axios";
import type { AuthTokens, UserProfile } from "../types";

interface AuthState {
  tokens: AuthTokens | null;
  me: UserProfile | null;
  loading: boolean;
  error?: string;
  login: (email: string, password: string) => Promise<boolean>;
  refresh: () => Promise<boolean>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      tokens: null,
      me: null,
      loading: false,
      async login(email, password) {
        set({ loading: true, error: undefined });
        try {
          const { data } = await api.post("/auth/login", { email, password });
          // Escuelajs returns access_token
          const tokens: AuthTokens = { access_token: data.access_token };
          set({ tokens, loading: false });
          await get().fetchMe();
          return true;
        } catch (e: any) {
          set({
            loading: false,
            error: e?.response?.data?.message || "Invalid credentials",
          });
          return false;
        }
      },
      async refresh() {
        // Demo: no real refresh endpoint on Escuelajs; return false to force re-login if expired
        return false;
      },
      logout() {
        set({ tokens: null, me: null });
      },
      async fetchMe() {
        try {
          const { data } = await api.get("/auth/profile");
          set({ me: data });
        } catch {
          /* set this up later */
        }
      },
    }),
    { name: "auth-store" }
  )
);
