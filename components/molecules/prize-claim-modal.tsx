"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  DollarSign,
  Gift,
  MapPin,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ModalLayout from "@/components/layout/modal-layout";
import { usePost } from "@/hooks/use-api";
import { API_ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { Stake } from "@/lib/types";

interface PrizeClaimModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stake: Stake | null;
}

export function PrizeClaimModal({
  open,
  onOpenChange,
  stake,
}: PrizeClaimModalProps) {
  const queryClient = useQueryClient();
  const [claimMethod, setClaimMethod] = useState<"cash" | "physical">("cash");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const prizeValue =
    stake?.potentialWinnings || stake?.amount ? stake.amount * 10 : 1000;
  const cashAmount = Math.round(prizeValue * 0.9);

  const { mutate: claimPrize, isPending } = usePost(
    API_ROUTES.USER_CLAIM_PRIZE,
    {
      onSuccess: () => {
        toast.success(
          claimMethod === "cash"
            ? `Successfully claimed $${cashAmount.toLocaleString()} cash to your wallet!`
            : "Delivery details submitted! Tracking info will be sent to your email.",
        );
        queryClient.invalidateQueries({ queryKey: ["user-stakes"] });
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
        onOpenChange(false);
      },
    },
  );

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stake) return;

    if (
      claimMethod === "physical" &&
      (!address.street || !address.city || !address.zipCode)
    ) {
      toast.error("Please fill in all required shipping address fields.");
      return;
    }

    claimPrize({
      stakeId: stake.id,
      method: claimMethod,
      shippingAddress: claimMethod === "physical" ? address : undefined,
    });
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Claim Your Prize!"
      description={`Congratulations on winning the ${stake?.pollTitle || "Prize Draw"}!`}
      size="md"
      className="border-slate-800 bg-[#0f1426] text-white sm:max-w-lg"
    >
      <form onSubmit={handleClaim} className="space-y-6 pt-2">
        {/* Celebration Banner */}
        <div className="flex items-center gap-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Verified Winning Ticket
            </p>
            <h4 className="text-lg font-black text-white">
              {stake?.pollTitle || "Prize Draw Winner"}
            </h4>
            <p className="text-xs text-slate-300">
              Prize Market Value:{" "}
              <strong className="text-white">
                ${prizeValue.toLocaleString()}
              </strong>
            </p>
          </div>
        </div>

        {/* Claim Choice Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Payout Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Option 1: Cash */}
            <button
              type="button"
              onClick={() => setClaimMethod("cash")}
              className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                claimMethod === "cash"
                  ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-2">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold text-white">
                Instant Cash Payout
              </span>
              <span className="text-xs text-emerald-400 font-extrabold mt-0.5">
                ${cashAmount.toLocaleString()} USD
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                Credited instantly to your Wagerie wallet.
              </span>
            </button>

            {/* Option 2: Physical Delivery */}
            <button
              type="button"
              onClick={() => setClaimMethod("physical")}
              className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                claimMethod === "physical"
                  ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 mb-2">
                <Gift className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold text-white">
                Physical Prize
              </span>
              <span className="text-xs text-blue-300 font-semibold mt-0.5">
                100% Free Insured Express
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                Brand-new sealed item shipped directly to you.
              </span>
            </button>
          </div>
        </div>

        {/* Address Form (if physical delivery selected) */}
        {claimMethod === "physical" ? (
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-blue-400" />
              Delivery Address
            </h5>
            <div>
              <input
                type="text"
                placeholder="Street Address *"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
                className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="City *"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="State / Province"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Postal / ZIP Code *"
                value={address.zipCode}
                onChange={(e) =>
                  setAddress({ ...address, zipCode: e.target.value })
                }
                className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Country *"
                value={address.country}
                onChange={(e) =>
                  setAddress({ ...address, country: e.target.value })
                }
                className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-slate-300">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Your cash claim will be processed immediately upon submission and
              added to your available wallet balance with no withdrawal locking.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className={`flex-1 rounded-xl font-bold text-white shadow-lg transition-all ${
              claimMethod === "cash"
                ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
                : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
            }`}
          >
            {isPending
              ? "Submitting Claim..."
              : `Confirm & Claim ${claimMethod === "cash" ? `$${cashAmount.toLocaleString()} Cash` : "Physical Prize"}`}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
}

export default PrizeClaimModal;
