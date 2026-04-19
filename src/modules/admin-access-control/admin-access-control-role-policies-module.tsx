"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AdminFilterSelect,
  AdminSectionCard,
  AdminStatusBadge,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import {
  APP_ADMIN_SECTION_VALUES,
  canManageAccessControlRolePolicy,
  getAdminSectionLabel,
  getAppRoleDisplayLabel,
  type AppAdminSection,
  type AppAdminSectionAccess,
} from "@/lib/auth";
import { useMockAuthContext } from "@/lib/auth/react";

import { updateAdminAccessControlRolePolicyAction } from "./actions";
import type { AdminAccessControlRolePolicyRecord } from "./types";

interface AdminAccessControlRolePoliciesModuleProps {
  initialRolePolicies: ReadonlyArray<AdminAccessControlRolePolicyRecord>;
}

type RolePolicyDraft = Record<
  AppAdminSection,
  {
    canAccess: boolean;
    canManage: boolean;
  }
>;

function createDraft(
  record: AdminAccessControlRolePolicyRecord | null | undefined,
): RolePolicyDraft {
  return APP_ADMIN_SECTION_VALUES.reduce((draft, section) => {
    draft[section] = {
      canAccess: record?.effectivePermissions[section].canAccess ?? false,
      canManage: record?.effectivePermissions[section].canManage ?? false,
    };

    return draft;
  }, {} as RolePolicyDraft);
}

function buildSectionsFromDraft(draft: RolePolicyDraft) {
  return Object.fromEntries(
    APP_ADMIN_SECTION_VALUES.map((section) => [
      section,
      {
        canAccess: draft[section].canAccess || draft[section].canManage,
        canManage: draft[section].canManage,
      },
    ]),
  ) as AppAdminSectionAccess;
}

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

function getPermissionTone(options: {
  canAccess: boolean;
  canManage: boolean;
}) {
  if (options.canManage) {
    return "success" as const;
  }

  if (options.canAccess) {
    return "info" as const;
  }

  return "neutral" as const;
}

function getDraftSignature(draft: RolePolicyDraft) {
  return JSON.stringify(
    APP_ADMIN_SECTION_VALUES.map((section) => [
      section,
      draft[section].canAccess,
      draft[section].canManage,
    ]),
  );
}

