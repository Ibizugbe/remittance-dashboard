export default function Brand({ meEmail }: { meEmail?: string }) {
  return (
    <div className="px-4 py-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">RemitX</span>
          <span className="text-xs text-slate-500">Secure Cross-Border</span>
        </div>
      </div>
      {meEmail && (
        <div className="mt-2 text-xs text-slate-500 truncate">{meEmail}</div>
      )}
    </div>
  );
}
