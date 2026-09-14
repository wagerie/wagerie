"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import client from "@/lib/axios";
import { Wallet, Transaction, TransactionFilter } from "@/lib/types";
import { DepositInput, WithdrawInput } from "@/lib/schemas";
import { PaginatedResponse } from "@/lib/types";
import { API_ROUTES } from "@/constants/routes";

// ============================================
// QUERY KEYS
// ============================================

export const walletQueryKeys = {
  all: ["wallet"] as const,
  balance: () => [...walletQueryKeys.all, "balance"] as const,
  transactions: () => [...walletQueryKeys.all, "transactions"] as const,
};

// ============================================
// HOOKS
// ============================================

/**
 * Fetch user wallet balance
 */
export const useGetBalance = () => {
  return useQuery({
    queryKey: walletQueryKeys.balance(),
    queryFn: async () => {
      const { data } = await client.get<Wallet>(API_ROUTES.WALLET);
      return data;
    },
  });
};

/**
 * Deposit funds to wallet
 */
export const useDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DepositInput) => {
      const { data } = await client.post<{
        wallet: Wallet;
        transaction: Transaction;
      }>(API_ROUTES.WALLET_DEPOSIT, {
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        cardDetails: input.cardDetails,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch balance
      queryClient.invalidateQueries({
        queryKey: walletQueryKeys.balance(),
      });
      queryClient.invalidateQueries({
        queryKey: walletQueryKeys.transactions(),
      });

      toast.success(`Successfully deposited $${variables.amount.toFixed(2)}`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Deposit failed";
      toast.error(message);
    },
  });
};

/**
 * Withdraw funds from wallet
 */
export const useWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: WithdrawInput) => {
      const { data } = await client.post<{
        wallet: Wallet;
        transaction: Transaction;
      }>(API_ROUTES.WALLET_WITHDRAW, {
        amount: input.amount,
        bankDetails: input.bankDetails,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch balance
      queryClient.invalidateQueries({
        queryKey: walletQueryKeys.balance(),
      });
      queryClient.invalidateQueries({
        queryKey: walletQueryKeys.transactions(),
      });

      toast.success(`Successfully withdrawn $${variables.amount.toFixed(2)}`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Withdrawal failed";
      toast.error(message);
    },
  });
};

/**
 * Fetch transaction history with filtering
 */
export const useTransactionHistory = (filter?: TransactionFilter) => {
  return useQuery({
    queryKey: [
      ...walletQueryKeys.transactions(),
      filter?.type,
      filter?.status,
      filter?.page,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter?.type) params.append("type", filter.type);
      if (filter?.status) params.append("status", filter.status);
      if (filter?.page) params.append("page", filter.page.toString());
      if (filter?.pageSize)
        params.append("pageSize", filter.pageSize.toString());

      const { data } = await client.get<PaginatedResponse<Transaction>>(
        API_ROUTES.WALLET_TRANSACTIONS,
        { params: Object.fromEntries(params) },
      );
      return data;
    },
  });
};

/**
 * Get total transaction count for a user
 */
export const useTransactionCount = () => {
  const { data } = useTransactionHistory({ pageSize: 1 });
  return data?.total || 0;
};
