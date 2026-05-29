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
  isLoading?: boolean;
}

export const BtnComponent = ({
  children,
  variant = "default",
  size = "default",
  className,
  loading,
  isLoading,
  disabled,
  type = "button",
  ...props
}: BtnProps) => {
  const isLoaded = loading || isLoading;
  
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "transition-all duration-200 flex gap-2 items-center justify-center",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "hover:shadow-md active:scale-95",
        className,
      )}
      disabled={isLoaded || disabled}
      type={type}
      {...props}
    >
      {children}
      {isLoaded && <Loader2 className="w-4 h-4 animate-spin" />}
    </Button>
  );
};
