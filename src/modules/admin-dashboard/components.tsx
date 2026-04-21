import * as React from "react";
import { ArrowRight } from "lucide-react";

import {
  AdminDetailSection,
  AdminEmptyState,
  AdminMetricStrip,
  AdminQuickActionCard,
  AdminSectionCard,
  AdminStatusBadge,
  AdminUserAvatar,
} from "@/components/admin";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";
import {
  translateAdminActivityText,
  translateAdminDashboardText,
} from "@/modules/admin-shared/i18n";

import type {
  AdminDashboardActivityItem,
  AdminDashboardMetric,
  AdminDashboardNoticeItem,
  AdminDashboardQuickAction,
  AdminDashboardTrendPoint,
  AdminDashboardTrendSummaryItem,
} from "./types";

type TranslateText = (text: string) => string;
type FormatMessage = (
  template: string,
  variables: Record<string, string | number>,
) => string;

function getToneClasses(tone: AdminDashboardMetric["tone"]) {
  switch (tone) {
    case "success":
      return {
        accentClassName: "bg-success-surface text-success ring-success-border/70",
        trendClassName: "text-success",
      };
    case "warning":
      return {
        accentClassName: "bg-warning-surface text-warning ring-warning-border/70",
        trendClassName: "text-warning",
      };
    case "danger":
      return {
        accentClassName: "bg-danger-surface text-danger ring-danger-border/70",
        trendClassName: "text-danger",
      };
    case "info":
      return {
        accentClassName: "bg-info-surface text-info ring-info-border/70",
        trendClassName: "text-info",
      };
    default:
      return {
        accentClassName:
          "bg-secondary text-primary ring-border-subtle/80 ring-1 ring-inset",
        trendClassName: "text-text-secondary",
      };
  }
}

function getNoticeToneClasses(tone: AdminDashboardNoticeItem["tone"]) {
  switch (tone) {
    case "danger":
      return "border-danger-border/70 bg-danger-surface/60";
    case "warning":
      return "border-warning-border/70 bg-warning-surface/75";
    case "success":
      return "border-success-border/70 bg-success-surface/65";
    case "info":
      return "border-info-border/70 bg-info-surface/65";
    default:
      return "border-border-subtle bg-elevated";
  }
}

function getBarHeight(value: number, maxValue: number) {
  if (value <= 0 || maxValue <= 0) {
    return "0%";
  }

  return `${Math.max((value / maxValue) * 100, 10)}%`;
}

function ChartLegendItem({
  className,
  label,
  translateText,
}: Readonly<{
  className: string;
  label: string;
  translateText: TranslateText;
}>) {

  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-2.5 rounded-full", className)} />
      <span className="text-body-sm text-text-secondary">{translateText(label)}</span>
    </div>
  );
}

function AdminDashboardMetricGrid({
  metrics,
  translateText,
}: Readonly<{
  metrics: ReadonlyArray<AdminDashboardMetric>;
  translateText: TranslateText;
}>) {

  return (
    <AdminMetricStrip
      columnsClassName="sm:grid-cols-2 xl:grid-cols-5"
      items={metrics.map((metric) => {
        const Icon = metric.icon;
        const toneClasses = getToneClasses(metric.tone);

        return {
          icon: (
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-xl ring-1 ring-inset",
                toneClasses.accentClassName,
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
            </span>
          ),
          label: metric.label,
          supportingText: metric.supportingText,
          trend: metric.trend ? (
            <span className={cn("font-medium", toneClasses.trendClassName)}>
              {translateAdminDashboardText(metric.trend, translateText)}
            </span>
          ) : undefined,
          value: metric.value,
        };
      })}
    />
  );
}

