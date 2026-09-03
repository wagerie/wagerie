"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Users, TrendingUp, PieChart, Wallet } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const statCards = [
  {
    label: "Total Users",
    value: "247",
    icon: Users,
    color: "text-blue-500",
  },
  {
    label: "Active Polls",
    value: "4",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    label: "Total Revenue",
    value: "$12,450",
    icon: Wallet,
    color: "text-blue-500",
  },
  {
    label: "Conversion Rate",
    value: "24.5%",
    icon: PieChart,
    color: "text-orange-500",
  },
];

const recentTransactions = [
  {
    id: 1,
    user: "john@example.com",
    type: "Deposit",
    amount: "+$500.00",
    status: "Completed",
    time: "2 minutes ago",
  },
  {
    id: 2,
    user: "jane@example.com",
    type: "Stake",
    amount: "-$50.00",
    status: "Completed",
    time: "5 minutes ago",
  },
  {
    id: 3,
    user: "mike@example.com",
    type: "Withdrawal",
    amount: "-$200.00",
    status: "Pending",
    time: "10 minutes ago",
  },
];

export default function AdminDashboardPage() {
  return (
    <DashboardLayout
      userEmail="admin@wagerie.com"
      userBalance={50000}
      isAdmin={true}
    >
      <div className="min-h-full bg-[#f5f3ff] p-4 lg:p-8 dark:bg-[#0b1020]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
              Operator workspace
            </p>
            <h1 className="mb-2 text-3xl font-black tracking-tight text-[#172119] dark:text-[#f3f4ed]">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage polls, users, and track platform analytics
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-[0_8px_24px_rgba(37,99,235,0.05)] dark:border-slate-800 dark:bg-slate-900/80"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {card.label}
                      </p>
                      <p className="text-3xl font-bold">{card.value}</p>
                    </div>
                    <Icon className={cn("w-8 h-8 opacity-20", card.color)} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-[0_8px_24px_rgba(37,99,235,0.05)] dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Transactions</h2>
                <Link
                  href="/admin/transactions"
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/80"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{tx.user}</p>
                      <p className="text-sm text-muted-foreground">{tx.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{tx.amount}</p>
                      <p className="text-xs text-muted-foreground">{tx.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-[0_8px_24px_rgba(37,99,235,0.05)] dark:border-slate-800 dark:bg-slate-900/80">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/admin/polls"
                  className="block w-full rounded-xl bg-blue-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Manage Polls
                </Link>
                <Link
                  href="/admin/users"
                  className="block w-full rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-2 text-center font-medium transition-colors hover:bg-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700"
                >
                  View Users
                </Link>
                <Link
                  href="/admin/transactions"
                  className="block w-full rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-2 text-center font-medium transition-colors hover:bg-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700"
                >
                  View Transactions
                </Link>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-500/20 dark:bg-blue-500/10">
            <h3 className="font-bold mb-2">Welcome to Admin Panel</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor wallet activity and manage the platform from the
              navigation menu.
            </p>
            <div className="rounded-xl border border-blue-100 bg-white/70 p-3 text-xs text-slate-600 dark:border-blue-500/20 dark:bg-slate-900/50 dark:text-slate-300">
              <strong>Workspace status:</strong> Monitor platform activity,
              manage live polls, and review account movement from one place.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
