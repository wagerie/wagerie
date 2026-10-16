import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";

const steps = [
  {
    step: "1",
    title: "Fund Wallet",
    desc: "Add funds using a payment method available to your account.",
    href: APP_ROUTES.TRANSACTIONS,
  },
  {
    step: "2",
    title: "Choose a Product",
    desc: "Compare available products, ticket prices, and entry status.",
    href: APP_ROUTES.POLLS,
  },
  {
    step: "3",
    title: "Track Your Entries",
    desc: "Review confirmed entries and their status in My Stakes.",
    href: APP_ROUTES.MY_STAKES,
  },
  {
    step: "4",
    title: "Review Draw Results",
    desc: "Follow published outcomes and the claim options available for each product.",
    href: APP_ROUTES.MY_STAKES,
  },
];

export function HowItWorks() {
  return (
    <section className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-xl">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-foreground">How Wagerie Works</h2>
        <p className="text-xs text-slate-400">
          4 simple steps to winning luxury prizes
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((item) => (
          <Link
            key={item.step}
            href={item.href}
            className="group flex items-start gap-3 rounded-2xl border border-border bg-muted p-3 transition-colors hover:border-primary/50 hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
              {item.step}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-foreground">
                {item.title}
              </span>
              <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-400">
                {item.desc}
              </span>
            </span>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          </Link>
        ))}
      </div>
    </section>
  );
}
