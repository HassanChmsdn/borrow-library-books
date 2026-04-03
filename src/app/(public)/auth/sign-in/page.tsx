import Link from "next/link";
import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";

import {
  buildMockAuthorizeHref,
  buildMockSignOutHref,
  getDefaultRedirectForRole,
  sanitizeRedirectTo,
} from "@/lib/auth/mock-auth";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMockSession } from "@/server/auth/mock-session";

interface SignInPageProps {
  searchParams: Promise<{
    redirectTo?: string;
    role?: string;
  }>;
}

export const metadata = {
  title: "Mock Sign In",
};

export default async function MockSignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const roleHint = params.role === "admin" ? "admin" : "member";
  const redirectTo = sanitizeRedirectTo(
    params.redirectTo,
    getDefaultRedirectForRole(roleHint),
  );
  const session = await getMockSession();

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Authentication"
        title="Mock sign in"
        description="This project uses a temporary cookie-based session with guest, member, and admin states so public browsing, member borrowing flows, and admin routes can be separated cleanly before Auth0 and MongoDB are integrated."
      />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="bg-secondary text-primary flex size-11 items-center justify-center rounded-2xl">
                <UserRound className="size-5" />
              </div>
              <CardTitle>Continue as member</CardTitle>
              <CardDescription>
                Opens authenticated borrowing and account routes while keeping public catalog browsing available.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <p className="text-body-sm text-text-secondary">
                Member access covers `/account/borrowings` and `/account/profile`.
              </p>
              <Button asChild>
                <Link href={buildMockAuthorizeHref("member", redirectTo)}>
                  Continue as member
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="bg-secondary text-primary flex size-11 items-center justify-center rounded-2xl">
                <ShieldCheck className="size-5" />
              </div>
              <CardTitle>Continue as admin</CardTitle>
              <CardDescription>
                Opens protected management routes for catalog, inventory, borrowing, categories, and users.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <p className="text-body-sm text-text-secondary">
                Admin access covers `/admin` and all nested management pages.
              </p>
              <Button asChild variant={roleHint === "admin" ? "default" : "outline"}>
                <Link href={buildMockAuthorizeHref("admin", redirectTo)}>
                  Continue as admin
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Session details</CardTitle>
            <CardDescription>
              These controls only manage a temporary mock cookie and will be replaced by real identity flows later.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-2xl border border-dashed border-black/5 p-4">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Requested destination
              </p>
              <p className="text-body text-foreground mt-2 font-medium break-all">
                {redirectTo}
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-black/5 p-4">
              <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
                Current session
              </p>
              <p className="text-body text-foreground mt-2 font-medium">
                {session.currentUser
                  ? `${session.currentUser.fullName} (${session.currentRole})`
                  : "Guest browsing only"}
              </p>
              <p className="text-body-sm text-text-secondary mt-1">
                {session.currentUser
                  ? session.currentUser.email
                  : "Borrowing/account and admin routes will redirect here until a mock role is selected."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="ghost">
                <Link href="/books">Keep browsing</Link>
              </Button>
              {session.isAuthenticated ? (
                <Button asChild size="sm" variant="outline">
                  <Link href={buildMockSignOutHref(`/auth/sign-in?role=${roleHint}&redirectTo=${encodeURIComponent(redirectTo)}`)}>
                    Clear mock session
                  </Link>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}