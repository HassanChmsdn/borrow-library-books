import type { ReactNode } from "react";
import Link from "next/link";

import { buildMockSignOutHref } from "@/lib/auth/mock-auth";
import { MockAuthProvider } from "@/components/auth/mock-auth-provider";
import { PublicShell, ShellBrand } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { requireMockMemberSession } from "@/server/auth/mock-session";

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

  return (
    <MockAuthProvider value={session}>
      <PublicShell
        brand={
          <ShellBrand
            href="/books"
            monogram={session.currentUser?.monogram ?? "BL"}
            subtitle={session.currentUser?.subtitle ?? "Member Account"}
            title={session.currentUser?.fullName ?? "Borrow Library Books"}
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