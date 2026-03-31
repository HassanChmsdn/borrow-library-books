import type { ReactNode } from "react";
import Link from "next/link";

import { PublicShell, ShellBrand } from "@/components/layout";
import { Button } from "@/components/ui/button";

const publicNavigationItems = [
  {
    href: "/",
    label: "Browse",
    matchStrategy: "exact" as const,
  },
  {
    href: "/#my-borrowings",
    label: "My Borrowings",
  },
  {
    href: "/#profile",
    label: "Profile",
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
      currentPath="/"
      utilitySlot={
        <>
          <Button asChild size="sm" variant="outline">
            <Link href="/#browse">Browse</Link>
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
