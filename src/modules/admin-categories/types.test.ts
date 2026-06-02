import assert from "node:assert/strict";
import test from "node:test";

import { adminCategoryFormSchema } from "./types";

test("adminCategoryFormSchema accepts a trimmed valid category", () => {
  const result = adminCategoryFormSchema.parse({
    description: "  Books about software delivery.  ",
    name: "  Technology  ",
  });

  assert.equal(result.description, "Books about software delivery.");
  assert.equal(result.name, "Technology");
});

test("adminCategoryFormSchema rejects category names that are too short", () => {
  const result = adminCategoryFormSchema.safeParse({
    description: "",
    name: "A",
  });

  assert.equal(result.success, false);
});
