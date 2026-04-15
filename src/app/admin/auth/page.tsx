import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import {
  isAdmin,
  sanitizeRedirectTo,
} from "@/lib/auth";
import { PageHeader, ShellBrand } from "@/components/layout";
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
  const auth0Enabled = isAuth0Configured();

  if (isAdmin(session)) {
    redirect(redirectTo);
  }

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="flex items-start justify-between gap-6">
          <ShellBrand
            href="/books"
            monogram="BL"
            subtitle="Admin Console"
            title="Borrow Library Books"
          />
        </div>

        <div className="gap-section flex flex-col">
          <PageHeader
            eyebrow="Restricted Access"
            title="Admin sign in"
            description="Continue with an authorized admin identity to open the operations workspace and protected management routes."
          />

          <section style={{ maxWidth: "var(--layout-reading-max-width)" }}>
          <Card>
            <CardHeader>
              <div className="bg-secondary text-primary flex size-11 items-center justify-center rounded-2xl">
                <ShieldCheck className="size-5" />
              </div>
              <CardTitle>Admin workspace access</CardTitle>
              <CardDescription>
                Authentication is completed on the secure Auth0 page. Only users with an authorized admin role can enter this workspace.
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
                <p className="text-body-sm text-text-secondary mt-2">
                  If you are redirected here from a protected admin route, sign in with the admin account that should access that destination.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild className="sm:min-w-52">
                  <a href={buildAuth0LoginHref(redirectTo)}>
                    Continue to admin login
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/books">Back to catalog</Link>
                </Button>
              </div>

              {!auth0Enabled ? (
                <div className="rounded-2xl border border-danger/20 bg-danger-surface px-4 py-3">
                  <p className="text-body-sm text-danger font-medium">
                    Admin authentication is unavailable until Auth0 is configured for this environment.
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