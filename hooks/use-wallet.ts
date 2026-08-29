"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Wallet, Transaction, TransactionFilter } from "@/lib/types";
import { DepositInput, WithdrawInput } from "@/lib/schemas";
import { PaginatedResponse } from "@/lib/types";
import { API_ROUTES } from "@/constants/routes";

// ============================================
// QUERY KEYS
// ============================================

export const walletQueryKeys = {
  all: ["wallet"] as const,
  balance: (userId: string) =>
    [...walletQueryKeys.all, "balance", userId] as const,
  transactions: (userId: string) =>
    [...walletQueryKeys.all, "transactions", userId] as const,
};

// ============================================
// HOOKS
// ============================================

/**
 * Fetch user wallet balance
 */
export const useGetBalance = (userId: string) => {
  return useQuery({
    queryKey: walletQueryKeys.balance(userId),
    queryFn: async () => {
      const { data } = await api.get<Wallet>(API_ROUTES.WALLET_BALANCE, {
        params: { userId },
      });
      return data;
    },
    enabled: !!userId,
  });
};

/**
 * Deposit funds to wallet
 */
export const useDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DepositInput & { userId: string }) => {
      const { data } = await api.post<{
        wallet: Wallet;
        transaction: Transaction;
      }>("/wallet/deposit", {
        userId: input.userId,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        cardDetails: input.cardDetails,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch balance
      queryClient.invalidateQueries({
        queryKey: walletQueryKeys.balance(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: walletQueryKeys.transactions(variables.userId),
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
    mutationFn: async (input: WithdrawInput & { userId: string }) => {
      const { data } = await api.post<{
        wallet: Wallet;
        transaction: Transaction;
      }>("/wallet/withdraw", {
        userId: input.userId,
        amount: input.amount,
        bankDetails: input.bankDetails,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch balance
      queryClient.invalidateQueries({
        queryKey: walletQueryKeys.balance(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: walletQueryKeys.transactions(variables.userId),
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
export const useTransactionHistory = (
  userId: string,
  filter?: TransactionFilter,
) => {
  return useQuery({
    queryKey: [
      ...walletQueryKeys.transactions(userId),
      filter?.type,
      filter?.status,
      filter?.page,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("userId", userId);
      if (filter?.type) params.append("type", filter.type);
      if (filter?.status) params.append("status", filter.status);
      if (filter?.page) params.append("page", filter.page.toString());
      if (filter?.pageSize)
        params.append("pageSize", filter.pageSize.toString());

      const { data } = await api.get<PaginatedResponse<Transaction>>(
        API_ROUTES.WALLET_TRANSACTIONS,
        { params: Object.fromEntries(params) },
      );
      return data;
    },
    enabled: !!userId,
  });
};

/**
 * Get total transaction count for a user
 */
export const useTransactionCount = (userId: string) => {
  const { data } = useTransactionHistory(userId, { pageSize: 1 });
  return data?.total || 0;
};
