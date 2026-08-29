"use client";

import React, { useMemo, useState } from "react";
import { DataTable } from "@/components/molecules/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGet } from "@/hooks/use-api";
import { API_ROUTES } from "@/constants/routes";
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

export default function MyStakesPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const { data, isLoading } = useGet<{
    data?: Stake[];
    total?: number;
    totalPages?: number;
  }>(
    ["user-stakes", String(pageIndex + 1)],
    `${API_ROUTES.USER_STAKES}?page=${pageIndex + 1}&pageSize=${pageSize}`,
  );

  const stakes = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [] as Stake[];
  }, [data]);

  const totalPages = data?.totalPages ?? 1;

  const columns: ColumnDef<Stake>[] = [
    {
      accessorKey: "pollTitle",
      header: "Poll",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-foreground max-w-xs truncate">
            {row.getValue("pollTitle") ?? "Unknown poll"}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            Your prediction:{" "}
            <span className="text-primary capitalize">
              {row.original.selectedOption ?? "pending"}
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
            ${(Number(row.getValue("amount")) || 0).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = (row.getValue("status") as string) || "pending";
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
        const winnings = Number(row.getValue("potentialWinnings") || 0);
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
            Lost ${Number(row.original.amount || 0).toLocaleString()}
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

  const stats = [
    {
      label: "Total Staked",
      value: `$${stakes.reduce((sum, s) => sum + Number(s.amount || 0), 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
    },
    {
      label: "Active Stakes",
      value: stakes.filter((s) => s.status === "pending").length,
      icon: Clock,
      color: "text-blue-500",
    },
    {
      label: "Total Winnings",
      value: `$${stakes
        .filter((s) => s.status === "won")
        .reduce((sum, s) => sum + Number(s?.potentialWinnings || 0), 0)
        .toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Win Rate",
      value: `${stakes.length ? ((stakes.filter((s) => s.status === "won").length / stakes.length) * 100).toFixed(0) : 0}%`,
      icon: CheckCircle,
      color: "text-emerald-500",
    },
  ];

  const handlePaginationChange = (state: any) => {
    setPageIndex(state.pageIndex);
  };

  return (
    <div className="flex-1 flex flex-col gap-8 p-6 lg:p-8 overflow-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">My Stakes</h1>
        <p className="text-muted-foreground">
          Track your prediction stakes and winnings.
        </p>
      </div>

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
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <DataTable
          columns={columns}
          data={stakes}
          pageCount={totalPages}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          emptyMessage={isLoading ? "Loading stakes..." : "No stakes found"}
        />
      </div>
    </div>
  );
}
