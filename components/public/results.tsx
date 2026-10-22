import { APP_ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Link from "next/link";
import { demoResults } from "@/lib/public-demo";
import { DemoNotice } from "@/components/atoms/demo-notice";

export function Results({ compact = false }: { compact?: boolean }) {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black">
          {compact ? "Draw results & fulfillment" : "Results & fulfillment"}
        </h2>
        {compact && (
          <Link
            href={APP_ROUTES.WINNERS}
            className="text-sm text-blue-500 underline"
          >
            View results showcase →
          </Link>
        )}
      </div>
      <DemoNotice>
        Sample results and fulfillment records show how this section will work.
        No real winners or payouts are represented.
      </DemoNotice>
      <div className="grid gap-4 md:grid-cols-3">
        {demoResults.map((result) => (
          <article
            key={result.id}
            className="space-y-3 rounded-2xl border border-border bg-card p-5"
          >
            <Badge className="border-0 bg-amber-500/15 text-amber-700 dark:text-amber-300">
              Demo result
            </Badge>
            <h3 className="text-xl font-bold">{result.prize}</h3>
            <p>{result.winner}</p>
            <p className="text-sm text-muted-foreground">
              <time dateTime={result.date}>{result.date}</time> ·{" "}
              {result.status}
            </p>
            {!compact && (
              <Accordion type="single" collapsible>
                <AccordionItem
                  value={result.id}
                  className="border-t border-b-0 border-border"
                >
                  <AccordionTrigger className="text-sm">
                    View sample fulfillment record
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {result.evidence}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
