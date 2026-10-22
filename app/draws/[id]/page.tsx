import { PublicLayout } from "@/components/layout/public-layout";
import { PublicDrawDetail } from "@/components/public/draw-detail";

export default async function DrawPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PublicLayout>
      <PublicDrawDetail id={id} />
    </PublicLayout>
  );
}
