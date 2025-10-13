import { useTxStore } from "../store/transactions";

export default function Transactions() {
  const items = useTxStore((s) => s.items);
  return (
    <section>
      <h1 className="text-lg font-semibold mb-3">Transactions</h1>
      <div className="grid gap-3">
        {items.map((tx) => (
          <div key={tx.id} className="bg-white p-4 rounded-2xl shadow">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium">{tx.recipient.name}</div>
              <div className="text-slate-500">
                {new Date(tx.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="mt-2 text-sm grid grid-cols-2 gap-2">
              <div>
                From: {tx.fromAmount} {tx.fromCurrency}
              </div>
              <div>
                To: {tx.toAmount} {tx.toCurrency}
              </div>
              <div>
                Rate: 1 {tx.fromCurrency} = {tx.rate} {tx.toCurrency}
              </div>
              <div>
                Status:{" "}
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    tx.status === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-500">No transactions yet.</p>
        )}
      </div>
    </section>
  );
}
