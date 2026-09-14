"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/components/landing/landing-page-data";

export function FAQSection() {
  return (
    <section id="faq" className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
          Questions, answered
        </span>
        <h2 className="mt-2 text-3xl font-black text-foreground">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Start with the basics, then review the details in your account before
          participating.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {faqItems.map(({ question, answer }) => (
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
  );
}
