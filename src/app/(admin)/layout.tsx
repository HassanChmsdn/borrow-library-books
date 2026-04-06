import type { ReactNode } from "react";
import Link from "next/link";
import {
  BookCopy,
  FolderKanban,
  LayoutDashboard,
  PackageOpen,
  Rows3,
  Users,
} from "lucide-react";

import {
  buildSignOutHref,
  getCurrentUser,
} from "@/lib/auth";
import { MockAuthProvider } from "@/lib/auth/react";
import {
  AdminShell,
  AdminTopHeader,
  ShellBrand,
} from "@/components/layout";
import { Button } from "@/components/ui/button";
import { requireAdminSession } from "@/lib/auth/server";

const adminNavigationSections = [
  {
    title: "Workspace",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        description: "Daily operations summary, alerts, and branch pulse.",
        icon: <LayoutDashboard aria-hidden="true" />,
        matchStrategy: "exact" as const,
      },
      {
        href: "/admin/borrowings",
        label: "Borrowings",
        description: "Review holds, renewals, due-soon items, and returns.",
        icon: <BookCopy aria-hidden="true" />,
      },
      {
        href: "/admin/books",
        label: "Books",
        description: "Manage catalog records, shelf details, and fees.",
        icon: <Rows3 aria-hidden="true" />,
      },
      {
        href: "/admin/inventory",
        label: "Inventory",
        description: "Track stock health, branch balances, and restock plans.",
        icon: <PackageOpen aria-hidden="true" />,
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
      },
      {
        href: "/admin/users",
        label: "Users",
        description: "Monitor members, balances, and engagement activity.",
        icon: <Users aria-hidden="true" />,
      },
    ],
  },
];

function AdminFooter({
  monogram,
  subtitle,
  fullName,
  signOutHref,
}: {
  monogram: string;
  subtitle: string;
  fullName: string;
  signOutHref: string;
}) {

  return (
    <div className="border-border-subtle bg-background rounded-xl border px-3 py-3 shadow-xs">
      <div className="flex items-center gap-3">
        <span className="bg-secondary text-primary rounded-pill border-border-subtle text-caption inline-flex size-9 shrink-0 items-center justify-center border font-semibold uppercase">
          {monogram}
        </span>

        <div className="min-w-0">
          <p className="text-body-sm text-foreground truncate font-medium">
            {fullName}
          </p>
          <p className="text-caption text-text-tertiary truncate">
            {subtitle}
          </p>
        </div>
      </div>

      <p className="text-caption text-text-tertiary mt-3 text-pretty">
        Mock-data admin workspace. Backend integration is intentionally deferred.
      </p>

      <div className="mt-3 grid gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/profile">View profile</Link>
        </Button>

        <Button asChild className="w-full" size="sm" variant="secondary">
          <Link href={signOutHref}>Sign out</Link>
        </Button>
      </div>
    </div>
  );
}

export default async function AdminSectionLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requireAdminSession();
  const currentUser = getCurrentUser(session);

  return (
    <MockAuthProvider value={session}>
      <AdminShell
        brand={
          <ShellBrand
            href="/admin"
            monogram="BL"
            subtitle="Admin Console"
            title="Borrow Library Books"
          />
        }
        navigationSections={adminNavigationSections}
        topHeader={
          <AdminTopHeader
            eyebrow="Library Admin"
            title="Operations Workspace"
            description="A shared admin frame for dashboard, catalog, borrowing, inventory, category, and member management modules built on the existing token and shell system."
            actions={
              <>
                <Button asChild size="sm" variant="outline">
                  <Link href="/books">Reader Experience</Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/admin/books">Catalog queue</Link>
                </Button>
              </>
            }
          />
        }
        userSlot={
          <div className="bg-secondary rounded-xl px-3 py-3">
            <p className="text-label text-primary font-medium tracking-[0.18em] uppercase">
              {currentUser?.subtitle ?? "Shift lead account"}
            </p>
            <p className="text-body-sm text-text-secondary mt-1">
              {currentUser?.fullName ?? "Samir Chahine"} is covering catalog,
              circulation, and member operations this afternoon.
            </p>
          </div>
        }
        footerSlot={
          <AdminFooter
            fullName={currentUser?.fullName ?? "Samir Chahine"}
            monogram={currentUser?.monogram ?? "SC"}
            signOutHref={buildSignOutHref(session, "/books")}
            subtitle={currentUser?.subtitle ?? "Shift lead account"}
          />
        }
      >
        {children}
      </AdminShell>
    </MockAuthProvider>
  );
}
