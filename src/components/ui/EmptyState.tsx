import { Box } from "iconsax-reactjs";
export default function EmptyState({
  title = "Nothing here yet",
  subtitle = "Start by creating a transfer.",
}) {
  return (
    <div className="text-center rounded-2xl p-10 bg-white">
      <div className="inline-grid place-items-center h-12 w-12 rounded-full bg-brand-50 mb-3">
        <Box size={22} className="text-brand-600" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-slate-600">{subtitle}</p>
    </div>
  );
}
