"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Coins,
  DollarSign,
  Loader,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DepositModal } from "@/components/molecules/modals/deposit-modal";
import { useGetBalance, useTransactionHistory } from "@/hooks/use-wallet";
import { useGet } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import formatDate from "@/lib/format-date";
import { API_ROUTES } from "@/constants/routes";
import type { Product, Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PollCard } from "@/components/molecules/poll-card";

function getTransactionColor(type: string) {
  switch (type) {
    case "deposit":
      return "text-emerald-400";
    case "withdrawal":
      return "text-red-400";
    case "stake":
      return "text-amber-400";
    case "winnings":
      return "text-emerald-400 font-extrabold";
    case "refund":
      return "text-blue-400";
    default:
      return "text-slate-400";
  }
}

function getTransactionSign(type: string) {
  if (type === "deposit" || type === "refund" || type === "winnings") {
    return "+";
  }
  return "-";
}

interface ProductListResponse {
  data?: {
    items?: Product[];
  };
}

export default function DashboardPage() {
  const [depositOpen, setDepositOpen] = useState(false);

  const { data: wallet, isLoading: walletLoading } = useGetBalance();
  const { data: transactionsData, isLoading: txLoading } =
    useTransactionHistory({ pageSize: 5 });
  const { data: featuredData } = useGet<ProductListResponse>(
    ["featured-products"],
    `${API_ROUTES.PRODUCTS}?limit=3`,
  );

  const isLoading = walletLoading || txLoading;
  const recentTransactions = transactionsData?.data || [];
  const featuredDraws = featuredData?.data?.items || [];
  const balance = wallet?.balance ?? 0;

  const statCards = [
    {
      label: "Active Entries",
      value: "3",
      hint: "Across 2 guaranteed draws",
      icon: Ticket,
      href: "/my-stakes",
      glow: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    },
    {
      label: "Available Balance",
      value: `$${balance.toFixed(2)}`,
      hint: "Instant draw liquidity",
      icon: Wallet,
      href: "/transactions",
      glow: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    },
    {
      label: "Guaranteed Draws",
      value: "14",
      hint: "Ready to enter from $1",
      icon: Trophy,
      href: "/polls",
      glow: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    },
  ];

  return (
    <DashboardLayout
      userEmail="player@wagerie.com"
      userBalance={balance}
      onDeposit={() => setDepositOpen(true)}
    >
      <div className="min-h-full bg-background text-foreground p-4 lg:p-8 space-y-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Welcome Banner */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="border-0 bg-blue-500/10 text-xs font-semibold uppercase tracking-widest text-blue-400">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Player Hub
                </Badge>
              </div>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Welcome back, player.
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Track your active ticket entries, explore guaranteed luxury
                draws, and manage your balance.
              </p>
            </div>

            <Button
              onClick={() => setDepositOpen(true)}
              className="rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
            >
              <Coins className="mr-2 h-4 w-4" />
              Quick Deposit
            </Button>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {statCards.map(({ label, value, hint, icon: Icon, href, glow }) => (
              <div
                key={label}
                className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-xl transition hover:border-primary/50"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {label}
                      </p>
                      <p className="mt-2 text-3xl font-black tracking-tight text-foreground">
                        {value}
                      </p>
                    </div>
                    <div className={cn("rounded-2xl border p-3", glow)}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
                </div>

                <Link
                  href={href}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Featured Draws Showcase */}
          {featuredDraws.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    Featured Guaranteed Draws
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    High-demand luxury prize pools filling rapidly today
                  </p>
                </div>
                <Link
                  href="/polls"
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                >
                  View All Draws
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredDraws.map((product) => (
                  <PollCard key={product.id} product={product} featured />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Grid: Recent Activity & How It Works */}
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Recent Transactions */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-lg font-bold text-foreground">
                  Recent Transactions
                </h2>
                <Link
                  href="/transactions"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  View All
                </Link>
              </div>

              {isLoading ? (
                <div className="flex min-h-[160px] items-center justify-center">
                  <Loader className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="flex min-h-[160px] flex-col items-center justify-center text-center">
                  <p className="mb-3 text-xs text-slate-400">
                    No transactions yet. Fund your wallet to begin playing!
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setDepositOpen(true)}
                    className="rounded-xl bg-blue-600 hover:bg-blue-500"
                  >
                    Make First Deposit
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((tx: Transaction) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between rounded-2xl border border-border bg-muted p-3.5 text-xs"
                    >
                      <div>
                        <p className="font-bold text-foreground capitalize">
                          {tx.description || tx.type}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {formatDate(tx.createdAt, "MMM dd, yyyy • HH:mm")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "font-black text-sm",
                            getTransactionColor(tx.type),
                          )}
                        >
                          {getTransactionSign(tx.type)}${tx.amount.toFixed(2)}
                        </p>
                        <Badge className="border-0 bg-slate-800/80 text-[10px] text-slate-400 capitalize mt-0.5">
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* How Wagerie Works Guide */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-foreground">
                  How Wagerie Works
                </h2>
                <p className="text-xs text-slate-400">
                  4 simple steps to winning luxury prizes
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: "1",
                    title: "Fund Wallet",
                    desc: "Deposit funds instantly via Card, Bank, or PayPal.",
                  },
                  {
                    step: "2",
                    title: "Choose a Luxury Draw",
                    desc: "Browse phones, watches, tech, cash pools, and cars.",
                  },
                  {
                    step: "3",
                    title: "Receive Unique Numbers",
                    desc: "Get assigned cryptographically registered ticket IDs.",
                  },
                  {
                    step: "4",
                    title: "Claim Cash or Item",
                    desc: "Winners choose free worldwide delivery or instant cash credit.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-muted p-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
    </DashboardLayout>
  );
}
