# Business Rules

This document defines the current backend-ready business rules for the library borrowing platform. It is intended to guide future API, database, and workflow implementation.

## 1. Borrowing Rules

### Core borrowing unit

- Members borrow physical copies, not abstract book titles.
- A book title may have many copies.
- A borrowing record must reference exactly one member and exactly one physical copy.

### Duration types

- A borrowing may use a predefined borrowing duration.
- A borrowing may also use a custom duration request.
- Custom duration requests are exceptions and may require admin review before approval.
- If a custom duration is not approved, the borrowing should not become active.

### Borrowing statuses

- `draft`: a temporary client or server-side record before submission is finalized.
- `pending`: the borrowing request has been submitted and is awaiting review or approval.
- `active`: the borrowing has been approved, the copy is checked out, and the due date is in effect.
- `overdue`: the borrowing is still active, but the due date has passed and the item has not been returned.
- `returned`: the copy has been returned and the borrowing is complete from a circulation perspective.
- `cancelled`: the request or borrowing was cancelled before completion.

### Borrowing constraints

- Only authenticated members may create borrowing requests.
- Guests may browse books and book details but may not start a borrowing request.
- Admins may review and manage borrowings. Whether admins can borrow as members should remain an explicit product decision and not be assumed by default.
- A borrowing request should not be approved unless the referenced copy is currently borrowable.

## 2. Payment Rules

### Payment method

- Payment is onsite cash only.
- No online payment gateway is required in the current system design.
- Payment status must be tracked independently from borrowing status.

### Payment statuses

- `unpaid`: the member owes the borrowing fee and has not yet paid.
- `pending`: payment is expected or being reconciled onsite but is not yet confirmed.
- `paid`: onsite cash payment has been received and confirmed.
- `waived`: the fee was intentionally removed by policy or admin decision.

### Payment behavior

- A borrowing may have a fee or may be free.
- Free borrowings should still allow a payment status field if needed for consistency, but they should normally be treated as not requiring collection.
- Admin views should make unpaid cash obligations clearly visible.

## 3. Inventory Rules

### Book and copy relationship

- A book title has one or more physical copies.
- Copies are the borrowable inventory units.
- Inventory records must reference an existing book title.

### Borrowability

- Only copies with status `available` may be newly borrowed.
- Copies in any other status are not eligible for new borrowing requests.

### Copy status lifecycle

- `available`: the copy is ready for checkout.
- `reserved`: the copy is temporarily held for an approved or in-process borrowing flow.
- `borrowed`: the copy is currently checked out to a member.
- `maintenance`: the copy is temporarily unavailable because it requires repair, inspection, or handling.

### Inventory expectations

- Copy status must stay consistent with borrowing activity.
- When a borrowing becomes active, the related copy should no longer be `available`.
- When a borrowing is completed and the copy is returned in usable condition, the copy should return to `available` unless another operational state applies.

## 4. Role Rules

### Guest

- May browse public book listings and book details.
- May not access borrowing or personal account routes.
- May not access admin routes.

### Member

- May browse books.
- May create borrowing requests.
- May access personal account pages such as borrowings and profile.
- May not access admin-only management pages unless explicitly granted admin rights.

### Admin

- Has full management access to admin routes and operational tools.
- May manage books, categories, borrowings, inventory, users, and dashboard workflows.
- Admin access must be enforced separately from member access.

## 5. Borrow Lifecycle

The intended business flow is:

1. `request`
2. `review`
3. `approval`
4. `active`
5. `return`
6. `completion`

### Lifecycle interpretation

- `request`: a member submits a borrowing request for a specific copy and duration.
- `review`: the request is inspected, especially if it includes exceptions such as custom duration.
- `approval`: an admin accepts the request and confirms the copy may be borrowed.
- `active`: the item is checked out and the due date window is running.
- `return`: the item is handed back to the library.
- `completion`: the borrowing record is finalized, payment is settled or waived if needed, and the copy returns to the correct inventory state.

### Exceptional outcomes

- A request may be rejected during review.
- A request or borrowing may be cancelled before completion.
- An active borrowing may transition to `overdue` if not returned by the due date.

## 6. Email Events

These events are planned but not implemented yet.

### Planned notifications

- Request confirmation: sent when a borrowing request is submitted.
- Approval confirmation: sent when a borrowing request is approved.
- Due reminder: sent before the due date.
- Overdue reminder: sent after the due date has passed.

### Implementation notes

- Email events should be triggered from domain events, not directly from UI actions.
- Email delivery should be asynchronous and resilient to retry.
- Templates should be role-aware and status-aware.

## Implementation Notes

- Borrowing status, payment status, copy status, and role values should be modeled as explicit enums or equivalent constrained values in the future backend.
- Copy references, book references, and user references should be represented by stable identifiers suitable for MongoDB document relations.
- UI mock flows should continue to mirror these rules so the later Auth0 and MongoDB integration can replace the mocked layer without changing the business model.