import type { HTMLInputTypeAttribute } from "react";

export function Field({
  id,
  label,
  error,
  hint,
  type = "text",
  ...rest
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  type?: HTMLInputTypeAttribute;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        {...rest}
      />
      {hint && !error && (
        <div id={`${id}-hint`} className="mt-1 text-xs text-slate-500">
          {hint}
        </div>
      )}
      {error && (
        <div
          id={`${id}-err`}
          role="alert"
          className="mt-1 text-xs text-red-600"
        >
          {error}
        </div>
      )}
    </div>
  );
}
