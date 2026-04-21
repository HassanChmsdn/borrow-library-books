import type { ReactNode } from "react";
import Link from "next/link";

import {
  buildSignOutHref,
  canAccessAdminSection,
  getAuthorizedAdminNavigationSections,
  getCurrentUser,
} from "@/lib/auth";
import { MockAuthProvider } from "@/lib/auth/react";
import {
  AdminShell,
  AdminTopHeader,
  LanguageSwitcher,
  ShellBrand,
} from "@/components/layout";
import { AnchorButton } from "@/components/ui/anchor-button";
import { LinkButton } from "@/components/ui/link-button";
import { requireAdminSession } from "@/lib/auth/server";
import { getI18n } from "@/lib/i18n/server";

function AdminFooter({
  monogram,
  subtitle,
  fullName,
  signOutHref,
  translateText,
}: {
  monogram: string;
  subtitle: string;
  fullName: string;
  signOutHref: string;
  translateText: (text: string) => string;
}) {

  return (
    <div className="border-border-subtle bg-background rounded-xl border px-3 py-3 shadow-xs">
      <div className="flex items-center gap-3">
        <span className="bg-secondary text-primary rounded-pill border-border-subtle text-caption inline-flex size-9 shrink-0 items-center justify-center border font-semibold uppercase">
          {monogram}
        </span>

        <div className="min-w-0">
          <p className="text-body-sm text-foreground truncate font-medium">
            {fullName}
          </p>
          <p className="text-caption text-text-tertiary truncate">
            {translateText(subtitle)}
          </p>
        </div>
      </div>

      <p className="text-caption text-text-tertiary mt-3 text-pretty">
        {translateText(
          "Mock-data admin workspace. Backend integration is intentionally deferred.",
        )}
      </p>

      <div className="mt-3 grid gap-2">
        <LinkButton href="/admin/profile" size="sm" variant="outline">
          {translateText("View profile")}
        </LinkButton>

        <AnchorButton className="w-full" href={signOutHref} size="sm" variant="secondary">
          {translateText("Sign out")}
        </AnchorButton>
      </div>
    </div>
  );
}

export default async function AdminSectionLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requireAdminSession();
  const { messages, translateText } = await getI18n();
  const currentUser = getCurrentUser(session);
  const navigationSections = getAuthorizedAdminNavigationSections(
    session,
    translateText,
  );
  const canAccessBooks = canAccessAdminSection(session, "books");

  return (
    <MockAuthProvider value={session}>
      <AdminShell
        brand={
          <ShellBrand
            href="/admin"
            monogram="BL"
            subtitle={messages.ui.adminConsoleName}
            title={messages.ui.appName}
          />
        }
        navigationSections={navigationSections}
        topHeader={
          <AdminTopHeader
            eyebrow={translateText("Library Admin")}
            title={translateText("Operations Workspace")}
            description={translateText(
              "A shared admin frame for dashboard, catalog, borrowing, inventory, category, and member management modules built on the existing token and shell system.",
            )}
            actions={
              <>
                <LanguageSwitcher />
                <LinkButton href="/books" size="sm" variant="outline">
                  {translateText("Reader Experience")}
                </LinkButton>
                {canAccessBooks ? (
                  <LinkButton href="/admin/books" size="sm" variant="secondary">
                    {translateText("Catalog queue")}
                  </LinkButton>
                ) : null}
              </>
            }
          />
        }
        userSlot={
          <div className="bg-secondary rounded-xl px-3 py-3">
            <p className="text-label text-primary font-medium tracking-[0.18em] uppercase">
              {translateText(currentUser?.subtitle ?? "Shift lead account")}
            </p>
            <p className="text-body-sm text-text-secondary mt-1">
              {currentUser?.fullName ?? "Samir Chahine"} {translateText(
                "is covering catalog, circulation, and member operations this afternoon.",
              )}
            </p>
          </div>
        }
        footerSlot={
          <AdminFooter
            fullName={currentUser?.fullName ?? "Samir Chahine"}
            monogram={currentUser?.monogram ?? "SC"}
            signOutHref={buildSignOutHref(session, "/books")}
            subtitle={currentUser?.subtitle ?? "Shift lead account"}
            translateText={translateText}
          />
        }
      >
        {children}
      </AdminShell>
    </MockAuthProvider>
  );
}
