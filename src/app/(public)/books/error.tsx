"use client";

import { TriangleAlert } from "lucide-react";

import { EmptyState } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function AllBooksError({
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const { translateText } = useI18n();

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Catalog"
        title="All Books"
        description="Discover and borrow from the full library catalog."
      />

      <EmptyState
        action={
          <Button onClick={reset} type="button">
            {translateText("Try again")}
          </Button>
        }
        description="The mock catalog could not be rendered. Retry the page and, if it persists, inspect the local module data before wiring a backend."
        icon={<TriangleAlert className="size-5" />}
        title="We couldn't load the catalog"
      />
    </div>
  );
}
