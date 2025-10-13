import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Recipient } from "../types";

interface RecipientsState {
  cache: Record<string, Recipient[]>; // keyed by nat (gb, ng, za)
  loading: boolean;
  error?: string;
  getForCountry: (nat: "gb" | "ng" | "za") => Promise<Recipient[]>;
}

export const useRecipientsStore = create<RecipientsState>()(
  persist(
    (set, get) => ({
      cache: {},
      loading: false,
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
          set({ loading: false, error: "Could not load recipients" });
          return [];
        }
      },
    }),
    { name: "recipients-cache" }
  )
);
