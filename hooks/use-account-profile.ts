"use client";

import { useGet } from "@/hooks/use-api";

export interface AccountProfile {
  id: string;
  email: string;
  displayName?: string;
  role?: "user" | "admin";
  verificationStatus?: string;
  twoFactorEnabled?: boolean;
}

// Configure only after the backend confirms its authenticated profile contract.
export function useAccountProfile() {
  const configuredPath = process.env.NEXT_PUBLIC_ACCOUNT_PROFILE_PATH;
  const path =
    configuredPath?.startsWith("/") && !configuredPath.startsWith("//")
      ? configuredPath
      : undefined;
  const query = useGet<AccountProfile>(["account-profile"], path || "", {
    enabled: Boolean(path),
    retry: false,
  });
  return { ...query, isConfigured: Boolean(path) };
}
