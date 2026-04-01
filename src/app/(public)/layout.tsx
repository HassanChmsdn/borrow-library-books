import type { ReactNode } from "react";
import Link from "next/link";

import { PublicShell, ShellBrand } from "@/components/layout";
import { Button } from "@/components/ui/button";

const publicNavigationItems = [
  {
    href: "/",
    label: "Overview",
    matchStrategy: "exact" as const,
  },
  {
    href: "/books",
    label: "All Books",
    badge: "12",
    matchStrategy: "exact" as const,
  },
  {
    href: "/borrowings",
    label: "My Borrowings",
    matchStrategy: "exact" as const,
  },
];

export default function PublicSectionLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PublicShell
      brand={
        <ShellBrand
          href="/"
          monogram="BL"
          subtitle="Community Library"
          title="Borrow Library Books"
        />
      }
      navigationItems={publicNavigationItems}
      utilitySlot={
        <>
          <Button asChild size="sm" variant="outline">
            <Link href="/books">Browse Books</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin">Admin</Link>
          </Button>
        </>
      }
    >
      {children}
    </PublicShell>
  );
}
