import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryStatCardProps {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  iconClassName: string;
  className?: string;
  valueClassName?: string;
}

export function SummaryStatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  className,
  valueClassName,
}: SummaryStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            iconClassName,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className={cn("text-xl font-black text-white", valueClassName)}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
