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
    href: "/#layout-regions",
    label: "Layout Regions",
  },
  {
    href: "/#responsive-behavior",
    label: "Responsive Behavior",
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
            <Link href="/#token-note">View Notes</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin">Admin Preview</Link>
          </Button>
        </>
      }
    >
      {children}
    </PublicShell>
  );
}
