"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Users,
  TrendingUp,
  PieChart,
  Wallet,
  ShieldCheck,
  Plus,
  Trophy,
  Ticket,
  ArrowUpRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statCards = [
  {
    label: "Total Registered Players",
    value: "2,480",
    change: "+18% this month",
    icon: Users,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  },
  {
    label: "Active Guaranteed Draws",
    value: "8",
    change: "3 closing today",
    icon: Trophy,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  {
    label: "Total Platform Volume",
    value: "$184,250",
    change: "+24.5% vs last month",
    icon: Wallet,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  {
    label: "Draw Completion Rate",
    value: "96.4%",
    change: "Zero failed draws",
    icon: PieChart,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  },
];

const mockPolls = [
  {
    id: 1,
    name: "iPhone 16 Pro Max 256GB",
    target: "$1,299",
    ticketsSold: 214,
    totalTickets: 260,
    status: "active",
  },
  {
    id: 2,
    name: "Rolex Submariner Date 41mm",
    target: "$14,500",
    ticketsSold: 1120,
    totalTickets: 1450,
    status: "active",
  },
  {
    id: 3,
    name: "MacBook Pro M3 Max 16-inch",
    target: "$3,499",
    ticketsSold: 350,
    totalTickets: 350,
    status: "ready_for_draw",
  },
];

const mockTransactions = [
  {
    id: 1,
    user: "alex@vance.io",
    type: "Deposit",
    amount: "+$500.00",
    status: "Completed",
    time: "2 minutes ago",
  },
  {
    id: 2,
    user: "sarah.m@gmail.com",
    type: "Draw Entry (5 tickets)",
    amount: "-$25.00",
    status: "Completed",
    time: "4 minutes ago",
  },
  {
    id: 3,
    user: "marcus_k@yahoo.com",
    type: "Prize Claim (Cash)",
    amount: "-$1,150.00",
    status: "Processing",
    time: "12 minutes ago",
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "polls" | "transactions"
  >("overview");

  return (
    <DashboardLayout
      userEmail="admin@wagerie.com"
      userBalance={50000}
      isAdmin={true}
    >
      <div className="min-h-full bg-background text-foreground p-4 lg:p-8 space-y-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="border-0 bg-amber-500/10 text-xs font-semibold uppercase tracking-widest text-amber-300">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Operator Console
                </Badge>
              </div>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Platform Overview
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Monitor prize pools, provably fair draw executions, and player
                liquidity.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                asChild
                className="rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg shadow-blue-600/30"
              >
                <Link href="/polls">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Explore Public Draws
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-3xl border border-border bg-card p-6 shadow-xl flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {card.label}
                      </p>
                      <p className="text-3xl font-black text-foreground mt-2">
                        {card.value}
                      </p>
                    </div>
                    <div className={cn("p-3 rounded-2xl border", card.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 font-medium">
                    {card.change}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Main Workspace Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Polls Monitor */}
            <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Active Prize Draws
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time fill progress and draw readiness
                  </p>
                </div>
                <Link
                  href="/polls"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  View Catalog
                </Link>
              </div>

              <div className="space-y-3">
                {mockPolls.map((poll) => {
                  const pct = Math.round(
                    (poll.ticketsSold / poll.totalTickets) * 100,
                  );
                  const isReady = poll.status === "ready_for_draw";

                  return (
                    <div
                      key={poll.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">
                            {poll.name}
                          </h4>
                          <span className="text-xs text-slate-400">
                            Target Value: {poll.target}
                          </span>
                        </div>
                        {isReady ? (
                          <Badge className="border-0 bg-emerald-500/20 text-emerald-400 font-bold">
                            Ready for Draw
                          </Badge>
                        ) : (
                          <Badge className="border-0 bg-blue-500/15 text-blue-300 font-semibold">
                            {pct}% Sold
                          </Badge>
                        )}
                      </div>

                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>
                          {poll.ticketsSold} of {poll.totalTickets} tickets
                        </span>
                        <span>
                          {poll.totalTickets - poll.ticketsSold} remaining
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Recent Transactions */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white">
                  Platform Activity
                </h2>
                <p className="text-xs text-slate-400">Recent money movements</p>
              </div>

              <div className="space-y-3">
                {mockTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white truncate max-w-[140px]">
                        {tx.user}
                      </p>
                      <p className="text-[10px] text-slate-400">{tx.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{tx.amount}</p>
                      <p className="text-[10px] text-slate-500">{tx.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-3.5 text-xs text-slate-300 space-y-1">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Automated Liquidity Health
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    All user prize reserves and escrow deposits are 100% matched
                    against platform balances.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
