import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { DemoNotice } from "@/components/atoms/demo-notice";

export const metadata = { title: "Terms & draw policies | Wagerie" };

export default function Page() {
  return (
    <PublicLayout>
      <h1 className="text-4xl font-black">Terms & draw policies</h1>
      <DemoNotice>
        Company, policy, and contact details are draft placeholders pending
        confirmation.
      </DemoNotice>
      <div className="max-w-3xl space-y-5">
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">Draft preview — not final terms</h2>
          <p className="leading-relaxed text-muted-foreground">
            This page is a content placeholder for the operating policies.
            Confirmed participation terms must be published before accepting
            entries.
          </p>
        </section>
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">Eligibility and participation</h2>
          <p className="leading-relaxed text-muted-foreground">
            Demo placeholder: confirm minimum age, supported countries, account
            restrictions, entry limits, and any alternative entry routes.
          </p>
        </section>
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">Draws and prize claims</h2>
          <p className="leading-relaxed text-muted-foreground">
            Demo placeholder: specify the draw trigger, winner selection,
            notification process, claim deadlines, cash alternatives, and
            unclaimed-prize handling.
          </p>
        </section>
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">
            Payments, cancellations and refunds
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Demo placeholder: specify payment methods, fees, withdrawal
            timelines, cancellation conditions, refunds, and dispute handling.
          </p>
        </section>
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">Responsible participation</h2>
          <p className="leading-relaxed text-muted-foreground">
            Demo placeholder: confirm spending controls, account restriction
            options, and the appropriate support process for supported
            territories.
          </p>
        </section>
      </div>
      <nav className="flex flex-wrap gap-5 text-sm text-blue-500 underline">
        <Link href={APP_ROUTES.DRAWS}>Explore draws</Link>
        <Link href={APP_ROUTES.HOME_FAQ}>Frequently asked questions</Link>
        <Link href={APP_ROUTES.SUPPORT}>Support</Link>
      </nav>
    </PublicLayout>
  );
}
