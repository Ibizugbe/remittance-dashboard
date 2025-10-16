import { Outlet, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "./store/auth";
import { Menu, CloseCircle } from "iconsax-reactjs";
import Nav from "./components/layout/Nav";
import Brand from "./components/layout/Brand";
import UserFooter from "./components/layout/UserFooter";

export default function App() {
  const { me, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b bg-white">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="inline-flex items-center justify-center h-9 w-9 rounded-lg border bg-white hover:bg-slate-50"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-bold">RemitX</span>
          <span className="text-xs text-slate-500">Secure Cross-Border</span>
        </div>
        <div className="text-xs text-slate-600">{me?.email}</div>
      </header>

      <div className="lg:grid lg:grid-cols-[18rem_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0 bg-white border-r">
          <Brand meEmail={me?.email} />
          <Nav onLogout={onLogout} />
          <UserFooter meEmail={me?.email} onLogout={onLogout} />
        </aside>

        {/* Drawer (mobile) */}
        {open && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-72 bg-white border-r shadow-xl flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  <span className="font-bold">RemitX</span>
                  <span className="text-xs text-slate-500">
                    Secure Cross-Border
                  </span>
                </div>
                <button
                  ref={closeBtnRef}
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation"
                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg border bg-white hover:bg-slate-50"
                >
                  <CloseCircle size={18} />
                </button>
              </div>
              <Nav
                onLogout={() => {
                  setOpen(false);
                  onLogout();
                }}
                onNavigate={() => setOpen(false)}
              />
              <UserFooter meEmail={me?.email} onLogout={onLogout} />
            </div>
          </div>
        )}

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
