"use client";

import React, { useState } from "react";
import { useGetBalance } from "@/hooks/use-wallet";
import { DepositModal } from "@/components/molecules/modals/deposit-modal";
import Sidebar from "../molecules/sidebar";
import Header from "../molecules/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
  userBalance?: number;
  onDeposit?: () => void;
  isAdmin?: boolean;
}

export function DashboardLayout({
  children,
  userEmail = "player@wagerie.com",
  userBalance,
  onDeposit,
  isAdmin = false,
}: DashboardLayoutProps) {
  const [depositOpen, setDepositOpen] = useState(false);
  const { data: wallet } = useGetBalance();

  // If userBalance is not provided or 0, fallback to real fetched balance
  const activeBalance =
    userBalance !== undefined && userBalance !== 0
      ? userBalance
      : (wallet?.balance ?? 0);

  const handleDepositClick = () => {
    if (onDeposit) {
      onDeposit();
    } else {
      setDepositOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar isAdmin={isAdmin} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Header
          userEmail={userEmail}
          userBalance={activeBalance}
          onDeposit={handleDepositClick}
          isAdmin={isAdmin}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background pb-32 lg:pb-0">
          {children}
        </main>
      </div>

      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
    </div>
  );
}

export default DashboardLayout;
