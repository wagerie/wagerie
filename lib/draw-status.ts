import type { JoinedDraw } from "@/lib/types";
import type { DrawStatus } from "@/components/molecules/my-stakes-grid";

export function getDrawStatus(draw: JoinedDraw): DrawStatus {
  if (draw.userParticipation.isWinner) {
    const claimStatus = draw.product.claimStatus || "";
    const shippingStatus = draw.product.claimDetails?.shipment?.shippingStatus;
    if (
      draw.product.claimType === "physical" &&
      (claimStatus.startsWith("claimed") ||
        ["shipped", "delivered", "received"].includes(claimStatus))
    ) {
      if (shippingStatus === "received" || claimStatus === "received")
        return "received";
      if (shippingStatus === "delivered" || claimStatus === "delivered")
        return "delivered";
      if (shippingStatus === "shipped" || claimStatus === "shipped")
        return "shipped";
      return "delivery_pending";
    }
    if (claimStatus.startsWith("claimed")) {
      return "claimed";
    }
    if (["pending", "processing"].includes(claimStatus)) {
      return "pending";
    }
    return "won";
  }

  return draw.product.status === "active" ? "active" : "lost";
}

export function canClaimDraw(draw: JoinedDraw) {
  const claimStatus = draw.product.claimStatus;

  return (
    draw.userParticipation.isWinner &&
    (claimStatus == null ||
      claimStatus === "unclaimed" ||
      claimStatus === "rejected")
  );
}
