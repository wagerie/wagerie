"use client";

import React, { useState } from "react";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WalletCard } from "@/components/molecules/wallet-card";
import { DepositModal } from "@/components/molecules/modals/deposit-modal";
import { WithdrawModal } from "@/components/molecules/modals/withdraw-modal";
import { useGetBalance, useTransactionHistory } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import formatDate from "@/lib/format-date";
import { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

// Mock user ID for development - replace with actual user from auth
const MOCK_USER_ID = "user-1";
const MOCK_USER_EMAIL = "john@example.com";

function getTransactionColor(type: string) {
  switch (type) {
    case "deposit":
      return "text-green-500";
    case "withdrawal":
      return "text-red-500";
    case "stake":
      return "text-orange-500";
    case "winnings":
      return "text-green-500";
    case "refund":
      return "text-blue-500";
    default:
      return "text-gray-500";
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
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const { data: wallet, isLoading: walletLoading } =
    useGetBalance(MOCK_USER_ID);
  const { data: transactionsData, isLoading: txLoading } =
    useTransactionHistory(MOCK_USER_ID, { pageSize: 5 });

  const isLoading = walletLoading || txLoading;
  const recentTransactions = transactionsData?.data || [];

  return (
    <DashboardLayout
      userEmail={MOCK_USER_EMAIL}
      userBalance={wallet?.balance || 0}
    >
      <div className="min-h-full bg-background p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your account today.
            </p>
          </div>

          {/* Wallet Card */}
          <div className="mb-8">
            <WalletCard
              balance={wallet?.balance || 0}
              onDeposit={() => setDepositOpen(true)}
              onWithdraw={() => setWithdrawOpen(true)}
              isLoading={walletLoading}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Active Stakes
                  </p>
                  <p className="text-3xl font-bold">3</p>
                </div>
                <Zap className="w-8 h-8 text-primary opacity-20" />
              </div>
              <Link
                href="/my-stakes"
                className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                View stakes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Available Polls
                  </p>
                  <p className="text-3xl font-bold">4</p>
                </div>
                <Zap className="w-8 h-8 text-primary opacity-20" />
              </div>
              <Link
                href="/polls"
                className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Browse polls <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Total Staked
                  </p>
                  <p className="text-3xl font-bold">$225</p>
                </div>
                <Zap className="w-8 h-8 text-primary opacity-20" />
              </div>
              <Link
                href="/transactions"
                className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                View history <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Transactions</h2>
              <Link
                href="/transactions"
                className="text-primary hover:underline text-sm"
              >
                View all
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
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
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between flex-1">
                      <div>
                        <p className="font-medium capitalize">
                          {tx.description || tx.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(tx.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "font-semibold",
                            getTransactionColor(tx.type),
                          )}
                        >
                          {getTransactionSign(tx.type)}${tx.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Getting Started Section */}
          <div className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3">Getting Started</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Deposit funds to your wallet
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Browse available polls and prizes
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Purchase slots and receive unique numbers
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Wait for the draw and claim your prize
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DepositModal
        open={depositOpen}
        onOpenChange={setDepositOpen}
        userId={MOCK_USER_ID}
      />
      <WithdrawModal
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        userId={MOCK_USER_ID}
      />
    </DashboardLayout>
  );
}
