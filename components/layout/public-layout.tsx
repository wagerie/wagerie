import type { ReactNode } from "react";
import { LandingPageHeader } from "@/components/landing/landing-page-header";
import { LandingPageFooter } from "@/components/landing/landing-page-footer";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-6 sm:px-6 lg:px-8">
        <LandingPageHeader />
        <main className="min-h-[55vh] space-y-8">{children}</main>
        <LandingPageFooter />
      </div>
    </div>
  );
}
