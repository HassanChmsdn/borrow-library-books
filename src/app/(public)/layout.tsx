import type { ReactNode } from "react";
import Link from "next/link";

import {
  buildSignOutHref,
  buildMockSignInHref,
  getCurrentUser,
  isAdmin,
  isAuthenticated,
  isMember,
  type AppAuthState,
} from "@/lib/auth";
import { MockAuthProvider } from "@/lib/auth/react";
import { PublicShell, ShellBrand } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { allBooksCatalog } from "@/modules/catalog/all-books-data";
import { getCurrentSession } from "@/lib/auth/server";

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
  session: AppAuthState;
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
      {isAdmin(session) ? (
        <Button asChild size="sm" variant="outline">
          <Link href="/admin">Admin console</Link>
        </Button>
      ) : isMember(session) ? (
        <Button asChild size="sm" variant="outline">
          <Link href="/account/borrowings">My account</Link>
        </Button>
      ) : null}
      <Button asChild size="sm" variant="secondary">
        <Link href={buildSignOutHref(session, "/books")}>Sign out</Link>
      </Button>
    </>
  );
}

export default async function PublicSectionLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getCurrentSession();
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
