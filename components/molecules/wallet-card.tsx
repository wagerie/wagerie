"use client";

import React from "react";
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  Coins,
} from "lucide-react";
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
    <div className="relative w-full overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-[#1e3a8a] via-[#172554] to-[#0b1020] p-6 sm:p-8 text-white shadow-2xl transition-all hover:border-blue-500/50">
      {/* Decorative gradient overlay */}
      <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-blue-400" />
              Available Balance
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight tabular-nums">
              ${balance.toFixed(2)}
              <span className="text-base sm:text-xl ml-2 font-bold text-blue-300/80">
                {currency}
              </span>
            </h2>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
            <Wallet className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={onDeposit}
            disabled={isLoading}
            className="rounded-xl h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/40 border border-blue-400/30 transition-all active:scale-95"
          >
            <ArrowDownRight className="w-4 h-4 mr-2" />
            Deposit
          </Button>
          <Button
            onClick={onWithdraw}
            disabled={isLoading || balance <= 0}
            className="rounded-xl h-12 bg-white/10 hover:bg-white/20 text-white font-bold backdrop-blur-md border border-white/20 transition-all active:scale-95 disabled:opacity-40"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WalletCard;
