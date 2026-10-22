import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DemoNotice } from "@/components/atoms/demo-notice";
import { demoLiveWinners } from "@/lib/public-demo";
import type { PublicWinner } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface LiveWinnersProps {
  winners?: PublicWinner[];
  isDemo?: boolean;
}

export function LiveWinners({
  winners = demoLiveWinners,
  isDemo = true,
}: LiveWinnersProps) {
  return (
    <section aria-labelledby="live-winners-heading" className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Trophy className="h-6 w-6 text-amber-400" aria-hidden="true" />
        <h2 id="live-winners-heading" className="text-2xl font-black">
          Live winners
        </h2>
        {isDemo && (
          <Badge className="border-0 bg-amber-500/15 text-amber-700 dark:text-amber-300">
            Demo feed
          </Badge>
        )}
      </div>
      {isDemo && (
        <DemoNotice>
          This feed uses fixed sample winners. Live updates will be connected
          when the API is available; these are not real wins.
        </DemoNotice>
      )}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Player</TableHead>
              <TableHead>Prize</TableHead>
              <TableHead className="text-right">Tickets</TableHead>
              <TableHead className="text-right">Prize value</TableHead>
              <TableHead className="text-right">Won on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {winners.length === 0 ? (
              <TableRow className="border-border">
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No published winners yet.
                </TableCell>
              </TableRow>
            ) : (
              winners.map((winner) => (
                <TableRow key={winner.id} className="border-border">
                  <TableCell className="font-medium">
                    {winner.displayName}
                  </TableCell>
                  <TableCell>{winner.prizeName}</TableCell>
                  <TableCell className="text-right">
                    {winner.ticketCount}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(winner.prizeValue)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    <time dateTime={winner.wonAt}>
                      {winner.wonAt.slice(0, 10)}
                    </time>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
