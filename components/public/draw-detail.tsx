"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGet } from "@/hooks/use-api";
import { APP_ROUTES, API_ROUTES } from "@/constants/routes";
import type { Product } from "@/lib/types";
import { demoProducts } from "@/lib/public-demo";
import { DemoNotice } from "@/components/atoms/demo-notice";
import { PollCard } from "@/components/molecules/poll-card";

export function PublicDrawDetail({ id }: { id: string }) {
  const fixture = demoProducts.find((p) => p.id === id);
  const query = useGet<Product | { product: Product }>(
    ["public-product", id],
    API_ROUTES.PRODUCT_DETAIL.replace(":id", encodeURIComponent(id)),
    { enabled: !id.startsWith("demo-"), retry: false },
  );
  const responseProduct =
    query.data && "product" in query.data ? query.data.product : query.data;
  const product = fixture || responseProduct;
  if (!fixture && query.isLoading) return <p role="status">Loading draw…</p>;
  if (!product)
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-black">Draw unavailable</h1>
        <p>
          This draw could not be loaded. No sample has been substituted for this
          draw.
        </p>
        <Link href={APP_ROUTES.DRAWS} className="text-blue-500 underline">
          Back to catalogue
        </Link>
        <Button
          variant="link"
          className="ml-4"
          onClick={() => void query.refetch()}
        >
          Retry
        </Button>
      </div>
    );
  return (
    <>
      <Link href={APP_ROUTES.DRAWS} className="text-sm text-blue-500">
        ← All draws
      </Link>
      {fixture && <DemoNotice />}
      <div className="grid gap-8 lg:grid-cols-2">
        <PollCard
          product={product}
          demo={!!fixture}
          href={APP_ROUTES.DRAW_DETAIL.replace(
            ":id",
            encodeURIComponent(String(product.id)),
          )}
          showAction={false}
        />
        <div className="space-y-6">
          <h1 className="text-3xl font-black">{product.name}</h1>
          <p className="whitespace-pre-line text-muted-foreground">
            {product.description}
          </p>
          {fixture ? (
            <p className="rounded-xl border border-border p-4 text-sm">
              Preview only. Entries and payments are disabled for this sample.
            </p>
          ) : product.status === "active" ? (
            <Button
              asChild
              className="rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-500"
            >
              <Link
                href={APP_ROUTES.POLL_DETAIL.replace(
                  ":id",
                  encodeURIComponent(String(id)),
                )}
              >
                Continue to entry
              </Link>
            </Button>
          ) : (
            <p>This draw is closed to new entries.</p>
          )}
        </div>
      </div>
    </>
  );
}
