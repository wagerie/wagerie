"use client";

import { APP_ROUTES } from "@/constants/routes";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePublicCatalog } from "@/hooks/use-public-catalog";
import {
  getPublicProducts,
  publicCatalogSortOptions,
  type PublicCatalogSort,
} from "@/lib/public-catalog";
import { DemoNotice } from "@/components/atoms/demo-notice";
import { PollCard } from "@/components/molecules/poll-card";

export function Collections() {
  const [collection, setCollection] = useState<PublicCatalogSort>("newest");
  const catalog = usePublicCatalog();
  const products = getPublicProducts(catalog.products, collection).slice(0, 3);
  return (
    <section id="featured" className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-black">Discover your next draw</h2>
        <Link href={APP_ROUTES.DRAWS} className="text-blue-500 underline">
          Browse all draws →
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {publicCatalogSortOptions.map(({ value: id, label }) => (
          <Button
            variant={id === collection ? "default" : "outline"}
            key={id}
            aria-pressed={id === collection}
            onClick={() => setCollection(id as PublicCatalogSort)}
            className={cn(
              "rounded-full",
              id === collection && "bg-blue-600 text-white hover:bg-blue-500",
            )}
          >
            {label}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Selections from the first catalogue page; ordering is not
        catalogue-wide.
      </p>
      {catalog.isDemo && <DemoNotice />}
      {catalog.isLoading ? (
        <p role="status">Loading draws…</p>
      ) : products.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <PollCard
              key={product.id}
              product={product}
              demo={catalog.isDemo}
              href={APP_ROUTES.DRAW_DETAIL.replace(
                ":id",
                encodeURIComponent(String(product.id)),
              )}
              actionLabel={catalog.isDemo ? "Preview draw" : "View draw"}
            />
          ))}
        </div>
      ) : (
        <p>No active draws are available right now.</p>
      )}
    </section>
  );
}
