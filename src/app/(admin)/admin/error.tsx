"use client";

import { useEffect } from "react";

import { AdminErrorState, AdminPageHeader } from "@/components/admin";
import { LinkButton } from "@/components/ui/link-button";
import { useI18n } from "@/lib/i18n";

interface AdminErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminErrorPage({
  error,
  reset,
}: Readonly<AdminErrorPageProps>) {
  const { translateText } = useI18n();

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
          <LinkButton href="/admin" size="sm" variant="outline">
            {translateText("Back to dashboard")}
          </LinkButton>
        }
      />

      <AdminErrorState
        title="Could not load this admin page"
        description={
          error.message ||
          "Try again now. If the problem persists, return to the dashboard and reload the affected management route later."
        }
        onRetry={reset}
        retryLabel={translateText("Try again")}
      />
    </div>
  );
}