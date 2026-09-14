"use client";

import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";

export function FairnessSection() {
  return (
    <section
      id="fairness"
      className="rounded-3xl border border-blue-500/20 bg-linear-to-b from-blue-500/10 to-card p-8 sm:p-12 space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Understand the process
          </span>
          <h2 className="text-3xl font-black text-foreground">
            Trust, Transparency & Security
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Entries are connected to your account, pool progress is visible, and
            your entry history remains available in the workspace. We show the
            product, price, target, and current pool status before you decide to
            participate.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-xl shadow-blue-600/30"
        >
          <Link href={APP_ROUTES.REGISTER}>Start Playing Today</Link>
        </Button>
      </div>
    </section>
  );
}
