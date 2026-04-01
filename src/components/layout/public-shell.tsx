"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { ShellContainer } from "./shell-container";
import type { ShellNavItem } from "./types";

interface PublicTopNavigationProps extends React.ComponentProps<"header"> {
  brand: React.ReactNode;
  navigationItems: ReadonlyArray<ShellNavItem>;
  currentPath?: string;
  utilitySlot?: React.ReactNode;
}

interface PublicShellProps extends React.ComponentProps<"div"> {
  brand: React.ReactNode;
  navigationItems: ReadonlyArray<ShellNavItem>;
  currentPath?: string;
  utilitySlot?: React.ReactNode;
  header?: React.ReactNode;
  mainClassName?: string;
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

function PublicTopNavigation({
  brand,
  navigationItems,
  currentPath,
  utilitySlot,
  className,
  ...props
}: PublicTopNavigationProps) {
  const pathname = usePathname();
  const activePath = currentPath ?? pathname;

  return (
    <header
      data-slot="public-top-navigation"
      className={cn(
        "border-border-subtle bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-40 border-b backdrop-blur",
        className,
      )}
      {...props}
    >
      <ShellContainer className="flex flex-col gap-4 py-4 md:min-h-(--layout-public-nav-height) md:flex-row md:items-center md:justify-between md:py-0">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">{brand}</div>
          {utilitySlot ? (
            <div className="flex shrink-0 items-center gap-2 md:hidden">
              {utilitySlot}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 md:flex-1 md:flex-row md:items-center md:justify-end md:gap-6">
          <nav
            aria-label="Primary"
            className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex min-w-max items-center gap-2">
              {navigationItems.map((item) => {
                const isCurrent = isCurrentItem(item, activePath);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(
                        "rounded-pill text-body-sm focus-visible:ring-ring/60 focus-visible:ring-offset-background inline-flex min-h-10 items-center gap-2 px-4 font-medium transition-[background-color,color,box-shadow] duration-200 focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:outline-none",
                        isCurrent
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-text-secondary hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      <span>{item.label}</span>
                      {item.badge ? (
                        <span
                          className={cn(
                            "rounded-pill text-caption px-2 py-0.5 font-medium",
                            isCurrent
                              ? "bg-primary-foreground/14 text-primary-foreground"
                              : "bg-muted text-text-secondary",
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {utilitySlot ? (
            <div className="hidden shrink-0 items-center gap-2 md:flex">
              {utilitySlot}
            </div>
          ) : null}
        </div>
      </ShellContainer>
    </header>
  );
}

function PublicShell({
  brand,
  navigationItems,
  currentPath,
  utilitySlot,
  header,
  className,
  mainClassName,
  children,
  ...props
}: PublicShellProps) {
  return (
    <div className={cn("bg-background min-h-screen", className)} {...props}>
      <PublicTopNavigation
        brand={brand}
        navigationItems={navigationItems}
        currentPath={currentPath}
        utilitySlot={utilitySlot}
      />

      <main className={cn("py-6 sm:py-8 lg:py-10", mainClassName)}>
        <ShellContainer className="gap-section flex flex-col">
          {header}
          {children}
        </ShellContainer>
      </main>
    </div>
  );
}

export { PublicShell, PublicTopNavigation };
