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

const apiBase = (date = "latest") =>
  `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies`;
const cfBase = (date = "latest") =>
  `https://${date}.currency-api.pages.dev/v1/currencies`;

async function fetchRateOnce(base: string, to: string, date = "latest") {
  const baseL = base.toLowerCase();
  const toL = to.toLowerCase();

  const urls = [
    `${apiBase(date)}/${baseL}.json`,
    `${cfBase(date)}/${baseL}.json`,
  ];

  for (const url of urls) {
    const res = await fetch(url);
    if (!res.ok) continue;
    const data = await res.json(); // shape: { date: 'YYYY-MM-DD', <base>: { <to>: number, ... } }
    const rate = data?.[baseL]?.[toL];
    if (rate != null) return rate;
  }
  throw new Error("No rate found");
}

export const useRatesStore = create<RatesState>((set) => ({
  base: null,
  to: null,
  rate: null,
  loading: false,
  async fetchRate(base, to) {
    set({ loading: true, error: undefined });
    try {
      const rate = await fetchRateOnce(base, to, "latest"); // or 'YYYY-MM-DD'
      set({ base, to, rate, loading: false });
    } catch (e: any) {
      set({ loading: false, error: e?.message ?? "Could not fetch rates" });
    }
  },
}));
