import { useEffect, useMemo, useState } from "react";
import { useRecipientsStore } from "../../store/recipients";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import type { RecipientCurrency, Recipient } from "../../types";
import { TickCircle, SearchNormal1 } from "iconsax-reactjs";

const natFor = (to: RecipientCurrency): "ng" | "za" | "gb" =>
  to === "NGN" ? "ng" : to === "ZAR" ? "za" : "gb";

const initials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "??";

export default function RecipientStep({
  toCurrency,
  onBack,
  onNext,
}: {
  toCurrency: RecipientCurrency;
  onBack: () => void;
  onNext: (r: Recipient) => void;
}) {
  const nat = useMemo(() => natFor(toCurrency), [toCurrency]);
  const { getForCountry, loading } = useRecipientsStore();
  const [list, setList] = useState<Recipient[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [q, setQ] = useState("");

  const selected = useMemo(
    () => list.find((x) => x.id === selectedId) || null,
    [list, selectedId]
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return list;
    return list.filter((r) => r.name.toLowerCase().includes(t));
  }, [list, q]);

  useEffect(() => {
    (async () => {
      const people = await getForCountry(nat);
      setList(people);
      if (people.length && !selectedId) setSelectedId(people[0].id);
    })();
  }, [nat, getForCountry]);

  return (
    <div className="space-y-4 grid justify-center">
      <div className="max-w-5xl">
        <div className="rounded-2xl bg-slate-50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selected?.avatar ? (
              <img
                src={selected.avatar}
                alt=""
                className="h-10 w-10 rounded-full ring-1 ring-black/5"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-slate-200 grid place-items-center text-slate-700 text-sm font-medium">
                {initials(selected?.name)}
              </div>
            )}
            <div className="leading-tight">
              <div className="text-sm text-slate-500">Recipient details</div>
              <div className="font-medium">{selected?.name || "—"}</div>
              <div className="text-xs text-slate-500">
                {selected?.email ||
                  selected?.phone ||
                  "Select a recipient below"}
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-1/2">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchNormal1 size={18} />
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name"
            className="w-full pl-10 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* List container */}
        <Card className="p-0 my-5">
          <div className="divide-y">
            {filtered.map((r) => {
              const active = selectedId === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  aria-pressed={active}
                  className={[
                    "w-full text-left px-4 py-4 sm:px-5 sm:py-5",
                    "focus:outline-none transition rounded-2xl",
                    active
                      ? "ring-2 ring-brand-500/90 border border-brand-300/40 bg-white"
                      : "hover:bg-slate-50",
                  ].join(" ")}
                  style={{
                    margin: "8px",
                  }}
                >
                  <div className="flex items-center gap-3">
                    {r.avatar ? (
                      <img
                        src={r.avatar}
                        alt=""
                        className="h-10 w-10 rounded-full ring-1 ring-black/5"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-100 grid place-items-center text-slate-700 text-sm font-medium">
                        {initials(r.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div
                        className={[
                          "font-semibold truncate",
                          active ? "text-brand-700" : "text-slate-900",
                        ].join(" ")}
                      >
                        {r.name}
                      </div>
                      <div className="text-slate-500 text-sm truncate">
                        {r.email || r.phone || "—"}
                      </div>
                    </div>
                    {active && (
                      <span className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white">
                        <TickCircle size={16} />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {!loading && filtered.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                No matches found.
              </div>
            )}
            {loading && (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                Loading recipients…
              </div>
            )}
          </div>
        </Card>

        {/* Footer actions */}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button
            type="button"
            disabled={!selectedId || loading}
            onClick={() => {
              const r = list.find((x) => x.id === selectedId);
              if (r) onNext(r);
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
