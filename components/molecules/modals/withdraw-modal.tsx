"use client";

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
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Wallet,
} from "lucide-react";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const { mutate: withdraw, isPending } = useWithdraw();
  const { data: wallet } = useGetBalance();
  const availableBalance = wallet?.balance || 0;

  const form = useForm<WithdrawInput>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: Math.min(100, availableBalance),
      bankDetails: {
        accountNumber: "",
        routingNumber: "",
        accountHolderName: "",
      },
    },
  });

  const onSubmit = async (data: WithdrawInput) => {
    const amount = data.amount;
    if (amount > availableBalance) {
      form.setError("amount", {
        type: "manual",
        message: `Insufficient funds. Available balance: $${availableBalance.toFixed(2)}`,
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
      description="Transfer available wallet balance to your verified bank account."
      size="md"
      className="border-slate-800 bg-[#0f1426] text-white sm:max-w-125"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-1">
          {/* Available Balance Box */}
          <div className="flex items-center justify-between rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
            <div>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-blue-400" />
                Available Withdrawal Balance
              </p>
              <p className="text-2xl font-black text-white mt-0.5">
                ${availableBalance.toFixed(2)} USD
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0.25, 0.5, 1].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setPercentAmount(pct)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:border-blue-500 hover:text-white"
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
                <FormLabel className="text-xs font-semibold text-slate-300">
                  Withdrawal Amount (USD)
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
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>Minimum $1.00</span>
                  <span className="text-emerald-400 font-medium">
                    0% Fee (Standard ACH)
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="bg-slate-800" />

          {/* Bank Details */}
          <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-blue-400" />
              Recipient Bank Details
            </h4>

            <FormField
              control={form.control}
              name="bankDetails.accountHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-slate-300">
                    Account Holder Full Name
                  </FormLabel>
                  <FormControl>
                    <InputComponent
                      {...field}
                      placeholder="e.g. Alexander Vance"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="bankDetails.accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-300">
                      Account Number
                    </FormLabel>
                    <FormControl>
                      <InputComponent
                        {...field}
                        placeholder="Account digits"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankDetails.routingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-300">
                      Routing (ABA)
                    </FormLabel>
                    <FormControl>
                      <InputComponent
                        {...field}
                        placeholder="9-digit routing"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Security & Timeline Note */}
          <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 text-xs text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">
                Direct Automated Clearing House (ACH)
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Funds typically arrive in your designated bank account within
                1-2 business days with zero withdrawal deductions.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <BtnComponent
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
              loading={isPending}
              disabled={isPending || availableBalance <= 0}
            >
              Withdraw ${currentAmount ? currentAmount.toFixed(2) : "0.00"}
            </BtnComponent>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
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
