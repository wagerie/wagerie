"use client";

import { APP_ROUTES } from "@/constants/routes";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, User, Wallet } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WithdrawModal } from "@/components/molecules/modals/withdraw-modal";
import { DepositModal } from "@/components/molecules/modals/deposit-modal";
import { QueryFeedback } from "@/components/molecules/query-feedback";
import { useGetBalance } from "@/hooks/use-wallet";
import { useAccountProfile } from "@/hooks/use-account-profile";
import { finiteAmount } from "@/lib/account-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function ProfilePage() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const walletQuery = useGetBalance();
  const profileQuery = useAccountProfile();
  const profile = profileQuery.data;
  const balance = finiteAmount(walletQuery.data?.balance);
  const balanceAvailable =
    !walletQuery.isLoading && !walletQuery.isError && balance !== null;

  return (
    <DashboardLayout>
      <div className="min-h-full space-y-8 bg-background p-4 text-foreground lg:p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2">
            <Badge className="border-0 bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <User className="mr-1 h-3.5 w-3.5" />
              Your account
            </Badge>
            <h1 className="text-3xl font-black sm:text-4xl">
              Profile & wallet
            </h1>
            <p className="text-sm text-muted-foreground">
              Review your account details, wallet, and recorded activity.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="space-y-5 rounded-3xl border border-border bg-card p-6">
              <h2 className="text-xl font-bold">Account details</h2>
              {profileQuery.isLoading ? (
                <p role="status">Loading account…</p>
              ) : profile ? (
                <dl className="space-y-4 text-sm">
                  {[
                    ["Email", profile.email],
                    ["Account ID", profile.id],
                    [
                      "Verification",
                      profile.verificationStatus || "Not provided",
                    ],
                    [
                      "Two-factor authentication",
                      typeof profile.twoFactorEnabled === "boolean"
                        ? profile.twoFactorEnabled
                          ? "Enabled"
                          : "Not enabled"
                        : "Not provided",
                    ],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="mt-1 break-all font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <QueryFeedback
                  message="Account details are not available. Verification and security status cannot be confirmed here yet."
                  onRetry={
                    profileQuery.isConfigured
                      ? () => void profileQuery.refetch()
                      : undefined
                  }
                />
              )}
            </section>
            <section className="space-y-5 rounded-3xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Wallet className="h-5 w-5 text-blue-500" />
                Available balance
              </h2>
              <p className="text-4xl font-black">
                {walletQuery.isLoading
                  ? "Loading…"
                  : balanceAvailable
                    ? formatCurrency(balance!, walletQuery.data?.currency)
                    : "Unavailable"}
              </p>
              {!walletQuery.isLoading && !balanceAvailable && (
                <QueryFeedback
                  message="Your balance could not be confirmed."
                  onRetry={() => void walletQuery.refetch()}
                />
              )}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  disabled={!balanceAvailable || balance! <= 0}
                  onClick={() => setWithdrawOpen(true)}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Withdraw funds
                </Button>
                <Button
                  className="rounded-xl bg-blue-600 text-white hover:bg-blue-500"
                  onClick={() => setDepositOpen(true)}
                >
                  <ArrowDownRight className="mr-2 h-4 w-4" />
                  Add funds
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Payment availability, fees, limits, and settlement times depend
                on the supported provider. No fee or timing guarantee is made
                here.
              </p>
            </section>
          </div>
          <section className="space-y-4 rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold">Account activity</h2>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={APP_ROUTES.MY_ENTRIES}>My Entries</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={APP_ROUTES.TRANSACTIONS}>Transactions</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={APP_ROUTES.SUPPORT}>Support</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
      <WithdrawModal open={withdrawOpen} onOpenChange={setWithdrawOpen} />
      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
    </DashboardLayout>
  );
}