function AdminAccessControlRolePoliciesModule({
  initialRolePolicies,
}: Readonly<AdminAccessControlRolePoliciesModuleProps>) {
  const router = useRouter();
  const authState = useMockAuthContext();
  const [rolePolicies, setRolePolicies] = useState(initialRolePolicies);
  const [selectedRole, setSelectedRole] = useState(
    initialRolePolicies[0]?.role ?? "super_admin",
  );
  const visibleRolePolicies = useMemo(
    () =>
      rolePolicies.filter((record) =>
        canManageAccessControlRolePolicy(authState, record.role),
      ),
    [authState, rolePolicies],
  );
  const selectedPolicy = useMemo(
    () =>
      visibleRolePolicies.find((record) => record.role === selectedRole) ??
      visibleRolePolicies[0] ??
      null,
    [selectedRole, visibleRolePolicies],
  );
  const [draft, setDraft] = useState<RolePolicyDraft>(() =>
    createDraft(selectedPolicy),
  );
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "danger" | "success";
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setRolePolicies(initialRolePolicies);
  }, [initialRolePolicies]);

  useEffect(() => {
    if (!selectedPolicy && visibleRolePolicies[0]) {
      setSelectedRole(visibleRolePolicies[0].role);
    }
  }, [selectedPolicy, visibleRolePolicies]);

  useEffect(() => {
    setDraft(createDraft(selectedPolicy));
  }, [selectedPolicy]);

  const hasChanges = Boolean(
    selectedPolicy &&
    getDraftSignature(draft) !== getDraftSignature(createDraft(selectedPolicy)),
  );

  function resetDraft() {
    setDraft(createDraft(selectedPolicy));
    setFeedback(null);
  }

  async function saveRolePolicy() {
    if (!selectedPolicy) {
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const result = await updateAdminAccessControlRolePolicyAction({
      role: selectedPolicy.role,
      sections: buildSectionsFromDraft(draft),
    });

    if (result.status === "success") {
      if (result.record) {
        setRolePolicies((current) =>
          current.map((record) =>
            record.role === result.record?.role ? result.record : record,
          ),
        );
      }

      setFeedback({ message: result.message, tone: "success" });
      router.refresh();
    } else {
      setFeedback({ message: result.message, tone: "danger" });
    }

    setIsSaving(false);
  }

  async function restoreBaselineDefaults() {
    if (!selectedPolicy) {
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const result = await updateAdminAccessControlRolePolicyAction({
      role: selectedPolicy.role,
      sections: undefined,
    });

    if (result.status === "success") {
      if (result.record) {
        setRolePolicies((current) =>
          current.map((record) =>
            record.role === result.record?.role ? result.record : record,
          ),
        );
        setDraft(createDraft(result.record));
      }

      setFeedback({ message: result.message, tone: "success" });
      router.refresh();
    } else {
      setFeedback({ message: result.message, tone: "danger" });
    }

    setIsSaving(false);
  }

  if (!selectedPolicy) {
    return (
      <AdminSectionCard
        description="The current session cannot edit any role-level access-control defaults."
        title="Role access policies"
      >
        <p className="text-body-sm text-text-secondary">
          Review user-specific access only, or sign in with a session that has broader access-control authority.
        </p>
      </AdminSectionCard>
    );
  }

  return (
    <AdminSectionCard
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={isSaving}
            size="sm"
            variant="outline"
            onClick={() => {
              void restoreBaselineDefaults();
            }}
          >
            Restore baseline defaults
          </Button>
          <Button
            disabled={isSaving || !hasChanges}
            size="sm"
            variant="outline"
            onClick={resetDraft}
          >
            Reset draft
          </Button>
          <Button
            disabled={isSaving || !hasChanges}
            size="sm"
            onClick={() => {
              void saveRolePolicy();
            }}
          >
            {isSaving ? "Saving..." : "Save role defaults"}
          </Button>
        </div>
      }
      description="Adjust the default admin section access granted to each staff role before any user-specific override is applied."
      title="Role access policies"
    >
      {feedback ? (
        <div
          className={
            feedback.tone === "success"
              ? "rounded-card border-success/25 bg-success/5 border px-4 py-3"
              : "rounded-card border-danger/25 bg-danger/5 border px-4 py-3"
          }
          role="status"
        >
          <p
            className={
              feedback.tone === "success"
                ? "text-body-sm text-success font-medium"
                : "text-body-sm text-danger font-medium"
            }
          >
            {feedback.message}
          </p>
        </div>
      ) : null}

      <div className="grid gap-4">
        <AdminFilterSelect
          label="Staff role"
          options={visibleRolePolicies.map((record) => ({
            label: getAppRoleDisplayLabel(record.role),
            value: record.role,
          }))}
          value={selectedPolicy.role}
          onValueChange={setSelectedRole}
        />

        <div className="grid gap-3 xl:grid-cols-2">
          {APP_ADMIN_SECTION_VALUES.map((section) => {
            const permission = draft[section];
            const effectivePermission = {
              canAccess: permission.canAccess || permission.canManage,
              canManage: permission.canManage,
            };

            return (
              <div
                key={`${selectedPolicy.role}-${section}`}
                className="rounded-card border-border-subtle bg-background grid gap-4 border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-body text-foreground font-medium">
                      {getAdminSectionLabel(section)}
                    </p>
                    <p className="text-body-sm text-text-secondary mt-1">
                      Configure the default access granted to the{" "}
                      {getAppRoleDisplayLabel(selectedPolicy.role)} role.
                    </p>
                  </div>
                  <AdminStatusBadge
                    label={formatPermissionSummary(effectivePermission)}
                    tone={getPermissionTone(effectivePermission)}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <label className="text-body-sm text-foreground flex items-center gap-2">
                    <input
                      checked={permission.canAccess || permission.canManage}
                      className="border-input size-4 rounded"
                      type="checkbox"
                      onChange={(event) => {
                        const checked = event.target.checked;

                        setDraft((current) => ({
                          ...current,
                          [section]: {
                            canAccess: checked,
                            canManage: checked
                              ? current[section].canManage
                              : false,
                          },
                        }));
                      }}
                    />
                    Access
                  </label>

                  <label className="text-body-sm text-foreground flex items-center gap-2">
                    <input
                      checked={permission.canManage}
                      className="border-input size-4 rounded"
                      type="checkbox"
                      onChange={(event) => {
                        const checked = event.target.checked;

                        setDraft((current) => ({
                          ...current,
                          [section]: {
                            canAccess: checked || current[section].canAccess,
                            canManage: checked,
                          },
                        }));
                      }}
                    />
                    Manage
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminSectionCard>
  );
}

export { AdminAccessControlRolePoliciesModule };
