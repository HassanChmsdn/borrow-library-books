"use client";

import { ArrowLeft } from "lucide-react";

import {
  AdminDetailSection,
  AdminEmptyState,
  AdminMetricStrip,
  AdminPageHeader,
  AdminSectionCard,
  AdminStatusBadge,
  AdminUserAvatar,
} from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { LinkButton } from "@/components/ui/link-button";
import { useI18n } from "@/lib/i18n";
import { translateAdminActivityText } from "@/modules/admin-shared/i18n";
import { UserRoleBadge, UserStatusBadge } from "@/modules/admin-users/components";

import type { AdminProfileModuleProps } from "./types";

function AdminProfileModule({
  profile,
  isLoading = false,
}: Readonly<AdminProfileModuleProps>) {
  const { translateText } = useI18n();

  if (isLoading) {
    return <AdminProfileLoadingState />;
  }

  if (!profile) {
    return <AdminProfileEmptyState />;
  }

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Admin profile"
        title={profile.fullName}
        description="Review the currently authenticated admin account, workspace scope, and recent operating activity."
        actions={
          <LinkButton href="/admin" size="sm" variant="outline">
            <ArrowLeft className="size-4" />
            {translateText("Back to dashboard")}
          </LinkButton>
        }
        controls={
          <div className="flex flex-wrap items-center gap-2">
            <UserRoleBadge role={profile.role} />
            <UserStatusBadge status={profile.status} />
          </div>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:items-start">
        <div className="grid gap-5">
          <AdminSectionCard
            title="Profile summary"
            description="Current admin identity details derived from the mocked authenticated session."
          >
            <div className="grid gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <AdminUserAvatar
                  name={profile.fullName}
                  subtitle={profile.email}
                  meta={profile.subtitle}
                />
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <UserRoleBadge role={profile.role} />
                  <UserStatusBadge status={profile.status} />
                </div>
              </div>

              <AdminDetailSection
                columns={2}
                className="sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2"
                items={profile.detailItems}
              />
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="Account summary"
            description="A compact workspace snapshot tied to the current admin session."
          >
            <AdminMetricStrip
              columnsClassName="sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3"
              items={profile.metrics}
            />
            <p className="text-body-sm text-text-secondary">
              {translateText(profile.accountSummaryNote)}
            </p>
          </AdminSectionCard>
        </div>

        <AdminSectionCard
          title="Recent workspace activity"
          description="The latest mocked operational changes surfaced for the active admin workspace."
        >
          <div className="grid gap-3">
            {profile.recentActivity.map((item) => (
              <div
                key={item.id}
                className="rounded-card border-border-subtle bg-elevated grid gap-2 border px-4 py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="text-body-sm text-foreground font-medium">
                      {translateText(item.title)}
                    </p>
                    <p className="text-body-sm text-text-secondary text-pretty">
                      {translateAdminActivityText(item.description, translateText)}
                    </p>
                  </div>
                  <AdminStatusBadge label={item.statusLabel} tone={item.statusTone} />
                </div>
                <p className="text-caption text-text-tertiary tracking-[0.16em] uppercase">
                  {translateText(item.occurredLabel)}
                </p>
              </div>
            ))}
          </div>
        </AdminSectionCard>
      </section>
    </div>
  );
}

function AdminProfileEmptyState() {
  const { translateText } = useI18n();

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Admin profile"
        title="Current account"
        description="The authenticated admin profile could not be prepared from the current mocked session."
      />

      <AdminEmptyState
        title="Profile unavailable"
        description="Try returning to the dashboard and reopening the profile page. The page is wired for future Auth0 and Mongo-backed account data, but it currently depends on the mocked admin session."
        action={
          <LinkButton href="/admin">{translateText("Back to dashboard")}</LinkButton>
        }
      />
    </div>
  );
}

function AdminProfileLoadingState() {
  const { translateText } = useI18n();

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow={translateText("Admin profile")}
        title={translateText("Current account")}
        description={translateText("Loading the authenticated admin summary, account details, and recent workspace activity.")}
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
        <div className="grid gap-5">
          <LoadingSkeleton count={2} variant="card" />
        </div>
        <LoadingSkeleton count={1} variant="card" />
      </section>
    </div>
  );
}

export {
  AdminProfileEmptyState,
  AdminProfileLoadingState,
  AdminProfileModule,
};