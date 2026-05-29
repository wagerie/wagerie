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
import { AlertCircle } from "lucide-react";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function WithdrawModal({
  open,
  onOpenChange,
  userId,
}: WithdrawModalProps) {
  const { mutate: withdraw, isPending } = useWithdraw();
  const { data: wallet } = useGetBalance(userId);

  const form = useForm<WithdrawInput>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 100,
      bankDetails: {
        accountNumber: "",
        routingNumber: "",
        accountHolderName: "",
      },
    },
  });

  const onSubmit = async (data: WithdrawInput) => {
    const amount = data.amount;
    if (wallet && amount > wallet.balance) {
      form.setError("amount", {
        type: "manual",
        message: `Insufficient funds. Available balance: $${wallet.balance.toFixed(2)}`,
      });
      return;
    }

    withdraw(
      { ...data, userId },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      },
    );
  };

  const availableBalance = wallet?.balance || 0;

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Withdraw Funds"
      description="Transfer funds from your wallet to your bank account."
      size="md"
      className="sm:max-w-125"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Available Balance */}
          <div className="p-3 bg-muted rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">
              Available Balance
            </p>
            <p className="text-2xl font-bold">${availableBalance.toFixed(2)}</p>
          </div>

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Withdrawal Amount (USD)</FormLabel>
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
                <FormDescription>
                  Minimum $1, Maximum ${availableBalance.toFixed(2)}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {/* Bank Details */}
          <div className="space-y-4">
            <h4 className="font-semibold">Bank Account Details</h4>

            <FormField
              control={form.control}
              name="bankDetails.accountHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <InputComponent
                      {...field}
                      placeholder="Your full name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankDetails.accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <InputComponent
                      {...field}
                      placeholder="Your account number"
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
                  <FormLabel>Routing Number</FormLabel>
                  <FormControl>
                    <InputComponent
                      {...field}
                      placeholder="Your routing number"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    9-digit routing number for US banks
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Info */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-400">
              Withdrawals typically process within 2-3 business days.
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <BtnComponent type="submit" className="flex-1" loading={isPending}>
              Withdraw
            </BtnComponent>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
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
