"use client";

import React, { useState } from "react";
import { DollarSign, Gift, MapPin, ShieldCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ModalLayout from "@/components/layout/modal-layout";
import { usePost } from "@/hooks/use-api";
import { API_ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { DrawClaimInput, JoinedDraw } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface PrizeClaimModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draw: JoinedDraw | null;
}

export function PrizeClaimModal({
  open,
  onOpenChange,
  draw,
}: PrizeClaimModalProps) {
  const queryClient = useQueryClient();
  const [claimMethod, setClaimMethod] = useState<"cash" | "physical">("cash");
  const [address, setAddress] = useState({
    recipientName: "",
    phoneNumber: "",
    addressLine1: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const { mutate: claimDraw, isPending } = usePost<unknown, DrawClaimInput>(
    API_ROUTES.CLAIM_DRAW.replace(":id", draw?.product.id || ""),
    {
      onSuccess: () => {
        toast.success("Claim submitted. Check your draw status for updates.");
        queryClient.invalidateQueries({ queryKey: ["my-draws"] });
        queryClient.invalidateQueries({ queryKey: ["won-draws"] });
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
        onOpenChange(false);
      },
    },
  );

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draw) return;

    if (
      claimMethod === "physical" &&
      (!address.recipientName ||
        !address.phoneNumber ||
        !address.addressLine1 ||
        !address.city ||
        !address.state ||
        !address.country ||
        !address.postalCode)
    ) {
      toast.error("Please complete all required shipping details.");
      return;
    }

    claimDraw({
      claimType: claimMethod,
      shippingDetails: claimMethod === "physical" ? address : undefined,
    });
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Claim Your Prize!"
      description={`Choose how to claim ${draw?.product.name || "your prize"}.`}
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
              Winning Entry
            </p>
            <h4 className="text-lg font-black text-white">
              {draw?.product.name || "Prize Draw Winner"}
            </h4>
            <p className="text-xs text-slate-300">
              Product value:{" "}
              {draw?.product.productValueAmount != null
                ? formatCurrency(draw.product.productValueAmount)
                : "Not provided"}
            </p>
          </div>
        </div>

        {/* Claim Choice Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select how you want to claim your prize
          </label>
          <p className="text-xs text-slate-400">
            Available claim methods, amounts, and timing depend on the product
            terms and claim approval.
          </p>
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
                Cash Equivalent
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                Amount and payment timing are confirmed during claim processing.
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
                Claim the Prize
              </span>
              <span className="text-xs text-blue-300 font-semibold mt-0.5">
                Delivery details depend on the product terms.
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                Fulfillment details are confirmed after claim submission.
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
                placeholder="Recipient Name *"
                value={address.recipientName}
                onChange={(e) =>
                  setAddress({ ...address, recipientName: e.target.value })
                }
                className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone Number *"
                value={address.phoneNumber}
                onChange={(e) =>
                  setAddress({ ...address, phoneNumber: e.target.value })
                }
                className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Address *"
                value={address.addressLine1}
                onChange={(e) =>
                  setAddress({ ...address, addressLine1: e.target.value })
                }
                className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                required
              />
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
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="State *"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
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
            <input
              type="text"
              placeholder="Postal Code *"
              value={address.postalCode}
              onChange={(e) =>
                setAddress({ ...address, postalCode: e.target.value })
              }
              className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-slate-300">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Cash-claim amount and payment timing are confirmed by the claim
              result.
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
              : `Submit ${claimMethod === "cash" ? "Cash Equivalent" : "Prize"} Claim`}
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
