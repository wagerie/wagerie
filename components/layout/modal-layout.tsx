"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerHeader,
  DrawerDescription,
} from "../ui/drawer";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            ` bg-card/95 backdrop-blur-sm border-border/50 shadow-xl rounded-2xl animate-in fade-in-0 zoom-in-95 duration-200`,
            className,
            sizeClass[size],
          )}
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange} modal showSwipeHandle>
      <DrawerContent
        className={cn(
          "bg-card/95 backdrop-blur-sm p-4 rounded-t-2xl",
          className,
        )}
      >
        {(title || description) && (
          <DrawerHeader className="space-y-2">
            <DrawerTitle className={"text-xl font-bold text-foreground"}>
              {title}
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground text-sm">
              {description}
            </DrawerDescription>
          </DrawerHeader>
        )}
        <div className="space-y-6">{children}</div>
        {footer && (
          <div className="mt-6 pt-4 border-t border-border/30">{footer}</div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default ModalLayout;
