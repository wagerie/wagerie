"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, LogOut, ArrowDownRight, User } from "lucide-react";
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
import Link from "next/link";
import { DepositModal } from "./modals/deposit-modal";
import ModalLayout from "@/components/layout/modal-layout";
import { API_ROUTES } from "@/constants/routes";
import { removeCookie } from "@/hooks/use-cookies";
import { usePost } from "@/hooks/use-api";

function Header({
  userEmail,
  userBalance,
  onDeposit,
  isAdmin,
}: {
  userEmail: string;
  userBalance: number;
  onDeposit?: () => void;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [depositOpen, setDepositOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { mutate: signOut } = usePost(API_ROUTES.SIGNOUT, {
    onSettled: () => {
      removeCookie("wagerie_token");
      router.push("/auth/login");
    },
  });

  const openLogoutDialog = () => {
    setLogoutOpen(true);
  };

  return (
    <header className="mx-3 mt-3 flex h-18 items-center justify-between rounded-2xl border border-border bg-card/95 px-4 shadow-[0_12px_35px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all lg:mx-6 lg:px-6">
      {/* Theme Toggle */}

      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center">
          <PrimaryLogo className="text-xl font-bold sm:text-2xl" />
        </Link>
      </div>

      {/* Right side of navbar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Wallet Balance Display (Always visible on mobile & desktop) */}
        <Link
          href="/transactions"
          title="View wallet & transactions"
          className="flex items-center gap-1.5 rounded-xl border border-blue-500/25 bg-blue-500/10 px-2.5 py-1.5 text-xs font-bold text-blue-700 shadow-sm transition hover:border-blue-500/50 dark:text-blue-300 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm"
        >
          <Coins className="h-3.5 w-3.5 text-blue-400 sm:h-4 sm:w-4" />
          <span className="font-bold text-foreground tabular-nums">
            ${userBalance.toFixed(2)}
          </span>
        </Link>

        {/* Global Deposit CTA Button */}
        <Button
          type="button"
          onClick={() => (onDeposit ? onDeposit() : setDepositOpen(true))}
          className="h-8 rounded-xl bg-blue-600 px-2.5 text-xs font-bold text-white shadow-[0_6px_16px_rgba(37,99,235,0.3)] hover:bg-blue-500 sm:h-9 sm:px-4 sm:text-sm hidden md:flex"
        >
          <ArrowDownRight className="mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4" />
          <span>Deposit</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-full p-0 hover:bg-accent"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 font-semibold text-white shadow-md">
                {userEmail ? (
                  userEmail.charAt(0).toUpperCase()
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-border bg-popover text-popover-foreground"
          >
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Signed in as
              </span>
              <span className="truncate text-sm font-semibold text-foreground">
                {userEmail}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              asChild
              className="hover:bg-accent focus:bg-accent"
            >
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="hover:bg-accent focus:bg-accent"
            >
              <Link href="/polls">Browse Draws</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="hover:bg-accent focus:bg-accent"
            >
              <Link href="/my-stakes">My Entries & Numbers</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="hover:bg-accent focus:bg-accent"
            >
              <Link href="/transactions">Wallet & Transactions</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="hover:bg-accent focus:bg-accent"
            >
              <Link href="/profile">Profile & Settings</Link>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  asChild
                  className="hover:bg-slate-800/80 focus:bg-slate-800/80"
                >
                  <Link
                    href="/admin/dashboard"
                    className="font-semibold text-warning"
                  >
                    Admin Workspace
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={openLogoutDialog}
              className="gap-2 text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
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
          <Button
            type="button"
            variant="destructive"
            onClick={() => signOut(undefined)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Confirm Logout
          </Button>
        </div>
      </ModalLayout>
    </header>
  );
}

export default Header;
