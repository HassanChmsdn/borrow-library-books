import { AdminPageHeader, AdminSectionCard } from "@/components/admin";
import { requireAuthorizedRoute } from "@/lib/auth/server";

export const metadata = {
  title: "Admin Financial",
};

export default async function AdminFinancialPage() {
  await requireAuthorizedRoute("/admin/financial");

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Financial"
        title="Financial operations"
        description="A dedicated workspace for fee intake, reconciliation, and future finance-specific workflows built on the shared staff shell."
      />

      <AdminSectionCard
        title="Finance section access is now policy-driven"
        description="Role defaults still define the baseline. Optional user-level access overrides can now narrow or expand the financial section without changing the user’s base role."
      >
        <p className="text-body-sm text-text-secondary">
          This route is intentionally lightweight for now. The important change is that it is protected by the same reusable section-permission resolver used by the rest of the admin workspace.
        </p>
      </AdminSectionCard>
    </div>
  );
}