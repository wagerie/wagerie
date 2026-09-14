"use client";

import React from "react";
import { Minus, Plus, Sparkles, Ticket, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calculateWinOdds } from "@/lib/prize-helpers";

interface TicketStepperProps {
  tickets: number;
  onChange: (value: number) => void;
  ticketPrice: number;
  remainingSlots: number;
  totalSlots: number;
  userBalance: number;
  disabled?: boolean;
  onQuickDeposit?: (neededAmount: number) => void;
}

export function TicketStepper({
  tickets,
  onChange,
  ticketPrice,
  remainingSlots,
  totalSlots,
  userBalance,
  disabled = false,
  onQuickDeposit,
}: TicketStepperProps) {
  const maxAllowed = Math.max(1, remainingSlots);
  const totalCost = tickets * ticketPrice;
  const isInsufficient = userBalance < totalCost;
  const neededAmount = Math.max(0, totalCost - userBalance);
  const odds = calculateWinOdds(tickets, totalSlots);

  const setSafeTickets = (val: number) => {
    const clamped = Math.min(maxAllowed, Math.max(1, Math.floor(val)));
    onChange(clamped);
  };

  const handleIncrement = (amount: number) => {
    setSafeTickets(tickets + amount);
  };

  const handleDecrement = (amount: number) => {
    setSafeTickets(tickets - amount);
  };

  const quickPicks = [
    { label: "+1", add: 1 },
    { label: "+5", add: 5 },
    { label: "+10", add: 10 },
    { label: "+25", add: 25 },
    { label: "Max", setMax: true },
  ];

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <label
          htmlFor="ticket-quantity"
          className="text-sm font-semibold text-white flex items-center gap-1.5"
        >
          <Ticket className="h-4 w-4 text-blue-400" />
          Select Tickets
        </label>
        <span className="text-xs text-slate-400">
          Max: <strong className="text-slate-200">{maxAllowed}</strong>{" "}
          remaining
        </span>
      </div>

      {/* Main Stepper Input */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleDecrement(1)}
          disabled={disabled || tickets <= 1}
          className="h-12 w-12 shrink-0 rounded-xl border-slate-700 bg-slate-900 text-white hover:bg-slate-800 hover:text-white disabled:opacity-30"
          aria-label="Decrease tickets"
        >
          <Minus className="h-5 w-5" />
        </Button>

        <div className="relative flex-1">
          <input
            id="ticket-quantity"
            type="number"
            min={1}
            max={maxAllowed}
            value={tickets}
            onChange={(e) => setSafeTickets(Number(e.target.value) || 1)}
            disabled={disabled}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-center text-xl font-black text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
            x ${ticketPrice}
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleIncrement(1)}
          disabled={disabled || tickets >= maxAllowed}
          className="h-12 w-12 shrink-0 rounded-xl border-slate-700 bg-slate-900 text-white hover:bg-slate-800 hover:text-white disabled:opacity-30"
          aria-label="Increase tickets"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Add Chips */}
      <div className="grid grid-cols-5 gap-1.5">
        {quickPicks.map((pick) => {
          const isMax = pick.setMax;
          return (
            <button
              key={pick.label}
              type="button"
              disabled={disabled}
              onClick={() =>
                isMax
                  ? setSafeTickets(maxAllowed)
                  : handleIncrement(pick.add || 1)
              }
              className={cn(
                "rounded-lg border py-1.5 text-xs font-semibold transition-all",
                "border-slate-800 bg-slate-900 text-slate-300 hover:border-blue-500/50 hover:bg-blue-600/10 hover:text-white",
                isMax && "text-blue-400 border-blue-500/30",
              )}
            >
              {pick.label}
            </button>
          );
        })}
      </div>

      {/* Calculation & Win Odds Bar */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Winning Probability:
          </span>
          <span className="font-extrabold text-emerald-400 text-sm">
            {odds.oddsPercent} ({odds.ratio})
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-sm">
          <span className="text-slate-400">Total Entry Cost</span>
          <span className="text-xl font-black text-white">
            ${totalCost.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Wallet Balance Verification */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="flex items-center gap-1.5 text-slate-400">
          <Wallet className="h-3.5 w-3.5 text-slate-500" />
          Wallet balance:
        </span>
        <span
          className={cn(
            "font-semibold",
            isInsufficient ? "text-amber-400" : "text-slate-200",
          )}
        >
          ${userBalance.toFixed(2)}
        </span>
      </div>

      {isInsufficient && onQuickDeposit && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs flex items-center justify-between gap-2">
          <span className="text-amber-200 font-medium">
            Short by ${neededAmount.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => onQuickDeposit(neededAmount)}
            className="rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
          >
            Deposit ${neededAmount.toFixed(0)}
          </button>
        </div>
      )}
    </div>
  );
}

export default TicketStepper;
