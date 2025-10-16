export default function Stepper({ step }: { step: number }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2" aria-label={`Step ${step} of 3`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i <= step ? "bg-brand-600" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <div className="mt-2 text-xs text-slate-500">Step {step} of 3</div>
    </div>
  );
}
