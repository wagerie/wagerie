import React from "react";
import { Button } from "../ui/button";

interface BtnProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onClick?: () => void;
  asChild?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

 export const BtnComponent = ({
  children,
  variant,
  size,
  className,
  onClick,
  asChild,
  loading,
  disabled
}: BtnProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
      asChild={asChild}
      disabled={loading ?? disabled}
    >
      {children} {loading ? "..." : null}
    </Button>
  );
};
