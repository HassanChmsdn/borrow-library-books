"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { translateNode, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface AdminSectionCardProps extends Omit<
  React.ComponentProps<typeof Card>,
  "title"
> {
  actions?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  title?: React.ReactNode;
}

function AdminSectionCard({
  actions,
  children,
  className,
  contentClassName,
  description,
  footer,
  title,
  ...props
}: AdminSectionCardProps) {
  const { translateText } = useI18n();

  return (
    <Card className={className} {...props}>
      {title || description || actions ? (
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-1.5">
              {title ? <CardTitle>{translateNode(title, translateText)}</CardTitle> : null}
              {description ? (
                <CardDescription>
                  {translateNode(description, translateText)}
                </CardDescription>
              ) : null}
            </div>
            {actions ? (
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                {actions}
              </div>
            ) : null}
          </div>
        </CardHeader>
      ) : null}
      <CardContent className={cn("grid gap-4", contentClassName)}>
        {children}
      </CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
}

export { AdminSectionCard, type AdminSectionCardProps };
