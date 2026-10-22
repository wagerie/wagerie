"use client";

import { finiteAmount } from "@/lib/account-state";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ModalLayout from "@/components/layout/modal-layout";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputComponent from "@/components/atoms/input-component";
import { BtnComponent } from "@/components/atoms/button-component";
import { withdrawSchema, WithdrawInput } from "@/lib/schemas";
import { useWithdraw, useGetBalance } from "@/hooks/use-wallet";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, ShieldCheck, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const { mutate: withdraw, isPending } = useWithdraw();
  const {
    data: wallet,
    isLoading: walletLoading,
    isError: walletError,
  } = useGetBalance();
  const amount = finiteAmount(wallet?.balance);
  const availableBalance = amount ?? 0;
  const walletAvailable = !walletLoading && !walletError && amount !== null;

  const form = useForm<WithdrawInput>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: Math.min(100, availableBalance),
      usdtAddresj: "",
    },
  });

  const onSubmit = async (data: WithdrawInput) => {
    if (!walletAvailable) {
      form.setError("amount", {
        message: "Balance unavailable. Please try again.",
      });
      return;
    }
    const amount = data.amount;
    if (amount > availableBalance) {
      form.setError("amount", {
        type: "manual",
        message: `Insufficient funds. Available balance: ${formatCurrency(availableBalance)}`,
      });
      return;
    }

    withdraw(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  const currentAmount = form.watch("amount") || 0;

  const setPercentAmount = (pct: number) => {
    const calculated = Math.floor(availableBalance * pct * 100) / 100;
    form.setValue("amount", Math.max(1, calculated), { shouldValidate: true });
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Withdraw Funds"
      description="Request a withdrawal to your USDT address. Confirm the supported network with support before submitting."
      size="md"
      className="border-border bg-card text-foreground sm:max-w-125"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-1">
          {/* Available Balance Box */}
          <div className="flex items-center justify-between rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-blue-400" />
                Available Withdrawal Balance
              </p>
              <p className="text-2xl font-black text-foreground mt-0.5">
                {walletLoading
                  ? "Loading…"
                  : !walletAvailable
                    ? "Unavailable"
                    : formatCurrency(availableBalance, wallet?.currency)}
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0.25, 0.5, 1].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setPercentAmount(pct)}
                  className="rounded-lg border border-border bg-secondary px-2.5 py-1 text-[11px] font-bold text-muted-foreground hover:border-blue-500 hover:text-foreground"
                >
                  {pct === 1 ? "Max" : `${pct * 100}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-muted-foreground">
                  Withdrawal amount (wallet units)
                </FormLabel>
                <FormControl>
                  <InputComponent
                    {...field}
                    type="number"
                    step="0.01"
                    min="1"
                    max={availableBalance}
                    placeholder="Enter amount"
                    prefix="$"
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    disabled={isPending}
                  />
                </FormControl>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                  <span>Minimum $1.00</span>
                  <span className="text-emerald-400 font-medium">
                    Fees: provider dependent
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="bg-muted" />

          {/* USDT Address */}
          <div className="space-y-3 rounded-2xl border border-border bg-muted/60 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Wallet className="h-4 w-4 text-blue-400" />
              Recipient USDT Address
            </h4>

            <FormField
              control={form.control}
              name="usdtAddresj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">
                    USDT Wallet Address
                  </FormLabel>
                  <FormControl>
                    <InputComponent
                      {...field}
                      placeholder="Enter your USDT wallet address"
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Security & Timeline Note */}
          <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-3.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">
                Withdrawal destination
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Double-check your address and network before submitting. Crypto
                transfers cannot be reversed once processed.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <BtnComponent
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
              loading={isPending}
              disabled={isPending || !walletAvailable || availableBalance <= 0}
            >
              Withdraw {formatCurrency(currentAmount)}
            </BtnComponent>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </Form>
    </ModalLayout>
  );
}

export default WithdrawModal;
