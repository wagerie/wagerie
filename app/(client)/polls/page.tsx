"use client";

import React, { useMemo, useState } from "react";
import { DataTable } from "@/components/molecules/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGet } from "@/hooks/use-api";
import { API_ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format-date";
import type { Poll } from "@/lib/types";
import { TrendingUp, Users, Calendar, Trophy } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function PollsPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 5;

  const { data, isLoading } = useGet<{
    data?: Poll[];
    total?: number;
    totalPages?: number;
    page?: number;
  }>(
    ["polls", String(pageIndex + 1)],
    `${API_ROUTES.POLLS}?page=${pageIndex + 1}&pageSize=${pageSize}`,
  );

  const polls = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [] as Poll[];
  }, [data]);

  const totalPages = data?.totalPages ?? 1;

  const columns: ColumnDef<Poll>[] = [
    {
      accessorKey: "title",
      header: "Poll Title",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-foreground max-w-xs truncate">
            {row.getValue("title") ??
              row.original.description ??
              "Untitled poll"}
          </p>
          <p className="text-xs text-muted-foreground max-w-xs truncate">
            {row.original.description ?? "Live ballot"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = (row.getValue("status") as string) || "active";
        return (
          <Badge
            className={`${
              status === "active"
                ? "bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30"
                : "bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-500/30"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "participants",
      header: "Participants",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {Number(row.getValue("participants") || 0).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "totalStaked",
      header: "Total Staked",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          <span className="text-sm font-semibold">
            ${Number(row.getValue("totalStaked") || 0).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "endsAt",
      header: "Ends",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{formatDate(row.getValue("endsAt"), "MMM dd")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Button
            size="sm"
            className={`${
              status === "active"
                ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            } transition-all`}
            disabled={status !== "active"}
          >
            {status === "active" ? "Stake" : "Closed"}
          </Button>
        );
      },
    },
  ];

  const stats = [
    {
      label: "Active Polls",
      value: polls.filter((p) => p.status === "active").length,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Total Staked",
      value: `$${polls.reduce((sum, p) => sum + (Number(p.totalStaked) || 0), 0).toLocaleString()}`,
      icon: Trophy,
      color: "text-blue-600 dark:text-blue-300",
    },
    {
      label: "Total Participants",
      value: polls.reduce((sum, p) => sum + (Number(p.participants) || 0), 0),
      icon: Users,
      color: "text-blue-500",
    },
  ];

  const handlePaginationChange = (state: any) => {
    setPageIndex(state.pageIndex);
  };

  return (
    <DashboardLayout>
      <div className="flex min-h-full flex-1 flex-col gap-8 bg-[#f5f3ff] p-6 lg:p-8 dark:bg-[#0b1020]">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
            Live markets
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Prediction Polls
          </h1>
          <p className="text-muted-foreground">
            Browse and stake on active prediction markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-[0_8px_24px_rgba(37,99,235,0.06)] transition-colors hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900/80"
              >
                <div
                  className={`p-3 rounded-lg bg-primary/10 dark:bg-primary/20 ${
                    stat.color
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80">
          <DataTable
            columns={columns}
            data={polls}
            pageCount={totalPages}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
            emptyMessage={isLoading ? "Loading polls..." : "No polls found"}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
