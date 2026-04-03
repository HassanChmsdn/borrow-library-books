"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { EmptyState } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";

interface PublicErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PublicErrorPage({
  error,
  reset,
}: Readonly<PublicErrorPageProps>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Library"
        title="Public view unavailable"
        description="A route-level error interrupted this member-facing screen. You can retry the page or return to the main library overview."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/">Back to overview</Link>
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
          "Try again now. If the problem persists, return to the main library overview and reopen the affected page."
        }
        icon={<TriangleAlert className="size-5" />}
        title="We couldn't load this page"
      />
    </div>
  );
}