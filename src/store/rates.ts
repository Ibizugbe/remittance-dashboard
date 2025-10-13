import { create } from "zustand";
import type { Currency, RecipientCurrency } from "../types";

interface RatesState {
  base: Currency | null;
  to: RecipientCurrency | null;
  rate: number | null;
  loading: boolean;
  error?: string;
  fetchRate: (base: Currency, to: RecipientCurrency) => Promise<void>;
}

export const useRatesStore = create<RatesState>((set) => ({
  base: null,
  to: null,
  rate: null,
  loading: false,
  async fetchRate(base, to) {
    set({ loading: true, error: undefined });
    try {
      // fawazahmed0 API: https://cdn.jsdelivr.net/gh/fawazahmed0/exchange-api@1/latest/currencies/{baseLower}/{toLower}.json
      const res = await fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/exchange-api@1/latest/currencies/${base.toLowerCase()}/${to.toLowerCase()}.json`
      );
      const data = await res.json();
      set({ base, to, rate: data[to.toLowerCase()], loading: false });
    } catch (e: any) {
      set({ loading: false, error: "Could not fetch rates" });
    }
  },
}));
