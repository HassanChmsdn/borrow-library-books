"use client";

import { LoadingSkeleton } from "@/components/feedback";
import { PageHeader } from "@/components/layout";

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
      <PageHeader
        eyebrow="Stock"
        title="Inventory management"
        description="Track shelf health, low-stock titles, and branch readiness using the same table, card, and badge system as the rest of the admin workspace."
      >
        <div className="rounded-card border-border-subtle bg-card grid gap-4 border p-4 shadow-xs sm:p-5 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="space-y-1">
            <p className="text-title-sm text-foreground font-semibold">
              Branch filter
            </p>
            <p className="text-body-sm text-text-secondary">
              Narrow the inventory view without changing the visual language or
              the future data boundary.
            </p>
          </div>
          <label className="grid gap-1.5">
            <span className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
              Branch
            </span>
            <select
              className="rounded-input border-input bg-card text-body text-foreground focus-visible:border-border-strong focus-visible:bg-elevated focus-visible:ring-ring h-11 w-full border px-4 shadow-xs outline-none focus-visible:ring-4"
              value={activeBranch}
              onChange={(event) =>
                setActiveBranch(event.target.value as typeof activeBranch)
              }
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </label>
        </div>
      </PageHeader>

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

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-title-sm text-foreground font-semibold">
            Restock table
          </h2>
          <p className="text-body-sm text-text-secondary">
            Desktop-optimized for dense review while remaining readable on
            narrower screens through the shared table shell.
          </p>
        </div>
        <AdminInventoryTable records={records} />
      </section>
    </div>
  );
}

function AdminInventoryLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
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
