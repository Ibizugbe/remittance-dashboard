import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useRatesStore } from "../../store/rates";
import type { Currency, RecipientCurrency } from "../../types";
import { Flash, Money4 } from "iconsax-reactjs";
import CurrencyFlag from "../../components/ui/CurrencyFlag";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { toErrorMessage } from "../../lib/errors";

const Schema = Yup.object({
  amount: Yup.number()
    .typeError("Enter a valid number")
    .positive("Must be > 0")
    .required("Required"),
});

export default function CurrencyStep(props: {
  fromAmount: number;
  setFromAmount: (n: number) => void;
  fromCurrency: Currency;
  setFromCurrency: (c: Currency) => void;
  toCurrency: RecipientCurrency;
  setToCurrency: (c: RecipientCurrency) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const { rate, loading, error, fetchRate } = useRatesStore();
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.fromCurrency && props.toCurrency) {
      fetchRate(props.fromCurrency, props.toCurrency);
    }
  }, []);

  useEffect(() => {
    if (!loading && rate == null && !error)
      toast.info("Select a pair to see the live rate.", {
        toastId: "rate-null",
      });
  }, [rate, loading, error]);

  useEffect(() => {
    const el = amountRef.current;
    if (el) {
      el.focus();
      const len = el.value?.length ?? 0;
      el.setSelectionRange(len, len);
    }
  }, []);

  // Allowed control/navigation keys
  const CTRL_KEYS = new Set([
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Tab",
    "Home",
    "End",
  ]);

  const sanitize = (raw: string) => {
    let s = raw.replace(",", ".");
    s = s.replace(/[^\d.]/g, "");
    const parts = s.split(".");
    if (parts.length > 2) s = parts[0] + "." + parts.slice(1).join("");
    return s;
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        amount: props.fromAmount || 0,
        from: props.fromCurrency,
        to: props.toCurrency,
      }}
      validationSchema={Schema}
      onSubmit={async (v) => {
        await fetchRate(v.from, v.to);
        props.setFromAmount(Number(v.amount));
        props.setFromCurrency(v.from as Currency);
        props.setToCurrency(v.to as RecipientCurrency);
        props.onNext();
      }}
    >
      {({ values, errors, touched, setFieldValue }) => {
        const showError = touched.amount && !!errors.amount;

        const handleFromChange: React.ChangeEventHandler<
          HTMLSelectElement
        > = async (e) => {
          const newFrom = e.target.value as Currency;
          setFieldValue("from", newFrom);
          await fetchRate(newFrom, values.to as RecipientCurrency);
        };

        const handleToChange: React.ChangeEventHandler<
          HTMLSelectElement
        > = async (e) => {
          const newTo = e.target.value as RecipientCurrency;
          setFieldValue("to", newTo);
          await fetchRate(values.from as Currency, newTo);
        };

        const onAmountKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
          e
        ) => {
          const { key, currentTarget } = e;
          if (CTRL_KEYS.has(key) || e.ctrlKey || e.metaKey) return;
          if (key === "e" || key === "E" || key === "+" || key === "-") {
            e.preventDefault();
            return;
          }
          if (key === ".") {
            if (currentTarget.value.includes(".")) e.preventDefault();
            return;
          }
          if (!/^\d$/.test(key)) e.preventDefault();
        };

        const onAmountChange: React.ChangeEventHandler<HTMLInputElement> = (
          e
        ) => {
          const cleaned = sanitize(e.target.value);
          setFieldValue("amount", cleaned);
        };

        const onAmountPaste: React.ClipboardEventHandler<HTMLInputElement> = (
          e
        ) => {
          const pasted = e.clipboardData.getData("text");
          const cleaned = sanitize(pasted);
          e.preventDefault();
          setFieldValue("amount", cleaned);
        };

        return (
          <Form noValidate className="space-y-4 grid justify-center">
            <h2 className="text-xl font-semibold">Enter amount</h2>

            <Card className="max-w-3xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm text-slate-600 mb-1">
                      You send
                    </label>
                    <div className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
                      <CurrencyFlag ccy={values.from as any} />
                      <select
                        name="from"
                        value={values.from}
                        onChange={handleFromChange}
                        className="bg-transparent outline-none"
                        aria-label="Sender currency"
                      >
                        <option>USD</option>
                        <option>GBP</option>
                        <option>CAD</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <input
                      ref={amountRef}
                      name="amount"
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={values.amount}
                      onChange={onAmountChange}
                      onPaste={onAmountPaste}
                      onKeyDown={onAmountKeyDown}
                      placeholder="0"
                      aria-invalid={showError}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className="w-full border-0 bg-transparent outline-none text-6xl md:text-7xl
             placeholder:font-thin placeholder:text-slate-300 tracking-tight
             focus:outline-none focus:ring-0 caret-brand-600 selection:bg-brand-100/60"
                    />
                  </div>

                  {showError && (
                    <div role="alert" className="mt-1 text-xs text-red-600">
                      {errors.amount}
                    </div>
                  )}
                </div>
              </div>
              <div className="my-6 h-px bg-slate-200" />
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-grid place-items-center h-6 w-6 rounded-full bg-slate-100">
                      <Money4 size={14} className="text-slate-500" />
                    </span>
                    <span className="text-sm">Fee</span>
                  </div>
                  <span className="text-sm text-slate-500">—</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-grid place-items-center h-6 w-6 rounded-full bg-slate-100">
                      <Money4 size={14} className="text-slate-500" />
                    </span>
                    <span className="text-sm">Live rate</span>
                  </div>
                  <div className="text-right text-sm">
                    {rate != null ? (
                      <>
                        <div>
                          1 {values.from} ={" "}
                          {rate.toLocaleString(undefined, {
                            maximumFractionDigits: 6,
                          })}{" "}
                          {values.to}
                        </div>
                      </>
                    ) : error ? (
                      <span className="text-red-600">
                        {toErrorMessage(error, "Couldn’t load rate")}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="my-6 h-px bg-slate-200" />
              {/* TO */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-slate-600 mb-1">
                    Recipient receives
                  </label>
                  <div className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
                    <CurrencyFlag ccy={values.to as any} />
                    <select
                      name="to"
                      value={values.to}
                      onChange={handleToChange}
                      className="bg-transparent outline-none"
                      aria-label="Recipient currency"
                    >
                      <option value="NGN">NGN</option>
                      <option value="ZAR">ZAR</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-baseline gap-3">
                  <div className="text-6xl md:text-7xl tracking-tight">
                    {rate
                      ? (Number(values.amount || 0) * rate).toLocaleString(
                          undefined,
                          { maximumFractionDigits: 2 }
                        )
                      : "0"}
                  </div>
                </div>
              </div>
            </Card>

            <div className="max-w-3xl rounded-2xl bg-brand-50/50 border border-brand-50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Flash size={16} className="text-brand-600" />
                Instantly
              </div>
              <div className="flex items-center gap-2">
                {props.onBack && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={props.onBack}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={loading || !!errors.amount || rate == null}
                >
                  {loading ? "Fetching rate…" : "Continue"}
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
