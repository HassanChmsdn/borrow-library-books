import type { ReactNode } from "react";
import Link from "next/link";

import { buildMockSignOutHref, getCurrentUser } from "@/lib/auth";
import { MockAuthProvider } from "@/lib/auth/react";
import { PublicShell, ShellBrand } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { requireMockMemberSession } from "@/lib/auth/server";

const accountNavigationItems = [
  {
    href: "/books",
    label: "All Books",
    matchStrategy: "prefix" as const,
  },
  {
    href: "/account/borrowings",
    label: "My Borrowings",
    matchStrategy: "prefix" as const,
  },
  {
    href: "/account/profile",
    label: "Profile",
    matchStrategy: "prefix" as const,
  },
];

function AccountUtilitySlot() {
  return (
    <>
      <Button asChild size="sm" variant="secondary">
        <Link href={buildMockSignOutHref("/books")}>Sign out</Link>
      </Button>
    </>
  );
}

export default async function AccountSectionLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requireMockMemberSession();
  const currentUser = getCurrentUser(session);

  return (
    <MockAuthProvider value={session}>
      <PublicShell
        brand={
          <ShellBrand
            href="/books"
            monogram={currentUser?.monogram ?? "BL"}
            subtitle={currentUser?.subtitle ?? "Member Account"}
            title={currentUser?.fullName ?? "Borrow Library Books"}
          />
        }
        navigationItems={accountNavigationItems}
        utilitySlot={<AccountUtilitySlot />}
      >
        {children}
      </PublicShell>
    </MockAuthProvider>
  );
}