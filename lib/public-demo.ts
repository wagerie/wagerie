import type { Category, Product, PublicWinner } from "@/lib/types";

// Preview fixtures only. Never submit demo IDs to enrollment or payment APIs.
export const demoCategories: Category[] = [
  { id: "demo-tech", name: "Technology", slug: "technology" },
  { id: "demo-gaming", name: "Gaming", slug: "gaming" },
  { id: "demo-cash", name: "Cash prizes", slug: "cash" },
];
export const demoProducts: Product[] = [
  {
    id: "demo-phone",
    categoryId: "demo-tech",
    name: "Flagship smartphone",
    slug: "demo-phone",
    description: "An example technology prize for the catalogue preview.",
    productValueAmount: 1200,
    targetAmount: 2000,
    ticketPrice: 5,
    raisedAmount: 1450,
    status: "active",
    createdAt: "2026-10-20T12:00:00Z",
    updatedAt: "2026-10-20T12:00:00Z",
  },
  {
    id: "demo-console",
    categoryId: "demo-gaming",
    name: "PlayStation gaming bundle",
    slug: "demo-console",
    description:
      "An example gaming bundle. Contents and availability are illustrative.",
    productValueAmount: 650,
    targetAmount: 1000,
    ticketPrice: 2,
    raisedAmount: 920,
    status: "active",
    createdAt: "2026-10-19T12:00:00Z",
    updatedAt: "2026-10-19T12:00:00Z",
  },
  {
    id: "demo-cash-prize",
    categoryId: "demo-cash",
    name: "Cash prize showcase",
    slug: "demo-cash-prize",
    description: "An illustrative cash prize; no entry or payout is available.",
    productValueAmount: 500,
    targetAmount: 1000,
    ticketPrice: 1,
    raisedAmount: 300,
    status: "active",
    createdAt: "2026-10-18T12:00:00Z",
    updatedAt: "2026-10-18T12:00:00Z",
  },
];
export const demoResults = [
  {
    id: "sample-1",
    prize: "Headphones bundle",
    winner: "Demo player A",
    date: "2026-10-18",
    status: "Delivery confirmed",
    evidence:
      "Illustrative delivery record. No real shipment or winner is represented.",
  },
  {
    id: "sample-2",
    prize: "$250 cash prize",
    winner: "Demo player B",
    date: "2026-10-16",
    status: "Payout completed",
    evidence:
      "Illustrative payout record. No real payment or winner is represented.",
  },
  {
    id: "sample-3",
    prize: "Gaming accessories",
    winner: "Demo player C",
    date: "2026-10-14",
    status: "Shipment in transit",
    evidence:
      "Illustrative tracking record. No real carrier or tracking number is represented.",
  },
];

// Fixed preview records. Do not simulate new wins or recent timestamps.
export const demoLiveWinners: PublicWinner[] = [
  {
    id: "demo-win-1",
    displayName: "Demo player A",
    prizeName: "Headphones bundle",
    prizeValue: 180,
    ticketCount: 2,
    wonAt: "2026-10-18T14:30:00Z",
  },
  {
    id: "demo-win-2",
    displayName: "Demo player B",
    prizeName: "Cash prize",
    prizeValue: 250,
    ticketCount: 5,
    wonAt: "2026-10-16T11:15:00Z",
  },
  {
    id: "demo-win-3",
    displayName: "Demo player C",
    prizeName: "Gaming accessories",
    prizeValue: 120,
    ticketCount: 3,
    wonAt: "2026-10-14T09:45:00Z",
  },
  {
    id: "demo-win-4",
    displayName: "Demo player D",
    prizeName: "Smartwatch",
    prizeValue: 300,
    ticketCount: 1,
    wonAt: "2026-10-12T16:20:00Z",
  },
];
