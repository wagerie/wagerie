import React, { useState } from "react";
import { Coins, LogOut, ArrowDownRight } from "lucide-react";
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
  const [depositOpen, setDepositOpen] = useState(false);

  return (
    <header className="lg:mx-6 mx-3 mt-3 flex h-[76px] items-center justify-between rounded-2xl border border-blue-100 bg-white/80 px-4 shadow-[0_12px_30px_rgba(30,41,59,0.06)] backdrop-blur-xl transition-all dark:border-slate-800 dark:bg-slate-950/80 lg:px-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="">
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DepositModal
        open={depositOpen}
        onOpenChange={setDepositOpen}
      />
    </header>
  );
}

export default Header;
