"use client";

import { APP_ROUTES } from "@/constants/routes";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectComponent } from "@/components/atoms/select-component";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  usePublicCatalog,
  usePublicCategories,
} from "@/hooks/use-public-catalog";
import { PollCard } from "@/components/molecules/poll-card";
import { DemoNotice } from "@/components/atoms/demo-notice";
import {
  getPublicProducts,
  publicCatalogSortOptions,
  type PublicCatalogSort,
} from "@/lib/public-catalog";

export function PublicCatalog({ categorySlug }: { categorySlug?: string }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<PublicCatalogSort>("newest");
  // Resolve the category before selecting its products endpoint.
  const discovery = usePublicCategories();
  const category = discovery.categories.find(
    (category) => category.slug === categorySlug,
  );
  const catalog = usePublicCatalog(page, category?.id);
  const products = getPublicProducts(catalog.products, sort, search);

  if (categorySlug && !discovery.isLoading && !category)
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-black">Category not found</h1>
        <Link href={APP_ROUTES.DRAWS} className="text-blue-500 underline">
          Browse all draws
        </Link>
      </div>
    );
  return (
    <>
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
          Find your next prize
        </p>
        <h1 className="text-4xl font-black">
          {category ? category.name : "Explore the draws"}
        </h1>
        <p className="text-muted-foreground">
          Browse prizes freely. Sign in when you are ready to enter a live draw.
        </p>
      </div>
      {catalog.isDemo && <DemoNotice />}
      {discovery.isDemo && !catalog.isDemo && (
        <DemoNotice>
          Category navigation uses sample categories while the category service
          is unavailable.
        </DemoNotice>
      )}
      <nav aria-label="Draw categories" className="flex flex-wrap gap-2">
        <Link
          href={APP_ROUTES.DRAWS}
          className="rounded-full border border-border px-4 py-2 text-sm"
          aria-current={!categorySlug ? "page" : undefined}
        >
          All draws
        </Link>
        {discovery.categories.map((category) => (
          <Link
            key={category.id}
            href={APP_ROUTES.CATEGORY_DETAIL.replace(
              ":slug",
              encodeURIComponent(String(category.slug)),
            )}
            aria-current={category.slug === categorySlug ? "page" : undefined}
            className={cn(
              "rounded-full border border-border px-4 py-2 text-sm transition-colors",
              category.slug === categorySlug
                ? "bg-blue-600 text-white"
                : "hover:bg-accent",
            )}
          >
            {category.name}
            {discovery.isDemo ? " (demo)" : ""}
          </Link>
        ))}
      </nav>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="public-draw-search">Search this page</Label>
          <Input
            id="public-draw-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prizes"
            className="h-11 rounded-xl"
          />
        </div>
        <SelectComponent
          label="Sort this page"
          value={sort}
          onValueChange={(value) => setSort(value as PublicCatalogSort)}
          className="sm:w-56"
          options={publicCatalogSortOptions}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Search and ordering apply to the current page.{" "}
        {catalog.isDemo
          ? "Sample catalogue"
          : `Page ${page} of ${catalog.pageCount}`}
      </p>
      {catalog.isLoading || (categorySlug && discovery.isLoading) ? (
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
        <p className="rounded-xl border p-8">
          No active draws match this selection. Try another category or clear
          your search.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {!catalog.isDemo && (
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={page <= 1 || catalog.isLoading}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={page >= catalog.pageCount || catalog.isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </>
        )}
        {catalog.isDemo && (
          <Button
            variant="outline"
            onClick={catalog.retry}
            className="rounded-xl"
          >
            Retry live catalogue
          </Button>
        )}
      </div>
    </>
  );
}
