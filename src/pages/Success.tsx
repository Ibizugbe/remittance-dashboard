import { Link, useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  TickCircle,
  DocumentDownload,
  Copy,
  ArrowRight2,
} from "iconsax-reactjs";
import { useTxStore } from "../store/transactions";
import { fmtDateTime, fmtMoney } from "../utils/format";
import { toast } from "react-toastify";
import { useMemo } from "react";

export default function Success() {
  const { id } = useParams();
  const tx = useTxStore((s) => s.items.find((t) => t.id === id));

  const title = useMemo(
    () => (tx ? "Transfer Successful" : "Payment Successful"),
    [tx]
  );

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(id || "");
      toast.success("Reference copied");
    } catch {
      toast.error("Could not copy reference");
    }
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <section className="container-pro py-10 print:py-0">
      <div className="max-w-3xl mx-auto">
        {/* Animated success badge */}
        <div className="flex justify-center mb-4 print:hidden">
          <div className="relative h-14 w-14">
            {/* ripple */}
            <span className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-60" />
            {/* main badge */}
            <span className="relative inline-grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-700 shadow-sm animate-[scaleIn_.3s_ease-out]">
              <TickCircle size={24} />
            </span>
          </div>
        </div>

        <Card className="max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-slate-600 mt-1">
              Reference: <span className="font-medium">{id}</span>
            </p>

            <div className="mt-3 flex items-center justify-center gap-2 print:hidden">
              <Button
                variant="secondary"
                onClick={copyRef}
                className="inline-flex gap-2"
              >
                <Copy size={16} /> Copy reference
              </Button>
              <Button
                variant="secondary"
                onClick={printReceipt}
                className="inline-flex gap-2"
              >
                <DocumentDownload size={16} /> Download receipt
              </Button>
            </div>
          </div>

          {/* Summary */}
          {tx ? (
            <div className="mt-6 grid gap-2 text-sm">
              <Row
                label="You sent"
                value={fmtMoney(tx.fromAmount, tx.fromCurrency)}
              />
              <Row
                label="Recipient got"
                value={fmtMoney(tx.toAmount, tx.toCurrency)}
              />
              <Row
                label="Rate"
                value={`1 ${tx.fromCurrency} = ${tx.rate} ${tx.toCurrency}`}
                subtle
              />
              <Divider />
              <Row
                label="Recipient"
                value={
                  <div className="text-right">
                    <div className="font-medium">{tx.recipient.name}</div>
                    {tx.recipient.email && (
                      <div className="text-xs text-slate-500">
                        {tx.recipient.email}
                      </div>
                    )}
                  </div>
                }
              />
              <Row label="Date" value={fmtDateTime(tx.createdAt)} subtle />
              <Row label="Status" value={<StatusBadge />} />
            </div>
          ) : (
            <p className="mt-6 text-sm text-slate-600 text-center">
              We couldn’t find a saved record for this reference on your device.
              You can still view all transfers from your transactions page.
            </p>
          )}

          {/* CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <Link to="/transactions" className="print:hidden">
              <Button variant="secondary" className="inline-flex gap-2">
                View transactions
              </Button>
            </Link>
            <Link to="/send" className="print:hidden">
              <Button className="inline-flex gap-2">
                Make another transfer <ArrowRight2 size={18} />
              </Button>
            </Link>
          </div>
        </Card>

        <p className="mt-4 text-xs text-slate-500 text-center print:hidden">
          Tip: You’ll find this receipt in{" "}
          <span className="font-medium">Transactions</span> anytime.
        </p>
      </div>

      <style>
        {`
          @keyframes scaleIn { 
            0% { transform: scale(.8); opacity: .6 } 
            100% { transform: scale(1); opacity: 1 } 
          }
        `}
      </style>
    </section>
  );
}

// some UI helpers just for only this success flow
function Row({
  label,
  value,
  subtle,
}: {
  label: string;
  value: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-1">
      <span className={subtle ? "text-slate-600" : "text-slate-800"}>
        {label}
      </span>
      <span
        className={subtle ? "text-slate-600" : "font-medium text-slate-900"}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="my-2 h-px bg-slate-200" />;
}

function StatusBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 text-xs px-2 py-0.5">
      Success
    </span>
  );
}
