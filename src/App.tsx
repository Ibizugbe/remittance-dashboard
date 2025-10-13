import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/auth";
import { Home2, Logout, CardSend, Receipt1 } from "iconsax-reactjs";

export default function App() {
  const { me, logout } = useAuthStore();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div className="flex items-center gap-2">
          <span className="font-bold">RemitX</span>
          <span className="text-xs text-slate-500">Secure Cross‑Border</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">{me?.email}</span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
            aria-label="Logout"
          >
            <Logout size={18} /> Logout
          </button>
        </div>
      </header>
      <nav className="flex gap-4 px-4 py-2 bg-white border-b">
        <Link className="inline-flex items-center gap-1 hover:underline" to="/">
          <Home2 size={18} />
          Dashboard
        </Link>
        <Link
          className="inline-flex items-center gap-1 hover:underline"
          to="/send"
        >
          <CardSend size={18} />
          Send
        </Link>
        <Link
          className="inline-flex items-center gap-1 hover:underline"
          to="/transactions"
        >
          <Receipt1 size={18} />
          Transactions
        </Link>
      </nav>
      <main className="p-4 max-w-3xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
