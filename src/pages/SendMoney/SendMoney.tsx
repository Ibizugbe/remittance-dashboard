import { useState } from "react";
import Stepper from "../../components/ui/Stepper";
import CurrencyStep from "./CurrencyStep";
import RecipientStep from "./RecipientStep";
import SummaryStep from "./SummaryStep";
import type { Currency, RecipientCurrency, Recipient } from "../../types";

export default function SendMoney() {
  const [step, setStep] = useState(1);
  const [fromAmount, setFromAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState<Currency>("USD");
  const [toCurrency, setToCurrency] = useState<RecipientCurrency>("NGN");
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div>
      <h1 className="text-lg font-semibold mb-2">Send Money</h1>
      <Stepper step={step} />
      {step === 1 && (
        <CurrencyStep
          fromAmount={fromAmount}
          setFromAmount={setFromAmount}
          fromCurrency={fromCurrency}
          setFromCurrency={setFromCurrency}
          toCurrency={toCurrency}
          setToCurrency={setToCurrency}
          onNext={next}
        />
      )}
      {step === 2 && (
        <RecipientStep
          toCurrency={toCurrency}
          onBack={back}
          onNext={(r) => {
            setRecipient(r);
            next();
          }}
        />
      )}
      {step === 3 && recipient && (
        <SummaryStep
          fromAmount={fromAmount}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          recipient={recipient}
          onBack={back}
        />
      )}
    </div>
  );
}
