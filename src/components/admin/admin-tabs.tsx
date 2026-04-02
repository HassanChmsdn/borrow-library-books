"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminTabItem<T extends string> {
  label: React.ReactNode;
  value: T;
}

interface AdminTabsProps<T extends string> {
  className?: string;
  itemClassName?: string;
  items: ReadonlyArray<AdminTabItem<T>>;
  onValueChange: (value: T) => void;
  value: T;
}

function AdminTabs<T extends string>({
  className,
  itemClassName,
  items,
  onValueChange,
  value,
}: AdminTabsProps<T>) {
  return (
    <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className={cn("flex min-w-max gap-2", className)}>
        {items.map((item) => {
          const isActive = item.value === value;

          return (
            <Button
              key={item.value}
              size="sm"
              type="button"
              variant={isActive ? "default" : "outline"}
              className={itemClassName}
              onClick={() => onValueChange(item.value)}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export { AdminTabs, type AdminTabItem, type AdminTabsProps };
