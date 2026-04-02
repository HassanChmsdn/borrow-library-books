import { LoadingSkeleton } from "@/components/feedback";
import { PageHeader } from "@/components/layout";

import {
  AdminCategoriesCards,
  AdminCategoriesPlanningList,
  AdminCategoriesTable,
} from "./components";
import { getAdminCategoriesModuleData } from "./hooks";

function AdminCategoriesModule() {
  const { planningItems, records } = getAdminCategoriesModuleData();

  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Collections"
        title="Category planning"
        description="A clean, tokenized view of category performance, shelf grouping, and curation tasks that fits the existing admin shell and prepares for future API-backed planning tools."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-title-sm text-foreground font-semibold">
              Category snapshot
            </h2>
            <p className="text-body-sm text-text-secondary">
              High-level category cards mirror the Figma hierarchy while staying
              reusable across other operations pages.
            </p>
          </div>
          <AdminCategoriesCards records={records} />
        </section>

        <AdminCategoriesPlanningList items={planningItems} />
      </div>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-title-sm text-foreground font-semibold">
            Category table
          </h2>
          <p className="text-body-sm text-text-secondary">
            A denser desktop summary for loan volume, fee visibility, and
            current category posture.
          </p>
        </div>
        <AdminCategoriesTable records={records} />
      </section>
    </div>
  );
}

function AdminCategoriesLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Collections"
        title="Category planning"
        description="Loading category planning surfaces."
      />
      <LoadingSkeleton count={4} variant="card" className="xl:grid-cols-4" />
      <LoadingSkeleton count={2} variant="table" className="xl:grid-cols-2" />
    </div>
  );
}

export { AdminCategoriesLoadingState, AdminCategoriesModule };
