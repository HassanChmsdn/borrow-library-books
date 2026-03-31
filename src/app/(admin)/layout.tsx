import type { ReactNode } from "react";
import Link from "next/link";
import { BookCopy, PackageOpen, ScrollText, Users } from "lucide-react";

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
        description: "Library operations summary and daily system health.",
        icon: <ScrollText aria-hidden="true" />,
        matchStrategy: "exact" as const,
      },
      {
        href: "/admin#borrow-requests",
        label: "Borrow Requests",
        description: "Review holds, renewals, and pending pickup reminders.",
        icon: <BookCopy aria-hidden="true" />,
      },
      {
        href: "/admin#inventory",
        label: "Inventory",
        description: "Track collection health and low-stock signals.",
        icon: <PackageOpen aria-hidden="true" />,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        href: "/admin#members",
        label: "Members",
        description: "Monitor engagement patterns across branches and plans.",
        icon: <Users aria-hidden="true" />,
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
          title="Library Operations"
          description="Shared navigation, sticky header, and content framing now host static admin modules that can be replaced with real data later."
          actions={
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/">Reader Experience</Link>
              </Button>
              <Button size="sm" type="button" variant="secondary">
                Review today
              </Button>
            </>
          }
        />
      }
      pageActionBar={
        <PageActionBar
          id="action-surface"
          eyebrow="Daily Actions"
          title="Operations action bar"
          description="Use this surface for cross-page controls, status context, and task actions once admin workflows are implemented."
          actions={
            <>
              <Button size="sm" type="button">
                Add book
              </Button>
              <Button size="sm" type="button" variant="outline">
                Export report
              </Button>
            </>
          }
        />
      }
      userSlot={
        <div className="bg-secondary rounded-xl px-3 py-3">
          <p className="text-label text-primary font-medium tracking-[0.18em] uppercase">
            Shift lead
          </p>
          <p className="text-body-sm text-text-secondary mt-1">
            Samir Chahine is covering catalog operations this afternoon.
          </p>
        </div>
      }
      footerSlot={
        <p className="text-caption text-text-tertiary">
          Static module scaffold. No admin business logic is mounted yet.
        </p>
      }
    >
      {children}
    </AdminShell>
  );
}
