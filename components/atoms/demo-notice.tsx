import type { ReactNode } from "react";

export function DemoNotice({ children }: { children?: ReactNode }) {
  return (
    <p
      role="status"
      className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300"
    >
      <strong>Demo preview.</strong>{" "}
      {children ||
        "These are sample records, not real draws, winners, or payments. Demo draws cannot be entered."}
    </p>
  );
}
