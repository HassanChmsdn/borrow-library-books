import { AdminPageHeader, AdminSectionCard } from "@/components/admin";
import { getAppRoleDisplayLabel, getCurrentUser } from "@/lib/auth";
import { requireAuthorizedRoute } from "@/lib/auth/server";
import {
  AdminAccessControlRolePoliciesModule,
  AdminAccessControlOverridesModule,
  listAdminAccessControlRolePolicyRecords,
  listAdminAccessControlUserRecords,
} from "@/modules/admin-access-control";

export const metadata = {
  title: "Access Management",
};

export default async function AdminAccessControlPage() {
  const session = await requireAuthorizedRoute(
    "/admin/settings/access-control",
  );
  const currentUser = getCurrentUser(session);
  const [rolePolicies, users] = await Promise.all([
    listAdminAccessControlRolePolicyRecords(),
    listAdminAccessControlUserRecords(),
  ]);

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Governance"
        title="Access management"
        description="Manage staff role defaults and per-user section access from one surface. Only staff sessions with explicit access-control permission can reach this page, and super-admin remains the highest-privilege role for protected changes."
      />

      <AdminSectionCard
        title="Current operator"
        description="The signed-in operator below is authorized to manage role assignment and section access policy surfaces."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <p className="text-caption text-text-tertiary tracking-[0.18em] uppercase">
              Name
            </p>
            <p className="text-body-sm text-foreground mt-1 font-medium">
              {currentUser?.fullName ?? "Unknown staff member"}
            </p>
          </div>
          <div>
            <p className="text-caption text-text-tertiary tracking-[0.18em] uppercase">
              Authorized role
            </p>
            <p className="text-body-sm text-foreground mt-1 font-medium">
              {currentUser
                ? getAppRoleDisplayLabel(currentUser.role)
                : "Staff account"}
            </p>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Policy model"
        description="Role defaults resolve first. User-specific section access is then applied as an optional override through access.sections, which keeps the model ready for persisted Mongo-backed authorization without changing the admin shell structure."
      >
        <div className="rounded-card border-border-subtle bg-elevated border p-4">
          <pre className="text-caption text-foreground overflow-x-auto whitespace-pre-wrap">
            {`{
  role: "employee",
  sections: {
    books: { canAccess: true, canManage: true },
    financial: { canAccess: true, canManage: false },
    accessControl: { canAccess: false, canManage: false }
  }
}`}
          </pre>
        </div>
      </AdminSectionCard>

      <AdminAccessControlRolePoliciesModule
        initialRolePolicies={rolePolicies}
      />

      <AdminAccessControlOverridesModule
        initialRolePolicies={rolePolicies}
        initialUsers={users}
      />
    </div>
  );
}
