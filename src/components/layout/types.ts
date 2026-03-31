import type * as React from "react";

export type ShellIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface ShellNavItem {
  href: string;
  label: string;
  description?: string;
  badge?: string;
  icon?: ShellIcon;
  matchStrategy?: "exact" | "prefix";
}

export interface ShellNavSection {
  title?: string;
  items: ReadonlyArray<ShellNavItem>;
}
