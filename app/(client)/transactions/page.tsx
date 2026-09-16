"use client";

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
      return <Coins className="w-4 h-4 text-slate-400" />;
  }
}

function getTransactionLabel(type: TransactionType) {
  const labels: Record<TransactionType, string> = {
    deposit: "Wallet Deposit",
    withdrawal: "Bank Withdrawal",
    stake: "Draw Ticket Entry",
    winnings: "Prize Win Claim",
    refund: "Draw Refund",
  };
  return labels[type] || type;
}

function getStatusBadge(status: TransactionStatus) {
  switch (status) {
    case "completed":
      return (
        <Badge className="border-0 bg-emerald-500/15 text-emerald-400 font-semibold">
          Completed
        </Badge>
      );
    case "pending":
      return (
        <Badge className="border-0 bg-amber-500/15 text-amber-400 font-semibold">
          Processing
        </Badge>
      );
    case "failed":
      return (
        <Badge className="border-0 bg-red-500/15 text-red-400 font-semibold">
          Failed
        </Badge>
      );
    default:
      return (
        <Badge className="border-0 bg-slate-800 text-slate-400">{status}</Badge>
      );
  }
}

export default function TransactionsPage() {
  const [selectedType, setSelectedType] = useState<TransactionType | "">("");
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | "">(
    "",
  );
  const [page, setPage] = useState(1);

  const { data: wallet, isLoading: walletLoading } = useGetBalance();
  const { data: transactionsData, isLoading: txLoading } =
    useTransactionHistory({
      type: selectedType || undefined,
      status: selectedStatus || undefined,
      page,
      pageSize: 10,
    });

  const isLoading = walletLoading || txLoading;
  const transactions = (transactionsData as any)?.data?.items || [];
  const totalPages =
    (transactionsData as any)?.data?.pagination?.totalPages || 1;
  const balance = (wallet as any)?.data?.balance ?? 0;

  // Define columns for the data table
  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "type",
        header: "Type/ Provider",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
              {getTransactionIcon(row.original.type)}
            </div>
            <div>
              <span className="font-bold text-white text-xs block">
                {getTransactionLabel(row.original.type)}
              </span>
              <span className="text-[10px] text-slate-500 capitalize">
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
          const isPositive =
            row.original.type === "deposit" ||
            row.original.type === "refund" ||
            row.original.type === "winnings";

          return (
            <span
              className={cn(
                "text-sm font-black tabular-nums",
                isPositive ? "text-emerald-400" : "text-slate-200",
              )}
            >
              {isPositive ? "+" : "-"}
              {formatCurrency(parseFloat(row.original.amount))}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
      {
        accessorKey: "createdAt",
        header: "Timestamp",
        cell: ({ row }) => (
          <span className="text-xs text-slate-400">
            {formatDate(row.original.createdAt, "MMM dd, yyyy • HH:mm")}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <DashboardLayout userEmail="player@wagerie.com">
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
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Wallet Transactions
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Complete verifiable ledger of deposits, draw entries, prize
              winnings, and bank withdrawals.
            </p>
          </div>

          {/* Stats Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">
                    Available Balance
                  </p>
                  <p className="text-2xl font-black text-white">
                    {formatCurrency(balance)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">
                    Total Records
                  </p>
                  <p className="text-2xl font-black text-white">
                    {transactionsData?.total || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">
                    Operating Currency
                  </p>
                  <p className="text-2xl font-black text-white">USDT ($)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          {/* <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectComponent
                label="Filter by Type"
                value={selectedType}
                onValueChange={(value: any) =>
                  setSelectedType(value === "all" ? "" : value)
                }
                options={transactionTypeOptions}
                placeholder="All transaction types"
              />
              <SelectComponent
                label="Filter by Status"
                value={selectedStatus}
                onValueChange={(value: any) =>
                  setSelectedStatus(value === "all" ? "" : value)
                }
                options={transactionStatusOptions}
                placeholder="All statuses"
              />
            </div>
          </div> */}

          {/* Transactions Table Container */}
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
        </div>
      </div>
    </DashboardLayout>
  );
}
