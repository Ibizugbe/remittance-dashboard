import { useEffect, useState } from "react";
import { useRecipientsStore } from "../../store/recipients";
import Button from "../../components/ui/Button";
import type { RecipientCurrency, Recipient } from "../../types";

const natFor = (to: RecipientCurrency): "ng" | "za" | "gb" =>
  to === "NGN" ? "ng" : to === "ZAR" ? "za" : "gb";

export default function RecipientStep({
  toCurrency,
  onBack,
  onNext,
}: {
  toCurrency: RecipientCurrency;
  onBack: () => void;
  onNext: (r: Recipient) => void;
}) {
  const nat = natFor(toCurrency);
  const { getForCountry, loading } = useRecipientsStore();
  const [list, setList] = useState<Recipient[]>([]);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    (async () => setList(await getForCountry(nat)))();
  }, [nat, getForCountry]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="font-medium mb-3">Choose recipient</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {list.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelected(r.id)}
            className={`flex items-center gap-3 border rounded-xl p-3 text-left ${
              selected === r.id
                ? "ring-2 ring-indigo-600 bg-indigo-50"
                : "hover:bg-slate-50"
            }`}
            aria-pressed={selected === r.id}
          >
            <img src={r.avatar} alt="" className="h-10 w-10 rounded-full" />
            <div className="text-sm">
              <div className="font-medium">{r.name}</div>
              <div className="text-slate-500">{r.email}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          onClick={onBack}
          className="bg-slate-200 text-slate-900"
        >
          Back
        </Button>
        <Button
          type="button"
          disabled={!selected || loading}
          onClick={() => {
            const r = list.find((x) => x.id === selected);
            if (r) onNext(r);
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
