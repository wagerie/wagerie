"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ModalLayout from "@/components/layout/modal-layout";
import { usePost } from "@/hooks/use-api";

export function ReceiptConfirmation({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const configuredPath = process.env.NEXT_PUBLIC_RECEIPT_API_PATH;
  const template =
    configuredPath?.startsWith("/") &&
    !configuredPath.startsWith("//") &&
    configuredPath.includes(":id")
      ? configuredPath
      : undefined;
  const path = template?.replace(":id", encodeURIComponent(productId));
  const { mutate, isPending } = usePost<unknown, { received: true }>(
    path || "",
    {
      onSuccess: () => {
        for (const key of [
          "my-draws",
          "dashboard-joined-draws",
          "admin-products",
        ])
          void queryClient.invalidateQueries({ queryKey: [key] });
        setOpen(false);
      },
    },
  );

  if (!path)
    return (
      <p className="text-xs text-muted-foreground">
        Receipt confirmation is not available yet. Contact support if delivery
        is incorrect.
      </p>
    );
  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Confirm receipt
      </Button>
      <ModalLayout
        open={open}
        onOpenChange={setOpen}
        title="Have you received your prize?"
        description="Confirm only after the prize has arrived."
      >
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={() => mutate({ received: true })}
          >
            {isPending ? "Confirming…" : "Yes, received"}
          </Button>
        </div>
      </ModalLayout>
    </>
  );
}
