import React from "react";
import { Button } from "../ui/button";

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
      className={className}
      disabled={loading ?? disabled}
      type={type}
      {...props}
    >
      {children} {loading ? "..." : null}
    </Button>
  );
};
