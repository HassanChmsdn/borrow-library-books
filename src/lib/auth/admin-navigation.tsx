import type { ReactNode } from "react";
import {
  BookCopy,
  FolderKanban,
  HandCoins,
  LayoutDashboard,
  PackageOpen,
  Rows3,
  ShieldCheck,
  Users,
} from "lucide-react";

import type { ShellNavSection } from "@/components/layout/types";

import type { AppAdminSection } from "./app-user-model";
import {
  canAccessAdminSection,
  hasAdminAccess,
  type AppAuthState,
} from "./mock-auth";

interface AdminNavigationItemConfig {
  href: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  matchStrategy?: "exact" | "prefix";
  section?: AppAdminSection;
}

interface AdminNavigationSectionConfig {
  title: string;
  items: ReadonlyArray<AdminNavigationItemConfig>;
}

const adminNavigationSections: ReadonlyArray<AdminNavigationSectionConfig> = [
  {
    title: "Workspace",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        description: "Daily operations summary, alerts, and branch pulse.",
        icon: <LayoutDashboard aria-hidden="true" />,
        matchStrategy: "exact",
      },
      {
        href: "/admin/borrowings",
        label: "Borrowings",
        description: "Review holds, renewals, due-soon items, and returns.",
        icon: <BookCopy aria-hidden="true" />,
        section: "borrowings",
      },
      {
        href: "/admin/books",
        label: "Books",
        description: "Manage catalog records, shelf details, and fees.",
        icon: <Rows3 aria-hidden="true" />,
        section: "books",
      },
      {
        href: "/admin/inventory",
        label: "Inventory",
        description: "Track stock health, branch balances, and restock plans.",
        icon: <PackageOpen aria-hidden="true" />,
        section: "inventory",
      },
    ],
  },
  {
    title: "Organization",
    items: [
      {
        href: "/admin/categories",
        label: "Categories",
        description: "Shape collection mix, shelves, and demand by category.",
        icon: <FolderKanban aria-hidden="true" />,
        section: "categories",
      },
      {
        href: "/admin/users",
        label: "Users",
        description: "Monitor members, balances, and engagement activity.",
        icon: <Users aria-hidden="true" />,
        section: "users",
      },
      {
        href: "/admin/financial",
        label: "Financial",
        description: "Review fee intake, reconciliations, and cashier workflows.",
        icon: <HandCoins aria-hidden="true" />,
        section: "financial",
      },
    ],
  },
  {
    title: "Governance",
    items: [
      {
        href: "/admin/settings/access-control",
        label: "Access Control",
        description: "Inspect role defaults and prepare targeted access overrides.",
        icon: <ShieldCheck aria-hidden="true" />,
        section: "accessControl",
      },
    ],
  },
];

function canAccessAdminNavigationItem(
  authState: AppAuthState,
  item: AdminNavigationItemConfig,
) {
  if (!hasAdminAccess(authState)) {
    return false;
  }

  return !item.section || canAccessAdminSection(authState, item.section);
}

export function getAuthorizedAdminNavigationSections(
  authState: AppAuthState,
): ReadonlyArray<ShellNavSection> {
  if (!hasAdminAccess(authState)) {
    return [];
  }

  return adminNavigationSections
    .map((section) => ({
      title: section.title,
      items: section.items
        .filter((item) => canAccessAdminNavigationItem(authState, item))
        .map((item) => ({
          description: item.description,
          href: item.href,
          icon: item.icon,
          label: item.label,
          matchStrategy: item.matchStrategy,
        })),
    }))
    .filter((section) => section.items.length > 0);
}