import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import type { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const tokens = useAuthStore((s) => s.tokens);
  const location = useLocation();
  if (!tokens)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}
