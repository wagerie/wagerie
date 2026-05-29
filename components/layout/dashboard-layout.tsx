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
  Users,
  Settings,
  TrendingUp,
  Target,
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
import { removeCookie, getCookie } from "@/hooks/use-cookies";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
  userBalance?: number;
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
  isAdmin = false,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    removeCookie("wagerie_token");
    router.push("/auth/login");
  };

  const items = isAdmin ? [...navItems, ...adminNavItems] : navItems;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-2">
              <PrimaryLogo />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-card/50 backdrop-blur-md border-b border-border/50 shadow-sm flex items-center justify-between px-4 lg:px-8 transition-all">
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
          </div>

          {/* Right side of navbar */}
          <div className="flex items-center gap-3">
            {/* Wallet Balance */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-linear-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 dark:from-primary/20 dark:to-accent/20 border border-border/50 rounded-xl transition-all duration-200 cursor-default">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                ${userBalance.toFixed(2)}
              </span>
            </div>

            {/* Theme Toggle */}
            <ModeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full w-10 h-10 p-0 hover:bg-muted/70 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary/80 dark:from-primary dark:to-accent flex items-center justify-center text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-shadow">
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
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>

      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
