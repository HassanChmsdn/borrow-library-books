import type { ReactNode } from "react";
import Link from "next/link";

import {
  buildMockSignInHref,
  buildMockSignOutHref,
  type MockSession,
} from "@/lib/auth/mock-auth";
import { MockAuthProvider } from "@/components/auth/mock-auth-provider";
import { PublicShell, ShellBrand } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { allBooksCatalog } from "@/modules/catalog/all-books-data";
import { getMockSession } from "@/server/auth/mock-session";

const publicNavigationItems = [
  {
    href: "/books",
    label: "All Books",
    badge: String(allBooksCatalog.length),
    matchStrategy: "prefix" as const,
  },
];

function PublicUtilitySlot({
  session,
}: {
  session: MockSession;
}) {
  if (!session.isAuthenticated) {
    return (
      <>
        <Button asChild size="sm" variant="outline">
          <Link
            href={buildMockSignInHref({
              role: "member",
              redirectTo: "/account/borrowings",
            })}
          >
            Member sign in
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link
            href={buildMockSignInHref({ role: "admin", redirectTo: "/admin" })}
          >
            Admin sign in
          </Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <Button asChild size="sm" variant="outline">
        <Link href={session.isAdmin ? "/admin" : "/account/borrowings"}>
          {session.isAdmin ? "Admin console" : "My account"}
        </Link>
      </Button>
      <Button asChild size="sm" variant="secondary">
        <Link href={buildMockSignOutHref("/books")}>Sign out</Link>
      </Button>
    </>
  );
}

export default async function PublicSectionLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getMockSession();

  return (
    <MockAuthProvider value={session}>
      <PublicShell
        brand={
          <ShellBrand
            href="/books"
            monogram="BL"
            subtitle="Community Library"
            title="Borrow Library Books"
          />
        }
        navigationItems={publicNavigationItems}
        utilitySlot={<PublicUtilitySlot session={session} />}
      >
        {children}
      </PublicShell>
    </MockAuthProvider>
  );
}
