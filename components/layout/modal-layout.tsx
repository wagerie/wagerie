"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ModalLayoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const sizeClass: Record<NonNullable<ModalLayoutProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export function ModalLayout({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  children,
  footer,
  className = "",
}: ModalLayoutProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${sizeClass[size]} ${className} bg-card/95 backdrop-blur-sm border-border/50 shadow-xl rounded-2xl animate-in fade-in-0 zoom-in-95 duration-200`}
      >
        {(title || description) && (
          <DialogHeader className="space-y-2">
            {title && (
              <DialogTitle className="text-xl font-bold text-foreground">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-muted-foreground text-sm">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="space-y-6">{children}</div>

        {footer && (
          <div className="mt-6 pt-4 border-t border-border/30">{footer}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ModalLayout;
