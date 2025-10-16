export const fmtMoney = (n: number, ccy: string) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(
    n
  );
export const fmtDateTime = (iso: string) => new Date(iso).toLocaleString();
