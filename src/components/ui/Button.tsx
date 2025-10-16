import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const button = cva(
  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-600",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-300",
        ghost:
          "bg-transparent hover:bg-slate-100 text-slate-700 focus-visible:ring-slate-300",
        danger:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-3 text-base",
      },
      full: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export default function Button({
  className,
  variant,
  size,
  full,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(button({ variant, size, full }), className)}
    />
  );
}
