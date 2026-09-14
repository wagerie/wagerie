"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/routes";
import { featuredDraws } from "@/components/landing/landing-page-data";
import Image from "next/image";
import Link from "next/link";

export function FeaturedDrawsSection() {
  return (
    <section id="featured" className="space-y-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
          High Anticipation
        </span>
        <h2 className="text-3xl font-black text-foreground">
          Featured Live Draws
        </h2>
        <p className="text-sm text-muted-foreground">
          Explore the products currently available and see how close each pool
          is to its target.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredDraws.map((draw) => (
          <div
            key={draw.name}
            className="flex flex-col rounded-3xl border border-border bg-card overflow-hidden shadow-xl hover:border-primary/50 transition-all"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
              <Image
                src={draw.image}
                alt={draw.name}
                fill
                sizes="33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11162b] via-transparent to-black/40" />
              <Badge className="absolute left-3 top-3 border-0 bg-slate-900/80 text-xs text-white">
                {draw.category}
              </Badge>
              <div className="absolute right-3 top-3 rounded-xl border border-amber-500/30 bg-slate-950/80 px-2 py-0.5 text-right">
                <span className="text-[9px] uppercase font-bold text-amber-300">
                  Value
                </span>
                <p className="text-xs font-black text-white">{draw.value}</p>
              </div>
            </div>

            <div className="p-5 flex flex-1 flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-foreground text-base line-clamp-1">
                  {draw.name}
                </h3>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                  Cash equivalent where eligible: {draw.cash}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-blue-400 font-bold">
                    {draw.progress}% Filled
                  </span>
                  <span className="text-muted-foreground">
                    {draw.ticketsLeft} left
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                    style={{ width: `${draw.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">
                    From
                  </span>
                  <p className="text-base font-extrabold text-foreground">
                    {draw.ticketPrice}
                  </p>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 font-bold"
                >
                  <Link href={APP_ROUTES.REGISTER}>Enter Draw</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
