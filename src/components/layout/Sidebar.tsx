import { NavLink } from "react-router-dom";
import {
  Home2,
  CardSend,
  Receipt1,
  Logout,
  ArrowLeft2,
  ArrowRight2,
} from "iconsax-reactjs";
import { useState, useRef } from "react";

type SidebarProps = {
  meEmail?: string;
  onLogout: () => void;
  onNavigate?: () => void;
};

const navItems = [
  { to: "/", label: "Dashboard", Icon: Home2, exact: true },
  { to: "/send", label: "Send money", Icon: CardSend },
  { to: "/transactions", label: "Transactions", Icon: Receipt1 },
];

export default function Sidebar({
  meEmail,
  onLogout,
  onNavigate,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Spotlight effect (Aceternity style): set CSS vars on mouse move
  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  return (
    <aside
      ref={ref}
      onMouseMove={handleMouseMove}
      className={[
        "relative flex h-screen flex-col bg-white/80 backdrop-blur border-r",
        "transition-[width] duration-300",
        collapsed ? "w-[5.25rem]" : "w-[18rem]",
      ].join(" ")}
      style={{
        // radial spotlight behind content
        backgroundImage:
          "radial-gradient(120px 120px at var(--mx, -200px) var(--my, -200px), rgba(99,102,241,0.10), transparent 70%)",
      }}
    >
      {/* Brand */}
      <div className="px-3 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-100 text-brand-700 font-bold">
            RX
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-semibold">RemitX</div>
              <div className="text-xs text-slate-500">Secure Cross-Border</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map(({ to, label, Icon, exact }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={!!exact}
                onClick={onNavigate}
                className={({ isActive }) =>
                  [
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-brand-50 text-brand-700 ring-1 ring-brand-600/20 font-medium"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full bg-brand-600" />
                    )}
                    <span
                      className={[
                        "grid h-8 w-8 place-items-center rounded-lg",
                        "bg-slate-100 text-slate-700",
                        "group-[.active]:bg-brand-100 group-[.active]:text-brand-700",
                      ].join(" ")}
                    >
                      <Icon size={18} />
                    </span>
                    {!collapsed && <span className="truncate">{label}</span>}

                    {/* Tooltip when collapsed */}
                    {collapsed && (
                      <span
                        className="pointer-events-none absolute left-[3.25rem] z-20 rounded-lg bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow
                                   translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition"
                        role="tooltip"
                      >
                        {label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="mt-3 border-t" />

        {/* Logout */}
        <button
          onClick={onLogout}
          className={[
            "group mt-3 w-full relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
            "text-slate-700 hover:bg-red-50 hover:text-red-700",
          ].join(" ")}
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-red-100 group-hover:text-red-700">
            <Logout size={18} />
          </span>
          {!collapsed && <span>Logout</span>}
          {collapsed && (
            <span
              className="pointer-events-none absolute left-[3.25rem] z-20 rounded-lg bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow
                         translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition"
              role="tooltip"
            >
              Logout
            </span>
          )}
        </button>
      </nav>

      {/* User footer + collapse toggle */}
      <div className="mt-auto border-t p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 grid place-items-center text-xs font-semibold">
              {meEmail ? meEmail.slice(0, 2).toUpperCase() : "U"}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">
                  {meEmail ?? "Signed in"}
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs text-brand-600 hover:underline"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((s) => !s)}
            className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-white hover:bg-slate-50"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ArrowRight2 size={18} /> : <ArrowLeft2 size={18} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
