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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { depositSchema, DepositInput } from "@/lib/schemas";
import { useDeposit } from "@/hooks/use-wallet";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, CreditCard, Lock, ShieldCheck, Zap } from "lucide-react";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultAmount?: number;
}

const paymentMethods = [
  { id: "credit_card", label: "Debit / Credit Card (Instant)" },
  { id: "bank_transfer", label: "Bank Wire / ACH" },
  { id: "paypal", label: "PayPal Express" },
];

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

export function DepositModal({
  open,
  onOpenChange,
  defaultAmount = 100,
}: DepositModalProps) {
  const { mutate: deposit, isPending } = useDeposit();

  const form = useForm<DepositInput>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: defaultAmount,
      paymentMethod: "credit_card",
    },
  });

  const onSubmit = async (data: DepositInput) => {
    deposit(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  const selectedMethod = form.watch("paymentMethod");
  const currentAmount = form.watch("amount");

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Fund Wallet"
      description="Add funds instantly to enter live prize draws and stake entries."
      size="md"
      className="border-slate-800 bg-[#0f1426] text-white sm:max-w-125"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-1">
          {/* Quick Preset Amount Chips */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">
              Quick Select Amount
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() =>
                    form.setValue("amount", amt, { shouldValidate: true })
                  }
                  className={`rounded-xl border py-2 text-xs font-bold transition-all ${
                    currentAmount === amt
                      ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Field */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-slate-300">
                  Custom Amount (USD)
                </FormLabel>
                <FormControl>
                  <InputComponent
                    {...field}
                    type="number"
                    step="1"
                    min="1"
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
                    0% Deposit Fee
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="bg-slate-800" />

          {/* Payment Method */}
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-slate-300">
                  Payment Method
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-xl border-slate-700 bg-slate-900 text-sm text-white">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-slate-800 bg-slate-900 text-white">
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Card Details (show only for credit_card) */}
          {selectedMethod === "credit_card" && (
            <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-blue-400" />
                  Card Information
                </h4>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <Lock className="h-3 w-3" />
                  256-Bit SSL
                </span>
              </div>

              <FormField
                control={form.control}
                name="cardDetails.cardNumber"
                render={({ field }) => (
                  <InputComponent
                    {...field}
                    label="Card Number"
                    placeholder="4000 1234 5678 9010"
                    disabled={isPending}
                  />
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="cardDetails.expiryDate"
                  render={({ field }) => (
                    <InputComponent
                      {...field}
                      label="Expiry Date"
                      placeholder="MM/YY"
                      disabled={isPending}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardDetails.cvv"
                  render={({ field }) => (
                    <InputComponent
                      label="Security Code"
                      {...field}
                      placeholder="CVC"
                      disabled={isPending}
                    />
                  )}
                />
              </div>
            </div>
          )}

          {/* Security Guarantee Strip */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              PCI-DSS Level 1 Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-400" />
              Available Immediately
            </span>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <BtnComponent
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
              loading={isPending}
            >
              Deposit ${currentAmount?.toLocaleString() || "0"} Now
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

export default DepositModal;
