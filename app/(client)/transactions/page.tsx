"use client";

import {
  transactionLabel,
  transactionAmount,
  transactionAmountClass,
  TRANSACTION_DATE_FORMAT,
} from "@/lib/transaction-presentation";
import { TransactionStatusBadge } from "@/components/atoms/transaction-status-badge";
import { QueryFeedback } from "@/components/molecules/query-feedback";
import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import formatDate from "@/lib/format-date";
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Coins,
  Receipt,
  Filter,
  Wallet,
  Sparkles,
  Trophy,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/molecules/data-table";
import { SummaryStatCard } from "@/components/molecules/summary-stat-card";
import SelectComponent from "@/components/atoms/select-component";
import { useTransactionHistory, useGetBalance } from "@/hooks/use-wallet";
import { Transaction, TransactionType, TransactionStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";

const transactionTypeOptions: {
  value: TransactionType | "all";
  label: string;
}[] = [
  { value: "all", label: "All Types" },
  { value: "deposit", label: "Deposits" },
  { value: "withdrawal", label: "Withdrawals" },
  { value: "stake", label: "Draw Entries" },
  { value: "refund", label: "Refunds" },
  { value: "winnings", label: "Prize Winnings" },
];

const transactionStatusOptions: {
  value: TransactionStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

function getTransactionIcon(type: TransactionType) {
  switch (type) {
    case "deposit":
      return <ArrowDownRight className="w-4 h-4 text-emerald-400" />;
    case "withdrawal":
      return <ArrowUpRight className="w-4 h-4 text-red-400" />;
    case "stake":
      return <TrendingDown className="w-4 h-4 text-amber-400" />;
    case "winnings":
      return <Trophy className="w-4 h-4 text-emerald-400" />;
    case "refund":
      return <ArrowDownRight className="w-4 h-4 text-blue-400" />;
    default:
      return <Coins className="w-4 h-4 text-muted-foreground" />;
  }
}

export default function TransactionsPage() {
  const [selectedType, setSelectedType] = useState<TransactionType | "">("");
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | "">(
    "",
  );
  const [page, setPage] = useState(1);

  const {
    data: wallet,
    isLoading: walletLoading,
    isError: walletError,
  } = useGetBalance();
  const {
    data: transactionsData,
    isLoading: txLoading,
    isError: txError,
    refetch,
  } = useTransactionHistory({
    type: selectedType || undefined,
    status: selectedStatus || undefined,
    page,
    pageSize: 10,
  });

  const isLoading = walletLoading || txLoading;
  const transactions = transactionsData?.items || [];
  const totalPages = transactionsData?.pageCount || 1;
  const balance = wallet?.balance;
  const summaryCards = [
    {
      id: "balance",
      label: "Available Balance",
      value: walletLoading
        ? "Loading…"
        : walletError || balance == null
          ? "Unavailable"
          : formatCurrency(balance, wallet?.currency),
      icon: Wallet,
      iconClassName: "bg-emerald-500/10 text-emerald-400",
      className: "rounded-3xl p-5",
      valueClassName: "text-2xl",
    },
    {
      id: "records",
      label: "Total Records",
      value: txLoading
        ? "Loading…"
        : txError
          ? "Unavailable"
          : transactionsData?.totalItems || 0,
      icon: Receipt,
      iconClassName: "bg-blue-500/10 text-blue-400",
      className: "rounded-3xl p-5",
      valueClassName: "text-2xl",
    },
    {
      id: "currency",
      label: "Operating Currency",
      value: wallet?.currency || "Not available",
      icon: Sparkles,
      iconClassName: "bg-amber-500/10 text-amber-400",
      className: "rounded-3xl p-5",
      valueClassName: "text-2xl",
    },
  ];

  // Define columns for the data table
  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "type",
        header: "Type/ Provider",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary border border-border shrink-0">
              {getTransactionIcon(row.original.type)}
            </div>
            <div>
              <span className="font-bold text-foreground text-xs block capitalize">
                {transactionLabel(row.original.type)}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize">
                {row.original.provider}
              </span>
            </div>
          </div>
        ),
      },

      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          return (
            <span
              className={cn(
                "text-sm font-black tabular-nums",
                transactionAmountClass(row.original),
              )}
            >
              {transactionAmount(row.original)}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <TransactionStatusBadge status={row.original.status} />
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Timestamp",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {formatDate(row.original.createdAt, TRANSACTION_DATE_FORMAT)}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <DashboardLayout>
      <div className="min-h-full bg-background text-foreground p-4 lg:p-8 space-y-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge className="border-0 bg-blue-500/10 text-xs font-semibold uppercase tracking-widest text-blue-400">
                <Receipt className="mr-1 h-3 w-3" />
                Ledger
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Wallet Transactions
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Complete verifiable ledger of deposits, draw entries, prize
              winnings, and wallet withdrawals.
            </p>
          </div>

          {/* Stats Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {summaryCards.map(({ id, ...card }) => (
              <SummaryStatCard key={id} {...card} />
            ))}
          </div>

          {/* Filters Bar */}
          <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectComponent
                label="Filter by Type"
                value={selectedType}
                onValueChange={(value: any) => {
                  setSelectedType(value === "all" ? "" : value);
                  setPage(1);
                }}
                options={transactionTypeOptions}
                placeholder="All transaction types"
              />
              <SelectComponent
                label="Filter by Status"
                value={selectedStatus}
                onValueChange={(value: any) => {
                  setSelectedStatus(value === "all" ? "" : value);
                  setPage(1);
                }}
                options={transactionStatusOptions}
                placeholder="All statuses"
              />
            </div>
          </div>

          {txError && (
            <QueryFeedback
              message="Transaction history could not be loaded."
              onRetry={() => void refetch()}
            />
          )}
          {/* Transactions Table Container */}
          {!txError && (
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
              <DataTable
                columns={columns}
                data={transactions}
                pageCount={totalPages}
                pageIndex={page - 1}
                pageSize={10}
                isLoading={isLoading}
                emptyMessage="No transactions recorded yet"
                onPaginationChange={(state) => setPage(state.pageIndex + 1)}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
