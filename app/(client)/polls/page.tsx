"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/molecules/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format-date";
import type { Poll } from "@/lib/types";
import { TrendingUp, Users, Calendar, Trophy } from "lucide-react";

// Mock polls data
const mockPolls: Poll[] = [
  {
    id: "poll-1",
    title: "Will Bitcoin reach $100k by EOY?",
    description: "Predict if Bitcoin will hit $100,000 by end of year",
    category: "crypto",
    status: "active",
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    totalStaked: 125000,
    participants: 234,
    options: [
      { id: "yes", label: "Yes", votes: 156 },
      { id: "no", label: "No", votes: 78 },
    ],
  },
  {
    id: "poll-2",
    title: "Will the Fed cut rates in Q2?",
    description: "Predict if Federal Reserve will cut interest rates in Q2 2024",
    category: "economics",
    status: "active",
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    totalStaked: 89000,
    participants: 187,
    options: [
      { id: "yes", label: "Yes", votes: 112 },
      { id: "no", label: "No", votes: 75 },
    ],
  },
  {
    id: "poll-3",
    title: "AI will create 5M+ new jobs",
    description: "Will AI create more than 5 million new jobs globally this year?",
    category: "technology",
    status: "active",
    endsAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    totalStaked: 156000,
    participants: 412,
    options: [
      { id: "yes", label: "Yes", votes: 289 },
      { id: "no", label: "No", votes: 123 },
    ],
  },
  {
    id: "poll-4",
    title: "Olympics 2024 attendance record",
    description: "Will Paris Olympics 2024 set new attendance record?",
    category: "sports",
    status: "closed",
    endsAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    totalStaked: 67000,
    participants: 198,
    options: [
      { id: "yes", label: "Yes", votes: 145 },
      { id: "no", label: "No", votes: 53 },
    ],
  },
];

const columns: ColumnDef<Poll>[] = [
  {
    accessorKey: "title",
    header: "Poll Title",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-foreground max-w-xs truncate">
          {row.getValue("title")}
        </p>
        <p className="text-xs text-muted-foreground max-w-xs truncate">
          {row.original.description}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
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
          {(row.getValue("participants") as number).toLocaleString()}
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
          ${((row.getValue("totalStaked") as number) / 1000).toFixed(0)}k
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

export default function PollsPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 5;
  const totalPages = Math.ceil(mockPolls.length / pageSize);
  const paginatedData = mockPolls.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize,
  );

  const stats = [
    {
      label: "Active Polls",
      value: mockPolls.filter((p) => p.status === "active").length,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Total Staked",
      value: `$${(mockPolls.reduce((sum, p) => sum + p.totalStaked, 0) / 1000).toFixed(0)}k`,
      icon: Trophy,
      color: "text-primary",
    },
    {
      label: "Total Participants",
      value: mockPolls.reduce((sum, p) => sum + p.participants, 0),
      icon: Users,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-8 p-6 lg:p-8 overflow-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Prediction Polls</h1>
        <p className="text-muted-foreground">
          Browse and stake on various prediction polls
        </p>
      </div>

      {/* Stats */}
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

      {/* Polls Table */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <DataTable
          columns={columns}
          data={paginatedData}
          pageCount={totalPages}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPaginationChange={(newPageIndex) => setPageIndex(newPageIndex)}
          emptyMessage="No polls found"
        />
      </div>
    </div>
  );
}
