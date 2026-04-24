import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
}

export const BtnComponent = ({
  children,
  variant,
  size,
  className,
  loading,
  disabled,
  type = "button",
  ...props
}: BtnProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "disabled:opacity-50 disabled:cursor-not-allowed flex gap-1",
        className,
      )}
      disabled={loading || disabled}
      type={type}
      {...props}
    >
      {children}{" "}
      {loading ? <Loader2 className="animate-spin" size={18} /> : null}
    </Button>
  );
};
