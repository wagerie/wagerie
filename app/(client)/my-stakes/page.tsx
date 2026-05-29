"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/molecules/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format-date";
import type { Stake } from "@/lib/types";
import {
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";

// Mock stakes data
const mockStakes: Stake[] = [
  {
    id: "stake-1",
    userId: "user-1",
    pollId: "poll-1",
    pollTitle: "Will Bitcoin reach $100k by EOY?",
    selectedOption: "yes",
    amount: 500,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "pending",
    potentialWinnings: 1250,
  },
  {
    id: "stake-2",
    userId: "user-1",
    pollId: "poll-2",
    pollTitle: "Will the Fed cut rates in Q2?",
    selectedOption: "no",
    amount: 250,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: "pending",
    potentialWinnings: 500,
  },
  {
    id: "stake-3",
    userId: "user-1",
    pollId: "poll-3",
    pollTitle: "AI will create 5M+ new jobs",
    selectedOption: "yes",
    amount: 1000,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: "won",
    potentialWinnings: 3500,
  },
  {
    id: "stake-4",
    userId: "user-1",
    pollId: "poll-4",
    pollTitle: "Olympics 2024 attendance record",
    selectedOption: "no",
    amount: 300,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: "lost",
    potentialWinnings: 0,
  },
];

const columns: ColumnDef<Stake>[] = [
  {
    accessorKey: "pollTitle",
    header: "Poll",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-foreground max-w-xs truncate">
          {row.getValue("pollTitle")}
        </p>
        <p className="text-xs text-muted-foreground font-medium">
          Your prediction:{" "}
          <span className="text-primary capitalize">
            {row.original.selectedOption}
          </span>
        </p>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Staked",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold">
          ${(row.getValue("amount") as number).toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        pending: {
          icon: Clock,
          color: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
        },
        won: {
          icon: CheckCircle,
          color: "bg-green-500/20 text-green-700 dark:text-green-400",
        },
        lost: {
          icon: XCircle,
          color: "bg-red-500/20 text-red-700 dark:text-red-400",
        },
      };

      const config =
        statusConfig[status as keyof typeof statusConfig] ||
        statusConfig.pending;
      const Icon = config.icon;

      return (
        <Badge className={`${config.color} hover:${config.color}`}>
          <Icon className="w-3 h-3 mr-1" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "potentialWinnings",
    header: "Potential Winnings",
    cell: ({ row }) => {
      const winnings = row.getValue("potentialWinnings") as number;
      const status = row.original.status;

      if (status === "pending") {
        return (
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              ${winnings.toLocaleString()}
            </span>
          </div>
        );
      }

      if (status === "won") {
        return (
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              +${winnings.toLocaleString()}
            </span>
          </div>
        );
      }

      return (
        <span className="text-sm text-red-600 dark:text-red-400 font-medium">
          Lost ${row.original.amount}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.getValue("createdAt"), "MMM dd, yyyy")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const status = row.original.status;
      return status === "pending" ? (
        <Button size="sm" variant="outline" className="text-destructive">
          Cancel
        </Button>
      ) : (
        <Button size="sm" disabled variant="ghost">
          -
        </Button>
      );
    },
  },
];

export default function MyStakesPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(mockStakes.length / pageSize);
  const paginatedData = mockStakes.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize,
  );

  const stats = [
    {
      label: "Total Staked",
      value: `$${mockStakes.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
    },
    {
      label: "Active Stakes",
      value: mockStakes.filter((s) => s.status === "pending").length,
      icon: Clock,
      color: "text-blue-500",
    },
    {
      label: "Total Winnings",
      value: `$${mockStakes
        .filter((s) => s.status === "won")
        .reduce((sum, s) => sum + s.potentialWinnings, 0)
        .toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Win Rate",
      value: `${(
        (mockStakes.filter((s) => s.status === "won").length /
          mockStakes.length) *
        100
      ).toFixed(0)}%`,
      icon: CheckCircle,
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-8 p-6 lg:p-8 overflow-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">My Stakes</h1>
        <p className="text-muted-foreground">
          Track your prediction stakes and winnings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-4 bg-card border border-border/50 rounded-xl hover:border-border transition-colors"
            >
              <div
                className={`p-2.5 rounded-lg bg-primary/10 dark:bg-primary/20 ${
                  stat.color
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </p>
                <p className="text-lg font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stakes Table */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <DataTable
          columns={columns}
          data={paginatedData}
          pageCount={totalPages}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPaginationChange={(newPageIndex) => setPageIndex(newPageIndex)}
          emptyMessage="No stakes yet. Start staking on polls to see them here!"
        />
      </div>
    </div>
  );
}
