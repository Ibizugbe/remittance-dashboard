import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Th, Td } from "../components/ui/Table";
import EmptyState from "../components/ui/EmptyState";
import { CardSend, Receipt, Activity } from "iconsax-reactjs";
import { useTxStore } from "../store/transactions";
import { useRatesStore } from "../store/rates";
import { fmtMoney, fmtDateTime } from "../utils/format";

export default function Dashboard() {
  const items = useTxStore((s) => s.items);
  const { rate, base, to } = useRatesStore();

  const total = items.length;
  const success = items.filter((t) => t.status === "success");
  const successCount = success.length;
  const successRate = total ? Math.round((successCount / total) * 100) : 0;

  const recent = [...items]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold font-display tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-slate-600">
            Start a cross-border transfer or review recent activity.
          </p>
        </div>
        <Link to="/send">
          <Button variant="primary" size="lg" className="inline-flex gap-2">
            <CardSend size={18} /> Start transfer
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Transfers</div>
              <div className="text-2xl font-semibold">{total}</div>
            </div>
            <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <Receipt size={18} />
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {total
              ? `Last: ${fmtDateTime(items[items.length - 1].createdAt)}`
              : "No transfers yet"}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Success rate</div>
              <div className="text-2xl font-semibold">{successRate}%</div>
            </div>
            <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-700">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {successCount} successful of {total}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Live rate</div>
              <div className="text-lg font-semibold">
                {rate != null && base && to ? (
                  <>
                    1 {base} = {rate} {to}
                  </>
                ) : (
                  <span className="text-slate-400">No pair selected</span>
                )}
              </div>
            </div>
            <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
              <CardSend size={18} />
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Change pair on the Send flow
          </div>
        </Card>
      </div>

      <Card className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Send money</h2>
          <p className="text-sm text-slate-600">
            USD / GBP / CAD → NGN / ZAR with real-time rates.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/send">
            <Button variant="primary" className="inline-flex gap-2">
              <CardSend size={18} /> New transfer
            </Button>
          </Link>
          <Link to="/transactions">
            <Button variant="secondary">View all transactions</Button>
          </Link>
        </div>
      </Card>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold">Recent transactions</h3>
          <Link
            to="/transactions"
            className="text-sm text-brand-600 hover:underline"
          >
            See all
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            subtitle="When you complete a transfer, it will appear here."
          />
        ) : (
          <div className="mt-2">
            <div className="table-wrap">
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead className="bg-slate-50">
                    <tr>
                      <Th>Recipient</Th>
                      <Th>From</Th>
                      <Th>To</Th>
                      <Th>Rate</Th>
                      <Th>Date</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((tx) => (
                      <tr key={tx.id} className="border-t">
                        <Td>
                          <div className="flex items-center gap-3">
                            <img
                              src={tx.recipient.avatar}
                              alt=""
                              className="h-8 w-8 rounded-full"
                            />
                            <div className="leading-tight">
                              <div className="font-medium truncate max-w-[180px]">
                                {tx.recipient.name}
                              </div>
                              <div className="text-xs text-slate-500 truncate max-w-[220px]">
                                {tx.recipient.email}
                              </div>
                            </div>
                          </div>
                        </Td>
                        <Td>{fmtMoney(tx.fromAmount, tx.fromCurrency)}</Td>
                        <Td>{fmtMoney(tx.toAmount, tx.toCurrency)}</Td>
                        <Td>
                          1 {tx.fromCurrency} = {tx.rate} {tx.toCurrency}
                        </Td>
                        <Td className="text-slate-500">
                          {fmtDateTime(tx.createdAt)}
                        </Td>
                        <Td>
                          <span
                            className={[
                              "badge",
                              tx.status === "success"
                                ? "badge-green"
                                : tx.status === "pending"
                                ? "badge-yellow"
                                : "badge-red",
                            ].join(" ")}
                          >
                            {tx.status[0].toUpperCase() + tx.status.slice(1)}
                          </span>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
