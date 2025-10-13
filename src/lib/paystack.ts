import PaystackPop from "@paystack/inline-js";

export function payWithPaystack(opts: {
  email: string;
  amountKobo: number;
  reference: string;
  onSuccess: (ref: string) => void;
  onCancel: () => void;
}) {
  const pk = import.meta.env.VITE_PAYSTACK_PK as string;
  const paystack = new PaystackPop();
  paystack.newTransaction({
    key: pk,
    email: opts.email,
    amount: opts.amountKobo,
    reference: opts.reference,
    onSuccess: (trx) => opts.onSuccess(trx.reference),
    onCancel: opts.onCancel,
  });
}
