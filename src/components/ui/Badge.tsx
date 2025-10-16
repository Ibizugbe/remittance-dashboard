export default function Badge({
  children,
  color = "slate" as "slate" | "green" | "yellow" | "red",
}: {
  children: React.ReactNode;
  color?: "slate" | "green" | "yellow" | "red";
}) {
  const map: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[color]}`}
    >
      {children}
    </span>
  );
}
