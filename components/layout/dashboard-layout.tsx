"use client";

import React, { useState } from "react";
import { useGetBalance } from "@/hooks/use-wallet";
import { DepositModal } from "@/components/molecules/modals/deposit-modal";
import Sidebar from "../molecules/sidebar";
import Header from "../molecules/header";
import { ModeToggle } from "../atoms/toggle-theme";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
  onDeposit?: () => void;
  isAdmin?: boolean;
}

export function DashboardLayout({
  children,
  userEmail = "player@wagerie.com",
  onDeposit,
  isAdmin = false,
}: DashboardLayoutProps) {
  const { data: wallet } = useGetBalance();

  // If userBalance is not provided or 0, fallback to real fetched balance
  const activeBalance = Number((wallet as any)?.data?.balance) ?? 0;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="fixed right-6 bottom-28 lg:bottom-6 z-20">
        <ModeToggle />
      </div>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Header
          userEmail={userEmail}
          userBalance={activeBalance}
          isAdmin={isAdmin}
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
