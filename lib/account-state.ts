import { APP_ROUTES, matchesAppRoute } from "@/constants/routes";
export function finiteAmount(value: unknown): number | null {
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  )
    return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function normalizeTransactionType(type: string): string {
  const aliases: Record<string, string> = {
    bet: "stake",
    win: "winnings",
    wallet_deposit: "deposit",
    wallet_withdrawal: "withdrawal",
    withdraw: "withdrawal",
  };
  const key = type.toLowerCase().trim();
  return aliases[key] || key;
}

export function transactionSign(transaction: {
  type: string;
  direction?: "credit" | "debit";
}): string {
  if (transaction.direction)
    return transaction.direction === "credit" ? "+" : "−";
  const type = normalizeTransactionType(transaction.type);
  if (["deposit", "refund", "winnings"].includes(type)) return "+";
  if (["withdrawal", "stake"].includes(type)) return "−";
  return "";
}

export function ticketNumbersFromResponse(payload: unknown): number[] {
  if (!payload || typeof payload !== "object") return [];
  const numbers = (payload as { ticketNumbers?: unknown }).ticketNumbers;
  if (!Array.isArray(numbers)) return [];
  return [
    ...new Set(
      numbers.filter(
        (number): number is number =>
          Number.isSafeInteger(number) && number >= 0,
      ),
    ),
  ];
}

export function safeAccountReturnPath(value: string | null): string | null {
  if (!value) return null;
  if (
    [
      APP_ROUTES.DASHBOARD,
      APP_ROUTES.PROFILE,
      APP_ROUTES.TRANSACTIONS,
      APP_ROUTES.POLLS,
      APP_ROUTES.MY_ENTRIES,
    ].some((route) => route === value)
  )
    return value;
  const identifier = value.slice(APP_ROUTES.POLLS.length + 1);
  return matchesAppRoute(value, APP_ROUTES.POLL_DETAIL) &&
    /^[a-zA-Z0-9_-]+$/.test(identifier)
    ? value
    : null;
}
