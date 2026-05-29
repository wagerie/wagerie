"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  // The DashboardLayout already supports admin mode via isAdmin prop
  // This component is a wrapper for consistency
  return (
    <DashboardLayout
      userEmail="admin@wagerie.com"
      userBalance={50000}
      isAdmin={true}
    >
      {children}
    </DashboardLayout>
  );
}
