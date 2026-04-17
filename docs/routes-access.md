# Routes and Access

This document defines the current application routes and who can access them.

## Route Notes

- The current public homepage is `/`, which immediately redirects to `/books`.
- The current member account routes use the `/account/*` namespace.
- Product shorthand such as `/borrow`, `/my-borrowings`, and `/profile` maps to current canonical routes under `/account/*`.
- The current admin authentication route is `/admin/auth`.

## Public Routes

These routes are accessible to guests, members, and admins.

| Route | Access | Notes |
| --- | --- | --- |
| `/` | Public | Redirects to `/books`. |
| `/books` | Public | Main public landing page and books listing. |
| `/books/[bookId]` | Public | Public book details page. |
| `/auth/sign-in` | Public | Member-only sign-in/register UX for guests and member flows. |

## Member-Only Routes

These routes require authenticated member access.

| Product Intent | Current Route | Access | Notes |
| --- | --- | --- | --- |
| Borrowing flow | `/account/borrowings` | Member only | Guests are redirected to `/auth/sign-in`. |
| My Borrowings | `/account/borrowings` | Member only | Canonical member borrowing page. |
| Profile | `/account/profile` | Member only | Member account/profile page. |
| Account root | `/account` | Member only | Redirects to `/account/borrowings`. |

## Staff-Only Routes

These routes require authenticated staff access.

| Route | Access | Notes |
| --- | --- | --- |
| `/admin/auth` | Public | Admin login route for guest admin access attempts. |
| `/admin` | Staff only | Admin dashboard. |
| `/admin/books` | Staff only | Books list is section-gated; list access can be read-only when only access permission is granted. |
| `/admin/books/new` | Staff only | Requires `books` manage permission. |
| `/admin/books/[id]` | Staff only | Requires `books` manage permission for the edit/details workspace. |
| `/admin/categories` | Staff only | Category list is section-gated; create and edit controls require `categories` manage permission. |
| `/admin/borrowings` | Staff only | Borrowings management page. |
| `/admin/financial` | Staff only | Financial operations page. |
| `/admin/inventory` | Staff only | Inventory list is section-gated; create and edit controls require `inventory` manage permission. |
| `/admin/settings/access-control` | Staff only | Requires `accessControl` manage permission. |
| `/admin/users` | Staff only | Users list is section-gated; create account and profile links require `users` manage permission. |
| `/admin/users/[id]` | Staff only | Requires `users` manage permission. |
| `/admin/profile` | Staff only | Current authenticated admin profile page. |

## Access Rules

### Guest

- Can browse `/books` and `/books/[bookId]`.
- Cannot access `/account/*` routes.
- Cannot access `/admin/*` routes other than `/admin/auth`.
- If a guest attempts a member-only route, they are redirected to `/auth/sign-in`.
- If a guest attempts an admin-only route, they are redirected to `/admin/auth`.

### Member

- Can access public routes.
- Can access member routes under `/account/*`.
- Cannot access admin routes under `/admin/*` unless they are authenticated as an admin.

### Staff

- Can access public routes.
- Can access admin routes under `/admin/*` only when the matched route policy and section permission allow it.
- Staff roles currently include `super_admin`, `admin`, `employee`, and `financial`.
- Section access inside `/admin/*` now resolves from role defaults plus optional per-user overrides stored on the app-user access model.
- `super_admin` and `admin` resolve to full operational access by default.
- `employee` resolves to assigned operational sections only.
- `financial` resolves to the financial section by default and any explicitly granted sections beyond that.
- Under the current mocked model, staff and member are separate roles. Staff access does not automatically imply member account access unless the auth model is expanded later.

## Current Guard Behavior

- `/account/*` is protected by mocked member-only access checks.
- `/admin/*` is protected first by staff-access checks, then by centralized route-policy evaluation that can require either section access or section management depending on the path.
- The same route policy is used in both middleware and server-side route guards so optimistic redirects and authoritative page checks stay aligned.
- List pages can remain visible with section access while manage-only controls are hidden in the client through the shared auth hooks.
- The current mocked auth layer is temporary and structured to be replaced later by Auth0 and MongoDB-backed user/session logic.

## Canonical Route Summary

- Public browsing: `/books`, `/books/[bookId]`
- Member actions: `/account/borrowings`, `/account/profile`
- Admin area: `/admin/...`
- Member sign-in: `/auth/sign-in`
- Admin sign-in: `/admin/auth`