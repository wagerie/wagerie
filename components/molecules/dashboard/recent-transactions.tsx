import { useTransactionHistory } from "@/hooks/use-wallet";
import React from "react";
import Link from "next/link";
import { Loader, Ticket, TrendingUp, Trophy, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/types";
import formatDate from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function getTransactionColor(type: string) {
  switch (type) {
    case "deposit":
      return "text-emerald-400";
    case "withdrawal":
      return "text-red-400";
    case "stake":
      return "text-amber-400";
    case "winnings":
      return "text-emerald-400 font-extrabold";
    case "refund":
      return "text-blue-400";
    default:
      return "text-slate-400";
  }
}

function getTransactionSign(type: string) {
  if (type === "deposit" || type === "refund" || type === "winnings") {
    return "+";
  }
  return "-";
}

function RecentTransactions({
  openDepositModal,
}: {
  openDepositModal: () => void;
}) {
  const { data: transactionsData, isLoading } = useTransactionHistory({
    pageSize: 5,
  });

  console.log("transactionsData", transactionsData);

  const recentTransactions = transactionsData?.data || [];

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-lg font-bold text-foreground">
          Recent Transactions
        </h2>
        <Link
          href="/transactions"
          className="text-xs font-semibold text-blue-400 hover:text-blue-300"
        >
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="flex min-h-[160px] items-center justify-center">
          <Loader className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      ) : recentTransactions.length === 0 ? (
        <div className="flex min-h-[160px] flex-col items-center justify-center text-center">
          <p className="mb-3 text-xs text-slate-400">
            No transactions yet. Fund your wallet to begin playing!
          </p>
          <Button
            size="sm"
            onClick={openDepositModal}
            className="rounded-xl bg-blue-600 hover:bg-blue-500"
          >
            Make First Deposit
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTransactions.map((tx: Transaction) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-muted p-3.5 text-xs"
            >
              <div>
                <p className="font-bold text-foreground capitalize">
                  {tx.type}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {formatDate(tx.createdAt, "MMM dd, yyyy • HH:mm")}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "font-black text-sm",
                    getTransactionColor(tx.type),
                  )}
                >
                  {getTransactionSign(tx.type)}${tx.amount}
                </p>
                <Badge className="border-0 bg-slate-800/80 text-[10px] text-slate-400 capitalize mt-0.5">
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentTransactions;
