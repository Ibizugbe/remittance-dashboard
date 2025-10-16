import { CardSend, Home2, Logout, Receipt1 } from "iconsax-reactjs";
import { NavLink } from "react-router-dom";

export default function Nav({
  onLogout,
  onNavigate,
}: {
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  const linkBase =
    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition";
  const active =
    "bg-brand-50 text-brand-700 ring-1 ring-brand-600/20 font-medium";
  const inactive = "text-slate-700 hover:bg-slate-50 hover:text-slate-900";

  return (
    <nav className="flex-1 overflow-y-auto p-3 space-y-1">
      <NavLink
        to="/"
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          `${linkBase} ${isActive ? active : inactive}`
        }
      >
        <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-700 group-[.active]:bg-brand-100 group-[.active]:text-brand-700">
          <Home2 size={18} />
        </span>
        Dashboard
      </NavLink>

      <NavLink
        to="/send"
        onClick={onNavigate}
        className={({ isActive }) =>
          `${linkBase} ${isActive ? active : inactive}`
        }
      >
        <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-700 group-[.active]:bg-brand-100 group-[.active]:text-brand-700">
          <CardSend size={18} />
        </span>
        Send money
      </NavLink>

      <NavLink
        to="/transactions"
        onClick={onNavigate}
        className={({ isActive }) =>
          `${linkBase} ${isActive ? active : inactive}`
        }
      >
        <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-700 group-[.active]:bg-brand-100 group-[.active]:text-brand-700">
          <Receipt1 size={18} />
        </span>
        Transactions
      </NavLink>

      <div className="pt-3 mt-3 border-t" />

      <button
        onClick={onLogout}
        className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 transition"
      >
        <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-red-100 group-hover:text-red-700">
          <Logout size={18} />
        </span>
        Logout
      </button>
    </nav>
  );
}
