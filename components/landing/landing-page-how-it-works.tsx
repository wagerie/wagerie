"use client";

import { howItWorksSteps } from "@/components/landing/landing-page-data";

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="rounded-3xl border border-border bg-card p-8 sm:p-12 space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
          Simple & Transparent
        </span>
        <h2 className="text-3xl font-black text-foreground">
          How Wagerie Works in 3 Steps
        </h2>
        <p className="text-sm text-muted-foreground">
          No complicated mechanics or hidden rules.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {howItWorksSteps.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.step}
              className="rounded-2xl border border-border bg-muted p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-400">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-2xl font-black text-muted-foreground/60">
                  {item.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
