"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ShellNavItem, ShellNavSection } from "./types";

interface AdminTopHeaderProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

interface AdminShellProps extends React.ComponentProps<"div"> {
  brand: React.ReactNode;
  navigationSections: ReadonlyArray<ShellNavSection>;
  currentPath?: string;
  topHeader?: React.ReactNode;
  pageActionBar?: React.ReactNode;
  userSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  contentClassName?: string;
}

function isCurrentItem(item: ShellNavItem, currentPath?: string) {
  if (!currentPath) {
    return false;
  }

  if ((item.matchStrategy ?? "prefix") === "exact") {
    return currentPath === item.href;
  }

  return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
}

function AdminTopHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  ...props
}: AdminTopHeaderProps) {
  return (
    <div
      data-slot="admin-top-header"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-between",
        className,
      )}
      {...props}
    >
      <div className="min-w-0 space-y-1">
        {eyebrow ? (
          <p className="text-caption text-text-tertiary truncate font-medium tracking-[0.24em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h1 className="text-title-sm text-foreground truncate font-semibold">
            {title}
          </h1>
        ) : null}
        {description ? (
          <p className="text-body-sm text-text-secondary truncate md:max-w-2xl">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

function AdminContentWrapper({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="admin-content-wrapper"
      className={cn(
        "px-gutter mx-auto flex min-h-full w-full max-w-(--layout-admin-content-max-width) flex-col gap-6 py-6 sm:gap-8 sm:py-8 lg:py-10",
        className,
      )}
      {...props}
    />
  );
}

function AdminNavigation({
  navigationSections,
  currentPath,
  onNavigate,
}: {
  navigationSections: ReadonlyArray<ShellNavSection>;
  currentPath?: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Admin" className="flex flex-col gap-6">
      {navigationSections.map((section, sectionIndex) => (
        <div
          key={section.title ?? `section-${sectionIndex}`}
          className="space-y-3"
        >
          {section.title ? (
            <p className="text-caption text-text-tertiary px-3 font-medium tracking-[0.24em] uppercase">
              {section.title}
            </p>
          ) : null}

          <ul className="space-y-1">
            {section.items.map((item) => {
              const isCurrent = isCurrentItem(item, currentPath);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={onNavigate}
                    className={cn(
                      "group focus-visible:ring-ring/60 focus-visible:ring-offset-card flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-[background-color,color,border-color,box-shadow] duration-200 focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:outline-none",
                      isCurrent
                        ? "border-border-subtle bg-secondary text-primary shadow-xs"
                        : "text-text-secondary hover:border-border-subtle hover:bg-elevated hover:text-foreground border-transparent",
                    )}
                  >
                    {item.icon ? (
                      <span className="mt-0.5 size-4 shrink-0 [&_svg]:size-4">
                        {item.icon}
                      </span>
                    ) : null}

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-body-sm font-medium">
                          {item.label}
                        </span>
                        {item.badge ? (
                          <span
                            className={cn(
                              "rounded-pill text-caption px-2 py-0.5 font-medium",
                              isCurrent
                                ? "bg-primary/8 text-primary"
                                : "bg-muted text-text-secondary",
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </span>

                      {item.description ? (
                        <span className="text-caption text-text-tertiary mt-1 block text-pretty">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function AdminShell({
  brand,
  navigationSections,
  currentPath,
  topHeader,
  pageActionBar,
  userSlot,
  footerSlot,
  className,
  contentClassName,
  children,
  ...props
}: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const pathname = usePathname();
  const activePath = currentPath ?? pathname;

  return (
    <div
      className={cn("bg-background h-dvh min-h-screen overflow-hidden", className)}
      {...props}
    >
      <div className="h-full lg:grid lg:grid-cols-[var(--layout-admin-sidebar-width)_minmax(0,1fr)]">
        <aside className="border-border-subtle bg-card hidden border-r lg:flex lg:h-full lg:flex-col lg:overflow-hidden">
          <div className="border-border-subtle flex min-h-(--layout-admin-header-height) items-center border-b px-5">
            <div className="min-w-0">{brand}</div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <AdminNavigation
              navigationSections={navigationSections}
              currentPath={activePath}
            />
          </div>

          {userSlot ? (
            <div className="border-border-subtle border-t px-4 py-4">
              {userSlot}
            </div>
          ) : null}

          {footerSlot ? <div className="px-4 pb-4">{footerSlot}</div> : null}
        </aside>

        <div
          className={cn(
            "bg-background/72 fixed inset-0 z-50 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
            mobileNavOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0",
          )}
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />

        <aside
          id="admin-mobile-drawer"
          aria-hidden={!mobileNavOpen}
          className={cn(
            "border-border-subtle bg-card fixed inset-y-0 left-0 z-50 flex w-(--layout-admin-drawer-width) max-w-full flex-col border-r shadow-lg transition-transform duration-200 lg:hidden",
            mobileNavOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="border-border-subtle flex min-h-(--layout-admin-header-height) items-center justify-between gap-3 border-b px-5">
            <div className="min-w-0">{brand}</div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
            >
              <X />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <AdminNavigation
              navigationSections={navigationSections}
              currentPath={activePath}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>

          {userSlot ? (
            <div className="border-border-subtle border-t px-4 py-4">
              {userSlot}
            </div>
          ) : null}

          {footerSlot ? <div className="px-4 pb-4">{footerSlot}</div> : null}
        </aside>

        <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
          <header className="border-border-subtle bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-30 border-b backdrop-blur">
            <div className="px-gutter mx-auto flex min-h-(--layout-admin-header-height) w-full max-w-(--layout-admin-content-max-width) items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="lg:hidden"
                aria-controls="admin-mobile-drawer"
                aria-expanded={mobileNavOpen}
                aria-label="Open navigation"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu />
              </Button>

              <div className="min-w-0 flex-1">{topHeader ?? brand}</div>
            </div>
          </header>

          <main className="flex min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <AdminContentWrapper>
              {pageActionBar}
              <div className={cn("min-w-0 flex-1", contentClassName)}>
                {children}
              </div>
            </AdminContentWrapper>
          </main>
        </div>
      </div>
    </div>
  );
}

export { AdminContentWrapper, AdminShell, AdminTopHeader };
