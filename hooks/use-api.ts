"use client";

import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import client from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

// Reusable GET hook
export function useGet<T>(
  key: readonly string[],
  url: string,
  options?: Omit<UseQueryOptions<T, AxiosError>, "queryKey" | "queryFn">,
) {
  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const response = await client.get<T>(url);
      return response.data;
    },
    ...options,
  });
}

// Reusable POST hook
export function usePost<T, TVariables = any>(
  url: string,
  options?: UseMutationOptions<T, AxiosError, TVariables>,
  method: "post" | "put" | "patch" = "post",
) {
  const { onSuccess, onError, onSettled, ...restOptions } = options || {};

  return useMutation<T, AxiosError, TVariables>({
    ...restOptions,
    mutationFn: async (data: TVariables) => {
      const response = await client[method](url, data);
      return response.data;
    },
    onSuccess: (...args) => {
      const data = args[0];
      if (!onSuccess) {
        toast.success((data as any)?.message || "Success");
      }
      // console.log("success", data);
      // Common logic on success, like invalidating queries
      // queryClient.invalidateQueries();
      if (onSuccess) {
        (onSuccess as any)(...args);
      }
    },
    onError: (...args) => {
      const data = args[0];
      if (!onError) {
        toast.error((data as any)?.response?.data.message || "Error");
      }
      if (onError) {
        (onError as any)(...args);
      }
    },
    onSettled: (...args) => {
      if (onSettled) {
        (onSettled as any)(...args);
      }
    },
  });
}

export function useDelete<T = unknown>(
  url: string,
  options?: UseMutationOptions<T, AxiosError, void>,
) {
  const { onSuccess, onError, onSettled, ...restOptions } = options || {};

  return useMutation<T, AxiosError, void>({
    ...restOptions,
    mutationFn: async () => {
      const response = await client.delete<T>(url);
      return response.data;
    },
    onSuccess: (...args) => {
      const data = args[0];
      toast.success((data as any)?.message || "Deleted successfully");
      onSuccess?.(...args);
    },
    onError: (...args) => {
      const data = args[0];
      toast.error((data as any)?.response?.data?.message || "Delete failed");
      onError?.(...args);
    },
    onSettled: (...args) => onSettled?.(...args),
  });
}
