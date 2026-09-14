"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, ShieldCheck } from "lucide-react";
import { ModeToggle } from "@/components/atoms/toggle-theme";
import { PrimaryLogo } from "@/components/atoms/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ModalLayout from "@/components/layout/modal-layout";
import { API_ROUTES } from "@/constants/routes";
import { removeCookie } from "@/hooks/use-cookies";
import { usePost } from "@/hooks/use-api";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Catalog", href: "/admin/products", icon: Package },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { mutate: signOut } = usePost(API_ROUTES.SIGNOUT, {
    onSettled: () => {
      removeCookie("wagerie_token");
      router.push("/admin/auth/login");
    },
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-72 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-border px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <PrimaryLogo className="text-2xl" />
            <span className="rounded-full bg-warning/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-warning">
              Admin
            </span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <nav className="space-y-1" aria-label="Admin navigation">
            <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Operator workspace
            </p>
            {navigation.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setLogoutOpen(true)}
            >
              <LogOut className="h-5 w-5" />
              Log out
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <PrimaryLogo className="text-xl" />
            <span className="rounded-full bg-warning/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-warning">
              Admin
            </span>
          </div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
            <ShieldCheck className="h-4 w-4 text-warning" />
            Operator Console
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Log out"
              title="Log out"
              onClick={() => setLogoutOpen(true)}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background pb-24 lg:pb-0">
          {children}
        </main>

        <nav
          aria-label="Mobile admin navigation"
          className="fixed bottom-3 left-3 right-3 z-50 grid grid-cols-4 gap-1 rounded-2xl border border-border bg-card/95 p-2 shadow-xl backdrop-blur-xl lg:hidden"
        >
          {navigation.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold",
                pathname === href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <ModalLayout
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out of the operator console?"
        description="You will need to sign in again to manage Wagerie."
        size="sm"
      >
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => setLogoutOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => signOut(undefined)}>
            <LogOut className="mr-2 h-4 w-4" />
            Confirm Logout
          </Button>
        </div>
      </ModalLayout>
    </div>
  );
}
