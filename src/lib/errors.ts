export function toErrorMessage(
  err: unknown,
  fallback = "Something went wrong"
) {
  if (!err) return fallback;

  const any = err as any;
  const msg =
    any?.response?.data?.message ||
    any?.response?.data?.error ||
    any?.message ||
    any?.error ||
    (typeof err === "string" ? err : null);

  if (typeof msg === "string") return msg;

  if (
    msg &&
    typeof msg === "object" &&
    "message" in msg &&
    typeof msg.message === "string"
  ) {
    return msg.message as string;
  }

  try {
    return JSON.stringify(any);
  } catch {
    return fallback;
  }
}
