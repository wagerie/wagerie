"use client";

import { PrimaryLogo } from "@/components/atoms/logo";
import { Badge } from "@/components/ui/badge";
import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { ModeToggle } from "../atoms/toggle-theme";

export function LandingPageFooter() {
  return (
    <footer className="rounded-3xl border border-border bg-card/80 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.10)] sm:p-8">
      <div className="fixed left-6 bottom-6 z-20">
        <ModeToggle align="start" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <PrimaryLogo className="text-xl" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Premium product pools with clear entry details, account-based
            tracking, and straightforward draw mechanics.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge className="border-0 bg-blue-500/10 text-blue-300">
              Live product pools
            </Badge>
            <Badge className="border-0 bg-emerald-500/10 text-emerald-300">
              Transparent entries
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Product
          </p>
          <div className="mt-3 space-y-2 text-sm">
            <Link
              href="#featured"
              className="block transition hover:text-foreground"
            >
              Live Draws
            </Link>
            <Link
              href="#how-it-works"
              className="block transition hover:text-foreground"
            >
              How It Works
            </Link>
            <Link
              href="#winners"
              className="block transition hover:text-foreground"
            >
              Winners
            </Link>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Support
          </p>
          <div className="mt-3 space-y-2 text-sm">
            <Link
              href="#faq"
              className="block transition hover:text-foreground"
            >
              FAQ
            </Link>
            <Link
              href="#fairness"
              className="block transition hover:text-foreground"
            >
              Fairness
            </Link>
            <Link
              href={APP_ROUTES.LOGIN}
              className="block transition hover:text-foreground"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Company
          </p>
          <div className="mt-3 space-y-2 text-sm">
            <Link href="#" className="block transition hover:text-foreground">
              About
            </Link>
            <Link href="#" className="block transition hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="block transition hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Wagerie. Product availability and claim
          terms may vary.
        </p>
        <p>Made for premium product discovery.</p>
      </div>
    </footer>
  );
}
