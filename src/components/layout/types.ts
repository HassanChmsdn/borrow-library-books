import type * as React from "react";

export interface ShellNavItem {
  href: string;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  matchStrategy?: "exact" | "prefix";
}

export interface ShellNavSection {
  title?: string;
  items: ReadonlyArray<ShellNavItem>;
}
