import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import {
  hasAdminAccess,
  sanitizeRedirectTo,
} from "@/lib/auth";
import { PageHeader, ShellBrand } from "@/components/layout";
import { AnchorButton } from "@/components/ui/anchor-button";
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth/server";
import { buildAuth0LoginHref, isAuth0Configured } from "@/lib/auth/auth0";
import { getI18n } from "@/lib/i18n/server";

interface AdminAccessPageProps {
  searchParams: Promise<{
    error?: string;
    redirectTo?: string;
  }>;
}

export const metadata = {
  title: "Admin Access",
};

function getAdminAuthErrorMessage(error?: string) {
  if (error === "auth0-not-configured") {
    return "Admin authentication is unavailable until Auth0 is configured for this environment.";
  }

  return null;
}

export default async function AdminAccessPage({ searchParams }: AdminAccessPageProps) {
  const { messages, translateText } = await getI18n();
  const params = await searchParams;
  const redirectTo = sanitizeRedirectTo(params.redirectTo, "/admin");
  const session = await getCurrentSession();
  const auth0Enabled = isAuth0Configured();
  const rawErrorMessage =
    getAdminAuthErrorMessage(params.error) ??
    (!auth0Enabled
      ? "Admin authentication is unavailable until Auth0 is configured for this environment."
      : null);
  const errorMessage = rawErrorMessage ? translateText(rawErrorMessage) : null;

  if (hasAdminAccess(session)) {
    redirect(redirectTo);
  }

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="flex items-start justify-between gap-6">
          <ShellBrand
            href="/books"
            monogram="BL"
            subtitle={messages.ui.adminConsoleName}
            title={messages.ui.appName}
          />
        </div>

        <div className="gap-section flex flex-col">
          <PageHeader
            eyebrow="Restricted Access"
            title="Staff sign in"
            description="Continue with an authorized staff identity to open the operations workspace and protected management routes."
          />

          <section style={{ maxWidth: "var(--layout-reading-max-width)" }}>
            <Card>
              <CardHeader>
                <div className="bg-secondary text-primary flex size-11 items-center justify-center rounded-2xl">
                  <ShieldCheck className="size-5" />
                </div>
                <CardTitle>{translateText("Admin workspace access")}</CardTitle>
                <CardDescription>
                  {translateText(
                    "Authentication is completed on the secure Auth0 page. Only users with an authorized staff role can enter this workspace.",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="rounded-2xl border border-dashed border-black/5 p-4">
                  <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                    {translateText("Requested destination")}
                  </p>
                  <p className="text-body text-foreground mt-2 font-medium break-all">
                    {redirectTo}
                  </p>
                  <p className="text-body-sm text-text-secondary mt-2">
                    {translateText(
                      "If you are redirected here from a protected admin route, sign in with the staff account that should access that destination.",
                    )}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {auth0Enabled ? (
                    <AnchorButton className="sm:min-w-52" href={buildAuth0LoginHref(redirectTo)}>
                      Continue to admin login
                    </AnchorButton>
                  ) : null}
                  <LinkButton href="/books" variant="outline">
                    Back to catalog
                  </LinkButton>
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-danger/20 bg-danger-surface px-4 py-3">
                    <p className="text-body-sm text-danger font-medium">
                      {errorMessage}
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}