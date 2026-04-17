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
  APP_USER_ROLE_VALUES,
  createEmptyResolvedAdminSectionPermissions,
  getAdminSectionLabel,
  getAppRoleDisplayLabel,
  getResolvedAdminSectionPermissionsForDefaults,
  hasAdminAccessRole,
  type AppAdminSection,
  type AppAdminSectionAccess,
  type AppUserRole,
  type ResolvedAppSectionPermissions,
} from "@/lib/auth";

import { updateAdminAccessControlUserAction } from "./actions";
import type {
  AdminAccessControlRolePolicyRecord,
  AdminAccessControlUserRecord,
} from "./types";

interface AdminAccessControlOverridesModuleProps {
  initialRolePolicies: ReadonlyArray<AdminAccessControlRolePolicyRecord>;
  initialUsers: ReadonlyArray<AdminAccessControlUserRecord>;
}

type SectionToggleDraft = Record<
  AppAdminSection,
  {
    canAccess: boolean;
    canManage: boolean;
    inherit: boolean;
  }
>;

function createRolePolicyMap() {
  return APP_USER_ROLE_VALUES.reduce(
    (map, role) => {
      map[role] = createEmptyResolvedAdminSectionPermissions();

      return map;
    },
    {} as Record<AppUserRole, ResolvedAppSectionPermissions>,
  );
}

function mergeRolePolicies(
  rolePolicies: ReadonlyArray<AdminAccessControlRolePolicyRecord>,
) {
  const map = createRolePolicyMap();

  for (const record of rolePolicies) {
    map[record.role] = record.effectivePermissions;
  }

  return map;
}

function createDraftFromSections(
  sections: AppAdminSectionAccess | undefined,
): SectionToggleDraft {
  return APP_ADMIN_SECTION_VALUES.reduce((draft, section) => {
    const permission = sections?.[section];

    draft[section] = {
      canAccess:
        permission?.canAccess === true || permission?.canManage === true,
      canManage: permission?.canManage === true,
      inherit: !permission,
    };

    return draft;
  }, {} as SectionToggleDraft);
}

