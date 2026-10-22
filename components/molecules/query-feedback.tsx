import { Button } from "@/components/ui/button";

interface QueryFeedbackProps {
  message: string;
  onRetry?: () => void;
}

export function QueryFeedback({ message, onRetry }: QueryFeedbackProps) {
  return (
    <div
      role="status"
      className="space-y-3 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground"
    >
      <p>{message}</p>
      {onRetry && (
        <Button type="button" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
