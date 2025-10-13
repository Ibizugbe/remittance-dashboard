import Button from "../../components/ui/Button";
import { useRatesStore } from "../../store/rates";
import { payWithPaystack } from "../../lib/paystack";
import { useNavigate } from "react-router-dom";
import { useTxStore } from "../../store/transactions";
import type { Currency, RecipientCurrency, Recipient } from "../../types";

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

  const pay = () => {
    // For demo: Paystack needs NGN amount in kobo; we simulate by multiplying USD-equivalent by 100 and treating as NGN test.
    const amountKobo = Math.max(100, Math.round(toAmount * 100));
    payWithPaystack({
      email: recipient.email || "test@example.com",
      amountKobo,
      reference,
      onSuccess: (ref) => {
        const tx = {
          id: ref,
          createdAt: new Date().toISOString(),
          fromAmount,
          fromCurrency,
          toAmount,
          toCurrency,
          rate: rate || 0,
          recipient,
          status: "success" as const,
        };
        addTx(tx);
        nav(`/success/${ref}`);
      },
      onCancel: () => {
        /* could log */
      },
    });
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="font-medium mb-3">Review & Pay</h2>
      <div className="text-sm grid gap-2">
        <div className="flex justify-between">
          <span>Sender</span>
          <span>
            {fromAmount} {fromCurrency}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Recipient gets</span>
          <span>
            {toAmount} {toCurrency}
          </span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Rate</span>
          <span>
            1 {fromCurrency} = {rate} {toCurrency}
          </span>
        </div>
        <div className="h-px bg-slate-200 my-2" />
        <div>
          <span className="text-slate-500">Recipient</span>
          <div className="font-medium">{recipient.name}</div>
          <div className="text-slate-500">{recipient.email}</div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          onClick={onBack}
          className="bg-slate-200 text-slate-900"
        >
          Back
        </Button>
        <Button type="button" onClick={pay}>
          Pay with Paystack (Test)
        </Button>
      </div>
    </div>
  );
}
