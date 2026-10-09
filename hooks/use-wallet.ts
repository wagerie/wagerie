"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Wallet, Transaction, TransactionFilter } from "@/lib/types";
import { DepositInput, WithdrawInput } from "@/lib/schemas";
import { API_ROUTES } from "@/constants/routes";
import { getApiMessage, useGet, useGetPage, usePost } from "./use-api";
import { formatCurrency } from "@/lib/utils";

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
  return useGet<Wallet>(walletQueryKeys.balance(), API_ROUTES.WALLET);
};
/**
 * Deposit funds to wallet
 */
export const useDeposit = () => {
  const queryClient = useQueryClient();

  return usePost<unknown, DepositInput>(API_ROUTES.WALLET_DEPOSIT, {
    onSuccess: (response, variables) => {
      // Invalidate and refetch balance
      queryClient.invalidateQueries({
        queryKey: walletQueryKeys.balance(),
      });
      queryClient.invalidateQueries({
        queryKey: walletQueryKeys.transactions(),
      });

      toast.success(
        `${formatCurrency(variables.amount)} ${getApiMessage(response, "added to your wallet.")}`,
      );
    },
    onError: (error) => {
      const responseData = error.response?.data as { message?: string };
      toast.error(responseData?.message || error.message || "Deposit failed");
    },
  });
};

/**
 * Withdraw funds from wallet
 */
export const useWithdraw = () => {
  const queryClient = useQueryClient();

  return usePost<unknown, WithdrawInput>(API_ROUTES.WALLET_WITHDRAW, {
    onSuccess: (response, variables) => {
      // Invalidate and refetch balance
      queryClient.invalidateQueries({
        queryKey: walletQueryKeys.balance(),
      });
      queryClient.invalidateQueries({
        queryKey: walletQueryKeys.transactions(),
      });

      toast.success(
        `${formatCurrency(variables.amount)} ${getApiMessage(response, "withdrawal requested.")}`,
      );
    },
    onError: (error) => {
      const responseData = error.response?.data as { message?: string };
      toast.error(
        responseData?.message || error.message || "Withdrawal failed",
      );
    },
  });
};

/**
 * Fetch transaction history with filtering
 */
export const useTransactionHistory = (filter?: TransactionFilter) => {
  const params = new URLSearchParams();
  if (filter?.type) params.set("type", filter.type);
  if (filter?.status) params.set("status", filter.status);
  if (filter?.page) params.set("page", filter.page.toString());
  if (filter?.pageSize) params.set("limit", filter.pageSize.toString());

  const queryString = params.toString();
  const url = queryString
    ? `${API_ROUTES.WALLET_TRANSACTIONS}?${queryString}`
    : API_ROUTES.WALLET_TRANSACTIONS;

  return useGetPage<Transaction>(
    [
      ...walletQueryKeys.transactions(),
      filter?.type || "",
      filter?.status || "",
      filter?.page?.toString() || "",
      filter?.pageSize?.toString() || "",
    ],
    url,
  );
};

/**
 * Get total transaction count for a user
 */
export const useTransactionCount = () => {
  const { data } = useTransactionHistory({ pageSize: 1 });
  return data?.totalItems || 0;
};
