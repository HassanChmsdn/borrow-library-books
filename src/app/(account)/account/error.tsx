"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { EmptyState } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";

interface AccountErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AccountErrorPage({
  error,
  reset,
}: Readonly<AccountErrorPageProps>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Account"
        title="Account view unavailable"
        description="A route-level error interrupted this authenticated member screen. You can retry the page or return to your borrowing workspace."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/account/borrowings">Back to account</Link>
          </Button>
        }
      />

      <EmptyState
        action={
          <Button onClick={reset} type="button">
            Try again
          </Button>
        }
        description={
          error.message ||
          "Try again now. If the problem persists, return to your borrowing workspace and reopen the affected page."
        }
        icon={<TriangleAlert className="size-5" />}
        title="We couldn't load this account page"
      />
    </div>
  );
}