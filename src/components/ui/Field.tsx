import type { HTMLInputTypeAttribute } from "react";

export function Field({
  id,
  label,
  error,
  type = "text",
  ...rest
}: {
  id: string;
  label: string;
  error?: string;
  type?: HTMLInputTypeAttribute;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        {...rest}
      />
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
