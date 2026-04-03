# UI Guidelines

Use [design-tokens.md](./design-tokens.md) as the visual source of truth. This file explains how to compose screens, choose shared components, and keep the public and admin experiences consistent as the app grows.

## Purpose

- Keep the product aligned to one visual language across public and admin surfaces.
- Favor reusable patterns over page-specific markup.
- Optimize for production-oriented clarity, not decorative complexity.
- Build mobile-first, then increase density deliberately for larger screens.

## Core Principles

1. Reuse the system before inventing a new pattern.
2. Let hierarchy come from spacing, typography, and surface structure before adding more color.
3. Keep public pages calm and editorial; keep admin pages compact and operational.
4. Prefer short labels, short badges, and clear actions.
5. Every dense layout must still collapse cleanly on small screens.

## Source Of Truth

- Visual values come from [design-tokens.md](./design-tokens.md).
- Token application rules live in [component-token-usage.md](./component-token-usage.md).
- Shared shells live in `@/components/layout`.
- Shared admin building blocks live in `@/components/admin`.
- Shared library and feedback components live in `@/components/library` and `@/components/feedback`.

If this file and the token file appear to conflict, keep the token values and adjust the composition guidance here.

## Layout Rules

### Public Pages

- Use `PublicShell`, `ShellContainer`, and `PageHeader` for public-facing pages.
- Favor one main column on mobile and at most two coordinated regions on desktop.
- Keep page intros concise. Title, one supporting sentence, then actions or filters.
- Card grids should breathe more than admin tables. Prefer `gap-4 sm:gap-5 lg:gap-6`.

### Admin Pages

- Use `AdminShell`, `AdminContentWrapper`, and `AdminPageHeader`.
- Desktop admin should prioritize scanning and operational density, not decoration.
- Group dense content into section cards rather than stacking unrelated surfaces.
- Put search, filters, and high-value actions near the page header, not deep inside the page.
- Reserve KPI-heavy layouts for the dashboard or true overview screens.

## Responsive Behavior

- Start with a single-column mobile layout.
- Promote to multi-column layouts only when the content gains scanning value.
- Convert dense tables into cards or stacked lists on small screens.
- Allow long values to wrap before letting them overflow a card.
- Any right-aligned summary block in a card must be able to stack below the title block on narrower widths.

Recommended breakpoints:

- `sm`: slightly increase spacing and allow wider toolbars.
- `lg`: enable dense admin tables, side-by-side dashboard regions, and action rails.
- `xl`: widen dashboards and management screens, but do not add a new visual language.

## Typography And Copy

- Use `font-heading` only for major public page headings or editorial moments.
- Use `font-sans` for admin interfaces, controls, metadata, and tables.
- Keep admin subtitles practical and short.
- Prefer sentence case across UI copy.
- Keep badge labels to one or two words.
- Do not repeat the entire card title inside a badge.

## Surfaces And Spacing

- Use `AdminSectionCard` for grouped admin content.
- Use `Card`, `AdminStatCard`, `KpiCard`, and `AdminQuickActionCard` for self-contained content blocks.
- Prefer token-based spacing over custom values.
- Standard card padding should usually stay within `p-4`, `sm:p-5`, `lg:p-6`.
- Use consistent internal rhythm: title area, supporting text, content, then actions.

## Status, Badges, And Semantic Color

- All status indicators should use semantic tokens and shared badge components.
- Use `AdminStatusBadge` for admin workflow states.
- Use `AvailabilityBadge`, `FeeBadge`, and `BorrowStatusBadge` for circulation and catalog states.
- Keep badges compact, single-line, and non-wrapping.
- Use semantic tone meaning consistently:
  - `success`: healthy, resolved, available, paid
  - `warning`: pending, at-risk, needs review
  - `danger`: overdue, blocked, destructive actions
  - `info`: informational or in-progress states

## Tables And Data-Dense Views

- Use `AdminDataTable` and `AdminTable*` primitives for desktop management tables.
- The first column should carry the primary object and its most important secondary detail.
- Keep action columns narrow and right-aligned.
- Never place `AdminTableHead` outside `AdminTableHeader` and `AdminTableRow`.
- Use short column labels.
- Do not force every metric into a table if a compact summary card communicates it better.

For mobile fallbacks:

- Render each record as a card or stacked row.
- Keep the same information hierarchy as desktop.
- Show the primary object first, then metadata, then status, then actions.

## Search, Filters, Tabs, And Actions

- Use `AdminSearchBar` for page-level querying.
- Use `AdminFilterSelect` for single-dimension filtering.
- Use `AdminTabs` for mutually exclusive states like active, pending, or overdue.
- Keep toolbars compact and action-first.
- Avoid more than one primary button per page header.
- Use `AdminRowActions` for row-level edit, archive, delete, and review hooks.
- Use `ConfirmActionDialog` only for destructive or irreversible actions.

## Dashboard Guidance

- KPI cards should be quick to scan and limited to the most important operational indicators.
- Alert and notice cards should surface actionable pressure, not repeat the same metric twice.
- Chart sections should prioritize trend interpretation over visual flourish.
- Recent activity should read like a compact operations log.
- Quick actions should be short, direct, and clearly mapped to staff workflows.

## Empty, Loading, And Error States

- Loading skeletons should mirror the real layout density and shape.
- Use `AdminEmptyState` for empty and no-results states when possible.
- Empty states should explain what is missing and offer one recovery action.
- No-results states should encourage changing filters or search terms.
- Error states should be concise and actionable. Prefer a retry or reset action.

## Reusable Component Selection

Choose the shared component that matches the pattern before creating module-local markup.

- Page framing: `AdminPageHeader`, `AdminSectionCard`, `AdminDetailSection`
- Filters and navigation: `AdminSearchBar`, `AdminFilterSelect`, `AdminTabs`
- Metrics and overview: `AdminStatCard`, `AdminMetricStrip`, `AdminQuickActionCard`, `KpiCard`
- Data display: `AdminDataTable`, `AdminRowActions`, `AdminUserAvatar`, `AdminStatusBadge`
- States and confirmation: `AdminEmptyState`, `ConfirmActionDialog`

Create module-local components only when the page needs a reusable structure that is specific to that feature.

## Module Architecture

Admin and public features should stay module-oriented.

Recommended module shape:

- `types.ts` for view models and UI-facing types
- `mock-data.ts` or `data.ts` for static mock content
- `hooks.ts` for future-ready state and fetching boundaries
- `components/` for reusable feature-specific parts
- `*-module.tsx` for the top-level composed screen

Keep route files thin. Route files should mostly import and render a module.

## Avoid

- Creating a new badge style when a semantic badge already exists
- Using raw hex colors in component classes
- Building page-specific tables without `AdminDataTable` unless the layout is fundamentally different
- Repeating KPI cards on every admin page
- Long explanatory copy inside dense admin cards
- Overly large pills, buttons, or icons in data-heavy admin screens
- Decorative gradients, floating ornaments, or visual effects that are not present in the current system

## Definition Of Done

Before considering a new screen complete, verify:

1. It uses existing shells and shared primitives where appropriate.
2. It follows the token system instead of raw values.
3. It reads cleanly on mobile before desktop enhancements are applied.
4. Dense desktop content still feels readable and operational.
5. Empty, loading, and no-results states are handled.
6. Repeated patterns are extracted into shared or module-level components.
7. Type boundaries are clear enough for future API integration.