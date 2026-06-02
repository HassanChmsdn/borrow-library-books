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
- Completed: obsolete `src/modules/admin-overview` scaffold was retired after the newer admin workspace replaced it.

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

- Earlier admin overview scaffold has been removed.

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
- Implemented: centralized auth helpers and access guards under `src/lib/auth/`, with shared state helpers in `src/lib/auth/index.ts`, server session helpers in `src/lib/auth/server.ts`, and client hooks/provider utilities in `src/lib/auth/react.tsx`.
- Implemented: member-only access for `/account/*` and admin-only access for `/admin/*`.

### Auth0 integration status

- Partial: Auth0 login, callback, logout, session lookup, and app-user resolution helpers exist.
- Implemented: app authorization resolves from MongoDB app-user records when MongoDB is configured.
- Remaining: production validation of Auth0 tenant configuration, callback/logout behavior, and unauthorized identity handling.

### Missing role enforcement areas

- No obvious route-level gaps remain in the mocked access model.
- Partial: server actions use centralized staff/section authorization helpers.
- Remaining: broaden authorization tests around every persisted mutation.

## 4. Data Layer

### Current mock data usage

- Implemented: admin data normalized through a shared canonical mock dataset in `src/modules/admin-shared`.
- Implemented: feature-level mock data for public catalog, borrowings, and profile pages.
- Implemented: typed mock view models across admin books, categories, borrowings, inventory, users, dashboard, and admin profile.

### Database integration status

- Implemented: MongoDB client, collection initialization, validators, indexes, seed scripts, and app-user provisioning script.
- Implemented: Mongo-backed snapshot adapter for public catalog, member borrowings/profile, dashboard, financials, access control, users, books, categories, inventory, and borrowings.
- Implemented: server actions/services for books, users, access control, borrowing lifecycle/payment updates, categories, and inventory copy saves.
- Remaining: richer transactional handling across multi-collection borrowing/inventory updates and production observability for persistence failures.

### Schemas/models

- Implemented: shared Zod document/input schemas for users, categories, books, book copies, borrow requests, payment status, and lifecycle statuses.
- Remaining: domain service tests should expand around schema-to-workflow behavior as CRUD coverage grows.

## 5. Core Features

### Borrowing flow (UI vs real logic)

- Completed: public browsing, book details, borrow CTA behavior, and member-only My Borrowings UI.
- Partial: real borrow request creation, approval, rejection/cancellation, return, due-date calculation, copy reservation/borrowed/release updates, and payment status updates exist behind MongoDB-backed services.
- Remaining: transaction boundaries, stronger concurrency handling, and reminder/audit event integration.

### Admin management features (UI vs real logic)

- Completed: UI for managing books, categories, borrowings, inventory, users, dashboard, and profiles.
- Partial: books, users, access control, borrowings, categories, and inventory copy saves have server-backed mutations when MongoDB is configured.
- Remaining: full CRUD coverage for every management edge case, bulk operations, and richer delete/archive policy.

### Inventory logic

- Completed: inventory copy management UI, Add Copy flow, and book reference selection from existing mock books.
- Partial: inventory copy persistence exists, and open borrowing records constrain unsafe copy/book/status changes.
- Remaining: full lifecycle audit history, transfer/location rules, and staff-facing conflict resolution.

### User management

- Completed: users roster UI, user detail UI, and mocked create-user flow.
- Missing: real provisioning, suspension/reactivation persistence, role changes, and user/account sync with auth provider.

## 6. Missing Features

- Missing: email notifications.
- Missing: reminder scheduling for due/overdue borrowings.
- Partial: onsite-cash payment status can now be updated independently from borrowing lifecycle at the service/action layer.
- Missing: domain-level validation beyond UI/form validation.
- Missing: audit logging, admin activity history persistence, and operational event trails.

## 7. DevOps / Platform

### Environment setup

- Implemented: Next.js env validation scaffold in `src/env.ts` and `.env.example`.
- Missing: actual required server/client environment variables for production services.

### CI/CD

- Implemented: GitHub Actions workflow for install, lint, typecheck, tests, and build.
- Remaining: repo-wide format check currently reports pre-existing drift and should be enabled in CI after a dedicated formatting pass.

### Testing

- Partial: Node test runner script and initial schema/business-rule unit tests added.
- Missing: integration tests.
- Missing: end-to-end tests.
- Implemented: test runner configuration through the `npm test` script.

### Deployment readiness

- Partial: app builds successfully, uses typed env validation, and has route-level error boundaries.
- Missing: deployment config, hosting pipeline, production validation for database/auth integration, monitoring, secrets setup, and production observability.
