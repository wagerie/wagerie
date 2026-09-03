"use client";

import { useState } from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WithdrawModal } from "@/components/molecules/modals/withdraw-modal";
import { useGetBalance } from "@/hooks/use-wallet";

const CURRENT_USER = {
  id: "user-1",
  email: "you@wagerie.com",
};

export default function ProfilePage() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const { data: wallet, isLoading } = useGetBalance(CURRENT_USER.id);
  const balance = wallet?.balance || 0;

  return (
    <DashboardLayout userEmail={CURRENT_USER.email} userBalance={balance}>
      <div className="min-h-full bg-[#f5f3ff] p-4 dark:bg-[#0b1020] lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
              Account
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              Profile & wallet
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Manage your account details and move funds from your wallet.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-3xl border border-blue-100 bg-white/80 p-6 shadow-[0_12px_30px_rgba(37,99,235,0.06)] dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white">
                  {CURRENT_USER.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-slate-950 dark:text-white">
                    Your account
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {CURRENT_USER.email}
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-300" />
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Keep your account details current so wallet transfers can be
                  processed smoothly.
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-blue-100 bg-white/80 p-6 shadow-[0_12px_30px_rgba(37,99,235,0.06)] dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Available wallet balance
              </p>
              <p className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white">
                {isLoading ? "Loading..." : `$${balance.toFixed(2)}`}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setWithdrawOpen(true)}
                  disabled={isLoading}
                  className="inline-flex items-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/20"
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Withdraw funds
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <WithdrawModal
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        userId={CURRENT_USER.id}
      />
    </DashboardLayout>
  );
}
