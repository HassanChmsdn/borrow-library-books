# Authentication Architecture

This document defines the current authentication and authorization architecture for the application.

## Overview

- Auth0 is the identity provider.
- Auth0 is responsible for login, logout, callback handling, and authenticated session identity.
- Application authorization is not derived from Auth0 RBAC roles.
- Application role and account status are resolved from the app user record.
- The current app user source is temporary and mock-backed.
- The long-term source of truth for app users will be MongoDB.

## Current Responsibilities

### Auth0 responsibilities

- Authenticate the user.
- Provide a session for the authenticated identity.
- Expose a stable Auth0 user identifier, typically the subject (`sub`).
- Support login, logout, and callback routes.

### Application responsibilities

- Resolve the authenticated identity to an app user record.
- Determine application role:
  - `super_admin`
  - `admin`
  - `employee`
  - `financial`
  - `member`
- Determine account status:
  - `active`
  - `suspended`
- Apply route-level authorization based on the app user record.

## Source of Truth

### Identity source of truth

- Identity comes from the current authenticated session.
- If Auth0 is configured and active, identity comes from Auth0.
- If Auth0 is not active, the temporary mocked identity flow is used.

### Authorization source of truth

- Authorization comes from the app user record.
- The app user record is matched by Auth0 user id / subject.
- The app user record is the only place that should define:
  - role
  - status
- Auth0 claims must not be treated as the long-term source of application roles.

## Current Module Structure

### Central auth module

The centralized auth implementation lives under `src/lib/auth/`.

- `src/lib/auth/index.ts`
  Exposes the main shared auth API.
- `src/lib/auth/server.ts`
  Exposes server-side session and route guard helpers.
- `src/lib/auth/react.tsx`
  Exposes React-facing auth provider and hooks.
- `src/lib/auth/auth0.ts`
  Handles Auth0 identity integration.
- `src/lib/auth/app-users.ts`
  Resolves app user records and acts as the current seam for future MongoDB integration.
- `src/lib/auth/mock-auth.ts`
  Contains the mock auth model and fallback behavior.

## Core Auth API

The app should consume auth through the centralized module API rather than directly reading raw session shape.

Current shared helpers include:

- `getCurrentUser()`
- `getCurrentRole()`
- `isAuthenticated()`
- `isMember()`
- `isAdmin()`
- `isStaff()`
- `hasAdminAccess()`

Server-side access should go through the centralized server helpers rather than direct cookie or session inspection.

## App User Model

The current authorization model assumes an app user record with at least:

- `id`
- `auth0Subject` or equivalent external identity reference
- `email`
- `name`
- `role`
- `status`

### Role values

- `super_admin`
- `admin`
- `employee`
- `financial`
- `member`

### Status values

- `active`
- `suspended`

## Route Protection Model

### Public routes

- Public browsing routes remain accessible without authentication.
- Example routes:
  - `/books`
  - `/books/[bookId]`

### Member routes

- Member routes require an authenticated user.
- The authenticated identity must resolve to an app user record with:
  - role `member`
  - status `active`
- Example routes:
  - `/account/borrowings`
  - `/account/profile`

### Admin routes

- Admin routes require an authenticated user.
- The authenticated identity must resolve to an active app user record with a staff role:
  - `super_admin`
  - `admin`
  - `employee`
  - `financial`
- Example routes:
  - `/admin`
  - `/admin/books`
  - `/admin/users`

## Fallback Behavior

Because MongoDB integration is not fully implemented yet:

- a temporary app user lookup exists in the centralized auth layer
- mock identity and mock app-user records remain available for local development
- the fallback is intentionally isolated so it can be replaced later without changing route guards and UI consumers

### Important constraint

- If an Auth0 session exists but no matching app user record is found, the app should not silently grant application access.
- In that case, the user should be treated as authenticated for identity purposes but unauthorized for protected app areas until a matching app user exists.

## Middleware and Server Guards

Authorization is enforced through centralized route protection rather than page-level ad hoc checks.

Current protection layers include:

- middleware-based route gating
- server-side layout or route guards for protected areas

This layered approach is intentional and should remain in place when MongoDB-backed users are added.

## UI Expectations

- Public sign-in is member-focused.
- Admin login is accessed from admin routes.
- Borrowing actions should send guests to member sign-in rather than protected member pages.
- Admin-only pages should not expose member-only assumptions.

## Future MongoDB Integration Plan

When MongoDB is introduced, the replacement target is the app user resolution layer, not the entire auth stack.

Expected transition:

1. Keep Auth0 for identity and session handling.
2. Replace the temporary app user lookup in `src/lib/auth/app-users.ts` with MongoDB-backed queries.
3. Preserve the same centralized auth API for the rest of the app.
4. Keep route guards and UI consumers unchanged as much as possible.

## Implementation Guidance

- Do not read Auth0 claims directly in page components to make role decisions.
- Do not scatter authorization logic across modules or screens.
- Route and layout protection should call centralized helpers only.
- UI components should consume normalized auth state rather than raw provider session objects.

## Summary

- Auth0 handles identity.
- App users handle authorization.
- Roles are application data, not identity-provider data.
- MongoDB-backed app users remain the source of truth for role assignment.
- The current fallback is mock-backed.
- MongoDB will later replace only the app user data source layer.