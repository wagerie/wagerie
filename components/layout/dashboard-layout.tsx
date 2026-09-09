"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/routes";
import { removeCookie } from "@/hooks/use-cookies";
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
  userEmail = "user@example.com",
  userBalance = 0,
  onDeposit,
  isAdmin = false,
}: DashboardLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-[#f5f3ff] text-slate-900 dark:bg-[#0b1020] dark:text-white">
      {/* Sidebar */}
      <Sidebar isAdmin={isAdmin} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Header
          userEmail={userEmail}
          userBalance={userBalance}
          onDeposit={onDeposit}
          isAdmin={isAdmin}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#f5f3ff] pb-24 dark:bg-[#0b1020] lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
