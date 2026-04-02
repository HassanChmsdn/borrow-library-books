"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ConfirmActionDialog } from "./confirm-action-dialog";

interface AdminRowAction {
  confirm?: {
    cancelLabel?: string;
    confirmLabel?: string;
    description: React.ReactNode;
    title: React.ReactNode;
    tone?: "default" | "danger";
  };
  disabled?: boolean;
  href?: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  onAction?: () => void;
  variant?:
    | "default"
    | "destructive"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";
}

interface AdminRowActionsProps {
  actions: ReadonlyArray<AdminRowAction>;
  align?: "end" | "start";
  className?: string;
  size?: "sm" | "xs";
}

function AdminRowActions({
  actions,
  align = "start",
  className,
  size = "xs",
}: AdminRowActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        align === "end" ? "justify-end" : undefined,
        className,
      )}
    >
      {actions.map((action, index) => {
        const key = `${String(action.label)}-${index}`;
        const variant = action.variant ?? "outline";
        const content = (
          <>
            {action.icon}
            {action.label}
          </>
        );

        if (action.confirm) {
          return (
            <ConfirmActionDialog
              key={key}
              trigger={
                <Button type="button" size={size} variant={variant}>
                  {content}
                </Button>
              }
              title={action.confirm.title}
              description={action.confirm.description}
              cancelLabel={action.confirm.cancelLabel}
              confirmLabel={action.confirm.confirmLabel}
              tone={action.confirm.tone}
              onConfirm={action.onAction}
            />
          );
        }

        if (action.href) {
          return (
            <Button
              key={key}
              asChild
              type="button"
              size={size}
              variant={variant}
            >
              <Link href={action.href}>{content}</Link>
            </Button>
          );
        }

        return (
          <Button
            key={key}
            type="button"
            size={size}
            variant={variant}
            disabled={action.disabled}
            onClick={action.onAction}
          >
            {content}
          </Button>
        );
      })}
    </div>
  );
}

export { AdminRowActions, type AdminRowAction, type AdminRowActionsProps };
