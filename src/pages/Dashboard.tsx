import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <section>
      <h1 className="text-lg font-semibold mb-2">Welcome 👋</h1>
      <p className="text-sm text-slate-600 mb-4">
        Start a cross‑border transfer or review past transactions.
      </p>
      <Link
        to="/send"
        className="inline-block rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm"
      >
        Send Money
      </Link>
    </section>
  );
}
