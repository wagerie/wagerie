"use client";

import React, { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  CreditCard,
  Lock,
  Share2,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WithdrawModal } from "@/components/molecules/modals/withdraw-modal";
import { DepositModal } from "@/components/molecules/modals/deposit-modal";
import { useGetBalance } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

const CURRENT_USER = {
  email: "player@wagerie.com",
  referralCode: "WAG-78921",
};

export default function ProfilePage() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const { data: wallet, isLoading } = useGetBalance();
  const balance = (wallet as any)?.data?.balance ?? 0;

  const copyReferral = () => {
    navigator.clipboard.writeText(
      `https://wagerie.com/register?ref=${CURRENT_USER.referralCode}`,
    );
    toast.success("Referral link copied to clipboard!");
  };

  return (
    <DashboardLayout userEmail={CURRENT_USER.email}>
      <div className="min-h-full bg-background text-foreground p-4 lg:p-8 space-y-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge className="border-0 bg-blue-500/10 text-xs font-semibold uppercase tracking-widest text-blue-400">
                <User className="mr-1 h-3 w-3" />
                Player Account
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Profile & Wallet Settings
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Manage your personal credentials, withdrawal destination, and
              account security.
            </p>
          </div>

          {/* Top Two Column Layout */}
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            {/* Account Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-2xl font-black text-white shadow-lg">
                    {CURRENT_USER.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">
                        Verified Player
                      </h2>
                      <Badge className="border-0 bg-emerald-500/15 text-emerald-400 text-[10px]">
                        Active
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {CURRENT_USER.email}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Tier 1 KYC Verified
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 rounded-2xl border border-border bg-muted p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Account ID:</span>
                    <span className="font-mono text-foreground">
                      usr_98f420b
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Membership:</span>
                    <span className="font-bold text-blue-400">
                      Wagerie Pioneer
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Security Standard:
                    </span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Two-Factor Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-3.5 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <p>
                  Your account is protected with bank-grade encryption. Prize
                  notifications and withdrawal verifications are dispatched to
                  your registered email.
                </p>
              </div>
            </div>

            {/* Wallet & Payout Hub Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                  Available Liquidity
                </span>
                <p className="mt-2 text-4xl font-black tracking-tight text-foreground">
                  {isLoading ? "..." : formatCurrency(balance)}
                  <span className="ml-2 text-sm font-bold text-muted-foreground">
                    USD
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ready for instant entry staking or fee-free bank payout.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    onClick={() => setWithdrawOpen(true)}
                    disabled={isLoading || balance <= 0}
                    className="flex-1 rounded-xl bg-secondary border border-border text-secondary-foreground hover:bg-accent hover:border-primary/50 font-bold"
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4 text-emerald-400" />
                    Withdraw Funds
                  </Button>

                  <Button
                    onClick={() => setDepositOpen(true)}
                    className="flex-1 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-bold shadow-md shadow-blue-600/30"
                  >
                    <ArrowDownRight className="mr-2 h-4 w-4" />
                    Add Funds
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted p-4 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Daily Withdrawal Cap:</span>
                  <span className="text-foreground font-semibold">
                    $50,000.00
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>ACH Processing Timeline:</span>
                  <span className="text-emerald-400 font-semibold">
                    1-2 Business Days
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Withdrawal Fees:</span>
                  <span className="text-emerald-400 font-semibold">
                    $0.00 (Zero Fee)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Referral & Fair Play Strip */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Referral Hub */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Invite Friends, Earn Free Tickets
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Share your invite link to get $5 in draw credits.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted p-3">
                <span className="font-mono text-xs font-bold text-blue-400 flex-1 truncate w-20">
                  wagerie.com/register?ref={CURRENT_USER.referralCode}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyReferral}
                  className="rounded-xl border-border bg-secondary text-xs text-secondary-foreground hover:bg-accent"
                >
                  <Copy className="mr-1 h-3.5 w-3.5" />
                  Copy Link
                </Button>
              </div>
            </div>

            {/* Fair Play & Trust Banner */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Responsible Gaming & Fairness
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Transparent draws and account protection limits.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-border bg-muted p-3">
                  <p className="text-muted-foreground">Deposit Limits</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    Customizable
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted p-3">
                  <p className="text-muted-foreground">Provably Fair Seed</p>
                  <p className="font-semibold text-emerald-400 mt-0.5">
                    Verified SHA-256
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WithdrawModal open={withdrawOpen} onOpenChange={setWithdrawOpen} />

      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
    </DashboardLayout>
  );
}
