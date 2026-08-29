"use client";

import { BtnComponent } from "@/components/atoms/button-component";
import { PrimaryLogo } from "@/components/atoms/logo";
import { ModeToggle } from "@/components/atoms/toggle-theme";
import { APP_ROUTES } from "@/constants/routes";
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Wallet-powered gaming",
    description:
      "Instant deposits, transparent balances, and payouts that feel trustworthy from the first click.",
    icon: Wallet,
  },
  {
    title: "Live prediction markets",
    description:
      "Users discover active polls, follow stakes, and react to real-time momentum across every draw.",
    icon: BarChart3,
  },
  {
    title: "Trusted prize engine",
    description:
      "Every win is tracked from ticket to payout, so rewards feel confirmed, secure, and delightfully clear.",
    icon: Trophy,
  },
];

const stats = [
  { label: "Active users", value: "24.8k" },
  { label: "Monthly volume", value: "$4.2M" },
  { label: "Average win speed", value: "4 min" },
  { label: "Retention rate", value: "92%" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f3ff] text-slate-900 dark:bg-[#0b1020] dark:text-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="rounded-full border border-slate-200/80 bg-white/70 px-4 py-3 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between gap-4">
            <PrimaryLogo className="text-lg sm:text-xl" />

            <nav className="hidden items-center gap-6 text-sm text-slate-600 dark:text-slate-300 md:flex">
              <Link
                href="#features"
                className="transition hover:text-slate-900 dark:hover:text-white"
              >
                Features
              </Link>
              <Link
                href="#benefits"
                className="transition hover:text-slate-900 dark:hover:text-white"
              >
                Benefits
              </Link>
              <Link
                href="#insights"
                className="transition hover:text-slate-900 dark:hover:text-white"
              >
                Insights
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <ModeToggle />
              <BtnComponent variant="outline" asChild>
                <Link href={APP_ROUTES.LOGIN}>Login</Link>
              </BtnComponent>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden pt-16 sm:pt-20">
          <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.18),_transparent_40%),radial-gradient(circle_at_right,_rgba(59,130,246,0.18),_transparent_30%)]" />

          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200">
                <Sparkles className="h-4 w-4" />
                Built for modern prediction communities
              </div>

              <h1 className="max-w-xl text-5xl font-black tracking-[-0.06em] text-slate-950 dark:text-white sm:text-6xl">
                Win bigger. Play smarter.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Wagerie combines wallet management, live polls, and premium
                prize mechanics in one polished platform built for loyal players
                and sharp operators.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <BtnComponent size="lg" asChild>
                  <Link href={APP_ROUTES.REGISTER}>
                    Start playing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </BtnComponent>
                <BtnComponent variant="outline" size="lg" asChild>
                  <Link href={APP_ROUTES.LOGIN}>See dashboard</Link>
                </BtnComponent>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Secure payouts
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  Reward-first UX
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_25px_80px_rgba(79,70,229,0.18)] dark:border-slate-800 dark:bg-slate-900">
                <div className="rounded-[28px] bg-[linear-gradient(135deg,#111827_0%,#312e81_30%,#7c3aed_100%)] p-3 text-white">
                  <div className="rounded-[24px] bg-white/5 p-5 backdrop-blur-sm">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-violet-200">
                          Portfolio
                        </p>
                        <h2 className="mt-2 text-3xl font-bold">$24,860</h2>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-3">
                        <Wallet className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs text-violet-200">Active stakes</p>
                        <p className="mt-2 text-2xl font-bold">127</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs text-violet-200">This month</p>
                        <p className="mt-2 text-2xl font-bold">+18.4%</p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                      <div className="mb-3 flex items-center justify-between text-sm text-violet-100">
                        <span>Poll momentum</span>
                        <span>Live</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: "AI trend", value: "72%" },
                          { label: "Crypto", value: "68%" },
                          { label: "Sports", value: "83%" },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="mb-1 flex items-center justify-between text-xs text-violet-100">
                              <span>{item.label}</span>
                              <span>{item.value}</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400"
                                style={{ width: item.value }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="stats"
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        <section id="features" className="mt-24">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">
              Everything in one place
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Designed to keep interest high and friction low.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {features.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(79,70,229,0.1)] dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-violet-100 p-3 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="benefits"
          className="mt-24 rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                Why operators choose it
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                A product experience that feels premium from day one.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Frictionless onboarding",
                "Live competition dashboards",
                "Clear reward tracking",
                "Strong admin visibility",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="insights" className="mt-24 pb-6">
          <div className="rounded-[32px] bg-[linear-gradient(135deg,#111827_0%,#1f2937_30%,#4338ca_100%)] p-8 text-white shadow-[0_25px_80px_rgba(79,70,229,0.2)] sm:p-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-violet-200">
                  Player feedback
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  “The dashboard feels clear, rewarding, and premium.”
                </h2>
              </div>
              <div className="flex items-center gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
