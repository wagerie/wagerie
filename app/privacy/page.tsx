import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { DemoNotice } from "@/components/atoms/demo-notice";

export const metadata = { title: "Privacy notice | Wagerie" };

export default function Page() {
  return (
    <PublicLayout>
      <h1 className="text-4xl font-black">Privacy notice</h1>
      <DemoNotice>
        Company, policy, and contact details are draft placeholders pending
        confirmation.
      </DemoNotice>
      <div className="max-w-3xl space-y-5">
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">
            Draft preview — not final notice
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            This page is a placeholder. Confirmed privacy practices and the
            responsible company details must replace this content.
          </p>
        </section>
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">
            Account and transaction information
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Demo placeholder: document the personal information collected for
            accounts, payments, prize claims, and shipping, together with each
            purpose and applicable basis.
          </p>
        </section>
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">Cookies and service providers</h2>
          <p className="leading-relaxed text-muted-foreground">
            Demo placeholder: document authentication cookies, analytics,
            payment and fulfillment providers, and any international transfers.
          </p>
        </section>
        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">Retention and your choices</h2>
          <p className="leading-relaxed text-muted-foreground">
            Demo placeholder: confirm retention periods, access and deletion
            procedures, privacy contact details, and applicable rights.
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
