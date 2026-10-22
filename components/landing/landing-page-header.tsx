"use client";

import { useSessionPresence } from "@/hooks/use-session-presence";
import { BtnComponent } from "@/components/atoms/button-component";
import { PrimaryLogo } from "@/components/atoms/logo";
import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";

export function LandingPageHeader() {
  const signedIn = useSessionPresence();
  return (
    <header className="rounded-2xl border border-border bg-card/85 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <Link href={APP_ROUTES.HOME} aria-label="Wagerie home">
          <PrimaryLogo className="text-xl font-black sm:text-2xl" />
        </Link>

        <nav className="hidden items-center gap-1 text-sm text-muted-foreground lg:flex">
          <Link
            href={APP_ROUTES.HOME_HOW_IT_WORKS}
            className="rounded-lg px-3 py-2 transition hover:bg-accent hover:text-accent-foreground"
          >
            How It Works
          </Link>
          <Link
            href={APP_ROUTES.DRAWS}
            className="rounded-lg px-3 py-2 transition hover:bg-accent hover:text-accent-foreground"
          >
            Live Draws
          </Link>
          <Link
            href={APP_ROUTES.WINNERS}
            className="rounded-lg px-3 py-2 transition hover:bg-accent hover:text-accent-foreground"
          >
            Winners
          </Link>
          <Link
            href={APP_ROUTES.SUPPORT}
            className="rounded-lg px-3 py-2 transition hover:bg-accent hover:text-accent-foreground"
          >
            Support
          </Link>
          <Link
            href={APP_ROUTES.HOME_FAQ}
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
            <Link href={signedIn ? APP_ROUTES.DASHBOARD : APP_ROUTES.LOGIN}>
              {signedIn ? "Dashboard" : "Sign In"}
            </Link>
          </BtnComponent>
          {!signedIn && (
            <BtnComponent
              className="rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-500 shadow-md shadow-blue-600/30 hidden md:inline-flex"
              asChild
            >
              <Link href={APP_ROUTES.REGISTER}>Get Started</Link>
            </BtnComponent>
          )}
        </div>
      </div>
      <nav
        aria-label="Mobile public navigation"
        className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-3 text-sm lg:hidden"
      >
        <Link href={APP_ROUTES.DRAWS}>Draws</Link>
        <Link href={APP_ROUTES.WINNERS}>Results</Link>
        <Link href={APP_ROUTES.SUPPORT}>Support</Link>
        <Link href={APP_ROUTES.HOME_FAQ}>FAQ</Link>
      </nav>
    </header>
  );
}
