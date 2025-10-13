export default function Stepper({ step }: { step: number }) {
  return (
    <div
      className="flex items-center gap-2 mb-4"
      aria-label={`Step ${step} of 3`}
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full ${
            i <= step ? "bg-indigo-600" : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}
