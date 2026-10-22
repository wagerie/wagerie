"use client";
import { finiteAmount, ticketNumbersFromResponse } from "@/lib/account-state";
import { getApiPayload } from "@/hooks/use-api";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  Coins,
  Package,
  ShieldCheck,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGet, usePost } from "@/hooks/use-api";
import { useGetBalance } from "@/hooks/use-wallet";
import { APP_ROUTES, API_ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format-date";
import type { Product, ProductEnrollment } from "@/lib/types";
import { calculatePollMetrics, getPrizeImage } from "@/lib/prize-helpers";
import { TicketStepper } from "@/components/molecules/ticket-stepper";
import { TicketConfirmationModal } from "@/components/molecules/ticket-confirmation-modal";
import { DepositModal } from "@/components/molecules/modals/deposit-modal";
import { formatCurrency } from "@/lib/utils";

interface ProductDetail {
  product?: Product;
  enrollments?: ProductEnrollment[];
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [tickets, setTickets] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "details" | "draw" | "guarantee" | "participants"
  >("details");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [lastEnrollment, setLastEnrollment] = useState<{
    tickets: number;
    total: number;
    ticketNumbers: number[];
  }>({ tickets: 1, total: 0, ticketNumbers: [] });

  const detailPath = API_ROUTES.PRODUCT_DETAIL.replace(":id", params.id);

  // Queries & Mutations
  const { data, isLoading, isError } = useGet<ProductDetail>(
    ["product", params.id],
    detailPath,
    { enabled: Boolean(params.id) },
  );

  const {
    data: wallet,
    isLoading: walletLoading,
    isError: walletError,
  } = useGetBalance();
  const walletAmount = finiteAmount(wallet?.balance);
  const userBalance = walletAmount ?? 0;
  const walletAvailable =
    !walletLoading && !walletError && walletAmount !== null;

  const { mutate: enroll, isPending } = usePost<
    unknown,
    { productId: string; tickets: number }
  >(API_ROUTES.ENROLL_PRODUCT, {
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["product", params.id] });
      await queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setLastEnrollment({
        tickets,
        ticketNumbers: ticketNumbersFromResponse(getApiPayload(response)),
        total: tickets * Number(product?.ticketPrice || 0),
      });
      for (const queryKey of [
        "my-draws",
        "dashboard-joined-draws",
        "products",
        "public-products",
        "catalog-stats",
      ]) {
        void queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
      setConfirmationOpen(true);
      setTickets(1);
    },
  });

  const product = data?.product;
  const enrollments = data?.enrollments || [];
  const metrics = calculatePollMetrics(product);
  const prizeImage = getPrizeImage(product);

  const totalCost = tickets * metrics.pricePerTicket;
  const isSoldOut =
    metrics.remainingSlots === 0 ||
    product?.status === "closed" ||
    product?.status === "completed";
  const canEnroll =
    product?.status === "active" &&
    tickets > 0 &&
    tickets <= metrics.remainingSlots &&
    !isSoldOut &&
    walletAvailable;
  const hasInsufficientBalance = userBalance < totalCost;

  const handleEnroll = () => {
    if (!product || !canEnroll) return;
    if (hasInsufficientBalance) {
      setDepositOpen(true);
      return;
    }
    enroll({ productId: product.id, tickets });
  };

  const handleQuickDeposit = () => {
    setDepositOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="min-h-full bg-background text-foreground p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb / Back Link */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href={APP_ROUTES.POLLS}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Draws
            </Link>

            <div className="flex items-center gap-2">
              {product?.status === "active" ? (
                <Badge className="border-0 bg-emerald-500/20 text-emerald-400">
                  ● Live Draw
                </Badge>
              ) : (
                <Badge className="border-0 bg-muted text-muted-foreground">
                  {isLoading
                    ? "Loading…"
                    : isError
                      ? "Unavailable"
                      : product?.status || "Unavailable"}
                </Badge>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-border bg-card p-12 text-muted-foreground">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                <p className="text-sm font-medium">Loading draw details...</p>
              </div>
            </div>
          ) : isError || !product ? (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-12 text-center text-red-300">
              <h2 className="text-xl font-bold">Draw Not Found</h2>
              <p className="mt-2 text-sm text-red-200/80">
                The requested prize draw could not be loaded or may have
                expired.
              </p>
              <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-500">
                <Link href={APP_ROUTES.POLLS}>Browse Available Draws</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr]">
              {/* LEFT COLUMN: Prize Showcase & Specifications */}
              <div className="space-y-6">
                {/* Main Hero Card */}
                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
                  {/* Hero Image Showcase */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
                    <img
                      src={prizeImage}
                      alt={product.name}
                      loading="eager"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11162b] via-transparent to-black/40" />

                    {/* Top Floating Badges */}
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="rounded-xl border border-blue-500/30 bg-slate-950/80 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-md">
                        Active Prize Draw
                      </span>
                    </div>

                    <div className="absolute right-4 top-4">
                      <div className="rounded-2xl border border-amber-500/30 bg-slate-950/85 p-3 text-right backdrop-blur-md">
                        <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">
                          Retail Value
                        </span>
                        <p className="text-xl font-black text-white">
                          {formatCurrency(product.productValueAmount || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Product Title & Basic Stats */}
                  <div className="p-6">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        {product.name}
                      </h1>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {product.description ||
                          "No additional product description is available."}
                      </p>
                    </div>

                    {/* Metrics Row */}
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-2xl border border-border bg-muted/60 p-3.5">
                        <span className="text-[11px] text-muted-foreground font-medium">
                          Ticket Price
                        </span>
                        <p className="mt-1 text-lg font-extrabold text-foreground">
                          {formatCurrency(metrics.pricePerTicket)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border bg-muted/60 p-3.5">
                        <span className="text-[11px] text-muted-foreground font-medium">
                          Total Slots
                        </span>
                        <p className="mt-1 text-lg font-extrabold text-foreground">
                          {metrics.totalSlots.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border bg-muted/60 p-3.5">
                        <span className="text-[11px] text-muted-foreground font-medium">
                          Slots Filled
                        </span>
                        <p className="mt-1 text-lg font-extrabold text-emerald-400">
                          {metrics.filledSlots} ({metrics.progressPercent}%)
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border bg-muted/60 p-3.5">
                        <span className="text-[11px] text-muted-foreground font-medium">
                          Remaining
                        </span>
                        <p className="mt-1 text-lg font-extrabold text-amber-400">
                          {metrics.remainingSlots}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Information Tabs */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-xl">
                  {/* Tab Navigation */}
                  <div className="flex flex-wrap gap-2 border-b border-border pb-4">
                    {[
                      {
                        id: "details",
                        label: "Prize Specifications",
                        icon: Package,
                      },
                      {
                        id: "draw",
                        label: "Draw Details",
                        icon: ShieldCheck,
                      },
                      {
                        id: "guarantee",
                        label: "Claim Options",
                        icon: Trophy,
                      },
                      {
                        id: "participants",
                        label: `Participants (${enrollments.length})`,
                        icon: Users,
                      },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                            isActive
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content */}
                  <div className="pt-6">
                    {activeTab === "details" && (
                      <div className="space-y-4 text-sm text-muted-foreground">
                        <h3 className="text-base font-bold text-foreground">
                          Product Details
                        </h3>
                        <p className="leading-relaxed">
                          {product.description ||
                            "No additional product description is available."}
                        </p>
                        <div className="rounded-xl border border-border bg-muted/50 p-3 sm:max-w-xs">
                          <span className="text-xs text-muted-foreground">
                            Product value
                          </span>
                          <p className="font-semibold text-foreground">
                            {formatCurrency(product.productValueAmount || 0)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Confirm product condition, delivery, and any cash
                          alternative in the published product terms before
                          entering.
                        </p>
                      </div>
                    )}

                    {activeTab === "draw" && (
                      <div className="space-y-4 text-sm text-muted-foreground">
                        <h3 className="text-base font-bold text-foreground">
                          Draw Details
                        </h3>
                        <p className="leading-relaxed">
                          The listing shows current entry progress and status.
                          Draw method, closing time, and verification details
                          should be confirmed in the published terms for this
                          product.
                        </p>
                        <div className="space-y-3 pt-2">
                          <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-3.5">
                            <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                            <div>
                              <p className="font-semibold text-foreground">
                                Entry Records
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Confirmed entries are available in your account
                                history.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-3.5">
                            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                            <div>
                              <p className="font-semibold text-foreground">
                                Draw Schedule
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Check the product terms for its closing time and
                                winner-selection method.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-3.5">
                            <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                            <div>
                              <p className="font-semibold text-foreground">
                                Published Results
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Treat a result as confirmed when it appears in
                                the product and account records.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "guarantee" && (
                      <div className="space-y-4 text-sm text-muted-foreground">
                        <h3 className="text-base font-bold text-foreground">
                          Claim Options
                        </h3>
                        <p className="leading-relaxed">
                          Choose the cash equivalent or claim the prize itself.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          The cash amount and prize fulfillment details are
                          confirmed during claim processing.
                        </p>
                      </div>
                    )}

                    {activeTab === "participants" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-foreground">
                            Recent Entries
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            Total {enrollments.length} participant
                            {enrollments.length === 1 ? "" : "s"}
                          </span>
                        </div>

                        {enrollments.length === 0 ? (
                          <div className="rounded-2xl border border-border bg-muted/50 p-8 text-center text-muted-foreground">
                            <Users className="mx-auto mb-2 h-8 w-8 text-slate-600" />
                            <p className="text-sm font-medium">
                              Be the first player to enter this draw!
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {enrollments.map((entry) => (
                              <div
                                key={entry.id}
                                className="flex items-center justify-between rounded-xl border border-border bg-muted/60 p-3 text-xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 font-bold">
                                    #
                                  </div>
                                  <div>
                                    <p className="font-semibold text-foreground">
                                      Player #{entry.userId}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                      {formatDate(
                                        entry.createdAt,
                                        "MMM dd, HH:mm",
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge className="border-0 bg-blue-500/10 text-blue-300">
                                    {entry.ticketsBought} ticket
                                    {entry.ticketsBought > 1 ? "s" : ""}
                                  </Badge>
                                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                                    {formatCurrency(entry.amountPaid)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Interactive Staking Terminal */}
              <div className="space-y-6">
                <div className="sticky top-6 rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                        Ticket selection
                      </span>
                    </div>
                    <h2 className="mt-1 text-2xl font-black text-foreground">
                      Enter This Draw
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select your ticket quantity to join the pool.
                    </p>
                  </div>

                  {/* Progress Tracker Widget */}
                  <div className="space-y-2 rounded-2xl border border-border bg-muted/60 p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        Draw Progress
                      </span>
                      <span className="font-extrabold text-blue-400">
                        {metrics.progressPercent}%
                      </span>
                    </div>

                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 transition-all duration-500"
                        style={{
                          width: `${metrics.progressPercent}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>{metrics.filledSlots} tickets taken</span>
                      <span className="text-amber-400 font-semibold">
                        {metrics.remainingSlots} tickets left
                      </span>
                    </div>
                  </div>

                  {/* Interactive Ticket Stepper */}
                  {!walletAvailable && (
                    <p
                      role="status"
                      className="mb-4 text-sm text-muted-foreground"
                    >
                      {walletLoading
                        ? "Loading wallet…"
                        : "Wallet unavailable. Reload or sign in again before entering."}
                    </p>
                  )}
                  <TicketStepper
                    tickets={tickets}
                    onChange={setTickets}
                    ticketPrice={metrics.pricePerTicket}
                    remainingSlots={metrics.remainingSlots}
                    totalSlots={metrics.totalSlots}
                    userBalance={userBalance}
                    balanceAvailable={walletAvailable}
                    disabled={isPending || !canEnroll}
                    onQuickDeposit={
                      walletAvailable ? handleQuickDeposit : undefined
                    }
                  />

                  {/* Primary Action Button */}
                  <div>
                    {hasInsufficientBalance && walletAvailable ? (
                      <Button
                        type="button"
                        onClick={handleQuickDeposit}
                        className="h-14 w-full rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-base font-black text-slate-950 shadow-[0_10px_25px_rgba(245,158,11,0.25)] hover:from-amber-400 hover:to-amber-500 transition-all"
                      >
                        <Coins className="mr-2 h-5 w-5" />
                        Add funds · short by{" "}
                        {formatCurrency(totalCost - userBalance)}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleEnroll}
                        disabled={!canEnroll || isPending}
                        className="h-14 w-full rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-base font-black text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isPending ? (
                          "Confirming Entry..."
                        ) : isSoldOut ? (
                          "Draw Completed"
                        ) : (
                          <>
                            <Ticket className="mr-2 h-5 w-5" />
                            Confirm & Buy {tickets} Ticket
                            {tickets > 1 ? "s" : ""} (
                            {formatCurrency(totalCost)})
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Trust Micro-Indicators */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Entry history available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Package className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Review product terms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TicketConfirmationModal
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        prizeName={product?.name || "Prize"}
        ticketNumbers={lastEnrollment.ticketNumbers}
        ticketsBought={lastEnrollment.tickets}
        totalPaid={lastEnrollment.total}
        pollId={params.id}
      />

      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
    </DashboardLayout>
  );
}
