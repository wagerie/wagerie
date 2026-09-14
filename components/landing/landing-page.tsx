"use client";

import { ScrollToTopButton } from "@/components/atoms/scroll-to-top-button";
import { FAQSection } from "@/components/landing/landing-page-faq";
import { FairnessSection } from "@/components/landing/landing-page-fairness";
import { FeaturedDrawsSection } from "@/components/landing/landing-page-featured-draws";
import { LandingPageFooter } from "@/components/landing/landing-page-footer";
import { LandingPageHeader } from "@/components/landing/landing-page-header";
import { LandingPageHero } from "@/components/landing/landing-page-hero";
import { HowItWorksSection } from "@/components/landing/landing-page-how-it-works";
import { TrustMechanismsSection } from "@/components/landing/landing-page-trust-mechanisms";
import { WinnersSection } from "@/components/landing/landing-page-winners";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-blue-600 selection:text-white">
      <ScrollToTopButton />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-24">
        <LandingPageHeader />
        <LandingPageHero />
        <TrustMechanismsSection />
        <FeaturedDrawsSection />
        <HowItWorksSection />
        <FairnessSection />
        <WinnersSection />
        <FAQSection />
        <LandingPageFooter />
      </div>
    </main>
  );
}
