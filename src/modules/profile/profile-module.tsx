import Link from "next/link";
import {
  Bell,
  BookCopy,
  Clock3,
  CreditCard,
  HandCoins,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { KpiCard } from "@/components/admin";
import { EmptyState, LoadingSkeleton } from "@/components/feedback";
import { BorrowStatusBadge } from "@/components/library";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ProfileData, ProfileSummaryMetricKey } from "./data";

interface ProfileModuleProps {
  profile: ProfileData;
}

function metricIcon(metricKey: ProfileSummaryMetricKey) {
  switch (metricKey) {
    case "active-loans":
      return <BookCopy className="size-4" />;
    case "pending-pickups":
      return <Clock3 className="size-4" />;
    case "overdue-items":
      return <Bell className="size-4" />;
    case "cash-due":
      return <HandCoins className="size-4" />;
  }
}

function ProfileModule({ profile }: ProfileModuleProps) {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Review personal details, account information, and borrowing preferences in the member shell. This profile view is powered by local mock data and follows the existing token system."
        actions={
          <>
            <Button asChild size="sm" variant="outline">
              <Link href="/borrowings">My Borrowings</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/books">Browse Books</Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,22rem)] xl:items-start">
        <div className="grid gap-5">
          <Card>
            <CardContent className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
              <div className="from-secondary via-warning-surface to-background text-primary flex size-20 items-center justify-center rounded-[28px] bg-linear-to-br text-xl font-semibold shadow-sm sm:size-24 sm:text-2xl">
                {profile.person.initials}
              </div>

              <div className="grid gap-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-heading text-title text-foreground sm:text-title-lg font-semibold text-balance">
                      {profile.person.fullName}
                    </h1>
                    <BorrowStatusBadge
                      label={profile.accountStatusLabel}
                      tone="success"
                    />
                  </div>

                  <p className="text-body text-text-secondary max-w-3xl text-pretty">
                    {profile.person.bio}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-elevated rounded-2xl border border-dashed border-black/5 p-4">
                    <div className="text-text-tertiary mb-2 flex items-center gap-2">
                      <Mail className="size-4" />
                      <span className="text-caption font-medium tracking-[0.16em] uppercase">
                        Email
                      </span>
                    </div>
                    <p className="text-body text-foreground font-medium break-all">
                      {profile.person.email}
                    </p>
                  </div>

                  <div className="bg-elevated rounded-2xl border border-dashed border-black/5 p-4">
                    <div className="text-text-tertiary mb-2 flex items-center gap-2">
                      <Phone className="size-4" />
                      <span className="text-caption font-medium tracking-[0.16em] uppercase">
                        Phone
                      </span>
                    </div>
                    <p className="text-body text-foreground font-medium">
                      {profile.person.phone}
                    </p>
                  </div>

                  <div className="bg-elevated rounded-2xl border border-dashed border-black/5 p-4 sm:col-span-2">
                    <div className="text-text-tertiary mb-2 flex items-center gap-2">
                      <MapPin className="size-4" />
                      <span className="text-caption font-medium tracking-[0.16em] uppercase">
                        Membership location
                      </span>
                    </div>
                    <p className="text-body text-foreground font-medium">
                      {profile.person.location}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {profile.summaryMetrics.map((metric) => (
              <KpiCard
                key={metric.key}
                icon={metricIcon(metric.key)}
                label={metric.label}
                supportingText={metric.supportingText}
                value={metric.value}
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                A clean, mobile-first settings layout for future self-service
                flows. The current values are local placeholders only.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {profile.settingsSections.map((section) => (
                <section key={section.title} className="grid gap-3">
                  <div className="space-y-1">
                    <h2 className="text-title-sm text-foreground font-semibold">
                      {section.title}
                    </h2>
                    <p className="text-body-sm text-text-secondary">
                      {section.description}
                    </p>
                  </div>

                  <div className="rounded-card border-border-subtle overflow-hidden border">
                    {section.items.map((item, index) => (
                      <div
                        key={item.title}
                        className="bg-card grid gap-4 px-4 py-4 sm:px-5 sm:py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-body text-foreground font-medium">
                              {item.title}
                            </p>
                            <span className="bg-muted text-text-secondary rounded-pill px-2.5 py-1 text-[11px] font-medium tracking-[0.08em] uppercase">
                              {item.value}
                            </span>
                          </div>
                          <p className="text-body-sm text-text-secondary max-w-2xl">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex justify-start lg:justify-end">
                          <Button size="sm" type="button" variant="outline">
                            {item.actionLabel}
                          </Button>
                        </div>

                        {index < section.items.length - 1 ? (
                          <div className="border-border-subtle -mx-4 border-b sm:-mx-5 lg:col-span-2" />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 xl:sticky xl:top-28">
          <Card>
            <CardHeader>
              <CardTitle>Account details</CardTitle>
              <CardDescription>
                A clear reference for branch preferences, payment policy, and
                member metadata.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {profile.accountDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-dashed border-black/5 p-4"
                >
                  <span className="text-body-sm text-text-secondary">
                    {detail.label}
                  </span>
                  <span className="text-body text-foreground max-w-[14rem] text-right font-medium text-balance">
                    {detail.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account support</CardTitle>
              <CardDescription>
                Guidance that stays visible on mobile without adding decorative
                complexity.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="bg-elevated rounded-2xl border border-dashed border-black/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-secondary text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                    <CreditCard className="size-4" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-label text-foreground font-medium">
                      Onsite cash payments only
                    </p>
                    <p className="text-body-sm text-text-secondary">
                      Fee-bearing borrowings are paid in person at pickup or
                      return. Online payment is intentionally out of scope for
                      this mock phase.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-elevated rounded-2xl border border-dashed border-black/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-secondary text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-label text-foreground font-medium">
                      Staff-assisted updates
                    </p>
                    <p className="text-body-sm text-text-secondary">
                      Member profile edits are represented here visually first.
                      Real editing flows can attach to this layout later without
                      redesigning the shell.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function ProfileEmptyState() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="The member profile could not be loaded from the local mock data set."
      />

      <EmptyState
        title="Profile unavailable in mock data"
        description="Reopen the member profile once local account data is available again. The empty state is kept simple so it can evolve safely before backend wiring."
        action={
          <Button asChild>
            <Link href="/books">Browse books</Link>
          </Button>
        }
      />
    </div>
  );
}

function ProfileLoadingState() {
  return (
    <div className="gap-section flex flex-col">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Preparing personal details, borrowing summaries, and member settings."
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,22rem)] xl:items-start">
        <div className="grid gap-5">
          <LoadingSkeleton count={1} variant="card" />
          <LoadingSkeleton count={4} variant="kpi" />
          <LoadingSkeleton count={2} variant="table" />
        </div>

        <div className="grid gap-5">
          <LoadingSkeleton count={1} variant="card" />
          <LoadingSkeleton count={1} variant="card" />
        </div>
      </section>
    </div>
  );
}

export { ProfileEmptyState, ProfileLoadingState, ProfileModule };
