"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AdminFilterSelect,
  AdminSectionCard,
  AdminStatusBadge,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import {
  APP_ADMIN_SECTION_VALUES,
  getAdminSectionLabel,
  getResolvedAdminSectionPermissions,
  getAppRoleDisplayLabel,
  roleAdminSectionDefaults,
  type AppAdminSection,
  type AppAdminSectionAccess,
  type AppAdminSectionPermission,
} from "@/lib/auth";

import { updateAdminAccessControlUserAction } from "./actions";
import type {
  AccessControlPermissionLevel,
  AdminAccessControlUserRecord,
} from "./types";

interface AdminAccessControlOverridesModuleProps {
  initialUsers: ReadonlyArray<AdminAccessControlUserRecord>;
}

function permissionLevelFromSectionPermission(
  permission: AppAdminSectionPermission | undefined,
): AccessControlPermissionLevel {
  if (!permission) {
    return "inherit";
  }

  if (permission.canManage) {
    return "manage";
  }

  if (permission.canAccess) {
    return "access";
  }

  return "none";
}

function createDraftLevelsFromSections(
  sections: AppAdminSectionAccess | undefined,
): Record<AppAdminSection, AccessControlPermissionLevel> {
  return APP_ADMIN_SECTION_VALUES.reduce((levels, section) => {
    levels[section] = permissionLevelFromSectionPermission(sections?.[section]);

    return levels;
  }, {} as Record<AppAdminSection, AccessControlPermissionLevel>);
}

