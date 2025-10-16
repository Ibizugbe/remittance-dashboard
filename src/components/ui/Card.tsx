import type { ReactNode } from "react";
export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-white shadow-card rounded-2xl p-5 ${className}`}>
      {children}
    </section>
  );
}
