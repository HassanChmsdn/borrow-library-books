import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import {
  buildMockAuthorizeHref,
  buildMockSignOutHref,
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
  const session = await getMockSession();

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Authentication"
        title="Admin access"
        description="This separate mocked access screen protects the admin workspace while keeping the public member sign-in page focused on borrowing and account flows."
      />

      <section className="mx-auto grid w-full max-w-(--layout-reading-max-width) gap-5">
        <Card>
          <CardHeader>
            <div className="bg-secondary text-primary flex size-11 items-center justify-center rounded-2xl">
              <ShieldCheck className="size-5" />
            </div>
            <CardTitle>Continue to the admin workspace</CardTitle>
            <CardDescription>
              This mocked action grants temporary admin access to the operations workspace and all nested management routes.
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
              <p className="text-body-sm text-text-secondary">
                Current session: {session.currentUser ? `${session.currentUser.fullName} (${session.currentRole})` : "Guest"}.
                Continuing here will replace any existing mocked session with the admin role.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="sm:min-w-48">
                <Link href={buildMockAuthorizeHref("admin", redirectTo)}>
                  Continue as admin
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/books">Back to catalog</Link>
              </Button>
              {session.isAuthenticated ? (
                <Button asChild variant="ghost">
                  <Link href={buildMockSignOutHref(`/auth/admin?redirectTo=${encodeURIComponent(redirectTo)}`)}>
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