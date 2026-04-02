"use client";

import {
  AdminDataTable,
  AdminFilterSelect,
  AdminPageHeader,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";

import {
  AdminInventoryAlerts,
  AdminInventoryBranchGrid,
  AdminInventoryTable,
} from "./components";
import { useAdminInventoryModuleState } from "./hooks";

function AdminInventoryModule() {
  const {
    activeBranch,
    alerts,
    branches,
    branchCards,
    records,
    setActiveBranch,
  } = useAdminInventoryModuleState();

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Stock"
        title="Inventory management"
        description="Track shelf health, low-stock titles, and branch readiness using the same table, card, and badge system as the rest of the admin workspace."
        controls={
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-end">
            <div className="space-y-1">
              <p className="text-title-sm text-foreground font-semibold">
                Branch filter
              </p>
              <p className="text-body-sm text-text-secondary">
                Narrow the inventory view without changing the visual language
                or the future data boundary.
              </p>
            </div>
            <AdminFilterSelect
              label="Branch"
              options={branches.map((branch) => ({
                label: branch,
                value: branch,
              }))}
              value={activeBranch}
              onValueChange={setActiveBranch}
            />
          </div>
        }
      ></AdminPageHeader>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-title-sm text-foreground font-semibold">
              Branch health
            </h2>
            <p className="text-body-sm text-text-secondary">
              Branch summary cards reflect the Figma hierarchy while keeping the
              implementation token-driven and reusable.
            </p>
          </div>
          <AdminInventoryBranchGrid items={branchCards} />
        </section>

        <AdminInventoryAlerts alerts={alerts} />
      </div>

      <AdminDataTable
        title="Restock table"
        description="Desktop-optimized for dense review while remaining readable on narrower screens through the shared table shell."
      >
        <AdminInventoryTable records={records} />
      </AdminDataTable>
    </div>
  );
}

function AdminInventoryLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Stock"
        title="Inventory management"
        description="Loading inventory surfaces."
      />
      <LoadingSkeleton count={4} variant="card" className="xl:grid-cols-4" />
      <LoadingSkeleton count={2} variant="table" className="xl:grid-cols-2" />
    </div>
  );
}

export { AdminInventoryLoadingState, AdminInventoryModule };
