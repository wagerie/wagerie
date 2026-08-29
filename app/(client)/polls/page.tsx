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
          <Trophy className="w-4 h-4 text-primary" />
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
                ? "bg-primary text-primary-foreground hover:shadow-md"
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
      color: "text-primary",
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
    <div className="flex-1 flex flex-col gap-8 p-6 lg:p-8 overflow-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Prediction Polls</h1>
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
              className="flex items-center gap-4 p-6 bg-card border border-border/50 rounded-xl hover:border-border transition-colors"
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

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
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
  );
}
