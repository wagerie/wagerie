"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  DollarSign,
  Filter,
  Grid,
  List,
  Package,
  Search,
  Sparkles,
  Ticket,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGet } from "@/hooks/use-api";
import { API_ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format-date";
import type { Category, Product } from "@/lib/types";
import { PollCard } from "@/components/molecules/poll-card";
import { calculatePollMetrics } from "@/lib/prize-helpers";

interface ProductListResponse {
  data?: {
    items?: Product[];
    pagination?: { totalPages?: number };
  };
}

interface CategoryResponse {
  data?: Category[];
}

export default function PollsPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [categoryId, setCategoryId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "popular" | "price_asc" | "price_desc" | "value_desc"
  >("popular");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const pageSize = 12;

  const { data: categoryData } = useGet<CategoryResponse>(
    ["product-categories"],
    API_ROUTES.PRODUCT_CATEGORIES,
  );

  const productsPath =
    categoryId === "all"
      ? API_ROUTES.PRODUCTS
      : API_ROUTES.PRODUCTS_BY_CATEGORY.replace(":id", categoryId);

  const { data, isLoading } = useGet<ProductListResponse>(
    ["products", categoryId, String(pageIndex + 1)],
    `${productsPath}?page=${pageIndex + 1}&limit=${pageSize}`,
  );

  const rawProducts = useMemo(() => data?.data?.items || [], [data]);
  const categories = categoryData?.data || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  // Client-side search and sort filtering
  const filteredProducts = useMemo(() => {
    let result = [...rawProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)),
      );
    }

    result.sort((a, b) => {
      const metricsA = calculatePollMetrics(a);
      const metricsB = calculatePollMetrics(b);

      if (sortBy === "popular") {
        return metricsB.progressPercent - metricsA.progressPercent;
      }
      if (sortBy === "price_asc") {
        return metricsA.pricePerTicket - metricsB.pricePerTicket;
      }
      if (sortBy === "price_desc") {
        return metricsB.pricePerTicket - metricsA.pricePerTicket;
      }
      if (sortBy === "value_desc") {
        return metricsB.targetAmount - metricsA.targetAmount;
      }
      return 0;
    });

    return result;
  }, [rawProducts, searchQuery, sortBy]);

  // Table columns for stakers who prefer compact dense view
  const tableColumns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Prize Poll",
      cell: ({ row }) => {
        const metrics = calculatePollMetrics(row.original);
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <Link
                href={`/polls/${row.original.id}`}
                className="block max-w-xs truncate font-bold text-white hover:text-blue-400 transition-colors"
              >
                {row.original.name}
              </Link>
              <p className="text-xs text-slate-400">
                ${metrics.targetAmount.toLocaleString()} Value •{" "}
                {metrics.remainingSlots} left
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.status === "active"
              ? "bg-emerald-500/15 text-emerald-400 border-0"
              : "bg-slate-800 text-slate-400 border-0"
          }
        >
          {row.original.status === "active" ? "● Live" : row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "ticketPrice",
      header: "Ticket Price",
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-white">
          <Ticket className="h-4 w-4 text-blue-400" />$
          {Number(row.original.ticketPrice).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "raisedAmount",
      header: "Fill Progress",
      cell: ({ row }) => {
        const metrics = calculatePollMetrics(row.original);
        return (
          <div className="w-36 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">
                {metrics.progressPercent}%
              </span>
              <span className="text-slate-400">
                {metrics.filledSlots}/{metrics.totalSlots}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                style={{ width: `${metrics.progressPercent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          asChild
          size="sm"
          className="rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-500"
        >
          <Link href={`/polls/${row.original.id}`}>Enter Draw</Link>
        </Button>
      ),
    },
  ];

  // Stats calculation
  const totalPrizePool = useMemo(
    () => rawProducts.reduce((sum, p) => sum + Number(p.targetAmount || 0), 0),
    [rawProducts],
  );
  const activeDrawsCount = useMemo(
    () => rawProducts.filter((p) => p.status === "active").length,
    [rawProducts],
  );

  return (
    <DashboardLayout>
      <div className="flex min-h-full flex-1 flex-col gap-8 bg-background text-foreground p-4 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge className="border-0 bg-blue-500/10 text-xs font-semibold uppercase tracking-widest text-blue-400">
              <Sparkles className="mr-1 h-3 w-3" />
              Live Prize Arena
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Explore Prize Polls
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Stake entries into guaranteed luxury draws. Every ticket is assigned
            a verifiable unique number with instant automated draws and physical
            delivery or cash payout.
          </p>
        </div>

        {/* Global Stats Ribbon */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Active Prize Draws
                </p>
                <p className="text-2xl font-black text-white">
                  {activeDrawsCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Guaranteed Prize Value
                </p>
                <p className="text-2xl font-black text-white">
                  ${totalPrizePool.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Starting From
                </p>
                <p className="text-2xl font-black text-white">$1.00 / Ticket</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Control Bar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 lg:p-5">
          {/* Top Row: Search & Selectors */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search prizes (iPhone, Rolex, Tesla...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Sort & View Mode Controls */}
            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onValueChange={(val: any) => setSortBy(val)}
              >
                <SelectTrigger className="h-10 w-44 rounded-xl border-slate-700 bg-slate-900 text-xs text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-900 text-white">
                  <SelectItem value="popular">Most Popular (% Full)</SelectItem>
                  <SelectItem value="value_desc">
                    Highest Prize Value
                  </SelectItem>
                  <SelectItem value="price_asc">Lowest Ticket Price</SelectItem>
                  <SelectItem value="price_desc">
                    Highest Ticket Price
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Grid / Table Toggle */}
              <div className="flex rounded-xl border border-slate-700 bg-slate-900 p-1">
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
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setCategoryId("all");
                setPageIndex(0);
              }}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                categoryId === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
              }`}
            >
              All Draws ({rawProducts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setCategoryId(String(cat.id));
                  setPageIndex(0);
                }}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  categoryId === String(cat.id)
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section: Cards Grid vs Table */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-3xl border border-border bg-card animate-pulse p-4"
              >
                <div className="h-44 w-full rounded-2xl bg-slate-800/60" />
                <div className="mt-4 h-6 w-3/4 rounded-lg bg-slate-800/60" />
                <div className="mt-2 h-4 w-1/2 rounded-lg bg-slate-800/60" />
                <div className="mt-8 h-8 w-full rounded-xl bg-slate-800/60" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center">
            <Package className="h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-white">No Draws Found</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              No prize draws match your filter criteria. Try clearing your
              search query or selecting a different category.
            </p>
            {(searchQuery || categoryId !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryId("all");
                }}
                className="mt-4 rounded-xl border-slate-700 bg-slate-900 text-white"
              >
                Reset All Filters
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const cat = categories.find((c) => c.id === product.categoryId);
                return (
                  <PollCard
                    key={product.id}
                    product={product}
                    categoryName={cat?.name}
                  />
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-xs">
                <span className="text-slate-400">
                  Page <strong className="text-white">{pageIndex + 1}</strong>{" "}
                  of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                    disabled={pageIndex === 0}
                    className="rounded-xl border-slate-700 bg-slate-900 text-white disabled:opacity-30"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPageIndex((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={pageIndex >= totalPages - 1}
                    className="rounded-xl border-slate-700 bg-slate-900 text-white disabled:opacity-30"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            <DataTable
              columns={tableColumns}
              data={filteredProducts}
              pageCount={totalPages}
              pageIndex={pageIndex}
              pageSize={pageSize}
              onPaginationChange={(state) => setPageIndex(state.pageIndex)}
              emptyMessage="No prize draws available"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
