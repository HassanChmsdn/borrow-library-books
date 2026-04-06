import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import {
  buildMockAuthorizeHref,
  buildSignOutHref,
  getCurrentRole,
  getCurrentUser,
  isAuthenticated,
  sanitizeRedirectTo,
} from "@/lib/auth";
import { ShellBrand } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth/server";
import { buildAuth0LoginHref, isAuth0Configured } from "@/lib/auth/auth0";

interface AdminAccessPageProps {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
}

export const metadata = {
  title: "Admin Access",
};

export default async function AdminAccessPage({ searchParams }: AdminAccessPageProps) {
  const params = await searchParams;
  const redirectTo = sanitizeRedirectTo(params.redirectTo, "/admin");
  const session = await getCurrentSession();
  const currentUser = getCurrentUser(session);
  const currentRole = getCurrentRole(session);
  const authenticated = isAuthenticated(session);
  const auth0Enabled = isAuth0Configured();

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8 lg:grid lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start lg:gap-10 lg:px-10 lg:py-10">
        <section className="bg-secondary/35 rounded-card border-border-subtle flex h-full flex-col justify-between border p-6 shadow-xs lg:min-h-[40rem] lg:p-8">
          <div className="space-y-6">
            <ShellBrand
              href="/books"
              monogram="BL"
              subtitle="Admin Console"
              title="Borrow Library Books"
            />

            <div className="space-y-3">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.24em] uppercase">
                Restricted access
              </p>
              <h1 className="font-heading text-display-sm text-foreground max-w-xs text-balance font-semibold">
                Continue to the admin workspace.
              </h1>
              <p className="text-body text-text-secondary max-w-md text-pretty">
                Admin authentication now lives only under admin routes. This mocked screen protects the operations workspace while staying ready for future role-aware Auth0 integration.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-dashed border-black/5 bg-background/80 p-4">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Requested destination
              </p>
              <p className="text-body text-foreground mt-2 font-medium break-all">
                {redirectTo}
              </p>
            </div>
            <p className="text-body-sm text-text-tertiary">
              Guests are redirected here from protected admin routes. Member sign-in remains separate and public under the member auth flow.
            </p>
          </div>
        </section>

        <section className="grid gap-5 lg:pt-8">
          <Card>
            <CardHeader>
              <div className="bg-secondary text-primary flex size-11 items-center justify-center rounded-2xl">
                <ShieldCheck className="size-5" />
              </div>
              <CardTitle>Mocked admin access</CardTitle>
              <CardDescription>
                Continue with a mocked admin session to enter the operations workspace and all nested management routes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-2xl border border-dashed border-black/5 p-4">
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  Current session
                </p>
                <p className="text-body text-foreground mt-2 font-medium">
                  {currentUser
                    ? `${currentUser.fullName} (${currentRole})`
                    : "Guest"}
                </p>
                <p className="text-body-sm text-text-secondary mt-2">
                  Continuing here will replace any existing mocked session with the admin role.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild className="sm:min-w-52">
                  <Link href={buildMockAuthorizeHref("admin", redirectTo)}>
                    Continue as admin
                  </Link>
                </Button>
                {auth0Enabled ? (
                  <Button asChild className="sm:min-w-52" variant="outline">
                    <Link href={buildAuth0LoginHref(redirectTo)}>
                      Continue with Auth0
                    </Link>
                  </Button>
                ) : null}
                <Button asChild variant="outline">
                  <Link href="/books">Back to catalog</Link>
                </Button>
                {authenticated ? (
                  <Button asChild variant="ghost">
                    <Link
                      href={buildSignOutHref(
                        session,
                        `/admin/auth?redirectTo=${encodeURIComponent(redirectTo)}`,
                      )}
                    >
                      Clear mock session
                    </Link>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}