function buildSectionsFromDraft(draft: SectionToggleDraft) {
  const entries = APP_ADMIN_SECTION_VALUES.flatMap((section) => {
    const permission = draft[section];

    if (permission.inherit) {
      return [];
    }

    return [
      [
        section,
        {
          canAccess: permission.canAccess || permission.canManage,
          canManage: permission.canManage,
        },
      ],
    ];
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

function getSectionsSignature(sections: AppAdminSectionAccess | undefined) {
  return JSON.stringify(
    APP_ADMIN_SECTION_VALUES.map((section) => {
      const permission = sections?.[section];

      return [
        section,
        permission?.canAccess === true,
        permission?.canManage === true,
      ];
    }),
  );
}

function AccessToggleRow(props: {
  defaultPermission: { canAccess: boolean; canManage: boolean };
  draft: SectionToggleDraft[AppAdminSection];
  isDisabled: boolean;
  onAccessChange: (checked: boolean) => void;
  onInheritChange: (checked: boolean) => void;
  onManageChange: (checked: boolean) => void;
  section: AppAdminSection;
}) {
  const {
    defaultPermission,
    draft,
    isDisabled,
    onAccessChange,
    onInheritChange,
    onManageChange,
    section,
  } = props;
  const effectivePermission = draft.inherit
    ? defaultPermission
    : {
        canAccess: draft.canAccess || draft.canManage,
        canManage: draft.canManage,
      };

  return (
    <div className="rounded-card border-border-subtle bg-background grid gap-4 border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-body text-foreground font-medium">
            {getAdminSectionLabel(section)}
          </p>
          <p className="text-body-sm text-text-secondary mt-1">
            Role default: {formatPermissionSummary(defaultPermission)}
          </p>
        </div>
        <AdminStatusBadge
          label={`Effective: ${formatPermissionSummary(effectivePermission)}`}
          tone={getPermissionTone(effectivePermission)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="text-body-sm text-foreground flex items-center gap-2">
          <input
            checked={isDisabled ? true : draft.inherit}
            className="border-input size-4 rounded"
            disabled={isDisabled}
            type="checkbox"
            onChange={(event) => onInheritChange(event.target.checked)}
          />
          Use role default
        </label>

        <label className="text-body-sm text-foreground flex items-center gap-2">
          <input
            checked={
              draft.inherit
                ? defaultPermission.canAccess
                : draft.canAccess || draft.canManage
            }
            className="border-input size-4 rounded"
            disabled={isDisabled || draft.inherit}
            type="checkbox"
            onChange={(event) => onAccessChange(event.target.checked)}
          />
          Access
        </label>

        <label className="text-body-sm text-foreground flex items-center gap-2">
          <input
            checked={
              draft.inherit ? defaultPermission.canManage : draft.canManage
            }
            className="border-input size-4 rounded"
            disabled={isDisabled || draft.inherit}
            type="checkbox"
            onChange={(event) => onManageChange(event.target.checked)}
          />
          Manage
        </label>
      </div>
    </div>
  );
}

function AdminAccessControlOverridesModule({
  initialRolePolicies,
  initialUsers,
}: Readonly<AdminAccessControlOverridesModuleProps>) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [rolePolicies, setRolePolicies] = useState(() =>
    mergeRolePolicies(initialRolePolicies),
  );
  const [selectedUserId, setSelectedUserId] = useState(
    initialUsers[0]?.id ?? "",
  );
  const [draftRole, setDraftRole] = useState<AppUserRole>(
    initialUsers[0]?.role ?? "member",
  );
  const [draftSections, setDraftSections] = useState<SectionToggleDraft>(() =>
    createDraftFromSections(initialUsers[0]?.access?.sections),
  );
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "danger" | "success";
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    setRolePolicies(mergeRolePolicies(initialRolePolicies));
  }, [initialRolePolicies]);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? users[0] ?? null,
    [selectedUserId, users],
  );

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    setDraftRole(selectedUser.role);
    setDraftSections(createDraftFromSections(selectedUser.access?.sections));
  }, [selectedUser]);

  const isStaffRole = hasAdminAccessRole(draftRole);
  const builtSections = isStaffRole
    ? buildSectionsFromDraft(draftSections)
    : undefined;
  const effectivePermissions = getResolvedAdminSectionPermissionsForDefaults(
    draftRole,
    rolePolicies,
    builtSections ? { sections: builtSections } : undefined,
  );
  const hasChanges = Boolean(
    selectedUser &&
    (draftRole !== selectedUser.role ||
      getSectionsSignature(builtSections) !==
        getSectionsSignature(selectedUser.access?.sections)),
  );

  function selectUser(nextUserId: string) {
    setSelectedUserId(nextUserId);
    setFeedback(null);
  }

  function resetDraft() {
    if (!selectedUser) {
      return;
    }

    setDraftRole(selectedUser.role);
    setDraftSections(createDraftFromSections(selectedUser.access?.sections));
    setFeedback(null);
  }

  async function saveChanges() {
    if (!selectedUser) {
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const result = await updateAdminAccessControlUserAction({
      role: draftRole,
      sections: builtSections,
      userId: selectedUser.id,
    });

    if (result.status === "success") {
      if (result.record) {
        setUsers((current) =>
          current.map((user) =>
            user.id === result.record?.id ? result.record : user,
          ),
        );
        setDraftRole(result.record.role);
        setDraftSections(
          createDraftFromSections(result.record.access?.sections),
        );
      }

      setFeedback({ message: result.message, tone: "success" });
      router.refresh();
    } else {
      setFeedback({ message: result.message, tone: "danger" });
    }

    setIsSaving(false);
  }

  async function clearCustomAccess() {
    if (!selectedUser) {
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const result = await updateAdminAccessControlUserAction({
      role: draftRole,
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
        setDraftRole(result.record.role);
        setDraftSections(
          createDraftFromSections(result.record.access?.sections),
        );
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
        description="No accounts are currently available for access management."
        title="User access management"
      >
        <p className="text-body-sm text-text-secondary">
          Add or provision an account first, then return here to assign roles
          and section access.
        </p>
      </AdminSectionCard>
    );
  }

  return (
    <AdminSectionCard
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={isSaving || !selectedUser.hasSectionOverrides}
            size="sm"
            variant="outline"
            onClick={() => {
              void clearCustomAccess();
            }}
          >
            Clear custom access
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
              void saveChanges();
            }}
          >
            {isSaving ? "Saving..." : "Save user access"}
          </Button>
        </div>
      }
      description="Assign roles to individual accounts and optionally layer user-specific section permissions on top of the selected role defaults."
      title="User access management"
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

      <div className="grid gap-4 lg:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)]">
        <div className="grid gap-4">
          <AdminFilterSelect
            label="User account"
            options={users.map((user) => ({
              label: `${user.fullName} (${getAppRoleDisplayLabel(user.role)})`,
              value: user.id,
            }))}
            value={selectedUser.id}
            onValueChange={selectUser}
          />

          <AdminFilterSelect
            label="Assigned role"
            options={APP_USER_ROLE_VALUES.map((role) => ({
              label: getAppRoleDisplayLabel(role),
              value: role,
            }))}
            value={draftRole}
            onValueChange={(value) => {
              setDraftRole(value);
              if (!hasAdminAccessRole(value)) {
                setDraftSections(createDraftFromSections(undefined));
              }
            }}
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
                label={getAppRoleDisplayLabel(draftRole)}
                tone="info"
              />
              <AdminStatusBadge
                label={
                  selectedUser.status === "active" ? "Active" : "Suspended"
                }
                tone={selectedUser.status === "active" ? "success" : "warning"}
              />
              {builtSections ? (
                <AdminStatusBadge label="Custom section access" tone="info" />
              ) : (
                <AdminStatusBadge label="Role defaults only" tone="neutral" />
              )}
            </div>

            <p className="text-body-sm text-text-secondary">
              {selectedUser.subtitle}
            </p>

            {!isStaffRole ? (
              <p className="text-body-sm text-text-secondary border-border-subtle rounded-lg border border-dashed px-3 py-2">
                Member accounts do not receive admin workspace sections. Saving
                this role clears any existing admin section overrides.
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3">
          {APP_ADMIN_SECTION_VALUES.map((section) => (
            <AccessToggleRow
              key={section}
              defaultPermission={rolePolicies[draftRole][section]}
              draft={draftSections[section]}
              isDisabled={!isStaffRole}
              section={section}
              onAccessChange={(checked) => {
                setDraftSections((current) => ({
                  ...current,
                  [section]: {
                    ...current[section],
                    canAccess: checked,
                    canManage: checked ? current[section].canManage : false,
                  },
                }));
              }}
              onInheritChange={(checked) => {
                setDraftSections((current) => ({
                  ...current,
                  [section]: {
                    ...current[section],
                    inherit: checked,
                  },
                }));
              }}
              onManageChange={(checked) => {
                setDraftSections((current) => ({
                  ...current,
                  [section]: {
                    ...current[section],
                    canAccess: checked || current[section].canAccess,
                    canManage: checked,
                  },
                }));
              }}
            />
          ))}

          <div className="rounded-card border-border-subtle bg-elevated grid gap-2 border p-4">
            <p className="text-body text-foreground font-medium">
              Effective access summary
            </p>
            <div className="flex flex-wrap gap-2">
              {APP_ADMIN_SECTION_VALUES.map((section) => (
                <AdminStatusBadge
                  key={`summary-${section}`}
                  label={`${getAdminSectionLabel(section)}: ${formatPermissionSummary(
                    effectivePermissions[section],
                  )}`}
                  tone={getPermissionTone(effectivePermissions[section])}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminSectionCard>
  );
}

export { AdminAccessControlOverridesModule };
