import assert from "node:assert/strict";
import test from "node:test";

import { adminInventoryFormSchema } from "./types";

test("adminInventoryFormSchema accepts a valid physical copy", () => {
  const result = adminInventoryFormSchema.parse({
    bookId: "book-1",
    condition: "good",
    copyCode: "DT-FIC-1984-04",
    status: "available",
  });

  assert.equal(result.bookId, "book-1");
  assert.equal(result.condition, "good");
  assert.equal(result.copyCode, "DT-FIC-1984-04");
  assert.equal(result.status, "available");
});

test("adminInventoryFormSchema rejects an empty book reference", () => {
  const result = adminInventoryFormSchema.safeParse({
    bookId: "",
    condition: "good",
    copyCode: "DT-FIC-1984-04",
    status: "available",
  });

  assert.equal(result.success, false);
});
