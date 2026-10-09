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

export interface CollectionPage<T, TSummary = unknown> {
  items: T[];
  totalItems: number;
  pageCount: number;
  summary?: TSummary;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapPayload<T>(response: unknown): T {
  if (isRecord(response) && "data" in response) {
    return response.data as T;
  }
  return response as T;
}

export function getApiPayload<T>(response: unknown): T {
  return unwrapPayload<T>(response);
}

export function getApiMessage(response: unknown, fallback: string): string {
  if (isRecord(response) && typeof response.message === "string") {
    return response.message;
  }
  return fallback;
}

// Reusable GET hook
export function useGet<T>(
  key: readonly string[],
  url: string,
  options?: Omit<UseQueryOptions<T, AxiosError>, "queryKey" | "queryFn">,
) {
  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const response = await client.get<unknown>(url);
      return unwrapPayload<T>(response.data);
    },
    ...options,
  });
}

export function useGetPage<T, TSummary = unknown>(
  key: readonly string[],
  url: string,
  options?: Omit<
    UseQueryOptions<CollectionPage<T, TSummary>, AxiosError>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<CollectionPage<T, TSummary>, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const response = await client.get<unknown>(url);
      const payload = unwrapPayload<unknown>(response.data);
      if (Array.isArray(payload)) {
        return {
          items: payload as T[],
          totalItems: payload.length,
          pageCount: 1,
        };
      }

      const collection = isRecord(payload) ? payload : {};
      const pageInfo = isRecord(collection.pagination)
        ? collection.pagination
        : {};
      const items = Array.isArray(collection.items)
        ? (collection.items as T[])
        : [];
      const totalItems = Number(pageInfo.total ?? items.length);
      const pageCount = Number(pageInfo.totalPages ?? 1);
      const summary = collection.summary as TSummary | undefined;

      return {
        items,
        totalItems: Number.isFinite(totalItems) ? totalItems : items.length,
        pageCount: Number.isFinite(pageCount) ? pageCount : 1,
        ...(summary === undefined ? {} : { summary }),
      };
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
      const response = await client[method]<T>(url, data);
      return response.data;
    },
    onSuccess: (...args) => {
      if (!onSuccess) {
        toast.success(getApiMessage(args[0], "Success"));
      }
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
      toast.success(getApiMessage(args[0], "Deleted successfully"));
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
