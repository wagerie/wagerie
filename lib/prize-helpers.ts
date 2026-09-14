import { Product } from "./types";

export interface PrizeCalculation {
  totalSlots: number;
  filledSlots: number;
  remainingSlots: number;
  progressPercent: number;
  pricePerTicket: number;
  targetAmount: number;
  raisedAmount: number;
  cashAlternative: number;
}

/**
 * Calculates pool metrics from product target & ticket prices
 */
export function calculatePollMetrics(
  product?: Partial<Product> | null,
): PrizeCalculation {
  const targetAmount = Number(product?.targetAmount || 0);
  const ticketPrice = Number(product?.ticketPrice || 1);
  const raisedAmount = Number(product?.raisedAmount || 0);

  const totalSlots =
    ticketPrice > 0 ? Math.max(1, Math.round(targetAmount / ticketPrice)) : 100;
  const filledSlots =
    ticketPrice > 0
      ? Math.min(totalSlots, Math.round(raisedAmount / ticketPrice))
      : 0;
  const remainingSlots = Math.max(0, totalSlots - filledSlots);
  const progressPercent =
    targetAmount > 0
      ? Math.min(100, Math.round((raisedAmount / targetAmount) * 100))
      : 0;
  const cashAlternative = Math.round(targetAmount * 0.9); // 90% instant cash alternative

  return {
    totalSlots,
    filledSlots,
    remainingSlots,
    progressPercent,
    pricePerTicket: ticketPrice,
    targetAmount,
    raisedAmount,
    cashAlternative,
  };
}

/**
 * Curated high-resolution fallback photos for various prize categories
 */
const PRIZE_FALLBACKS: Record<string, string> = {
  iphone:
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
  apple:
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
  macbook:
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
  laptop:
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80",
  watch:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80",
  rolex:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
  car: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80",
  tesla:
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80",
  cash: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1000&q=80",
  vault:
    "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1000&q=80",
  playstation:
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80",
  ps5: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80",
  gaming:
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80",
  camera:
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
  headphones:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
  default:
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80",
};

/**
 * Returns a high-quality prize image with graceful fallbacks
 */
export function getPrizeImage(product?: Partial<Product> | null): string {
  if (product?.image && product.image.startsWith("http")) {
    return product.image;
  }
  if (
    product?.images &&
    product.images.length > 0 &&
    product.images[0].startsWith("http")
  ) {
    return product.images[0];
  }

  const name = (product?.name || "").toLowerCase();
  for (const [key, url] of Object.entries(PRIZE_FALLBACKS)) {
    if (name.includes(key)) {
      return url;
    }
  }

  return PRIZE_FALLBACKS.default;
}

/**
 * Returns formatted odds calculation
 */
export function calculateWinOdds(
  tickets: number,
  totalSlots: number,
): {
  oddsPercent: string;
  ratio: string;
} {
  if (totalSlots <= 0 || tickets <= 0) {
    return { oddsPercent: "0.0%", ratio: "0 in 0" };
  }
  const pct = Math.min(100, (tickets / totalSlots) * 100);
  const formattedPct = pct < 0.1 ? "<0.1%" : `${pct.toFixed(1)}%`;
  return {
    oddsPercent: formattedPct,
    ratio: `${tickets} in ${totalSlots}`,
  };
}
