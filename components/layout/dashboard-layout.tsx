"use client";

import React from "react";
import { useGetBalance } from "@/hooks/use-wallet";
import { finiteAmount } from "@/lib/account-state";
import { useAccountProfile } from "@/hooks/use-account-profile";
import Sidebar from "../molecules/sidebar";
import Header from "../molecules/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
  onDeposit?: () => void;
  isAdmin?: boolean;
}

export function DashboardLayout({
  children,
  userEmail,
  onDeposit,
  isAdmin = false,
}: DashboardLayoutProps) {
  const { data: wallet, isLoading, isError } = useGetBalance();
  const { data: profile } = useAccountProfile();

  // Unknown balances remain unavailable rather than becoming zero.
  const activeBalance = finiteAmount(wallet?.balance);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Header
          userEmail={profile?.email || userEmail || ""}
          userBalance={activeBalance}
          balanceLoading={isLoading}
          balanceError={isError}
          currency={wallet?.currency}

          isAdmin={profile?.role === "admin" || isAdmin}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background pb-32 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
