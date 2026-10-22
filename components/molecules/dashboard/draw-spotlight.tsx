import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { ArrowRight, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JoinedDraw, Product } from "@/lib/types";
import { calculatePollMetrics, getPrizeImage } from "@/lib/prize-helpers";
import { formatCurrency } from "@/lib/utils";

interface DrawSpotlightProps {
  joinedDraw?: JoinedDraw;
  fallbackProduct?: Product;
  isLoading: boolean;
}

export function DrawSpotlight({
  joinedDraw,
  fallbackProduct,
  isLoading,
}: DrawSpotlightProps) {
  if (!joinedDraw && isLoading) {
    return (
      <section
        aria-label="Loading your draw"
        className="h-40 animate-pulse rounded-2xl border border-border bg-card"
      />
    );
  }

  const product = joinedDraw?.product || fallbackProduct;
  if (!product) return null;

  const metrics = calculatePollMetrics(product);
  const image = getPrizeImage(product);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid gap-5 p-5 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:items-center sm:p-6">
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-28 w-full rounded-lg object-cover sm:w-28"
        />

        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-0 bg-blue-500/10 text-blue-400">
              {joinedDraw ? "Your active draw" : "Latest draw"}
            </Badge>
            {joinedDraw && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Ticket className="h-3.5 w-3.5" />
                {joinedDraw.userParticipation.userTicketsBought} tickets entered
              </span>
            )}
          </div>

          <div>
            <h2 className="truncate text-lg font-bold text-foreground">
              {product.name}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {product.description ||
                "Explore this prize draw and its details."}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between gap-3 text-xs">
              <span className="font-medium text-blue-400">
                {metrics.progressPercent}% filled
              </span>
              <span className="text-muted-foreground">
                {metrics.remainingSlots} tickets left
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`${product.name} draw progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={metrics.progressPercent}
              className="h-2 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${metrics.progressPercent}%` }}
              />
            </div>
            {joinedDraw ? (
              <p className="text-xs text-muted-foreground">
                Your entry:{" "}
                {formatCurrency(joinedDraw.userParticipation.userAmountPaid)}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {formatCurrency(metrics.pricePerTicket)} per ticket
              </p>
            )}
          </div>
        </div>

        <Button asChild className="w-full sm:w-auto">
          <Link
            href={APP_ROUTES.POLL_DETAIL.replace(
              ":id",
              encodeURIComponent(String(product.id)),
            )}
          >
            {joinedDraw ? "View your draw" : "Explore draw"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
