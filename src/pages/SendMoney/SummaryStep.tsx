import Button from "../../components/ui/Button";
import { useRatesStore } from "../../store/rates";
import { payWithPaystack } from "../../lib/paystack";
import { useNavigate } from "react-router-dom";
import { useTxStore } from "../../store/transactions";
import type { Currency, RecipientCurrency, Recipient } from "../../types";
import Card from "../../components/ui/Card";
import { fmtMoney } from "../../utils/format";
import { toast } from "react-toastify";

export default function SummaryStep({
  fromAmount,
  fromCurrency,
  toCurrency,
  recipient,
  onBack,
}: {
  fromAmount: number;
  fromCurrency: Currency;
  toCurrency: RecipientCurrency;
  recipient: Recipient;
  onBack: () => void;
}) {
  const { rate } = useRatesStore();
  const nav = useNavigate();
  const addTx = useTxStore((s) => s.add);

  const toAmount = rate ? +(fromAmount * rate).toFixed(2) : 0;
  const reference = `REF_${Date.now()}`;
  const fee = 0;

  const pay = () => {
    const amountKobo = Math.max(100, Math.round(toAmount * 100));
    payWithPaystack({
      email: recipient.email || "test@example.com",
      amountKobo,
      reference,
      onSuccess: (ref) => {
        addTx({
          id: ref,
          createdAt: new Date().toISOString(),
          fromAmount,
          fromCurrency,
          toAmount,
          toCurrency,
          rate: rate || 0,
          recipient,
          status: "success",
        });
        nav(`/success/${ref}`);
        toast.success("Payment successful");
      },
      onCancel: () => {
        toast.info("Payment cancelled.");
      },
    });
  };

  return (
    <section className="container-pro">
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold">Review payment details</h2>

        <Card>
          <div className="flex items-start justify-between py-2">
            <span className="text-slate-800">You send</span>
            <span className="font-semibold">
              {fmtMoney(fromAmount, fromCurrency)}
            </span>
          </div>

          <div className="flex items-start justify-between py-2">
            <span className="text-slate-800">Transfer fee</span>
            <span className="text-slate-700">{fmtMoney(fee, toCurrency)}</span>
          </div>

          <div className="flex items-start justify-between py-2">
            <span className="text-slate-800">Rate</span>
            <span className="text-slate-700">
              {rate != null ? `1 ${fromCurrency} = ${rate} ${toCurrency}` : "—"}
            </span>
          </div>

          <div className="my-2 h-px bg-slate-200" />
          <div className="flex items-start justify-between py-2">
            <span className="text-slate-800">Send to</span>
            <div className="text-right">
              <div className="font-semibold">{recipient.name}</div>
              {recipient.email && (
                <div className="text-sm text-slate-500">{recipient.email}</div>
              )}
            </div>
          </div>
          <div className="mt-2 h-px bg-slate-200" />
        </Card>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-5">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            className="sm:w-auto w-full"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={pay}
            className="sm:min-w-[200px] sm:w-auto w-full"
          >
            Send {fmtMoney(toAmount || 0, toCurrency)}
          </Button>
        </div>
      </div>
    </section>
  );
}
