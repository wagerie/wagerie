'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Reusable GET hook
export function useGet<T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const response = await api.get<T>(url);
      return response.data;
    },
    ...options,
  });
}

// Reusable POST hook
export function usePost<T, TVariables = any>(
  url: string,
  options?: UseMutationOptions<T, AxiosError, TVariables>,
  method: 'post' | 'put' | 'patch' = 'post'
) {
  const queryClient = useQueryClient();

  return useMutation<T, AxiosError, TVariables>({
    mutationFn: async (data: TVariables) => {
      const response = await api[method](url, data);
      return response.data;
    },
    onSuccess: (...args) => {
      const data = args[0];
      toast.success((data as any)?.message || 'Success');
      // Common logic on success, like invalidating queries
      // queryClient.invalidateQueries();
      if (options?.onSuccess) {
        (options.onSuccess as any)(...args);
      }
    },
    ...options,
  });
}
