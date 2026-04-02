import {
  AdminEmptyState,
  AdminMetricStrip,
  AdminRowActions,
  AdminDetailSection,
  AdminStatusBadge,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
  AdminUserAvatar,
} from "@/components/admin";
import { Card, CardContent } from "@/components/ui/card";

import type { AdminUserRecord, AdminUsersMetric } from "./types";

function AdminUsersMetricGrid({
  metrics,
}: Readonly<{ metrics: ReadonlyArray<AdminUsersMetric> }>) {
  return (
    <AdminMetricStrip
      items={metrics.map((metric) => {
        const Icon = metric.icon;

        return {
          icon: <Icon aria-hidden="true" className="size-4" />,
          label: metric.label,
          supportingText: metric.supportingText,
          value: metric.value,
        };
      })}
    />
  );
}

function AdminUsersMobileList({
  records,
}: Readonly<{ records: ReadonlyArray<AdminUserRecord> }>) {
  return (
    <div className="grid gap-3 lg:hidden">
      {records.map((record) => (
        <Card key={record.id}>
          <CardContent className="grid gap-4 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <AdminUserAvatar
                name={record.name}
                subtitle={record.email}
                meta={`${record.plan} · ${record.branch}`}
              />
              <AdminStatusBadge
                label={record.statusLabel}
                tone={record.statusTone}
              />
            </div>

            <AdminDetailSection
              items={[
                { label: "Borrowing", value: record.activeLoans },
                { label: "Balance", value: record.balanceLabel },
                {
                  label: "Payment",
                  value: (
                    <AdminStatusBadge
                      label={record.paymentLabel}
                      tone={record.paymentTone}
                    />
                  ),
                },
              ]}
            />

            <AdminRowActions
              align="end"
              actions={[
                {
                  label: "Pause",
                  variant: "ghost",
                  confirm: {
                    title: `Pause ${record.name}'s access?`,
                    description:
                      "This mock confirmation keeps the admin member workflow ready for future policy actions.",
                    confirmLabel: "Pause access",
                  },
                },
              ]}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdminUsersDesktopTable({
  records,
}: Readonly<{ records: ReadonlyArray<AdminUserRecord> }>) {
  return (
    <div className="hidden lg:block">
      <AdminTable>
        <AdminTableHeader>
          <AdminTableRow>
            <AdminTableHead>Member</AdminTableHead>
            <AdminTableHead>Borrowing</AdminTableHead>
            <AdminTableHead>Balance</AdminTableHead>
            <AdminTableHead>Payment</AdminTableHead>
            <AdminTableHead>Status</AdminTableHead>
            <AdminTableHead className="text-right">Action</AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>
        <AdminTableBody>
          {records.map((record) => (
            <AdminTableRow key={record.id}>
              <AdminTableCell>
                <AdminUserAvatar
                  size="sm"
                  name={record.name}
                  subtitle={record.email}
                  meta={`${record.plan} · ${record.branch}`}
                />
              </AdminTableCell>
              <AdminTableCell className="text-body-sm text-text-secondary">
                {record.activeLoans}
              </AdminTableCell>
              <AdminTableCell className="text-body-sm text-text-secondary">
                {record.balanceLabel}
              </AdminTableCell>
              <AdminTableCell>
                <AdminStatusBadge
                  label={record.paymentLabel}
                  tone={record.paymentTone}
                />
              </AdminTableCell>
              <AdminTableCell>
                <AdminStatusBadge
                  label={record.statusLabel}
                  tone={record.statusTone}
                />
              </AdminTableCell>
              <AdminTableCell className="text-right">
                <AdminRowActions
                  align="end"
                  actions={[
                    {
                      label: "Pause",
                      variant: "ghost",
                      confirm: {
                        title: `Pause ${record.name}'s access?`,
                        description:
                          "This mock confirmation keeps the shared admin row action ready for future integration.",
                        confirmLabel: "Pause access",
                      },
                    },
                  ]}
                />
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}

function AdminUsersEmptyState() {
  return (
    <AdminEmptyState
      title="No members match the current filters"
      description="Adjust the member filter or search term. The admin users view is still powered by local mock data only."
    />
  );
}

export {
  AdminUsersDesktopTable,
  AdminUsersEmptyState,
  AdminUsersMetricGrid,
  AdminUsersMobileList,
};
