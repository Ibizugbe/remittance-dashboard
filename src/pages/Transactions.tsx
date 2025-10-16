import { useTxStore } from "../store/transactions";
import { Table, Th, Td } from "../components/ui/Table";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import { fmtMoney, fmtDateTime } from "../utils/format";

export default function Transactions() {
  const items = useTxStore((s) => s.items);
  if (items.length === 0)
    return (
      <div className="container-pro">
        <EmptyState
          title="No transactions yet"
          subtitle="When you complete a transfer, it will appear here."
        />
      </div>
    );

  return (
    <section className="container-pro">
      <h1 className="text-2xl font-semibold font-display tracking-tight mb-3">
        Transactions
      </h1>
      <Table>
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
          {items.map((tx) => (
            <tr key={tx.id} className="hover:bg-slate-50">
              <Td>
                <div className="flex items-center gap-3">
                  <img
                    src={tx.recipient.avatar}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="leading-tight">
                    <div className="font-medium">{tx.recipient.name}</div>
                    <div className="text-xs text-slate-500">
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
              <Td className="text-slate-500">{fmtDateTime(tx.createdAt)}</Td>
              <Td>
                {tx.status === "success" ? (
                  <Badge color="green">Success</Badge>
                ) : tx.status === "pending" ? (
                  <Badge color="yellow">Pending</Badge>
                ) : (
                  <Badge color="red">Failed</Badge>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
