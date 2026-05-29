"use client";

import React from "react";
import { Wallet, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  balance: number;
  currency?: string;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  isLoading?: boolean;
}

export function WalletCard({
  balance,
  currency = "USD",
  onDeposit,
  onWithdraw,
  isLoading = false,
}: WalletCardProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary to-primary/80 dark:from-primary dark:via-primary/90 dark:to-accent/30 p-8 shadow-xl transition-all hover:shadow-2xl animate-fade-in">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent dark:from-black/20 pointer-events-none" />
      
      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary-foreground/80">Total Balance</p>
            <h2 className="text-5xl font-bold text-primary-foreground tracking-tight">
              ${balance.toFixed(2)}
              <span className="text-2xl ml-3 font-semibold text-primary-foreground/70">{currency}</span>
            </h2>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button
            onClick={onDeposit}
            disabled={isLoading}
            className="rounded-xl h-11 bg-white/20 hover:bg-white/30 text-primary-foreground font-semibold backdrop-blur-sm border border-white/30 transition-all hover:border-white/50 hover:shadow-lg active:scale-95"
          >
            <ArrowDownRight className="w-4 h-4 mr-2" />
            Deposit
          </Button>
          <Button
            onClick={onWithdraw}
            disabled={isLoading}
            className="rounded-xl h-11 bg-white/10 hover:bg-white/20 text-primary-foreground font-semibold backdrop-blur-sm border border-white/20 transition-all hover:border-white/40 hover:shadow-lg active:scale-95"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  );
}
