"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Ticket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { calculatePollMetrics, getPrizeImage } from "@/lib/prize-helpers";

interface PollCardProps {
  product: Product;
  categoryName?: string;
  featured?: boolean;
}

export function PollCard({
  product,
  categoryName,
  featured = false,
}: PollCardProps) {
  const metrics = calculatePollMetrics(product);
  const imageUrl = getPrizeImage(product);
  const isSoldOut =
    metrics.remainingSlots === 0 ||
    product.status === "closed" ||
    product.status === "completed";
  const isFillingFast = metrics.progressPercent >= 75 && !isSoldOut;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-300",
        "border-border bg-card text-card-foreground shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
        "hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_20px_40px_rgba(37,99,235,0.18)]",
        featured && "ring-1 ring-blue-500/30",
      )}
    >
      {/* Top Banner / Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/40" />

        {/* Floating Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
          {categoryName && (
            <Badge className="border-0 bg-slate-900/80 text-xs font-medium text-slate-200 backdrop-blur-md">
              {categoryName}
            </Badge>
          )}

          {isFillingFast && (
            <Badge className="border-0 bg-amber-500/90 text-xs font-semibold text-slate-950 backdrop-blur-md animate-pulse">
              <Sparkles className="mr-1 h-3 w-3" />
              Filling Fast
            </Badge>
          )}

          {isSoldOut && (
            <Badge className="border-0 bg-red-500/90 text-xs font-semibold text-white backdrop-blur-md">
              Completed
            </Badge>
          )}
        </div>

        {/* Prize Value Ribbon */}
        <div className="absolute right-3 top-3">
          <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 px-2.5 py-1 text-right backdrop-blur-md">
            <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold">
              Product Value
            </span>
            <p className="text-xs font-black text-white sm:text-sm">
              {formatCurrency(Number(product.productValueAmount || 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          <Link
            href={`/polls/${product.id}`}
            className="line-clamp-1 text-lg font-bold text-foreground transition-colors group-hover:text-blue-500 dark:group-hover:text-blue-400"
          >
            {product.name}
          </Link>
          <p className="line-clamp-2 mt-1 text-xs text-slate-400 leading-relaxed min-h-[32px]">
            {product.description ||
              "Review the product details, ticket price, and current entry availability."}
          </p>
        </div>

        {/* Progress Bar & Ticket Numbers */}
        <div className="mt-auto pt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-blue-400">
              {metrics.progressPercent}% filled
            </span>
            <span className="text-muted-foreground">
              <strong className="text-foreground">
                {metrics.remainingSlots}
              </strong>{" "}
              tickets left
            </span>
          </div>

          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                metrics.progressPercent >= 85
                  ? "bg-gradient-to-r from-amber-500 to-emerald-400"
                  : "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400",
              )}
              style={{ width: `${Math.max(4, metrics.progressPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>{metrics.filledSlots} sold</span>
            <span>{metrics.totalSlots} total slots</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Ticket Price
            </span>
            <p className="text-lg font-extrabold text-white flex items-center gap-1">
              <Ticket className="h-4 w-4 text-blue-400" />
              {formatCurrency(metrics.pricePerTicket)}
            </p>
          </div>

          <Button
            asChild
            size="sm"
            disabled={isSoldOut}
            className={cn(
              "rounded-xl font-semibold shadow-md transition-all",
              isSoldOut
                ? "bg-slate-800 text-slate-500"
                : "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_8px_20px_rgba(37,99,235,0.35)]",
            )}
          >
            <Link href={`/polls/${product.id}`}>
              {isSoldOut ? "Draw Ended" : "Enter Draw"}
              {!isSoldOut && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PollCard;
