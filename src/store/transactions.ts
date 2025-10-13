import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TransactionItem } from "../types";

interface TxState {
  items: TransactionItem[];
  add: (tx: TransactionItem) => void;
  clear: () => void;
}

export const useTxStore = create<TxState>()(
  persist(
    (set) => ({
      items: [],
      add: (tx) => set((s) => ({ items: [tx, ...s.items] })),
      clear: () => set({ items: [] }),
    }),
    { name: "tx-store" }
  )
);
