import { Link, useParams } from "react-router-dom";

export default function Success() {
  const { id } = useParams();
  return (
    <div className="bg-white p-6 rounded-2xl shadow text-center">
      <h1 className="text-xl font-semibold">Payment Successful 🎉</h1>
      <p className="text-sm text-slate-600 mt-2">Reference: {id}</p>
      <Link
        to="/transactions"
        className="inline-block mt-4 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm"
      >
        View Transactions
      </Link>
    </div>
  );
}
