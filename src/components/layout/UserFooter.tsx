export default function UserFooter({
  meEmail,
  onLogout,
}: {
  meEmail?: string;
  onLogout: () => void;
}) {
  return (
    <div className="mt-auto border-t p-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 grid place-items-center text-xs font-semibold">
          {meEmail ? meEmail.slice(0, 2).toUpperCase() : "U"}
        </div>
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
      </div>
    </div>
  );
}
