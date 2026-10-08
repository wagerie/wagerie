"use client";

import { BtnComponent } from "@/components/atoms/button-component";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_ROUTES, APP_ROUTES } from "@/constants/routes";
import { useGet } from "@/hooks/use-api";
import type { Product } from "@/lib/types";
import { calculatePollMetrics, getPrizeImage } from "@/lib/prize-helpers";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowRight,
  DollarSign,
  Package,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";

interface ProductListResponse {
  data?: {
    items?: Product[];
  };
}

export function LandingPageHero() {
  const { data, isError, isLoading } = useGet<ProductListResponse>(
    ["landing-products"],
    `${API_ROUTES.PRODUCTS}?page=1&limit=12`,
  );
  const spotlightDraw = (data?.data?.items || []).find(
    (product) => product.status === "active",
  );
  const metrics = spotlightDraw ? calculatePollMetrics(spotlightDraw) : null;
  const progress = Math.min(
    100,
    Math.max(
      0,
      Number(spotlightDraw?.percentage ?? metrics?.progressPercent ?? 0),
    ),
  );
  const slotsLeft = Number(
    spotlightDraw?.slotsLeft ?? metrics?.remainingSlots ?? 0,
  );
  const totalSlots = Number(
    spotlightDraw?.totalSlots ?? metrics?.totalSlots ?? 0,
  );

  return (
    <section className="relative overflow-hidden pt-6 sm:pt-12">
      <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_transparent_50%),radial-gradient(circle_at_right,_rgba(6,182,212,0.15),_transparent_40%)]" />

      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold text-blue-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Prize draws with live product details
          </div>

          <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.08]">
            Explore live draws. <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Know the price.
            </span>
          </h1>

          <p className="max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Compare product values, ticket prices, and current availability
            before creating an account to enter. Track confirmed entries from
            your account.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <BtnComponent
              size="lg"
              className="rounded-2xl bg-blue-600 text-base font-black hover:bg-blue-500 shadow-lg shadow-blue-600/30"
              asChild
            >
              <Link href={APP_ROUTES.REGISTER}>
                Create an Account to Enter
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
          {isLoading ? (
            <div className="h-[30rem] animate-pulse rounded-3xl border border-border bg-card" />
          ) : isError || !spotlightDraw ? (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center shadow-2xl">
              <Trophy className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isError
                  ? "Active product information is temporarily unavailable."
                  : "No active products are available right now."}
              </p>
            </div>
          ) : (
            <div className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 font-bold text-amber-400">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Active Product
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      {spotlightDraw.name}
                    </h3>
                  </div>
                </div>
                <Badge className="border-0 bg-emerald-500/20 text-xs font-bold text-emerald-300">
                  Active
                </Badge>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950">
                <img
                  src={getPrizeImage(spotlightDraw)}
                  alt={spotlightDraw.name}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11162b] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 backdrop-blur-md">
                  <span className="text-xs text-slate-300">Product value</span>
                  <strong className="text-xs text-white">
                    {formatCurrency(spotlightDraw.productValueAmount || 0)}
                  </strong>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">
                    Ticket price {formatCurrency(spotlightDraw.ticketPrice)}
                  </span>
                  <span className="font-bold text-amber-400">
                    {slotsLeft.toLocaleString()} left of{" "}
                    {totalSlots.toLocaleString()}
                  </span>
                </div>
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-slate-800"
                  role="progressbar"
                  aria-label={`${spotlightDraw.name} entries filled`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <Button
                asChild
                className="h-12 w-full rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
              >
                <Link href={APP_ROUTES.REGISTER}>
                  Create an Account to Enter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
