"use client";

import { BtnComponent } from "@/components/atoms/button-component";
import { PrimaryLogo } from "@/components/atoms/logo";
import { ModeToggle } from "@/components/atoms/toggle-theme";
import { APP_ROUTES } from "@/constants/routes";
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  DollarSign,
  Gift,
  Lock,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Trophy,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const featuredDraws = [
  {
    name: "iPhone 16 Pro Max 256GB",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    value: "$1,299",
    cash: "$1,150",
    ticketPrice: "$5.00",
    progress: 74,
    ticketsLeft: 68,
    category: "Luxury Tech",
  },
  {
    name: "Rolex Submariner Date 41mm",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    value: "$14,500",
    cash: "$13,000",
    ticketPrice: "$10.00",
    progress: 88,
    ticketsLeft: 174,
    category: "Horology",
  },
  {
    name: "$5,000 Cash Vault",
    image:
      "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80",
    value: "$5,000",
    cash: "$5,000",
    ticketPrice: "$2.00",
    progress: 62,
    ticketsLeft: 950,
    category: "Instant Cash",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-blue-600 selection:text-white">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 space-y-24">
        {/* Navigation Header */}
        <header className="rounded-2xl border border-border bg-card/85 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <PrimaryLogo className="text-xl font-black sm:text-2xl" />

            <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
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
              <ModeToggle />
              <BtnComponent
                className="border-border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground rounded-xl"
                asChild
              >
                <Link href={APP_ROUTES.LOGIN}>Sign In</Link>
              </BtnComponent>
              <BtnComponent
                className="rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-500 shadow-md shadow-blue-600/30"
                asChild
              >
                <Link href={APP_ROUTES.REGISTER}>Get Started</Link>
              </BtnComponent>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-6 sm:pt-12">
          <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_transparent_50%),radial-gradient(circle_at_right,_rgba(6,182,212,0.15),_transparent_40%)]" />

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold text-blue-300">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                Premium product pools
              </div>

              <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.08]">
                Win luxury prizes. <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  From just $1.
                </span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
                Browse premium products, choose how many entries you want, and
                receive a unique number linked to your account. When a pool is
                ready, the winning entry is selected and the outcome is
                recorded.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row pt-2">
                <BtnComponent
                  size="lg"
                  className="rounded-2xl bg-blue-600 text-base font-black hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                  asChild
                >
                  <Link href={APP_ROUTES.REGISTER}>
                    Explore Live Draws
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </BtnComponent>
                <BtnComponent
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-border bg-secondary text-secondary-foreground hover:bg-accent"
                  asChild
                >
                  <Link href="#how-it-works">See How It Works</Link>
                </BtnComponent>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Unique account entries
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  Clear pool progress
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-400" />
                  Track entries in your account
                </div>
              </div>
            </div>

            {/* Hero Visual Card Preview */}
            <div className="relative">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 font-bold">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                        Spotlight Draw
                      </span>
                      <h3 className="text-base font-bold text-foreground">
                        Rolex Submariner Date 41mm
                      </h3>
                    </div>
                  </div>
                  <Badge className="border-0 bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                    ● 88% Sold
                  </Badge>
                </div>

                <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-slate-950">
                  <Image
                    src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
                    alt="Rolex Submariner"
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11162b] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-300 dark:text-slate-300">
                      Prize Value:{" "}
                      <strong className="text-white">$14,500</strong>
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      Cash equivalent where eligible
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Tickets Claimed</span>
                    <span className="text-amber-400 font-bold">
                      Only 174 remaining
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 w-[88%]" />
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg shadow-blue-600/30"
                >
                  <Link href={APP_ROUTES.REGISTER}>
                    Claim Tickets for $10.00
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Mechanisms */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              CheckCircle2,
              "Verified entries",
              "Each entry is associated with the signed-in account.",
            ],
            [
              Ticket,
              "Visible progress",
              "See price, target, filled percentage, and entries remaining.",
            ],
            [
              Lock,
              "Account history",
              "Review your entries and outcomes from the workspace.",
            ],
            [
              ShieldCheck,
              "Clear outcomes",
              "Winning selection and fulfillment details are communicated after a draw.",
            ],
          ].map(([Icon, title, description]) => (
            <div
              key={title as string}
              className="rounded-3xl border border-border bg-card p-5 shadow-lg"
            >
              <Icon className="h-5 w-5 text-blue-500" />
              <h2 className="mt-4 text-sm font-bold text-foreground">
                {title as string}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {description as string}
              </p>
            </div>
          ))}
        </section>

        {/* Featured Live Draws Showcase */}
        <section id="featured" className="space-y-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              High Anticipation
            </span>
            <h2 className="text-3xl font-black text-foreground">
              Featured Live Draws
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore the products currently available and see how close each
              pool is to its target.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDraws.map((draw) => (
              <div
                key={draw.name}
                className="flex flex-col rounded-3xl border border-border bg-card overflow-hidden shadow-xl hover:border-primary/50 transition-all"
              >
                <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
                  <Image
                    src={draw.image}
                    alt={draw.name}
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11162b] via-transparent to-black/40" />
                  <Badge className="absolute left-3 top-3 border-0 bg-slate-900/80 text-xs text-white">
                    {draw.category}
                  </Badge>
                  <div className="absolute right-3 top-3 rounded-xl border border-amber-500/30 bg-slate-950/80 px-2 py-0.5 text-right">
                    <span className="text-[9px] uppercase font-bold text-amber-300">
                      Value
                    </span>
                    <p className="text-xs font-black text-white">
                      {draw.value}
                    </p>
                  </div>
                </div>

                <div className="p-5 flex flex-1 flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-foreground text-base line-clamp-1">
                      {draw.name}
                    </h3>
                    <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                      Cash equivalent where eligible: {draw.cash}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-400 font-bold">
                        {draw.progress}% Filled
                      </span>
                      <span className="text-muted-foreground">
                        {draw.ticketsLeft} left
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        style={{ width: `${draw.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">
                        From
                      </span>
                      <p className="text-base font-extrabold text-foreground">
                        {draw.ticketPrice}
                      </p>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="rounded-xl bg-blue-600 hover:bg-blue-500 font-bold"
                    >
                      <Link href={APP_ROUTES.REGISTER}>Enter Draw</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="rounded-3xl border border-border bg-card p-8 sm:p-12 space-y-8"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Simple & Transparent
            </span>
            <h2 className="text-3xl font-black text-foreground">
              How Wagerie Works in 3 Steps
            </h2>
            <p className="text-sm text-muted-foreground">
              No complicated mechanics or hidden rules.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: Wallet,
                title: "Deposit & Pick a Prize",
                desc: "Fund your wallet in seconds with card, bank, or PayPal. Browse verified luxury draws starting at just $1 per entry.",
              },
              {
                step: "02",
                icon: Ticket,
                title: "Get Verifiable Numbers",
                desc: "Select your desired tickets. Each ticket receives a cryptographic sequential number stored in your account ledger.",
              },
              {
                step: "03",
                icon: Trophy,
                title: "Automated Draw & Win",
                desc: "When the pool is ready, a winning entry is selected and the outcome is communicated. Claim options depend on the product terms.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-2xl border border-border bg-muted p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-black text-muted-foreground/60">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Fairness & Trust Section */}
        <section
          id="fairness"
          className="rounded-3xl border border-blue-500/20 bg-linear-to-b from-blue-500/10 to-card p-8 sm:p-12 space-y-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Understand the process
              </span>
              <h2 className="text-3xl font-black text-foreground">
                Trust, Transparency & Security
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Entries are connected to your account, pool progress is visible,
                and your entry history remains available in the workspace. We
                show the product, price, target, and current pool status before
                you decide to participate.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-xl shadow-blue-600/30"
            >
              <Link href={APP_ROUTES.REGISTER}>Start Playing Today</Link>
            </Button>
          </div>
        </section>

        {/* Winners Placeholder */}
        <section
          id="winners"
          className="rounded-3xl border border-border bg-card p-8 sm:p-12"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Real people. Real outcomes.
              </span>
              <h2 className="mt-2 text-3xl font-black text-foreground">
                Previous winners
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Winner records and testimonials will appear here once completed
                draws are available.
              </p>
            </div>
            <Badge className="w-fit border-border bg-muted text-muted-foreground">
              No completed draws yet
            </Badge>
          </div>
          <div className="mt-6 flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 p-6 text-center text-sm text-muted-foreground">
            Verified winner information will include the prize, date, winning
            entry, and claim outcome.
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Questions, answered
            </span>
            <h2 className="mt-2 text-3xl font-black text-foreground">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Start with the basics, then review the details in your account
              before participating.
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {[
              [
                "How does Wagerie work?",
                "Choose an available product, select your number of entries, and submit the enrollment. Your entries are linked to your account for tracking.",
              ],
              [
                "Can I see my entries?",
                "Yes. Your entries and account activity are available in the signed-in workspace.",
              ],
              [
                "How are products selected?",
                "Each product listing shows its name, category, target amount, ticket price, raised amount, and status before enrollment.",
              ],
              [
                "What happens if I win?",
                "The completed draw outcome and next claim steps will be communicated through the product and account experience.",
              ],
              [
                "Is there always a cash alternative?",
                "Cash alternatives should only be expected where the specific product listing or winner terms make them available.",
              ],
            ].map(([question, answer]) => (
              <AccordionItem
                key={question}
                value={question}
                className="rounded-2xl border border-border bg-card/80 px-1 shadow-sm transition-colors hover:border-blue-500/40 data-[state=open]:border-blue-500/40 data-[state=open]:bg-card"
              >
                <AccordionTrigger className="px-5 py-4 text-left text-sm font-bold text-foreground hover:no-underline">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <footer className="rounded-3xl border border-border bg-card/80 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.10)] sm:p-8">
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
                <Link
                  href="#"
                  className="block transition hover:text-foreground"
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="block transition hover:text-foreground"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="block transition hover:text-foreground"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Wagerie. Product availability and
              claim terms may vary.
            </p>
            <p>Made for premium product discovery.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
