import { LiveWinners } from "@/components/public/live-winners";
import { PublicLayout } from "@/components/layout/public-layout";
import { Results } from "@/components/public/results";

export const metadata = { title: "Draw results | Wagerie" };

export default function WinnersPage() {
  return (
    <PublicLayout>
      <h1 className="text-4xl font-black">Winners & draw results</h1>
      <p className="text-muted-foreground">
        A preview of published results and prize fulfillment records.
      </p>
      <LiveWinners />
      <Results />
    </PublicLayout>
  );
}
