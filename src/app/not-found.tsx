import { EmptyState } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { LinkButton } from "@/components/ui/link-button";
import { getI18n } from "@/lib/i18n/server";

export default async function NotFoundPage() {
  const { translateText } = await getI18n();

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow={translateText("Library")}
        title={translateText("Page not found")}
        description={translateText(
          "The page you requested does not exist, or the route is no longer available.",
        )}
      />

      <EmptyState
        title={translateText("This page is unavailable")}
        description={translateText(
          "Return to the catalog or continue from a known navigation path.",
        )}
        action={
          <LinkButton href="/books" size="sm" variant="outline">
            {translateText("Back to catalog")}
          </LinkButton>
        }
      />
    </div>
  );
}