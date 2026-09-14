"use client";

import { Badge } from "@/components/ui/badge";

export function WinnersSection() {
  return (
    <section
      id="winners"
      className="rounded-3xl border border-border bg-card p-8 sm:p-12"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Real people. Real outcomes.
          </span>
          <h2 className="mt-2 text-3xl font-black text-foreground">
            Previous winners
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Winner records and testimonials will appear here once completed
            draws are available.
          </p>
        </div>
        <Badge className="w-fit border-border bg-muted text-muted-foreground">
          No completed draws yet
        </Badge>
      </div>
      <div className="mt-6 flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 p-6 text-center text-sm text-muted-foreground">
        Verified winner information will include the prize, date, winning entry,
        and claim outcome.
      </div>
    </section>
  );
}
