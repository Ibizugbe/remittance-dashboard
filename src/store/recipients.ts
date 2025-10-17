import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Recipient } from "../types";
import { getApiErrorMessage } from "../utils/errors";
import { toast } from "react-toastify";
import { toErrorMessage } from "../lib/errors";

interface RecipientsState {
  cache: Record<string, Recipient[]>;
  loading: boolean;
  error?: string;
  getForCountry: (nat: "gb" | "ng" | "za") => Promise<Recipient[]>;
}

export const useRecipientsStore = create<RecipientsState>()(
  persist(
    (set, get) => ({
      cache: {},
      loading: false,
      error: undefined,
      async getForCountry(nat) {
        const existing = get().cache[nat];
        if (existing?.length) return existing;
        set({ loading: true, error: undefined });
        try {
          const res = await fetch(
            `https://randomuser.me/api/?results=10&nat=${nat}`
          );
          const json = await res.json();
          const mapped: Recipient[] = json.results.map((r: any) => ({
            id: r.login.uuid,
            name: `${r.name.first} ${r.name.last}`,
            email: r.email,
            phone: r.phone,
            countryCode: nat,
            avatar: r.picture.thumbnail,
          }));
          const next = { ...get().cache, [nat]: mapped };
          set({ cache: next, loading: false });
          return mapped;
        } catch (e: any) {
          const message = getApiErrorMessage(e, "Could not load recipients");
          set({
            loading: false,
            error: toErrorMessage(e, "Could not load recipients"),
          });
          toast.error(message, { toastId: `recipients-${nat}-error` });
          return [];
        }
      },
    }),
    { name: "recipients-cache" }
  )
);
