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

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentMethods = [
  { id: "credit_card", label: "Credit Card" },
  { id: "bank_transfer", label: "Bank Transfer" },
  { id: "paypal", label: "PayPal" },
];

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const { mutate: deposit, isPending } = useDeposit();

  const form = useForm<DepositInput>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 100,
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

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Deposit Funds"
      description="Add funds to your wallet to start staking on polls."
      size="md"
      className="sm:max-w-125"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (USD)</FormLabel>
                <FormControl>
                  <InputComponent
                    {...field}
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="Enter amount"
                    prefix="$"
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>Minimum $1, Maximum $100,000</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {/* Payment Method */}
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold">Card Details</h4>

                <FormField
                  control={form.control}
                  name="cardDetails.cardNumber"
                  render={({ field }) => (
                    <InputComponent
                      {...field}
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      disabled={isPending}
                    />
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
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
                        label="CVV"
                        {...field}
                        placeholder="123"
                        disabled={isPending}
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <BtnComponent type="submit" className="flex-1" loading={isPending}>
              Deposit Now
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
