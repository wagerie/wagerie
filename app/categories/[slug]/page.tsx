import { PublicLayout } from "@/components/layout/public-layout";
import { PublicCatalog } from "@/components/public/public-catalog";

export const metadata = { title: "Prize categories | Wagerie" };

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PublicLayout>
      <PublicCatalog key={slug} categorySlug={slug} />
    </PublicLayout>
  );
}
