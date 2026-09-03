"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Coins,
  History,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  Settings,
  TrendingUp,
  Target,
  UserRound,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PrimaryLogo } from "@/components/atoms/logo";
import { ModeToggle } from "@/components/atoms/toggle-theme";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/routes";
import { removeCookie } from "@/hooks/use-cookies";
import { DepositModal } from "@/components/molecules/modals/deposit-modal";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
  userBalance?: number;
  onDeposit?: () => void;
  isAdmin?: boolean;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Polls",
    href: "/polls",
    icon: TrendingUp,
  },
  {
    label: "My Stakes",
    href: "/my-stakes",
    icon: Target,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: History,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserRound,
  },
];

const adminNavItems = [
  {
    label: "Admin",
    href: "/admin/dashboard",
    icon: Settings,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

export function DashboardLayout({
  children,
  userEmail = "user@example.com",
  userBalance = 0,
  onDeposit,
  isAdmin = false,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post(API_ROUTES.SIGNOUT);
    } finally {
      removeCookie("wagerie_token");
      router.push("/auth/login");
    }
  };

  const items = isAdmin ? [...navItems, ...adminNavItems] : navItems;

  return (
    <div className="flex h-screen bg-[#f5f3ff] text-slate-900 dark:bg-[#0b1020] dark:text-white">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 border border-slate-800 bg-[#17152a] text-slate-100 shadow-[18px_0_50px_rgba(30,27,75,0.16)] transition-[width,transform] duration-300 ease-in-out dark:border-slate-800 dark:bg-[#111329] lg:inset-y-auto lg:my-3 lg:ml-3 lg:h-[calc(100vh-1.5rem)] lg:rounded-2xl",
          sidebarCollapsed ? "w-20" : "w-72",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          <button
            type="button"
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            className="absolute -right-3 top-8 z-10 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-[#25233e] text-slate-300 shadow-lg transition-colors hover:bg-blue-600 hover:text-white lg:flex"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>

          {/* Navigation */}
          <nav
            className={cn(
              "flex-1 space-y-1 overflow-y-auto py-7",
              sidebarCollapsed ? "px-3" : "px-3",
            )}
          >
            {!sidebarCollapsed && (
              <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Navigate
              </p>
            )}
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  aria-label={sidebarCollapsed ? item.label : undefined}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center rounded-xl py-3 text-sm font-medium transition-all",
                    sidebarCollapsed ? "justify-center px-3" : "gap-3 px-3.5",
                    isActive
                      ? "bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)]"
                      : "text-slate-400 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/10 p-4">
            <Button
              variant="ghost"
              className={cn(
                "w-full text-slate-400 hover:bg-white/10 hover:text-white",
                sidebarCollapsed ? "justify-center px-2" : "justify-start",
              )}
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {!sidebarCollapsed && "Logout"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="mx-3 mt-3 flex h-[76px] items-center justify-between rounded-2xl border border-blue-100 bg-white/80 px-4 shadow-[0_12px_30px_rgba(30,41,59,0.06)] backdrop-blur-xl transition-all dark:border-slate-800 dark:bg-slate-950/80 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-muted/70 rounded-lg transition-colors duration-200"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <Link href="/dashboard" className="hidden md:block">
              <PrimaryLogo className="text-2xl text-slate-900 dark:text-white" />
            </Link>
          </div>

          {/* Right side of navbar */}
          <div className="flex items-center gap-3">
            {/* Wallet Balance */}
            <div className="hidden items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200 sm:flex">
              <Coins className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                ${userBalance.toFixed(2)}
              </span>
            </div>
            <Button
              type="button"
              onClick={() => (onDeposit ? onDeposit() : setDepositOpen(true))}
              className="hidden rounded-xl bg-blue-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)] hover:bg-blue-700 sm:inline-flex"
            >
              <ArrowDownRight className="mr-2 h-4 w-4" />
              Deposit
            </Button>

            {/* Theme Toggle */}
            <ModeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 w-10 rounded-full p-0 hover:bg-blue-50 dark:hover:bg-white/10"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 font-semibold text-white shadow-md">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="text-sm">{userEmail}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/transactions">Transactions</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">Admin Panel</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#f5f3ff] dark:bg-[#0b1020]">
          {children}
        </main>
      </div>

      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <DepositModal
        open={depositOpen}
        onOpenChange={setDepositOpen}
        userId="user-1"
      />
    </div>
  );
}
