import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { DemoNotice } from "@/components/atoms/demo-notice";

export const metadata = { title: "About Wagerie | Wagerie" };

export default function Page() {
  return (
    <PublicLayout>
      <h1 className="text-4xl font-black">About Wagerie</h1>
      <DemoNotice>
        Company, policy, and contact details are draft placeholders pending
        confirmation.
      </DemoNotice>
      <div className="max-w-3xl space-y-5">
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">
            A clearer way to explore prize draws
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Wagerie brings prize browsing, ticket entries, wallet activity, and
            prize claims into one account-based experience.
          </p>
        </section>
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">What you can do</h2>
          <p className="leading-relaxed text-muted-foreground">
            Browse product values and ticket prices, compare available entries,
            and track your participation from My Stakes.
          </p>
        </section>
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">
            Company details — demo placeholder
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            The legal operator, registered address, service territories, and
            company registration details are pending confirmation. This preview
            does not represent a verified company profile.
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
