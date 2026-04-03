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
  orientation?: "column" | "row";
  size?: "sm" | "xs";
  stretch?: boolean;
}

function AdminRowActions({
  actions,
  align = "start",
  className,
  orientation = "row",
  size = "xs",
  stretch = false,
}: AdminRowActionsProps) {
  const buttonClassName = cn(
    stretch ? "w-full justify-center" : undefined,
    orientation === "column" ? "min-w-[5.75rem]" : undefined,
  );

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        orientation === "column" ? "flex-col" : "flex-wrap",
        align === "end"
          ? orientation === "column"
            ? "items-end"
            : "justify-end"
          : orientation === "column"
            ? "items-start"
            : undefined,
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
                <Button
                  type="button"
                  size={size}
                  variant={variant}
                  className={buttonClassName}
                >
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
              className={buttonClassName}
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
            className={buttonClassName}
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
