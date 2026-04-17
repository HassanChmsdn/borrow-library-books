import { AdminPageHeader, AdminSectionCard } from "@/components/admin";
import {
  APP_ADMIN_SECTION_VALUES,
  APP_USER_ROLE_VALUES,
  getAdminSectionLabel,
  getAppRoleDisplayLabel,
  getCurrentUser,
  roleAdminSectionDefaults,
} from "@/lib/auth";
import { requireAdminSectionManagement } from "@/lib/auth/server";
import {
  AdminAccessControlOverridesModule,
  listAdminAccessControlUserRecords,
} from "@/modules/admin-access-control";

export const metadata = {
  title: "Access Control",
};

function formatPermissionSummary(options: {
  canAccess: boolean;
  canManage: boolean;
}) {
  if (options.canManage) {
    return "Access + manage";
  }

  if (options.canAccess) {
    return "Access only";
  }

  return "No access";
}

export default async function AdminAccessControlPage() {
  const session = await requireAdminSectionManagement(
    "accessControl",
    "/admin/settings/access-control",
  );
  const currentUser = getCurrentUser(session);
  const staffUsers = await listAdminAccessControlUserRecords();

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Governance"
        title="Access control"
        description="Roles remain the base authorization layer. Section-level permissions now resolve from role defaults and optional per-user overrides so access can be extended without rewriting the auth model."
      />

      <AdminSectionCard
        title="Current operator"
        description="The signed-in staff member below is authorized to manage access-control policy surfaces."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <p className="text-caption text-text-tertiary uppercase tracking-[0.18em]">
              Name
            </p>
            <p className="text-body-sm text-foreground mt-1 font-medium">
              {currentUser?.fullName ?? "Unknown staff member"}
            </p>
          </div>
          <div>
            <p className="text-caption text-text-tertiary uppercase tracking-[0.18em]">
              Account type
            </p>
            <p className="text-body-sm text-foreground mt-1 font-medium">
              {currentUser?.subtitle ?? "Staff account"}
            </p>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Role defaults"
        description="Each role resolves a default section policy first. These defaults can then be selectively overridden on individual user records through access.sections when needed."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {APP_USER_ROLE_VALUES.map((role) => (
            <div
              key={role}
              className="rounded-card border-border-subtle bg-elevated grid gap-3 border p-4"
            >
              <div>
                <p className="text-body text-foreground font-medium">
                  {getAppRoleDisplayLabel(role)}
                </p>
                <p className="text-body-sm text-text-secondary mt-1">
                  Default section policy resolved before any user-specific override is applied.
                </p>
              </div>

              <div className="grid gap-2">
                {APP_ADMIN_SECTION_VALUES.map((section) => {
                  const permission = roleAdminSectionDefaults[role][section];

                  return (
                    <div
                      key={`${role}-${section}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-transparent bg-background px-3 py-2"
                    >
                      <span className="text-body-sm text-foreground font-medium">
                        {getAdminSectionLabel(section)}
                      </span>
                      <span className="text-caption text-text-secondary">
                        {formatPermissionSummary(permission)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Per-user override shape"
        description="User-level overrides are now nested under access.sections so admins can fine-tune one area without replacing the user’s base role."
      >
        <div className="rounded-card border-border-subtle bg-elevated border p-4">
          <pre className="text-caption text-foreground overflow-x-auto whitespace-pre-wrap">
{`{
  sections: {
    books: { canAccess: true, canManage: true },
    financial: { canAccess: true, canManage: false },
    accessControl: { canAccess: false, canManage: false }
  }
}`}
          </pre>
        </div>
      </AdminSectionCard>

      <AdminAccessControlOverridesModule initialUsers={staffUsers} />
    </div>
  );
}