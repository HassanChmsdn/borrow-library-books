import type { ReactNode } from "react";

import { buildSignOutHref, getCurrentUser } from "@/lib/auth";
import { MockAuthProvider } from "@/lib/auth/react";
import { LanguageSwitcher, PublicShell, ShellBrand } from "@/components/layout";
import { AnchorButton } from "@/components/ui/anchor-button";
import { requireAuthorizedRoute } from "@/lib/auth/server";
import { getI18n } from "@/lib/i18n/server";

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

function AccountUtilitySlot({
  signOutHref,
  signOutLabel,
}: {
  signOutHref: string;
  signOutLabel: string;
}) {
  return (
    <>
      <LanguageSwitcher />
      <AnchorButton href={signOutHref} size="sm" variant="secondary">
        {signOutLabel}
      </AnchorButton>
    </>
  );
}

export default async function AccountSectionLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { messages, translateText } = await getI18n();
  const session = await requireAuthorizedRoute("/account");
  const currentUser = getCurrentUser(session);

  return (
    <MockAuthProvider value={session}>
      <PublicShell
        brand={
          <ShellBrand
            href="/books"
            monogram={currentUser?.monogram ?? "BL"}
            subtitle={currentUser?.subtitle ?? translateText("Account")}
            title={currentUser?.fullName ?? messages.ui.appName}
          />
        }
        navigationItems={accountNavigationItems}
        utilitySlot={
          <AccountUtilitySlot
            signOutHref={buildSignOutHref(session, "/books")}
            signOutLabel={translateText("Sign out")}
          />
        }
      >
        {children}
      </PublicShell>
    </MockAuthProvider>
  );
}