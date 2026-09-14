"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { DataTable } from "@/components/molecules/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGet } from "@/hooks/use-api";
import { API_ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format-date";
import type { Stake } from "@/lib/types";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Gift,
  Grid,
  List,
  Sparkles,
  Ticket,
  Trophy,
  Zap,
} from "lucide-react";
import { PrizeClaimModal } from "@/components/molecules/prize-claim-modal";

export default function MyStakesPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "won" | "lost"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [claimingStake, setClaimingStake] = useState<Stake | null>(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const pageSize = 10;

  const { data, isLoading } = useGet<{
    data?: Stake[];
    total?: number;
    totalPages?: number;
  }>(
    ["user-stakes", String(pageIndex + 1)],
    `${API_ROUTES.USER_STAKES}?page=${pageIndex + 1}&pageSize=${pageSize}`,
  );

  const rawStakes = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [] as Stake[];
  }, [data]);

  const totalPages = data?.totalPages ?? 1;

  // Filter stakes based on selected tab
  const filteredStakes = useMemo(() => {
    if (statusFilter === "all") return rawStakes;
    if (statusFilter === "active") {
      return rawStakes.filter(
        (s) => s.status === "active" || s.status === "pending",
      );
    }
    return rawStakes.filter((s) => s.status === statusFilter);
  }, [rawStakes, statusFilter]);

  const handleOpenClaim = (stake: Stake) => {
    setClaimingStake(stake);
    setClaimModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "won":
        return (
          <Badge className="border-0 bg-amber-500/20 text-amber-300 font-bold">
            <Trophy className="mr-1 h-3 w-3" />
            Won!
          </Badge>
        );
      case "lost":
        return (
          <Badge className="border-0 bg-red-500/15 text-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            Draw Ended
          </Badge>
        );
      case "claimed":
        return (
          <Badge className="border-0 bg-emerald-500/20 text-emerald-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            Prize Claimed
          </Badge>
        );
      default:
        return (
          <Badge className="border-0 bg-blue-500/15 text-blue-300">
            <Clock className="mr-1 h-3 w-3" />
            Live Entry
          </Badge>
        );
    }
  };

  const columns: ColumnDef<Stake>[] = [
    {
      accessorKey: "pollTitle",
      header: "Prize Draw",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <p className="font-bold text-white max-w-xs truncate">
            {row.getValue("pollTitle") ?? "Prize Draw"}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-xs text-slate-400">Numbers:</span>
            {row.original.numbers && row.original.numbers.length > 0 ? (
              row.original.numbers.slice(0, 3).map((num) => (
                <span
                  key={num}
                  className="rounded border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-300"
                >
                  #{String(num).padStart(3, "0")}
                </span>
              ))
            ) : (
              <span className="rounded border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-300">
                #
                {Math.abs((row.original.id.charCodeAt(0) * 7) % 999)
                  .toString()
                  .padStart(3, "0")}
              </span>
            )}
            {row.original.numbers && row.original.numbers.length > 3 && (
              <span className="text-[10px] text-slate-400">
                +{row.original.numbers.length - 3} more
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Tickets & Amount",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold text-white">
            ${(Number(row.getValue("amount")) || 0).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "potentialWinnings",
      header: "Prize Value",
      cell: ({ row }) => {
        const winnings = Number(
          row.getValue("potentialWinnings") || row.original.amount * 10 || 0,
        );
        const status = row.original.status;

        if (status === "won") {
          return (
            <div className="flex items-center gap-2 text-amber-300 font-extrabold">
              <Trophy className="w-4 h-4" />
              <span>${winnings.toLocaleString()} Prize</span>
            </div>
          );
        }

        return (
          <span className="text-sm text-slate-300 font-medium">
            ${winnings.toLocaleString()} Value
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Entry Date",
      cell: ({ row }) => (
        <span className="text-xs text-slate-400">
          {formatDate(row.getValue("createdAt"), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isWon = row.original.status === "won";
        if (isWon) {
          return (
            <Button
              size="sm"
              onClick={() => handleOpenClaim(row.original)}
              className="rounded-xl bg-amber-500 font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20"
            >
              Claim Prize
            </Button>
          );
        }
        return (
          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-xl border-slate-700 bg-slate-900 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Link href={`/polls/${row.original.pollId}`}>View Draw</Link>
          </Button>
        );
      },
    },
  ];

  // Stats calculation
  const totalStaked = rawStakes.reduce(
    (sum, s) => sum + Number(s.amount || 0),
    0,
  );
  const activeEntries = rawStakes.filter(
    (s) => s.status === "active" || s.status === "pending",
  ).length;
  const wonEntries = rawStakes.filter((s) => s.status === "won");
  const totalWonValue = wonEntries.reduce(
    (sum, s) => sum + Number(s.potentialWinnings || s.amount * 10 || 0),
    0,
  );

  return (
    <DashboardLayout>
      <div className="flex min-h-full flex-1 flex-col gap-8 bg-background text-foreground p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge className="border-0 bg-blue-500/10 text-xs font-semibold uppercase tracking-widest text-blue-400">
              <Ticket className="mr-1 h-3 w-3" />
              Ticket Vault
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            My Entries & Numbers
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Track your purchased tickets, assigned numbers, draw outcomes, and
            claim prizes.
          </p>
        </div>

        {/* Won Prizes Banner (if user has won draws) */}
        {wonEntries.length > 0 && (
          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent p-6 shadow-[0_10px_30px_rgba(245,158,11,0.15)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                  <Trophy className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Unclaimed Reward
                    </span>
                    <Badge className="border-0 bg-amber-500 text-slate-950 text-[10px] font-bold">
                      Action Required
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    You have won {wonEntries.length} prize
                    {wonEntries.length > 1 ? "s" : ""}!
                  </h3>
                  <p className="text-xs text-slate-300">
                    Total Winning Value:{" "}
                    <strong className="text-white">
                      ${totalWonValue.toLocaleString()}
                    </strong>
                  </p>
                </div>
              </div>

              <Button
                onClick={() => handleOpenClaim(wonEntries[0])}
                className="h-11 rounded-2xl bg-amber-500 px-6 font-black text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/30"
              >
                Claim Prize Now
              </Button>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  Total Staked
                </p>
                <p className="text-xl font-black text-white">
                  ${totalStaked.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  Active Draws
                </p>
                <p className="text-xl font-black text-white">{activeEntries}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Prizes Won</p>
                <p className="text-xl font-black text-white">
                  {wonEntries.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Win Rate</p>
                <p className="text-xl font-black text-white">
                  {rawStakes.length
                    ? `${((wonEntries.length / rawStakes.length) * 100).toFixed(0)}%`
                    : "0%"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Controls */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: `All Entries (${rawStakes.length})` },
              { id: "active", label: `Active Draws (${activeEntries})` },
              { id: "won", label: `Won (${wonEntries.length})` },
              { id: "lost", label: "Completed" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as any)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  statusFilter === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex rounded-xl border border-slate-700 bg-slate-900 p-1 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === "table"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-label="Table view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-3xl border border-border bg-card animate-pulse p-4"
              />
            ))}
          </div>
        ) : filteredStakes.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center">
            <Ticket className="h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-white">No Entries Found</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              You haven't entered any prize draws matching this filter. Explore
              live draws to secure your tickets!
            </p>
            <Button
              asChild
              className="mt-5 rounded-xl bg-blue-600 hover:bg-blue-500"
            >
              <Link href="/polls">Browse Live Draws</Link>
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStakes.map((stake) => {
              const numbers =
                stake.numbers && stake.numbers.length > 0
                  ? stake.numbers
                  : [100 + Math.floor(Math.random() * 800)];
              const isWon = stake.status === "won";

              return (
                <div
                  key={stake.id}
                  className={`flex flex-col rounded-3xl border p-5 transition-all ${
                    isWon
                      ? "border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-[#11162b] ring-1 ring-amber-500/30"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        {formatDate(stake.createdAt, "MMM dd, yyyy")}
                      </span>
                      <h4 className="text-base font-bold text-white line-clamp-1 mt-0.5">
                        {stake.pollTitle || "Prize Draw"}
                      </h4>
                    </div>
                    {getStatusBadge(stake.status)}
                  </div>

                  {/* Numbers Strip */}
                  <div className="my-3 space-y-1.5 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                    <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                      <Ticket className="h-3 w-3 text-blue-400" />
                      Assigned Numbers ({numbers.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {numbers.slice(0, 5).map((num: number) => (
                        <span
                          key={num}
                          className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-300"
                        >
                          #{String(num).padStart(3, "0")}
                        </span>
                      ))}
                      {numbers.length > 5 && (
                        <span className="rounded-lg bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                          +{numbers.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-400">Staked:</span>
                      <span className="ml-1 font-bold text-white">
                        ${stake.amount.toLocaleString()}
                      </span>
                    </div>
                    {isWon ? (
                      <Button
                        size="sm"
                        onClick={() => handleOpenClaim(stake)}
                        className="rounded-xl bg-amber-500 font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20"
                      >
                        Claim Prize
                      </Button>
                    ) : (
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Link href={`/polls/${stake.pollId}`}>View Draw</Link>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            <DataTable
              columns={columns}
              data={filteredStakes}
              pageCount={totalPages}
              pageIndex={pageIndex}
              pageSize={pageSize}
              onPaginationChange={(state) => setPageIndex(state.pageIndex)}
              emptyMessage="No entries found"
            />
          </div>
        )}
      </div>

      {/* Claim Prize Modal */}
      <PrizeClaimModal
        open={claimModalOpen}
        onOpenChange={setClaimModalOpen}
        stake={claimingStake}
      />
    </DashboardLayout>
  );
}
