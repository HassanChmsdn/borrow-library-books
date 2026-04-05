# Project Progress Checklist

## 1. UI Completed

### Public user pages

- Completed: public books listing at `/books` and book details at `/books/[bookId]`.
- Completed: authenticated member pages for `/account/borrowings` and `/account/profile`.
- Completed: member sign-in flow at `/auth/sign-in` and admin sign-in at `/admin/auth`.
- Completed: public and account route-level error boundaries plus page-level loading states for major routes.

### Admin pages

- Completed: admin dashboard, books list, book create/edit, categories list, borrowings list, inventory list, users list, user profile, and admin self-profile.
- Completed: admin loading states across major routes and shared admin error presentation.
- Completed: admin detail routes for books and users.
- Legacy note: `src/modules/admin-overview` still exists as an earlier scaffold and can be retired.

### Layout shells

- Completed: public shell, account shell, and admin shell using shared layout components.
- Completed: admin shell keeps sidebar fixed while main content scrolls.

### Reusable components

- Completed: shared public/library components for books, fees, availability, durations, and borrowing status.
- Completed: shared admin primitives for headers, filters, tables, badges, row actions, empty states, error states, dialogs, quick actions, stat cards, and avatars.
- Completed: shared feedback primitives for empty and loading states.

## 2. UI Needs Refinement

### Inconsistent components

- Some older module-local components still coexist beside newer shared admin primitives, especially in earlier admin modules.
- Admin profile and admin user-detail flows are separate modules with overlapping summary patterns that could be unified later.

### Unnecessary sections

- `src/modules/admin-overview` appears obsolete now that the newer admin workspace is in place.

### Responsive issues

- Major known admin scrolling and dense-table issues were addressed, but dense admin tables still rely on careful per-feature tuning and should be browser-checked as content grows.

### Missing states (loading, empty, error)

- Most major routes have loading states.
- Admin and public route groups have route-level error boundaries.
- Empty and no-results states exist across key list pages.
- Remaining gap: error states are still mostly presentation-only; no real retry/data recovery logic exists because data is mocked.

## 3. Authentication

### Current mocked auth state

- Implemented: mocked cookie-based auth with three conceptual states: guest, authenticated member, and authenticated admin.
- Implemented: centralized helpers for current user, current role, `isAuthenticated`, `isMember`, and `isAdmin` in `src/lib/auth/mock-auth.ts` and `src/server/auth/mock-session.ts`.
- Implemented: member-only access for `/account/*` and admin-only access for `/admin/*`.

### Missing real auth integration

- Missing: Auth0 integration.
- Missing: persistent user sessions backed by a real identity provider.
- Missing: real user profile synchronization and role claims from an external auth source.

### Missing role enforcement areas

- No obvious route-level gaps remain in the mocked access model.
- Missing: backend/API-level authorization because there is no real server data layer yet.

## 4. Data Layer

### Current mock data usage

- Implemented: admin data normalized through a shared canonical mock dataset in `src/modules/admin-shared`.
- Implemented: feature-level mock data for public catalog, borrowings, and profile pages.
- Implemented: typed mock view models across admin books, categories, borrowings, inventory, users, dashboard, and admin profile.

### Missing database integration

- Missing: MongoDB integration.
- Missing: server persistence for books, copies, borrowings, users, categories, and dashboard metrics.
- Missing: API routes, server actions, or repository layer for CRUD operations.

### Missing schemas/models

- Missing: real database schemas/models.
- Partial: Zod-ready form/value types exist in several modules, but there is no shared domain schema layer for persisted entities.

## 5. Core Features

### Borrowing flow (UI vs real logic)

- Completed: public browsing, book details, borrow CTA behavior, and member-only My Borrowings UI.
- Missing: real borrow request creation, approval flow persistence, due-date calculations, and server-backed status changes.

### Admin management features (UI vs real logic)

- Completed: UI for managing books, categories, borrowings, inventory, users, dashboard, and profiles.
- Missing: real create/edit/delete/update logic against a backend.

### Inventory logic

- Completed: inventory copy management UI, Add Copy flow, and book reference selection from existing mock books.
- Missing: true copy lifecycle logic, stock rules, and persistence.

### User management

- Completed: users roster UI, user detail UI, and mocked create-user flow.
- Missing: real provisioning, suspension/reactivation persistence, role changes, and user/account sync with auth provider.

## 6. Missing Features

- Missing: email notifications.
- Missing: reminder scheduling for due/overdue borrowings.
- Missing: payment handling beyond mocked onsite-cash status labels.
- Missing: domain-level validation beyond UI/form validation.
- Missing: audit logging, admin activity history persistence, and operational event trails.

## 7. DevOps / Platform

### Environment setup

- Implemented: Next.js env validation scaffold in `src/env.ts` and `.env.example`.
- Missing: actual required server/client environment variables for production services.

### CI/CD

- Missing: GitHub Actions or any CI pipeline.
- Missing: automated lint/typecheck/build/test workflow on push or pull request.

### Testing

- Missing: unit tests.
- Missing: integration tests.
- Missing: end-to-end tests.
- Missing: test runner configuration.

### Deployment readiness

- Partial: app builds successfully, uses typed env validation, and has route-level error boundaries.
- Missing: deployment config, hosting pipeline, database/auth integration, monitoring, secrets setup, and production observability.