function AdminDashboardNoticeSection({
  notices,
  translateText,
}: Readonly<{
  notices: ReadonlyArray<AdminDashboardNoticeItem>;
  translateText: TranslateText;
}>) {

  return (
    <AdminSectionCard
      title="Operational notices"
      description="Priority work that needs attention before circulation slows down."
    >
      {notices.length > 0 ? (
        <div className="grid gap-3">
          {notices.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-card grid gap-4 border p-4 shadow-xs",
                getNoticeToneClasses(item.tone),
              )}
            >
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(9rem,12rem)] lg:items-start">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-title-sm text-foreground font-semibold">
                      {translateText(item.title)}
                    </p>
                    <AdminStatusBadge
                      label={item.badgeLabel ?? item.title}
                      tone={item.tone}
                    />
                  </div>
                  <p className="max-w-[32ch] text-body-sm text-text-secondary">
                    {translateText(item.description)}
                  </p>
                </div>
                <p className="text-foreground text-balance text-[1.9rem] leading-[0.92] font-semibold tracking-[-0.04em] lg:max-w-[10ch] lg:justify-self-end lg:text-end xl:text-[2.2rem]">
                    {translateAdminDashboardText(item.countLabel, translateText)}
                </p>
              </div>

                <p className="text-caption text-text-tertiary">{translateAdminDashboardText(item.meta, translateText)}</p>

              <LinkButton href={item.actionHref} size="sm" variant="outline" className="w-full sm:w-auto">
                {translateText(item.actionLabel)}
              </LinkButton>
            </div>
          ))}
        </div>
      ) : (
        <AdminEmptyState
          title="No operational notices"
          description="Pending request and overdue follow-up cards will appear here when the data layer is connected."
        />
      )}
    </AdminSectionCard>
  );
}

