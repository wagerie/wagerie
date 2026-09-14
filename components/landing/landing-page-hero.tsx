"use client";

import { BtnComponent } from "@/components/atoms/button-component";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/routes";
import { featuredDraws } from "@/components/landing/landing-page-data";
import {
  ArrowRight,
  DollarSign,
  Package,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function LandingPageHero() {
  const spotlightDraw = featuredDraws[1];

  return (
    <section className="relative overflow-hidden pt-6 sm:pt-12">
      <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_transparent_50%),radial-gradient(circle_at_right,_rgba(6,182,212,0.15),_transparent_40%)]" />

      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold text-blue-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Premium product pools
          </div>

          <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.08]">
            Win luxury prizes. <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              From just $1.
            </span>
          </h1>

          <p className="max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Browse premium products, choose how many entries you want, and
            receive a unique number linked to your account. When a pool is
            ready, the winning entry is selected and the outcome is recorded.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <BtnComponent
              size="lg"
              className="rounded-2xl bg-blue-600 text-base font-black hover:bg-blue-500 shadow-lg shadow-blue-600/30"
              asChild
            >
              <Link href={APP_ROUTES.REGISTER}>
                Explore Live Draws
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </BtnComponent>
            <BtnComponent
              variant="outline"
              size="lg"
              className="rounded-2xl border-border bg-secondary text-secondary-foreground hover:bg-accent"
              asChild
            >
              <Link href="#how-it-works">See How It Works</Link>
            </BtnComponent>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Unique account entries
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              Clear pool progress
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-400" />
              Track entries in your account
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 font-bold">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Spotlight Draw
                  </span>
                  <h3 className="text-base font-bold text-foreground">
                    {spotlightDraw.name}
                  </h3>
                </div>
              </div>
              <Badge className="border-0 bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                ● {spotlightDraw.progress}% Sold
              </Badge>
            </div>

            <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-slate-950">
              <Image
                src={spotlightDraw.image}
                alt={spotlightDraw.name}
                fill
                sizes="50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11162b] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-300 dark:text-slate-300">
                  Prize Value:{" "}
                  <strong className="text-white">{spotlightDraw.value}</strong>
                </span>
                <span className="text-xs text-emerald-400 font-bold">
                  Cash equivalent where eligible
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Tickets Claimed</span>
                <span className="text-amber-400 font-bold">
                  Only {spotlightDraw.ticketsLeft} remaining
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 w-[88%]" />
              </div>
            </div>

            <Button
              asChild
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg shadow-blue-600/30"
            >
              <Link href={APP_ROUTES.REGISTER}>
                Claim Tickets for {spotlightDraw.ticketPrice}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
