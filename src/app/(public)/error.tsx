"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

import { EmptyState } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { useI18n } from "@/lib/i18n";

interface PublicErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PublicErrorPage({
  error,
  reset,
}: Readonly<PublicErrorPageProps>) {
  const { translateText } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Library"
        title="Public view unavailable"
        description="A route-level error interrupted this member-facing screen. You can retry the page or return to the public catalog."
        actions={
          <LinkButton href="/books" size="sm" variant="outline">
            Back to catalog
          </LinkButton>
        }
      />

      <EmptyState
        action={
          <Button onClick={reset} type="button">
            {translateText("Try again")}
          </Button>
        }
        description={
          (error.message ? translateText(error.message) : null) ||
          "Try again now. If the problem persists, return to the public catalog and reopen the affected page."
        }
        icon={<TriangleAlert className="size-5" />}
        title="We couldn't load this page"
      />
    </div>
  );
}