function buildSectionsFromDraft(
  levels: Record<AppAdminSection, AccessControlPermissionLevel>,
) {
  const entries = APP_ADMIN_SECTION_VALUES.flatMap((section) => {
    const level = levels[section];

    if (level === "inherit") {
      return [];
    }

    if (level === "none") {
      return [[section, { canAccess: false, canManage: false }]];
    }

    if (level === "access") {
      return [[section, { canAccess: true, canManage: false }]];
    }

    return [[section, { canAccess: true, canManage: true }]];
  });

  return entries.length > 0
    ? (Object.fromEntries(entries) as AppAdminSectionAccess)
    : undefined;
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

function getPermissionTone(options: { canAccess: boolean; canManage: boolean }) {
  if (options.canManage) {
    return "success" as const;
  }

  if (options.canAccess) {
    return "info" as const;
  }

  return "neutral" as const;
}

const permissionLevelOptions: ReadonlyArray<{
  label: string;
  value: AccessControlPermissionLevel;
}> = [
  { label: "Inherit role default", value: "inherit" },
  { label: "No access", value: "none" },
  { label: "Access only", value: "access" },
  { label: "Access + manage", value: "manage" },
];

function AdminAccessControlOverridesModule({
  initialUsers,
}: Readonly<AdminAccessControlOverridesModuleProps>) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [selectedUserId, setSelectedUserId] = useState(initialUsers[0]?.id ?? "");
  const [draftLevels, setDraftLevels] = useState<Record<
    AppAdminSection,
    AccessControlPermissionLevel
  >>(() =>
    createDraftLevelsFromSections(initialUsers[0]?.access?.sections),
  );
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "danger" | "success";
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? users[0] ?? null,
    [selectedUserId, users],
  );

  function selectUser(nextUserId: string) {
    const nextUser = users.find((user) => user.id === nextUserId) ?? null;

    setSelectedUserId(nextUserId);
    setDraftLevels(createDraftLevelsFromSections(nextUser?.access?.sections));
    setFeedback(null);
  }

  const effectivePermissions = useMemo(() => {
    if (!selectedUser) {
      return undefined;
    }

    return getResolvedAdminSectionPermissions(
      selectedUser.role,
      selectedUser.access
        ? {
            ...selectedUser.access,
            sections: buildSectionsFromDraft(draftLevels),
          }
        : {
            sections: buildSectionsFromDraft(draftLevels),
          },
    );
  }, [draftLevels, selectedUser]);

  const hasChanges = useMemo(() => {
    if (!selectedUser) {
      return false;
    }

    const current = createDraftLevelsFromSections(selectedUser.access?.sections);

    return APP_ADMIN_SECTION_VALUES.some(
      (section) => current[section] !== draftLevels[section],
    );
  }, [draftLevels, selectedUser]);

  async function saveOverrides() {
    if (!selectedUser) {
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const result = await updateAdminAccessControlUserAction({
      sections: buildSectionsFromDraft(draftLevels),
      userId: selectedUser.id,
    });

    if (result.status === "success") {
      if (result.record) {
        setUsers((current) =>
          current.map((user) =>
            user.id === result.record?.id ? result.record : user,
          ),
        );
        setDraftLevels(createDraftLevelsFromSections(result.record.access?.sections));
      }

      setFeedback({ message: result.message, tone: "success" });
      router.refresh();
    } else {
      setFeedback({ message: result.message, tone: "danger" });
    }

    setIsSaving(false);
  }

  async function resetOverrides() {
    if (!selectedUser) {
      return;
    }

    setDraftLevels(createDraftLevelsFromSections(undefined));
    setIsSaving(true);
    setFeedback(null);

    const result = await updateAdminAccessControlUserAction({
      sections: undefined,
      userId: selectedUser.id,
    });

    if (result.status === "success") {
      if (result.record) {
        setUsers((current) =>
          current.map((user) =>
            user.id === result.record?.id ? result.record : user,
          ),
        );
        setDraftLevels(createDraftLevelsFromSections(result.record.access?.sections));
      }

      setFeedback({ message: result.message, tone: "success" });
      router.refresh();
    } else {
      setFeedback({ message: result.message, tone: "danger" });
    }

    setIsSaving(false);
  }

  if (!selectedUser) {
    return (
      <AdminSectionCard
        title="User overrides"
        description="No staff accounts are currently available for section override management."
      >
        <p className="text-body-sm text-text-secondary">
          Add or provision a staff identity first, then return here to configure user-specific section access.
        </p>
      </AdminSectionCard>
    );
  }

  return (
    <AdminSectionCard
      title="User-specific section overrides"
      description="Select a staff account and optionally override its inherited section permissions. Inherited values continue to follow the account role defaults."
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isSaving || !selectedUser.hasSectionOverrides}
            onClick={() => {
              void resetOverrides();
            }}
          >
            Clear overrides
          </Button>
          <Button
            size="sm"
            disabled={isSaving || !hasChanges}
            onClick={() => {
              void saveOverrides();
            }}
          >
            {isSaving ? "Saving..." : "Save overrides"}
          </Button>
        </div>
      }
    >
      {feedback ? (
        <div
          className={
            feedback.tone === "success"
              ? "rounded-card border border-success/25 bg-success/5 px-4 py-3"
              : "rounded-card border border-danger/25 bg-danger/5 px-4 py-3"
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

      <div className="grid gap-4 lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)]">
        <div className="grid gap-4">
          <AdminFilterSelect
            label="Staff account"
            options={users.map((user) => ({
              label: `${user.fullName} (${getAppRoleDisplayLabel(user.role)})`,
              value: user.id,
            }))}
            value={selectedUser.id}
            onValueChange={selectUser}
          />

          <div className="rounded-card border-border-subtle bg-elevated grid gap-3 border p-4">
            <div>
              <p className="text-body text-foreground font-medium">
                {selectedUser.fullName}
              </p>
              <p className="text-body-sm text-text-secondary mt-1">
                {selectedUser.email}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <AdminStatusBadge
                label={getAppRoleDisplayLabel(selectedUser.role)}
                tone="info"
              />
              <AdminStatusBadge
                label={selectedUser.status === "active" ? "Active" : "Suspended"}
                tone={selectedUser.status === "active" ? "success" : "warning"}
              />
              {selectedUser.hasSectionOverrides ? (
                <AdminStatusBadge label="Custom overrides" tone="info" />
              ) : (
                <AdminStatusBadge label="Role defaults only" tone="neutral" />
              )}
            </div>

            <p className="text-body-sm text-text-secondary">
              {selectedUser.subtitle}
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {APP_ADMIN_SECTION_VALUES.map((section) => {
            const permission = effectivePermissions?.[section];

            return (
              <div
                key={section}
                className="rounded-card border-border-subtle bg-background grid gap-3 border p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-body text-foreground font-medium">
                      {getAdminSectionLabel(section)}
                    </p>
                    <p className="text-body-sm text-text-secondary mt-1">
                      Role default: {formatPermissionSummary(
                        roleAdminSectionDefaults[selectedUser.role][section],
                      )}
                    </p>
                  </div>

                  {permission ? (
                    <AdminStatusBadge
                      label={`Effective: ${formatPermissionSummary(permission)}`}
                      tone={getPermissionTone(permission)}
                    />
                  ) : null}
                </div>

                <AdminFilterSelect
                  label="Override"
                  options={permissionLevelOptions}
                  value={draftLevels[section]}
                  onValueChange={(value) =>
                    setDraftLevels((current) => ({
                      ...current,
                      [section]: value,
                    }))
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </AdminSectionCard>
  );
}

export { AdminAccessControlOverridesModule };