"use client";

import { useGet, useGetPage } from "@/hooks/use-api";
import { API_ROUTES } from "@/constants/routes";
import type { Category, Product } from "@/lib/types";
import { demoCategories, demoProducts } from "@/lib/public-demo";

const PUBLIC_CATALOG_PAGE_SIZE = 12;

export function usePublicCategories() {
  const query = useGet<Category[]>(
    ["public-categories"],
    API_ROUTES.PRODUCT_CATEGORIES,
    { retry: false },
  );

  return {
    categories: query.isError ? demoCategories : query.data || [],
    isDemo: query.isError,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

export function usePublicCatalog(page = 1, categoryId?: string) {
  const isDemoCategory = categoryId?.startsWith("demo-") === true;
  const route = categoryId
    ? API_ROUTES.PRODUCTS_BY_CATEGORY.replace(
        ":id",
        encodeURIComponent(categoryId),
      )
    : API_ROUTES.PRODUCTS;
  const query = useGetPage<Product>(
    ["public-products", categoryId || "all", String(page)],
    `${route}?page=${page}&limit=${PUBLIC_CATALOG_PAGE_SIZE}`,
    { retry: false, enabled: !isDemoCategory },
  );
  const isDemo = query.isError || isDemoCategory;
  const fixtures = isDemoCategory
    ? demoProducts.filter((product) => product.categoryId === categoryId)
    : demoProducts;

  return {
    products: isDemo ? fixtures : query.data?.items || [],
    isDemo,
    isLoading: query.isLoading && !isDemo,
    pageCount: isDemo ? 1 : query.data?.pageCount || 1,
    retry: () => {
      void query.refetch();
    },
  };
}
