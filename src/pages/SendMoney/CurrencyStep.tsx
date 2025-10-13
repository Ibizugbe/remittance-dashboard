import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../../components/ui/Button";
import { useRatesStore } from "../../store/rates";
import type { Currency, RecipientCurrency } from "../../types";

const Schema = Yup.object({
  amount: Yup.number().positive("Must be > 0").required("Required"),
});

export default function CurrencyStep(props: {
  fromAmount: number;
  setFromAmount: (n: number) => void;
  fromCurrency: Currency;
  setFromCurrency: (c: Currency) => void;
  toCurrency: RecipientCurrency;
  setToCurrency: (c: RecipientCurrency) => void;
  onNext: () => void;
}) {
  const { rate, loading, fetchRate } = useRatesStore();

  return (
    <Formik
      initialValues={{
        amount: props.fromAmount,
        from: props.fromCurrency,
        to: props.toCurrency,
      }}
      validationSchema={Schema}
      onSubmit={async (v) => {
        await fetchRate(v.from, v.to);
        props.setFromAmount(v.amount);
        props.setFromCurrency(v.from);
        props.setToCurrency(v.to);
        props.onNext();
      }}
    >
      {({ values, errors, touched, handleChange }) => (
        <Form noValidate className="bg-white p-4 rounded-2xl shadow max-w-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">You send</label>
              <div className="flex">
                <select
                  name="from"
                  value={values.from}
                  onChange={handleChange}
                  className="rounded-l-xl border px-3 py-2 text-sm"
                >
                  <option>USD</option>
                  <option>GBP</option>
                  <option>CAD</option>
                </select>
                <input
                  name="amount"
                  inputMode="decimal"
                  value={values.amount}
                  onChange={handleChange}
                  className="flex-1 rounded-r-xl border px-3 py-2 text-sm"
                  placeholder="0.00"
                />
              </div>
              {touched.amount && errors.amount && (
                <div className="text-xs text-red-600 mt-1">{errors.amount}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Recipient gets
              </label>
              <div className="flex">
                <select
                  name="to"
                  value={values.to}
                  onChange={handleChange}
                  className="rounded-xl border px-3 py-2 text-sm w-full"
                >
                  <option value="NGN">NGN</option>
                  <option value="ZAR">ZAR</option>
                </select>
              </div>
              {rate != null && (
                <p className="text-xs text-slate-600 mt-1">
                  Last fetched rate:{" "}
                  <code>
                    1 {values.from} = {rate} {values.to}
                  </code>
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit" disabled={loading} aria-busy={loading}>
              {loading ? "Fetching rate…" : "Continue"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
