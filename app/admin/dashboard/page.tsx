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
    color: "text-purple-500",
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
      <div className="min-h-full bg-background p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
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
                  className="bg-card border border-border rounded-lg p-6"
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
            <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
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
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
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
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/admin/polls"
                  className="block w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center font-medium"
                >
                  Manage Polls
                </Link>
                <Link
                  href="/admin/users"
                  className="block w-full px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-center font-medium"
                >
                  View Users
                </Link>
                <Link
                  href="/admin/transactions"
                  className="block w-full px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-center font-medium"
                >
                  View Transactions
                </Link>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-linear-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
            <h3 className="font-bold mb-2">Welcome to Admin Panel</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Phase 1 Implementation: Wallet system and admin dashboard
              foundation complete. Use the navigation menu to access polls,
              users, and transaction management.
            </p>
            <div className="bg-muted/50 border border-border rounded p-3 text-xs text-muted-foreground">
              <strong>Demo Data:</strong> All data shown is from mock API. Real
              backend integration will be seamless when endpoints are ready.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
