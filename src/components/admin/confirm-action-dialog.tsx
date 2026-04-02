"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";

interface ConfirmActionDialogProps {
  cancelLabel?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  defaultOpen?: boolean;
  description: React.ReactNode;
  onConfirm?: () => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  title: React.ReactNode;
  tone?: "default" | "danger";
  trigger: React.ReactElement<{
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  }>;
}

function ConfirmActionDialog({
  cancelLabel = "Cancel",
  children,
  confirmLabel = "Confirm",
  defaultOpen = false,
  description,
  onConfirm,
  onOpenChange,
  open,
  title,
  tone = "danger",
  trigger,
}: ConfirmActionDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [mounted, setMounted] = React.useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isOpen || !mounted) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, mounted, setOpen]);

  const triggerElement = React.cloneElement(trigger, {
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      trigger.props.onClick?.(event);
      if (!event.defaultPrevented) {
        setOpen(true);
      }
    },
  });

  return (
    <>
      {triggerElement}
      {mounted && isOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/35 p-4 sm:items-center"
              onClick={() => setOpen(false)}
            >
              <div
                role="alertdialog"
                aria-modal="true"
                className="rounded-card border-border-subtle bg-card w-full max-w-md border shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="grid gap-3 p-5 sm:p-6">
                  <div className="space-y-1.5">
                    <h3 className="text-title-sm text-foreground font-semibold">
                      {title}
                    </h3>
                    <p className="text-body-sm text-text-secondary">
                      {description}
                    </p>
                  </div>
                  {children}
                </div>
                <div className="flex flex-col-reverse gap-2 border-t border-black/5 p-5 sm:flex-row sm:justify-end sm:p-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    type="button"
                    variant={tone === "danger" ? "destructive" : "default"}
                    onClick={() => {
                      onConfirm?.();
                      setOpen(false);
                    }}
                  >
                    {confirmLabel}
                  </Button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export { ConfirmActionDialog, type ConfirmActionDialogProps };
