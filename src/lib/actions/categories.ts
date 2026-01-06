"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  slug: z.string().min(1, "Slug 不能为空").regex(/^[a-z0-9-]+$/, "Slug 只能包含小写字母、数字和连字符"),
});

export type CategoryFormData = z.infer<typeof CategorySchema>;

export async function getCategories() {
  return db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: { posts: { where: { published: true }, orderBy: { createdAt: "desc" } } },
  });
}

export async function createCategory(data: CategoryFormData) {
  const validated = CategorySchema.parse(data);

  const category = await db.category.create({
    data: validated,
  });

  revalidatePath("/admin/posts");

  return category;
}

export async function updateCategory(id: string, data: CategoryFormData) {
  const validated = CategorySchema.parse(data);

  const category = await db.category.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/admin/posts");

  return category;
}

export async function deleteCategory(id: string) {
  await db.category.delete({
    where: { id },
  });

  revalidatePath("/admin/posts");
}
