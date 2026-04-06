import { MemberAuthPanel } from "@/components/auth/member-auth-panel";

import {
  buildAuth0LoginHref,
  getCurrentRole,
  getCurrentUser,
  sanitizeRedirectTo,
} from "@/lib/auth";
import { PageHeader } from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth/server";
import { isAuth0Configured } from "@/lib/auth/auth0";

interface SignInPageProps {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
}

export const metadata = {
  title: "Mock Sign In",
};

export default async function MockSignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const redirectTo = sanitizeRedirectTo(params.redirectTo, "/account/borrowings");
  const session = await getCurrentSession();
  const currentUser = getCurrentUser(session);
  const currentRole = getCurrentRole(session);
  const auth0Enabled = isAuth0Configured();

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Authentication"
        title="Member sign in"
        description="Use the mocked member access flow to continue into borrowing and account pages. This temporary UI stays intentionally close to a future Auth0 entry point without adding real backend authentication yet."
      />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
        <MemberAuthPanel
          auth0Enabled={auth0Enabled}
          auth0Href={buildAuth0LoginHref(redirectTo)}
          currentRole={currentRole}
          currentUserName={currentUser?.fullName ?? null}
          redirectTo={redirectTo}
        />
        <Card>
          <CardHeader>
            <CardTitle>Member access only</CardTitle>
            <CardDescription>
              This public authentication page is reserved for member account actions. Admin authentication remains available through the separate admin access route.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-2xl border border-dashed border-black/5 p-4">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Requested member destination
              </p>
              <p className="text-body text-foreground mt-2 font-medium break-all">
                {redirectTo}
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-black/5 p-4">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Mocked for now
              </p>
              <p className="text-body-sm text-text-secondary mt-2">
                Login and register currently create the same mocked member session. The form structure stays ready for future Auth0-backed credential handling.
              </p>
            </div>

            {auth0Enabled ? (
              <div className="rounded-2xl border border-dashed border-black/5 p-4">
                <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                  Auth0 path enabled
                </p>
                <p className="text-body-sm text-text-secondary mt-2">
                  This workspace has Auth0 configuration available, so members can also continue through the parallel Auth0 login route from the main form.
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}