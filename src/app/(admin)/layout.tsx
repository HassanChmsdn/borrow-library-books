import type { ReactNode } from "react";
import Link from "next/link";

import {
  AdminShell,
  AdminTopHeader,
  PageActionBar,
  ShellBrand,
} from "@/components/layout";
import { Button } from "@/components/ui/button";

const adminNavigationSections = [
  {
    title: "Workspace",
    items: [
      {
        href: "/admin",
        label: "Overview",
        description: "Preview the reusable admin layout shell.",
        matchStrategy: "exact" as const,
      },
      {
        href: "/admin#navigation",
        label: "Navigation",
        description: "Anchor preview for sidebar and drawer behavior.",
      },
      {
        href: "/admin#content-canvas",
        label: "Content Canvas",
        description: "Review spacing, wrappers, and card rhythm.",
      },
    ],
  },
  {
    title: "Shell Regions",
    items: [
      {
        href: "/admin#action-surface",
        label: "Action Surface",
        description: "Preview the shared page action bar region.",
      },
    ],
  },
];

export default function AdminSectionLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
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
      currentPath="/admin"
      topHeader={
        <AdminTopHeader
          eyebrow="Admin Shell"
          title="Operations workspace preview"
          description="Shared navigation, sticky header, and content framing are now mounted at the route-group layout level for admin routes."
          actions={
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/">Public Preview</Link>
              </Button>
              <Button size="sm" type="button" variant="secondary">
                Layout Actions
              </Button>
            </>
          }
        />
      }
      pageActionBar={
        <PageActionBar
          id="action-surface"
          eyebrow="Reusable Region"
          title="Action bar preview"
          description="Use this surface for cross-page controls, status context, and task actions once admin workflows are implemented."
          actions={
            <>
              <Button size="sm" type="button">
                Primary Action
              </Button>
              <Button size="sm" type="button" variant="outline">
                Secondary Action
              </Button>
            </>
          }
        />
      }
      userSlot={
        <div className="bg-secondary rounded-xl px-3 py-3">
          <p className="text-label text-primary font-medium tracking-[0.18em] uppercase">
            Preview User
          </p>
          <p className="text-body-sm text-text-secondary mt-1">
            Shared user summary slot for the admin shell.
          </p>
        </div>
      }
      footerSlot={
        <p className="text-caption text-text-tertiary">
          Layout-only scaffold. No admin business logic is mounted yet.
        </p>
      }
    >
      {children}
    </AdminShell>
  );
}
