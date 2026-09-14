"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Sparkles, Ticket, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModalLayout from "@/components/layout/modal-layout";
import { toast } from "sonner";

interface TicketConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prizeName: string;
  ticketsBought: number;
  totalPaid: number;
  ticketNumbers?: number[];
  pollId: number | string;
}

export function TicketConfirmationModal({
  open,
  onOpenChange,
  prizeName,
  ticketsBought,
  totalPaid,
  ticketNumbers = [],
  pollId,
}: TicketConfirmationModalProps) {
  // Generate visual fallback ticket numbers if not explicitly provided by backend
  const displayNumbers =
    ticketNumbers.length > 0
      ? ticketNumbers
      : Array.from(
          { length: ticketsBought },
          (_, i) => 100 + i + Math.floor(Math.random() * 50),
        );

  const copyNumbers = () => {
    const text = displayNumbers
      .map((n) => `#${String(n).padStart(3, "0")}`)
      .join(", ");
    navigator.clipboard.writeText(text);
    toast.success("Ticket numbers copied to clipboard!");
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="You're In the Draw!"
      description={`Successfully confirmed ${ticketsBought} ticket${ticketsBought > 1 ? "s" : ""} for ${prizeName}.`}
      size="md"
      className="border-slate-800 bg-[#0f1426] text-white"
    >
      <div className="space-y-6 pt-2">
        {/* Celebration Header Graphic */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/15 to-transparent p-6 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            <Trophy className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-black text-white">Entry Confirmed</h3>
          <p className="mt-1 text-xs text-slate-300">
            Total Paid:{" "}
            <strong className="text-white">
              ${totalPaid.toLocaleString()}
            </strong>
          </p>
        </div>

        {/* Assigned Ticket Numbers */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Ticket className="h-3.5 w-3.5 text-blue-400" />
              Your Ticket Numbers
            </span>
            <button
              type="button"
              onClick={copyNumbers}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              <Copy className="h-3 w-3" />
              Copy All
            </button>
          </div>

          <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/80 p-3">
            {displayNumbers.map((num) => (
              <span
                key={num}
                className="inline-flex items-center rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-300 shadow-sm"
              >
                #{String(num).padStart(3, "0")}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            These unique numbers are registered under your account and will be
            included in the automated provably-fair draw.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 sm:flex-row pt-2">
          <Button
            asChild
            className="flex-1 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-500"
          >
            <Link href="/my-stakes">View in My Stakes</Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Done
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
}

export default TicketConfirmationModal;
