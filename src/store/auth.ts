import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/axios";
import type { AuthTokens, UserProfile } from "../types";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../utils/errors";
import { toErrorMessage } from "../lib/errors";

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
          const tokens: AuthTokens = { access_token: data.access_token };
          set({ tokens, loading: false });
          await get().fetchMe();
          toast.success("Signed in successfully");
          return true;
        } catch (e: any) {
          const message = getApiErrorMessage(e, "Invalid credentials");
          set({
            loading: false,
            error: toErrorMessage(e, "Invalid credentials"),
          });
          toast.error(message, { toastId: "login-error" });
          return false;
        }
      },

      async refresh() {
        // currently there's no real refresh endpoint on Escuelajs; So i return false to force re-login if expired
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
