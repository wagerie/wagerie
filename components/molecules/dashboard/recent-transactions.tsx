import { APP_ROUTES } from "@/constants/routes";
import {
  transactionLabel,
  transactionAmount,
  transactionAmountClass,
  TRANSACTION_DATE_FORMAT,
} from "@/lib/transaction-presentation";
import { TransactionStatusBadge } from "@/components/atoms/transaction-status-badge";
import { QueryFeedback } from "@/components/molecules/query-feedback";
import { useTransactionHistory } from "@/hooks/use-wallet";
import React from "react";
import Link from "next/link";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/types";
import formatDate from "@/lib/format-date";
import { cn } from "@/lib/utils";

function RecentTransactions({
  openDepositModal,
}: {
  openDepositModal: () => void;
}) {
  const {
    data: transactionsData,
    isLoading,
    isError,
    refetch,
  } = useTransactionHistory({
    page: 1,
    pageSize: 5,
  });

  const recentTransactions = transactionsData?.items || [];

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-lg font-bold text-foreground">
          Recent Transactions
        </h2>
        <Link
          href={APP_ROUTES.TRANSACTIONS}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300"
        >
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Loader className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      ) : isError ? (
        <QueryFeedback
          message="Transaction history is unavailable."
          onRetry={() => void refetch()}
        />
      ) : recentTransactions.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center text-center">
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
                  {transactionLabel(tx.type)}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground capitalize">
                  {tx.provider}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {formatDate(tx.createdAt, TRANSACTION_DATE_FORMAT)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "font-black text-sm",
                    transactionAmountClass(tx),
                  )}
                >
                  {transactionAmount(tx)}
                </p>
                <TransactionStatusBadge status={tx.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentTransactions;
