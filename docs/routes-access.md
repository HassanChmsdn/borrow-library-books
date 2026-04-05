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

## Admin-Only Routes

These routes require authenticated admin access.

| Route | Access | Notes |
| --- | --- | --- |
| `/admin/auth` | Public | Admin login route for guest admin access attempts. |
| `/admin` | Admin only | Admin dashboard. |
| `/admin/books` | Admin only | Books management page. |
| `/admin/books/new` | Admin only | Create new book flow. |
| `/admin/books/[id]` | Admin only | Edit/view book details management flow. |
| `/admin/categories` | Admin only | Categories management page. |
| `/admin/borrowings` | Admin only | Borrowings management page. |
| `/admin/inventory` | Admin only | Inventory copies management page. |
| `/admin/users` | Admin only | Users management page. |
| `/admin/users/[id]` | Admin only | Admin user profile/details page. |
| `/admin/profile` | Admin only | Current authenticated admin profile page. |

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

### Admin

- Can access public routes.
- Can access admin routes under `/admin/*`.
- Under the current mocked model, admin and member are separate mocked roles. Admin access does not automatically imply member account access unless the auth model is expanded later.

## Current Guard Behavior

- `/account/*` is protected by mocked member-only access checks.
- `/admin/*` is protected by mocked admin-only access checks.
- Route protection is enforced in both middleware and server-side layout guards.
- The current mocked auth layer is temporary and structured to be replaced later by Auth0 and MongoDB-backed user/session logic.

## Canonical Route Summary

- Public browsing: `/books`, `/books/[bookId]`
- Member actions: `/account/borrowings`, `/account/profile`
- Admin area: `/admin/...`
- Member sign-in: `/auth/sign-in`
- Admin sign-in: `/admin/auth`