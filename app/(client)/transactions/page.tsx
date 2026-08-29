"use client";

import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import formatDate from "@/lib/format-date";
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/molecules/data-table";
import SelectComponent, {
  SelectOption,
} from "@/components/atoms/select-component";
import { useTransactionHistory, useGetBalance } from "@/hooks/use-wallet";
import { Transaction, TransactionType, TransactionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const CURRENT_USER_ID = "user-1";

const transactionTypeOptions: {
  value: TransactionType | "all";
  label: string;
}[] = [
  { value: "all", label: "All Types" },
  { value: "deposit", label: "Deposits" },
  { value: "withdrawal", label: "Withdrawals" },
  { value: "stake", label: "Stakes" },
  { value: "refund", label: "Refunds" },
  { value: "winnings", label: "Winnings" },
];

const transactionStatusOptions: {
  value: TransactionStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

function getTransactionIcon(type: TransactionType) {
  switch (type) {
    case "deposit":
      return <ArrowDownRight className="w-4 h-4 text-green-500" />;
    case "withdrawal":
      return <ArrowUpRight className="w-4 h-4 text-red-500" />;
    case "stake":
      return <TrendingDown className="w-4 h-4 text-orange-500" />;
    case "winnings":
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    case "refund":
      return <ArrowDownRight className="w-4 h-4 text-blue-500" />;
    default:
      return null;
  }
}

function getTransactionLabel(type: TransactionType) {
  const labels: Record<TransactionType, string> = {
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    stake: "Stake",
    winnings: "Winnings",
    refund: "Refund",
  };
  return labels[type];
}

function getStatusBadge(status: TransactionStatus) {
  const styles: Record<
    TransactionStatus,
    { bg: string; text: string; label: string }
  > = {
    pending: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-700 dark:text-yellow-400",
      label: "Pending",
    },
    completed: {
      bg: "bg-green-500/10",
      text: "text-green-700 dark:text-green-400",
      label: "Completed",
    },
    failed: {
      bg: "bg-red-500/10",
      text: "text-red-700 dark:text-red-400",
      label: "Failed",
    },
  };

  const style = styles[status];
  return (
    <span
      className={cn(
        "px-2 py-1 rounded text-xs font-medium",
        style.bg,
        style.text,
      )}
    >
      {style.label}
    </span>
  );
}

export default function TransactionsPage() {
  const [selectedType, setSelectedType] = useState<TransactionType | "">("");
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | "">(
    "",
  );
  const [page, setPage] = useState(1);

  const { data: wallet, isLoading: walletLoading } =
    useGetBalance(CURRENT_USER_ID);
  const { data: transactionsData, isLoading: txLoading } =
    useTransactionHistory(CURRENT_USER_ID, {
      type: selectedType || undefined,
      status: selectedStatus || undefined,
      page,
      pageSize: 10,
    });

  const isLoading = walletLoading || txLoading;
  const transactions = transactionsData?.data || [];
  const totalPages = transactionsData?.totalPages || 1;

  // Define columns for the data table
  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {getTransactionIcon(row.original.type)}
            <span className="font-medium">
              {getTransactionLabel(row.original.type)}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.description || "-"}</span>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span
            className={cn(
              "font-semibold",
              row.original.type === "deposit" ||
                row.original.type === "refund" ||
                row.original.type === "winnings"
                ? "text-green-500"
                : "text-red-500",
            )}
          >
            {row.original.type === "deposit" ||
            row.original.type === "refund" ||
            row.original.type === "winnings"
              ? "+"
              : "-"}
            ${row.original.amount.toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "reference",
        header: "Reference",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.reference || "-"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-sm">
            {formatDate(row.original.createdAt, "MMM dd, yyyy")}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <DashboardLayout
      userEmail="user@example.com"
      userBalance={wallet?.balance || 0}
    >
      <div className="min-h-full bg-background p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all your wallet transactions
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Current Balance
              </p>
              <p className="text-2xl font-bold">
                ${(wallet?.balance || 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Total Transactions
              </p>
              <p className="text-2xl font-bold">
                {transactionsData?.total || 0}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Currency</p>
              <p className="text-2xl font-bold">{wallet?.currency || "USD"}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectComponent
                label="Transaction Type"
                value={selectedType}
                onValueChange={(value: any) =>
                  setSelectedType(value === "all" ? "" : value)
                }
                options={transactionTypeOptions}
                placeholder="Select transaction type"
              />
              <SelectComponent
                label="Status"
                value={selectedStatus}
                onValueChange={(value: any) =>
                  setSelectedStatus(value === "all" ? "" : value)
                }
                options={transactionStatusOptions}
                placeholder="Select status"
              />
            </div>
          </div>

          {/* Transactions Table */}
          <DataTable
            columns={columns}
            data={transactions}
            pageCount={totalPages}
            pageIndex={page - 1}
            pageSize={10}
            isLoading={isLoading}
            emptyMessage="No transactions found"
            onPaginationChange={(state) => setPage(state.pageIndex + 1)}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
