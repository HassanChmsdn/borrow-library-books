"use client";

import { AdminTabs } from "@/components/admin";

import type { AdminBorrowingsTab, AdminBorrowingsTabItem } from "../types";

interface BorrowingsTabsProps {
  items: ReadonlyArray<AdminBorrowingsTabItem>;
  onValueChange: (value: AdminBorrowingsTab) => void;
  value: AdminBorrowingsTab;
}

function BorrowingsTabs({
  items,
  onValueChange,
  value,
}: Readonly<BorrowingsTabsProps>) {
  return (
    <AdminTabs
      items={items.map((item) => ({
        label: (
          <span className="flex items-center gap-2">
            <span>{item.label}</span>
            <span className="rounded-full border border-current/15 px-1.5 py-0.5 text-[0.625rem] leading-none opacity-80">
              {item.count}
            </span>
          </span>
        ),
        value: item.value,
      }))}
      value={value}
      onValueChange={onValueChange}
    />
  );
}

export { BorrowingsTabs, type BorrowingsTabsProps };