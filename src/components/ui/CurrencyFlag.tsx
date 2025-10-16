// src/components/ui/CurrencyFlag.tsx
import { US, GB, CA, NG, ZA } from "country-flag-icons/react/3x2";

type Currency = "USD" | "GBP" | "CAD" | "NGN" | "ZAR";

// Use the actual component type instead of FC<SVGProps<SVGSVGElement>>
type FlagComponent = typeof US;

const map: Record<Currency, FlagComponent> = {
  USD: US,
  GBP: GB,
  CAD: CA,
  NGN: NG,
  ZAR: ZA,
};

export default function CurrencyFlag({
  ccy,
  className = "h-4 w-6 rounded-[2px] shadow-sm",
  alt,
}: {
  ccy: Currency;
  className?: string;
  /** Accessible label for screen readers */
  alt?: string;
}) {
  const Flag = map[ccy] ?? US; // safe fallback
  return <Flag className={className} role="img" aria-label={alt ?? ccy} />;
}
