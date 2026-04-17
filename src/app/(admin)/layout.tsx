import type { ReactNode } from "react";
import Link from "next/link";

import {
  buildSignOutHref,
  canAccessAdminSection,
  getAuthorizedAdminNavigationSections,
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
          <a href={signOutHref}>Sign out</a>
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
  const navigationSections = getAuthorizedAdminNavigationSections(session);
  const canAccessBooks = canAccessAdminSection(session, "books");

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
        navigationSections={navigationSections}
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
                {canAccessBooks ? (
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/admin/books">Catalog queue</Link>
                  </Button>
                ) : null}
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
