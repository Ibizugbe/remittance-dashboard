export function getApiErrorMessage(
  err: any,
  fallback = "Something went wrong"
) {
  const a = err?.response?.data;
  const msg =
    (typeof a === "string" && a) || a?.message || a?.error || err?.message;

  if (!msg || /Network\s?Error/i.test(msg) || /Failed to fetch/i.test(msg)) {
    return "Network error — please check your connection and try again.";
  }
  if (/timeout/i.test(msg)) {
    return "Request timed out — please try again.";
  }
  return msg || fallback;
}
