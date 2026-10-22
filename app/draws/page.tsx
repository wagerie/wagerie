import { PublicLayout } from "@/components/layout/public-layout";
import { PublicCatalog } from "@/components/public/public-catalog";

export const metadata = { title: "Explore draws | Wagerie" };

export default function DrawsPage() {
  return (
    <PublicLayout>
      <PublicCatalog />
    </PublicLayout>
  );
}
