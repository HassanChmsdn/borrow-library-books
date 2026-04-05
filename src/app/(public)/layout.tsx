import type { ReactNode } from "react";
import Link from "next/link";

import {
  buildMockSignInHref,
  buildMockSignOutHref,
  getCurrentUser,
  isAdmin,
  isAuthenticated,
  type MockSession,
} from "@/lib/auth";
import { MockAuthProvider } from "@/lib/auth/react";
import { PublicShell, ShellBrand } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { allBooksCatalog } from "@/modules/catalog/all-books-data";
import { getMockSession } from "@/lib/auth/server";

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
  if (!isAuthenticated(session)) {
    return (
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
    );
  }

  return (
    <>
      <Button asChild size="sm" variant="outline">
        <Link href={isAdmin(session) ? "/admin" : "/account/borrowings"}>
          {isAdmin(session) ? "Admin console" : "My account"}
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
  const currentUser = getCurrentUser(session);

  return (
    <MockAuthProvider value={session}>
      <PublicShell
        brand={
          <ShellBrand
            href="/books"
            monogram="BL"
            subtitle={currentUser?.subtitle ?? "Community Library"}
            title={currentUser?.fullName ?? "Borrow Library Books"}
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
