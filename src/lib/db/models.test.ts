import assert from "node:assert/strict";
import test from "node:test";

import {
  BookCopyStatusSchema,
  BorrowRequestStatusSchema,
  PaymentStatusSchema,
} from "./models";

test("database status schemas preserve borrowing business-rule values", () => {
  assert.deepEqual(BorrowRequestStatusSchema.options, [
    "draft",
    "pending",
    "active",
    "overdue",
    "returned",
    "cancelled",
  ]);

  assert.deepEqual(BookCopyStatusSchema.options, [
    "available",
    "reserved",
    "borrowed",
    "maintenance",
  ]);

  assert.deepEqual(PaymentStatusSchema.options, [
    "unpaid",
    "pending",
    "paid",
    "waived",
  ]);
});
