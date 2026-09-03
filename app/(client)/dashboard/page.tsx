"use client";

import React, { useState } from "react";
import { ArrowRight, Loader, TrendingUp, Wallet, Zap } from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DepositModal } from "@/components/molecules/modals/deposit-modal";
import { useGetBalance, useTransactionHistory } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import formatDate from "@/lib/format-date";
import { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

const CURRENT_USER = {
  id: "user-1",
  email: "you@wagerie.com",
};

function getTransactionColor(type: string) {
  switch (type) {
    case "deposit":
      return "text-emerald-500";
    case "withdrawal":
      return "text-red-500";
    case "stake":
      return "text-orange-500";
    case "winnings":
      return "text-emerald-500";
    case "refund":
      return "text-blue-500";
    default:
      return "text-slate-500";
  }
}

function getTransactionSign(type: string) {
  if (type === "deposit" || type === "refund" || type === "winnings") {
    return "+";
  }
  return "-";
}

export default function DashboardPage() {
  const [depositOpen, setDepositOpen] = useState(false);

  const { data: wallet, isLoading: walletLoading } = useGetBalance(
    CURRENT_USER.id,
  );
  const { data: transactionsData, isLoading: txLoading } =
    useTransactionHistory(CURRENT_USER.id, { pageSize: 5 });

  const isLoading = walletLoading || txLoading;
  const recentTransactions = transactionsData?.data || [];

  const statCards = [
    {
      label: "Active stakes",
      value: "3",
      hint: "Across live polls",
      icon: Zap,
      glow: "from-blue-500/20 to-cyan-500/10",
    },
    {
      label: "Open polls",
      value: "4",
      hint: "Fresh opportunities",
      icon: TrendingUp,
      glow: "from-emerald-500/20 to-green-500/10",
    },
    {
      label: "Portfolio",
      value: "$225",
      hint: "Current exposure",
      icon: Wallet,
      glow: "from-sky-500/20 to-cyan-500/10",
    },
  ];

  return (
    <DashboardLayout
      userEmail={CURRENT_USER.email}
      userBalance={wallet?.balance || 0}
      onDeposit={() => setDepositOpen(true)}
    >
      <div className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.12),_transparent_20%),linear-gradient(to_bottom,#f8fafc,#f4f7fb)] p-4 dark:bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_transparent_22%),linear-gradient(to_bottom,#0b1020,#0f172a)] lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                Overview
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Welcome back, player.
              </h1>
            </div>
            <div className="rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-sm text-slate-600 shadow-sm dark:border-blue-500/20 dark:bg-slate-900/80 dark:text-slate-200">
              Updated just now
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {statCards.map(({ label, value, hint, icon: Icon, glow }) => (
              <div
                key={label}
                className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {label}
                    </p>
                    <p className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                      {value}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl bg-gradient-to-br p-3 text-slate-900 dark:text-white",
                      glow,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  {hint}
                </p>
                <Link
                  href={
                    label === "Active stakes"
                      ? "/my-stakes"
                      : label === "Open polls"
                        ? "/polls"
                        : "/transactions"
                  }
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-300"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Recent transactions
                </h2>
                <Link
                  href="/transactions"
                  className="text-sm font-medium text-blue-600 dark:text-blue-300"
                >
                  View all
                </Link>
              </div>

              {isLoading ? (
                <div className="flex min-h-[160px] items-center justify-center">
                  <Loader className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="flex min-h-[160px] flex-col items-center justify-center text-center">
                  <p className="mb-4 text-slate-500 dark:text-slate-400">
                    No transactions yet
                  </p>
                  <Button onClick={() => setDepositOpen(true)}>
                    Make your first deposit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((tx: Transaction) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {tx.description || tx.type}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(tx.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "font-bold",
                            getTransactionColor(tx.type),
                          )}
                        >
                          {getTransactionSign(tx.type)}${tx.amount.toFixed(2)}
                        </p>
                        <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900/80">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Getting started
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  "Deposit funds to your wallet",
                  "Browse live polls and prizes",
                  "Buy slots with unique numbers",
                  "Track your draw results and payouts",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/80"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DepositModal
        open={depositOpen}
        onOpenChange={setDepositOpen}
        userId={CURRENT_USER.id}
      />
    </DashboardLayout>
  );
}
