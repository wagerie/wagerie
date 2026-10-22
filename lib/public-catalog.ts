import { calculatePollMetrics } from "@/lib/prize-helpers";
import type { Product } from "@/lib/types";

export type PublicCatalogSort = "newest" | "price" | "filled";

export const publicCatalogSortOptions = [
  { value: "newest", label: "Newly added" },
  { value: "price", label: "Lowest ticket price" },
  { value: "filled", label: "Almost filled" },
];

export function getPublicProducts(
  products: Product[],
  sort: PublicCatalogSort,
  search = "",
) {
  const query = search.trim().toLowerCase();
  return products
    .filter((product) => {
      const searchableText = `${product.name} ${product.description || ""}`;
      return (
        product.status === "active" &&
        searchableText.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (sort) {
        case "price":
          return Number(a.ticketPrice) - Number(b.ticketPrice);
        case "filled":
          return (
            calculatePollMetrics(b).progressPercent -
            calculatePollMetrics(a).progressPercent
          );
        default:
          return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      }
    });
}
