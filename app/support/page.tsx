import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { DemoNotice } from "@/components/atoms/demo-notice";

export const metadata = { title: "How can we help? | Wagerie" };

export default function Page() {
  return (
    <PublicLayout>
      <h1 className="text-4xl font-black">How can we help?</h1>
      <DemoNotice>
        Company, policy, and contact details are draft placeholders pending
        confirmation.
      </DemoNotice>
      <div className="max-w-3xl space-y-5">
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">Entries and draw results</h2>
          <p className="leading-relaxed text-muted-foreground">
            Sign in and open My Stakes to view your entries, assigned tickets,
            and claim options for eligible wins.
          </p>
        </section>
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">Deposits and withdrawals</h2>
          <p className="leading-relaxed text-muted-foreground">
            Review your Transactions page for recorded wallet activity.
            Withdrawal controls are available from Profile. Keep your
            transaction reference when asking for help; never share your
            password or OTP.
          </p>
        </section>
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">Prize delivery</h2>
          <p className="leading-relaxed text-muted-foreground">
            Open My Stakes to check shipment information and tracking links
            where provided.
          </p>
        </section>
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">
            Contact support — demo placeholder
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Support email, service hours, and response targets have not been
            configured. No contact request can be sent from this preview.
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
