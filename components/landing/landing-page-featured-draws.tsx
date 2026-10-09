"use client";

import { useGetPage } from "@/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_ROUTES, APP_ROUTES } from "@/constants/routes";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { calculatePollMetrics, getPrizeImage } from "@/lib/prize-helpers";
import { formatCurrency } from "@/lib/utils";

export function FeaturedDrawsSection() {
  const { data, isError, isLoading } = useGetPage<Product>(
    ["landing-products"],
    `${API_ROUTES.PRODUCTS}?page=1&limit=12`,
  );
  const products = (data?.items || [])
    .filter((product) => product.status === "active")
    .slice(0, 3);

  return (
    <section id="featured" className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-foreground">
          Active Prize Draws
        </h2>
        <p className="text-sm text-muted-foreground">
          Current products, ticket prices, and live availability.
        </p>
      </div>

      {isLoading ? (
        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Loading active draws"
        >
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-lg border border-border bg-card"
            />
          ))}
        </div>
      ) : isError ? (
        <p className="border-y border-border py-6 text-sm text-muted-foreground">
          Active draws are temporarily unavailable.
        </p>
      ) : products.length === 0 ? (
        <p className="border-y border-border py-6 text-sm text-muted-foreground">
          No active draws are available right now.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const metrics = calculatePollMetrics(product);
            const progress = Math.min(
              100,
              Math.max(
                0,
                Number(product.percentage ?? metrics.progressPercent),
              ),
            );
            const totalSlots = Number(product.totalSlots ?? metrics.totalSlots);
            const slotsLeft = Number(
              product.slotsLeft ?? metrics.remainingSlots,
            );

            return (
              <article
                key={product.id}
                className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
              >
                <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
                  <img
                    src={getPrizeImage(product)}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/30" />
                  <Badge className="absolute left-3 top-3 border-0 bg-slate-900/80 text-xs text-white">
                    Active
                  </Badge>
                  <div className="absolute right-3 top-3 rounded-md border border-amber-500/30 bg-slate-950/80 px-2 py-1 text-right">
                    <span className="text-[9px] uppercase font-bold text-amber-300">
                      Product value
                    </span>
                    <p className="text-xs font-black text-white">
                      {formatCurrency(product.productValueAmount || 0)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <h3 className="line-clamp-1 text-base font-bold text-foreground">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ticket price {formatCurrency(product.ticketPrice)}
                    </p>
                  </div>

                  <div className="mt-auto space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-blue-400">
                        {progress}% filled
                      </span>
                      <span className="text-muted-foreground">
                        {slotsLeft.toLocaleString()} left ·{" "}
                        {totalSlots.toLocaleString()} total
                      </span>
                    </div>
                    <div
                      className="h-2 w-full overflow-hidden rounded-full bg-slate-800"
                      role="progressbar"
                      aria-label={`${product.name} entries filled`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progress}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-blue-600 font-bold text-white hover:bg-blue-500"
                  >
                    <Link href={APP_ROUTES.REGISTER}>
                      Create an account to enter
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
