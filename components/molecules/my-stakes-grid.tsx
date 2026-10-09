"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";
import type { JoinedDraw } from "@/lib/types";
import type { DeliveryStatus } from "@/hooks/use-delivery-status";
import {
  CheckCircle,
  Clock,
  PackageCheck,
  Ticket,
  Trophy,
  XCircle,
  type LucideIcon,
} from "lucide-react";

export type DrawStatus =
  | "active"
  | "won"
  | "lost"
  | "claimed"
  | "pending"
  | "delivery_pending"
  | "shipped"
  | "received";
export type DrawRow = JoinedDraw & { drawStatus: DrawStatus };

const statusBadges: Record<
  DrawStatus,
  { label: string; className: string; icon: LucideIcon }
> = {
  active: {
    label: "Live Entry",
    className: "border-0 bg-blue-500/15 text-blue-300",
    icon: Clock,
  },
  won: {
    label: "Won!",
    className: "border-0 bg-amber-500/20 text-amber-300 font-bold",
    icon: Trophy,
  },
  lost: {
    label: "Draw Ended",
    className: "border-0 bg-red-500/15 text-red-400",
    icon: XCircle,
  },
  claimed: {
    label: "Prize Claimed",
    className: "border-0 bg-emerald-500/20 text-emerald-300",
    icon: CheckCircle,
  },
  pending: {
    label: "Claim Processing",
    className: "border-0 bg-blue-500/15 text-blue-300",
    icon: Clock,
  },
  delivery_pending: {
    label: "Awaiting delivery",
    className: "border-0 bg-blue-500/15 text-blue-300",
    icon: Clock,
  },
  shipped: {
    label: "Shipped",
    className: "border-0 bg-cyan-500/15 text-cyan-300",
    icon: PackageCheck,
  },
  received: {
    label: "Received",
    className: "border-0 bg-emerald-500/20 text-emerald-300",
    icon: CheckCircle,
  },
};

export function getDrawStatus(
  draw: JoinedDraw,
  deliveryStatus: DeliveryStatus = "pending",
): DrawStatus {
  if (draw.userParticipation.isWinner) {
    if (draw.product.claimStatus?.startsWith("claimed")) {
      if (draw.product.claimType === "physical") {
        if (deliveryStatus === "received") return "received";
        if (deliveryStatus === "shipped") return "shipped";
        return "delivery_pending";
      }
      return "claimed";
    }
    if (["pending", "processing"].includes(draw.product.claimStatus || "")) {
      return "pending";
    }
    return "won";
  }

  return draw.product.status === "active" ? "active" : "lost";
}

export function canClaimDraw(draw: JoinedDraw) {
  const claimStatus = draw.product.claimStatus;

  return (
    draw.userParticipation.isWinner &&
    (claimStatus == null ||
      claimStatus === "unclaimed" ||
      claimStatus === "rejected")
  );
}

export function DrawStatusBadge({ status }: { status: DrawStatus }) {
  const { label, className, icon: Icon } = statusBadges[status];

  return (
    <Badge className={cn("shrink-0", className)}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  );
}

interface MyStakesGridProps {
  draws: DrawRow[];
  onClaim: (draw: JoinedDraw) => void;
  getDeliveryStatus: (productId: string) => DeliveryStatus;
  onConfirmReceived: (productId: string) => void;
}

export function MyStakesGrid({
  draws,
  onClaim,
  getDeliveryStatus,
  onConfirmReceived,
}: MyStakesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {draws.map((draw) => {
        const isWon = draw.userParticipation.isWinner;

        return (
          <article
            key={draw.product.id}
            className={`flex flex-col rounded-3xl border p-5 transition-all ${
              isWon
                ? "border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-[#11162b] ring-1 ring-amber-500/30"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {formatDate(
                    draw.userParticipation.firstJoinedAt,
                    "MMM dd, yyyy",
                  )}
                </span>
                <h3 className="mt-0.5 line-clamp-1 text-base font-bold text-white">
                  {draw.product.name}
                </h3>
              </div>
              <DrawStatusBadge status={draw.drawStatus} />
            </div>

            <div className="my-3 space-y-1.5 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                <Ticket className="h-3 w-3 text-blue-400" />
                {draw.userParticipation.userTicketsBought} tickets bought
              </span>
              <p className="text-xs text-slate-300">
                Product value:{" "}
                {formatCurrency(draw.product.productValueAmount || 0)}
              </p>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
              <p>
                <span className="text-slate-400">Staked:</span>
                <span className="ml-1 font-bold text-white">
                  {formatCurrency(draw.userParticipation.userAmountPaid)}
                </span>
              </p>
              {draw.product.claimType === "physical" &&
              draw.product.claimStatus?.startsWith("claimed") ? (
                <div className="flex items-center gap-2">
                  {getDeliveryStatus(draw.product.id) === "shipped" && (
                    <Button
                      size="sm"
                      onClick={() => onConfirmReceived(draw.product.id)}
                      className="rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                    >
                      Confirm received
                    </Button>
                  )}
                </div>
              ) : canClaimDraw(draw) ? (
                <Button
                  size="sm"
                  onClick={() => onClaim(draw)}
                  className="rounded-xl bg-amber-500 font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400"
                >
                  Claim
                </Button>
              ) : isWon ? (
                <DrawStatusBadge status={draw.drawStatus} />
              ) : (
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="rounded-xl text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                >
                  <Link href={`/polls/${draw.product.id}`}>View Draw</Link>
                </Button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