function AdminDashboardTrendSection({
  formatMessage,
  points,
  summary,
  translateText,
}: Readonly<{
  formatMessage: FormatMessage;
  points: ReadonlyArray<AdminDashboardTrendPoint>;
  summary: ReadonlyArray<AdminDashboardTrendSummaryItem>;
  translateText: TranslateText;
}>) {
  const maxValue = Math.max(
    1,
    ...points.map((item) =>
      Math.max(item.borrowings, item.returns, item.overdue),
    ),
  );

  return (
    <AdminSectionCard
      title="Borrowing trends"
      description="Seven-day circulation movement for borrowings, returns, and overdue escalation using mock operational data."
      actions={<p className="text-caption text-text-tertiary">{translateText("Last 7 days")}</p>}
    >
      {points.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-start">
          <div className="rounded-card border-border-subtle bg-elevated grid gap-4 border p-4">
            <div className="flex flex-wrap items-center gap-4">
              <ChartLegendItem className="bg-brand-500" label="Borrowings" translateText={translateText} />
              <ChartLegendItem className="bg-success" label="Returns" translateText={translateText} />
              <ChartLegendItem className="bg-danger" label="Overdue" translateText={translateText} />
            </div>

            <div className="grid min-h-72 grid-cols-7 items-end gap-2 sm:gap-3">
              {points.map((point) => (
                <div
                  key={point.id}
                  className="grid h-full grid-rows-[1fr_auto] gap-3"
                >
                  <div className="relative h-full">
                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-2">
                      {Array.from({ length: 4 }, (_, index) => (
                        <span
                          key={`${point.id}-grid-${index}`}
                          className="border-border-subtle block border-t border-dashed"
                        />
                      ))}
                    </div>

                    <div className="relative z-10 flex h-full items-end justify-center gap-1 px-1">
                      <span
                        className="bg-brand-500 w-2 rounded-t-[0.4rem] sm:w-2.5"
                        style={{
                          height: getBarHeight(point.borrowings, maxValue),
                        }}
                        title={formatMessage(translateText("{label}: {count} borrowings"), {
                          count: point.borrowings,
                          label: translateText(point.label),
                        })}
                      />
                      <span
                        className="bg-success w-2 rounded-t-[0.4rem] sm:w-2.5"
                        style={{ height: getBarHeight(point.returns, maxValue) }}
                        title={formatMessage(translateText("{label}: {count} returns"), {
                          count: point.returns,
                          label: translateText(point.label),
                        })}
                      />
                      <span
                        className="bg-danger w-2 rounded-t-[0.4rem] sm:w-2.5"
                        style={{ height: getBarHeight(point.overdue, maxValue) }}
                        title={formatMessage(translateText("{label}: {count} overdue"), {
                          count: point.overdue,
                          label: translateText(point.label),
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-center">
                    <p className="text-caption text-text-secondary font-medium uppercase tracking-[0.18em]">
                      {point.label}
                    </p>
                    <p className="text-caption text-text-tertiary">
                      {formatMessage(translateText("{count} out"), { count: point.borrowings })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AdminDetailSection
            items={summary.map((item) => ({
              hint: item.hint,
              label: item.label,
              value: item.statusLabel ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span>{translateAdminDashboardText(item.value, translateText)}</span>
                  <AdminStatusBadge
                    label={item.statusLabel}
                    tone={item.statusTone}
                  />
                </div>
              ) : (
                translateAdminDashboardText(item.value, translateText)
              ),
            }))}
          />
        </div>
      ) : (
        <AdminEmptyState
          title="No borrowing trends yet"
          description="Trend bars and weekly summaries will appear here once circulation analytics are available."
        />
      )}
    </AdminSectionCard>
  );
}

function AdminDashboardQuickActionsSection({
  actions,
  translateText,
}: Readonly<{
  actions: ReadonlyArray<AdminDashboardQuickAction>;
  translateText: TranslateText;
}>) {

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-title-sm text-foreground font-semibold">
          {translateText("Quick actions")}
        </h2>
        <p className="text-body-sm text-text-secondary">
          {translateText("Fast entry points into the highest-traffic management areas.")}
        </p>
      </div>

      {actions.length > 0 ? (
        <div className="grid gap-4">
          {actions.map((item) => {
            const Icon = item.icon;

            return (
              <AdminQuickActionCard
                key={item.id}
                actionLabel={item.actionLabel}
                description={item.description}
                href={item.href}
                icon={<Icon aria-hidden="true" className="size-4" />}
                title={item.title}
              />
            );
          })}
        </div>
      ) : (
        <AdminEmptyState
          title="No quick actions configured"
          description="Add admin action entries once the next workflow priorities are settled."
        />
      )}
    </section>
  );
}

function AdminDashboardActivitySection({
  items,
  translateText,
}: Readonly<{
  items: ReadonlyArray<AdminDashboardActivityItem>;
  translateText: TranslateText;
}>) {

  return (
    <AdminSectionCard
      title="Recent activity"
      description="A running panel of the latest circulation, catalog, and member support changes."
      footer={
        <LinkButton href="/admin/borrowings" variant="ghost" className="justify-between">
          {translateText("Open borrowings queue")}
          <ArrowRight className="size-4" />
        </LinkButton>
      }
    >
      {items.length > 0 ? (
        items.map((item) => (
              <div
                key={item.id}
            className="rounded-card border-border-subtle bg-card flex items-start justify-between gap-4 border p-4"
              >
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <p className="text-body text-foreground font-medium">
                    {translateText(item.title)}
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    {translateAdminActivityText(item.description, translateText)}
                  </p>
                </div>
                <AdminStatusBadge
                  label={item.statusLabel}
                  tone={item.statusTone}
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <AdminUserAvatar
                  meta={translateText(item.meta)}
                  name={item.actor}
                  size="sm"
                  subtitle={translateText(item.actorRole)}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <AdminEmptyState
          title="No recent activity"
          description="Recent dashboard activity will appear here once circulation and catalog events are connected."
        />
      )}
    </AdminSectionCard>
  );
}

export {
  AdminDashboardActivitySection,
  AdminDashboardMetricGrid,
  AdminDashboardNoticeSection,
  AdminDashboardQuickActionsSection,
  AdminDashboardTrendSection,
};
