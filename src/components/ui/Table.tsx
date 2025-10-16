import type { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">{children}</table>
      </div>
    </div>
  );
}

export function Th({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`text-left font-medium text-slate-600 px-4 py-3 ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}
