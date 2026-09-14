"use client";

import { BtnComponent } from "@/components/atoms/button-component";
import { PrimaryLogo } from "@/components/atoms/logo";
import { ModeToggle } from "@/components/atoms/toggle-theme";
import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";

export function LandingPageHeader() {
  return (
    <header className="rounded-2xl border border-border bg-card/85 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <PrimaryLogo className="text-xl font-black sm:text-2xl" />

        <nav className="hidden items-center gap-1 text-sm text-muted-foreground lg:flex">
          <Link
            href="#how-it-works"
            className="rounded-lg px-3 py-2 transition hover:bg-accent hover:text-accent-foreground"
          >
            How It Works
          </Link>
          <Link
            href="#featured"
            className="rounded-lg px-3 py-2 transition hover:bg-accent hover:text-accent-foreground"
          >
            Live Draws
          </Link>
          <Link
            href="#winners"
            className="rounded-lg px-3 py-2 transition hover:bg-accent hover:text-accent-foreground"
          >
            Winners
          </Link>
          <Link
            href="#fairness"
            className="rounded-lg px-3 py-2 transition hover:bg-accent hover:text-accent-foreground"
          >
            Fairness
          </Link>
          <Link
            href="#faq"
            className="rounded-lg px-3 py-2 transition hover:bg-accent hover:text-accent-foreground"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* <ModeToggle /> */}
          <BtnComponent
            className="border-border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground rounded-xl"
            asChild
          >
            <Link href={APP_ROUTES.LOGIN}>Sign In</Link>
          </BtnComponent>
          <BtnComponent
            className="rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-500 shadow-md shadow-blue-600/30 hidden md:inline-flex"
            asChild
          >
            <Link href={APP_ROUTES.REGISTER}>Get Started</Link>
          </BtnComponent>
        </div>
      </div>
    </header>
  );
}
