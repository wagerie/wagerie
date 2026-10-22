import type { Transaction } from "@/lib/types";
import {
  finiteAmount,
  normalizeTransactionType,
  transactionSign,
} from "@/lib/account-state";
import { formatCurrency } from "@/lib/utils";

export function transactionLabel(type: string): string {
  const labels: Record<string, string> = {
    deposit: "Wallet Deposit",
    withdrawal: "Wallet Withdrawal",
    stake: "Draw Entry",
    winnings: "Prize Winnings",
    refund: "Refund",
  };
  const normalized = normalizeTransactionType(type);
  return labels[normalized] || normalized.replace(/_/g, " ");
}

export function transactionAmount(
  transaction: Pick<Transaction, "type" | "direction" | "amount">,
): string {
  const amount = finiteAmount(transaction.amount);
  if (amount === null) return "Unavailable";
  return `${transactionSign(transaction)}${formatCurrency(Math.abs(amount))}`;
}

export function transactionAmountClass(
  transaction: Pick<Transaction, "type" | "direction">,
): string {
  return transactionSign(transaction) === "+"
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-foreground";
}

export const TRANSACTION_DATE_FORMAT = "MMM dd, yyyy • HH:mm";

export function transactionStatus(status: string) {
  const statuses: Record<string, { label: string; className: string }> = {
    completed: {
      label: "Completed",
      className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    },
    pending: {
      label: "Pending",
      className: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    },
    failed: {
      label: "Failed",
      className: "bg-red-500/15 text-red-700 dark:text-red-400",
    },
  };
  return (
    statuses[status] || {
      label: status,
      className: "bg-muted text-muted-foreground",
    }
  );
}
