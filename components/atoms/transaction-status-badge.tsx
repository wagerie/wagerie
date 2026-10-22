import { Badge } from "@/components/ui/badge";
import { transactionStatus } from "@/lib/transaction-presentation";
import { cn } from "@/lib/utils";

export function TransactionStatusBadge({ status }: { status: string }) {
  const presentation = transactionStatus(status);
  return (
    <Badge className={cn("border-0 font-semibold", presentation.className)}>
      {presentation.label}
    </Badge>
  );
}
