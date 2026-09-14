"use client";

import { cn } from "@/lib/utils";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  Settings,
  TrendingUp,
  Target,
  UserRound,
  LayoutDashboard,
  LogOut,
  History,
  ChevronsLeft,
  ChevronsRight,
  Ticket,
  Trophy,
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { API_ROUTES } from "@/constants/routes";
import api from "@/lib/axios";
import { removeCookie } from "@/hooks/use-cookies";
import ModalLayout from "@/components/layout/modal-layout";

function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Prize Draws",
      href: "/polls",
      icon: Trophy,
    },
    {
      label: "My Entries",
      href: "/my-stakes",
      icon: Ticket,
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

  const items = isAdmin ? [...navItems, ...adminNavItems] : navItems;

  const handleLogout = async () => {
    try {
      await api.post(API_ROUTES.SIGNOUT);
    } finally {
      removeCookie("wagerie_token");
      router.push("/auth/login");
    }
  };

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden border border-border bg-card text-foreground shadow-[18px_0_50px_rgba(30,27,75,0.12)] transition-[width,transform] duration-300 ease-in-out lg:inset-y-auto lg:my-3 lg:ml-3 lg:block lg:h-[calc(100vh-1.5rem)] lg:rounded-2xl",
          sidebarCollapsed ? "w-20" : "w-72",
          "lg:relative",
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
            className="absolute -right-3 top-16 z-10 hidden h-7 w-7 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground shadow-lg transition-colors hover:bg-primary hover:text-primary-foreground lg:flex"
          >
            {sidebarCollapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
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
              <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
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
                  className={cn(
                    "flex items-center rounded-xl py-3 text-sm font-medium transition-all",
                    sidebarCollapsed ? "justify-center px-3" : "gap-3 px-3.5",
                    isActive
                      ? "bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)]"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <Button
              variant="ghost"
              className={cn(
                "w-full text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                sidebarCollapsed ? "justify-center px-2" : "justify-start",
              )}
              onClick={() => setLogoutOpen(true)}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {!sidebarCollapsed && "Logout"}
            </Button>
          </div>
        </div>
      </aside>

      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-3 left-3 right-3 z-50 grid grid-cols-5 items-end overflow-visible rounded-2xl border border-border bg-card/95 p-2 text-muted-foreground shadow-[0_12px_35px_rgba(2,6,23,0.18)] backdrop-blur-xl lg:hidden"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={`mobile-${item.href}`}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition-colors",
                item.href === "/dashboard" &&
                  "relative z-10 order-3 h-16.75 justify-end gap-1.5",
                item.href === "/polls" && "order-1",
                item.href === "/my-stakes" && "order-2",
                item.href === "/transactions" && "order-4",
                item.href === "/profile" && "order-5",
                isActive
                  ? item.href === "/dashboard"
                    ? "text-primary"
                    : "bg-blue-600 text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl",
                  item.href === "/dashboard" &&
                    "absolute -top-8 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full border-4 border-background bg-blue-600 text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)]",
                )}
              >
                <Icon
                  className={cn(
                    item.href === "/dashboard" ? "h-5 w-5" : "h-4 w-4",
                  )}
                />
              </span>
              <span className="text-center">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <ModalLayout
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out of Wagerie?"
        description="You will need to sign in again to access your wallet and dashboard."
        size="sm"
      >
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLogoutOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Confirm Logout
          </Button>
        </div>
      </ModalLayout>
    </>
  );
}

export default Sidebar;
