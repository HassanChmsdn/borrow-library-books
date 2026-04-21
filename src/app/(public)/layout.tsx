import type { ReactNode } from "react";
import Link from "next/link";

import {
  buildSignOutHref,
  buildMockSignInHref,
  getCurrentUser,
  hasAdminAccess,
  isAuthenticated,
  isMember,
  type AppAuthState,
} from "@/lib/auth";
import { MockAuthProvider } from "@/lib/auth/react";
import {
  LanguageSwitcher,
  PublicShell,
  ShellBrand,
} from "@/components/layout";
import { AnchorButton } from "@/components/ui/anchor-button";
import { LinkButton } from "@/components/ui/link-button";
import { listCatalogBooks } from "@/modules/catalog/server";
import { getCurrentSession } from "@/lib/auth/server";
import { getI18n } from "@/lib/i18n/server";

function PublicUtilitySlot({
  session,
  translateText,
}: {
  session: AppAuthState;
  translateText: (text: string) => string;
}) {
  if (!isAuthenticated(session)) {
    return (
      <>
        <LanguageSwitcher />
        <LinkButton
          href={buildMockSignInHref({
            role: "member",
            redirectTo: "/books",
          })}
          size="sm"
          variant="outline"
        >
          {translateText("Member sign in")}
        </LinkButton>
      </>
    );
  }

  return (
    <>
      <LanguageSwitcher />
      {hasAdminAccess(session) ? (
        <LinkButton href="/admin" size="sm" variant="outline">
          {translateText("Admin console")}
        </LinkButton>
      ) : null}
      <AnchorButton href={buildSignOutHref(session, "/books")} size="sm" variant="secondary">
        {translateText("Sign out")}
      </AnchorButton>
    </>
  );
}

export default async function PublicSectionLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { messages, translateText } = await getI18n();
  const [session, books] = await Promise.all([
    getCurrentSession(),
    listCatalogBooks(),
  ]);
  const currentUser = getCurrentUser(session);
  const publicNavigationItems = isMember(session)
    ? [
        {
          href: "/books",
          label: translateText("All Books"),
          badge: String(books.length),
          matchStrategy: "prefix" as const,
        },
        {
          href: "/account/borrowings",
          label: translateText("My Borrowings"),
          matchStrategy: "prefix" as const,
        },
        {
          href: "/account/profile",
          label: translateText("Profile"),
          matchStrategy: "prefix" as const,
        },
      ]
    : [
        {
          href: "/books",
          label: translateText("All Books"),
          badge: String(books.length),
          matchStrategy: "prefix" as const,
        },
      ];

  return (
    <MockAuthProvider value={session}>
      <PublicShell
        brand={
          <ShellBrand
            href="/books"
            monogram="BL"
            subtitle={currentUser?.subtitle ?? messages.ui.publicLibraryName}
            title={currentUser?.fullName ?? messages.ui.appName}
          />
        }
        navigationItems={publicNavigationItems}
        utilitySlot={
          <PublicUtilitySlot session={session} translateText={translateText} />
        }
      >
        {children}
      </PublicShell>
    </MockAuthProvider>
  );
}
