import "server-only";

import { ObjectId } from "mongodb";

import {
  CreateCategoryInputSchema,
  UpdateCategoryInputSchema,
  getBooksCollection,
  getCategoriesCollection,
  isMongoConfigured,
} from "@/lib/db";

export interface SaveAdminCategoryInput {
  categoryId?: string;
  description: string;
  name: string;
}

export interface SavedAdminCategoryRecord {
  id: string;
  name: string;
}

function toDatabaseId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : id;
}

function slugifyCategoryName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function assertUniqueCategory(options: {
  categoryId?: string;
  name: string;
  slug: string;
}) {
  const categories = await getCategoriesCollection();
  const existingCategory = await categories.findOne({
    $or: [{ name: options.name }, { slug: options.slug }],
  });

  if (!existingCategory?._id) {
    return;
  }

  if (
    options.categoryId &&
    existingCategory._id.toString() === options.categoryId
  ) {
    return;
  }

  throw new Error("Another category already uses that name.");
}

export async function saveAdminCategory(input: SaveAdminCategoryInput) {
  if (!isMongoConfigured()) {
    throw new Error("Category management requires MongoDB to be configured.");
  }

  const name = input.name.trim();
  const slug = slugifyCategoryName(name);

  if (!slug) {
    throw new Error(
      "Category name must include at least one letter or number.",
    );
  }

  await assertUniqueCategory({
    categoryId: input.categoryId,
    name,
    slug,
  });

  const categories = await getCategoriesCollection();
  const now = new Date();
  const payload = {
    description: input.description.trim(),
    name,
    slug,
  };

  if (!input.categoryId) {
    const parsed = CreateCategoryInputSchema.parse(payload);
    const result = await categories.insertOne({
      ...parsed,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: result.insertedId.toString(),
      name: parsed.name,
    } satisfies SavedAdminCategoryRecord;
  }

  const parsed = UpdateCategoryInputSchema.parse(payload);
  const result = await categories.findOneAndUpdate(
    { _id: toDatabaseId(input.categoryId) },
    {
      $set: {
        ...parsed,
        updatedAt: now,
      },
    },
    {
      returnDocument: "after",
    },
  );

  if (!result?._id) {
    throw new Error("The selected category could not be found.");
  }

  return {
    id: result._id.toString(),
    name: result.name,
  } satisfies SavedAdminCategoryRecord;
}

export async function deleteAdminCategory(categoryId: string) {
  if (!isMongoConfigured()) {
    throw new Error("Category management requires MongoDB to be configured.");
  }

  const selector = { _id: toDatabaseId(categoryId) };
  const [categories, books] = await Promise.all([
    getCategoriesCollection(),
    getBooksCollection(),
  ]);
  const category = await categories.findOne(selector);

  if (!category?._id) {
    throw new Error("The selected category could not be found.");
  }

  const linkedBookCount = await books.countDocuments({
    categoryId: { $in: [category._id, category._id.toString()] },
  });

  if (linkedBookCount > 0) {
    throw new Error(
      "Categories with linked books cannot be deleted. Move or archive those books first.",
    );
  }

  await categories.deleteOne(selector);

  return {
    id: category._id.toString(),
    name: category.name,
  } satisfies SavedAdminCategoryRecord;
}
