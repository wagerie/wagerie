"use client";

import { ReceiptConfirmation } from "@/components/molecules/receipt-confirmation";
import { QueryFeedback } from "@/components/molecules/query-feedback";
import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { DataTable } from "@/components/molecules/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetPage } from "@/hooks/use-api";
import { APP_ROUTES, API_ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format-date";
import { formatCurrency } from "@/lib/utils";
import type { JoinedDraw, JoinedDrawsSummary } from "@/lib/types";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  canClaimDraw,
  DrawStatusBadge,
  getDrawStatus,
  MyStakesGrid,
  type DrawRow,
} from "@/components/molecules/my-stakes-grid";
import { PrizeClaimModal } from "@/components/molecules/prize-claim-modal";
import { SummaryStatCard } from "@/components/molecules/summary-stat-card";
import {
  Clock,
  DollarSign,
  Grid,
  List,
  Sparkles,
  Ticket,
  Trophy,
} from "lucide-react";

export default function MyStakesPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "won" | "lost"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [claimingDraw, setClaimingDraw] = useState<JoinedDraw | null>(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const drawHistoryRef = useRef<HTMLDivElement>(null);
  const pageSize = 10;

  const { data, isLoading, isError, refetch } = useGetPage<
    JoinedDraw,
    JoinedDrawsSummary
  >(
    ["my-draws", String(pageIndex + 1)],
    `${API_ROUTES.MY_DRAWS}?page=${pageIndex + 1}&limit=${pageSize}`,
  );

  const rawDraws = useMemo(() => data?.items || [], [data]);
  const summary = data?.summary;
  const totalPages = data?.pageCount ?? 1;
  const drawRows = useMemo<DrawRow[]>(
    () =>
      rawDraws.map((draw) => ({
        ...draw,
        drawStatus: getDrawStatus(draw),
      })),
    [rawDraws],
  );

  // Filter stakes based on selected tab
  const filteredDraws = useMemo(() => {
    if (statusFilter === "all") return drawRows;
    if (statusFilter === "won") {
      return drawRows.filter((draw) => draw.userParticipation.isWinner);
    }
    return drawRows.filter((draw) => draw.drawStatus === statusFilter);
  }, [drawRows, statusFilter]);

  const handleOpenClaim = (draw: JoinedDraw) => {
    setClaimingDraw(draw);
    setClaimModalOpen(true);
  };

  const handleReviewWinningDraws = () => {
    setStatusFilter("won");
    drawHistoryRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const columns: ColumnDef<DrawRow>[] = [
    {
      accessorKey: "product.name",
      header: "Prize Draw",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <p className="font-bold text-foreground max-w-xs truncate">
            {row.original.product.name}
          </p>
          <span className="text-xs text-muted-foreground">
            {row.original.userParticipation.userTicketsBought} tickets
          </span>
        </div>
      ),
    },
    {
      accessorKey: "userParticipation.userAmountPaid",
      header: "Tickets & Amount",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold text-foreground">
            {formatCurrency(row.original.userParticipation.userAmountPaid)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "drawStatus",
      header: "Status",
      cell: ({ row }) => <DrawStatusBadge status={row.original.drawStatus} />,
    },
    {
      accessorKey: "product.productValueAmount",
      header: "Prize Value",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground font-medium">
          {formatCurrency(row.original.product.productValueAmount || 0)}
        </span>
      ),
    },
    {
      accessorKey: "userParticipation.firstJoinedAt",
      header: "Entry Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(
            row.original.userParticipation.firstJoinedAt,
            "MMM dd, yyyy",
          )}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        if (row.original.drawStatus === "delivered")
          return <ReceiptConfirmation productId={row.original.product.id} />;
        if (canClaimDraw(row.original)) {
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
        if (row.original.userParticipation.isWinner) {
          if (
            row.original.product.claimType === "physical" &&
            row.original.drawStatus === "shipped" &&
            row.original.product.claimDetails?.shipment?.trackingUrl
          ) {
            return (
              <Button asChild size="sm" variant="outline">
                <a
                  href={row.original.product.claimDetails.shipment.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Track shipment
                </a>
              </Button>
            );
          }
          return <DrawStatusBadge status={row.original.drawStatus} />;
        }
        return (
          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-xl border-border bg-secondary text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Link
              href={APP_ROUTES.POLL_DETAIL.replace(
                ":id",
                encodeURIComponent(String(row.original.product.id)),
              )}
            >
              View Draw
            </Link>
          </Button>
        );
      },
    },
  ];

  const totalStaked = Number(
    summary?.totalAmountSpent ??
      rawDraws.reduce(
        (sum, draw) => sum + Number(draw.userParticipation.userAmountPaid || 0),
        0,
      ),
  );
  const activeEntries =
    summary?.activeDrawsCount ??
    drawRows.filter((draw) => draw.drawStatus === "active").length;
  const wonCount =
    summary?.wonDrawsCount ??
    drawRows.filter((draw) => draw.userParticipation.isWinner).length;
  const ticketsBought =
    summary?.totalTicketsBought ??
    rawDraws.reduce(
      (sum, draw) => sum + draw.userParticipation.userTicketsBought,
      0,
    );
  const claimableDraw = drawRows.find(canClaimDraw);
  const summaryCards = [
    {
      id: "spent",
      label: "Total entry spend",
      value: isLoading
        ? "Loading…"
        : isError
          ? "Unavailable"
          : formatCurrency(totalStaked),
      icon: DollarSign,
      iconClassName: "bg-blue-600/10 text-blue-400",
    },
    {
      id: "active",
      label: "Active Draws",
      value: isLoading
        ? "Loading…"
        : isError
          ? "Unavailable"
          : activeEntries.toLocaleString(),
      icon: Clock,
      iconClassName: "bg-blue-500/10 text-blue-400",
    },
    {
      id: "won",
      label: "Prizes Won",
      value: isLoading
        ? "Loading…"
        : isError
          ? "Unavailable"
          : wonCount.toLocaleString(),
      icon: Trophy,
      iconClassName: "bg-amber-500/10 text-amber-400",
    },
    {
      id: "tickets",
      label: "Tickets Bought",
      value: isLoading
        ? "Loading…"
        : isError
          ? "Unavailable"
          : ticketsBought.toLocaleString(),
      icon: Sparkles,
      iconClassName: "bg-emerald-500/10 text-emerald-400",
    },
  ];

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

        {/* Won Prizes Banner */}
        {!isLoading && !isError && wonCount > 0 && (
          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent p-6 shadow-[0_10px_30px_rgba(245,158,11,0.15)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                  <Trophy className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Winning Draws
                    </span>
                    <Badge className="border-0 bg-amber-500 text-slate-950 text-[10px] font-bold">
                      {wonCount}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black text-foreground mt-0.5">
                    You have {wonCount} winning draw
                    {wonCount === 1 ? "" : "s"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Claim eligibility and status are shown with each draw.
                  </p>
                </div>
              </div>

              <Button
                onClick={() =>
                  claimableDraw
                    ? handleOpenClaim(claimableDraw)
                    : handleReviewWinningDraws()
                }
                className="h-11 rounded-2xl !bg-amber-500 px-6 font-black text-slate-950 hover:!bg-amber-400 shadow-lg shadow-amber-500/30"
              >
                {claimableDraw ? "Claim Prize" : "Review Winning Draws"}
              </Button>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map(({ id, ...card }) => (
            <SummaryStatCard key={id} {...card} />
          ))}
        </div>

        {/* Filter Tabs & Controls */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            aria-busy={isLoading}
            className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0"
          >
            {[
              {
                id: "all",
                label:
                  isLoading || isError
                    ? "All Draws"
                    : `All Draws (${summary?.totalJoinedDraws ?? rawDraws.length})`,
              },
              {
                id: "active",
                label:
                  isLoading || isError
                    ? "Active Draws"
                    : `Active Draws (${activeEntries})`,
              },
              {
                id: "won",
                label: isLoading || isError ? "Won" : `Won (${wonCount})`,
              },
              { id: "lost", label: "Completed without win" },
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
          <div className="flex rounded-xl border border-border bg-secondary p-1 self-end sm:self-auto">
            <button
              type="button"
              aria-pressed={viewMode === "grid"}
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
              aria-pressed={viewMode === "table"}
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
        <div ref={drawHistoryRef} className="scroll-mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-3xl border border-border bg-card animate-pulse p-4"
                />
              ))}
            </div>
          ) : isError ? (
            <QueryFeedback
              message="Draw history could not be loaded."
              onRetry={() => void refetch()}
            />
          ) : filteredDraws.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center">
              <Ticket className="h-12 w-12 text-slate-600 mb-3" />
              <h3 className="text-lg font-bold text-foreground">
                No Entries Found
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                You haven't entered any prize draws matching this filter.
                Explore live draws to secure your tickets!
              </p>
              <Button
                asChild
                className="mt-5 rounded-xl bg-blue-600 hover:bg-blue-500"
              >
                <Link href={APP_ROUTES.POLLS}>Browse Live Draws</Link>
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <MyStakesGrid draws={filteredDraws} onClaim={handleOpenClaim} />
          ) : (
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
              <DataTable
                columns={columns}
                data={filteredDraws}
                pageCount={totalPages}
                pageIndex={pageIndex}
                pageSize={pageSize}
                onPaginationChange={(state) => setPageIndex(state.pageIndex)}
                emptyMessage="No entries found"
              />
            </div>
          )}
        </div>
      </div>

      {/* Claim Prize Modal */}
      <PrizeClaimModal
        open={claimModalOpen}
        onOpenChange={setClaimModalOpen}
        draw={claimingDraw}
      />
    </DashboardLayout>
  );
}
