"use client";

import { useEffect } from "react";
import Link from "next/link";

import { AdminErrorState, AdminPageHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";

interface AdminErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminErrorPage({
  error,
  reset,
}: Readonly<AdminErrorPageProps>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Admin"
        title="Admin view unavailable"
        description="A route-level error interrupted this admin screen. The surrounding admin shell is still active, so you can retry or return to another management area."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/admin">Back to dashboard</Link>
          </Button>
        }
      />

      <AdminErrorState
        title="Could not load this admin page"
        description={
          error.message ||
          "Try again now. If the problem persists, return to the dashboard and reload the affected management route later."
        }
        onRetry={reset}
      />
    </div>
  );
}