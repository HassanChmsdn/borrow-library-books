# Super Admin Provisioning

This document defines the supported manual workflow for provisioning a `super_admin` account.

## Purpose

- Auth0 remains responsible for identity only.
- MongoDB remains the source of truth for application roles.
- `super_admin` is reserved for explicit manual provisioning rather than automatic signup.

## Supported Workflow

1. Create the user manually in Auth0.
2. Copy the Auth0 subject exactly as stored in the Auth0 profile, for example `auth0|abc123xyz`.
3. Run the provisioning script to create or update the matching MongoDB app-user record.

## Command

```bash
npm run db:provision-user -- \
  --auth0-user-id=auth0|abc123xyz \
  --email=owner@example.com \
  --name="Library Owner" \
  --role=super_admin
```

## Optional Flags

- `--status=active`
- `--avatar-url=https://example.com/avatar.png`
- `--dry-run`

## Important Constraints

- Do not use Auth0 RBAC roles for application authorization.
- The Auth0 user must exist before running the script.
- The `auth0-user-id` value must match the Auth0 subject exactly.
- Re-running the script updates the existing MongoDB app-user record for that Auth0 subject.

## Verification

- Confirm that the `users` collection contains a record with the expected:
  - `auth0UserId`
  - `email`
  - `name`
  - `role: "super_admin"`
  - `status: "active"`
- Sign in through the normal Auth0 admin entry path and verify that the session resolves to staff access through the MongoDB user record.