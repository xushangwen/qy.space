"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TagSchema = z.object({
  name: z.string().min(1, "标签名不能为空"),
  slug: z.string().min(1, "Slug 不能为空").regex(/^[a-z0-9-]+$/, "Slug 只能包含小写字母、数字和连字符"),
});

export type TagFormData = z.infer<typeof TagSchema>;

export async function getTags() {
  return db.tag.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createTag(data: TagFormData) {
  try {
    const validated = TagSchema.parse(data);
    const tag = await db.tag.create({
      data: validated,
    });
    revalidatePath("/admin/tags");
    return { success: true, data: tag };
  } catch (error) {
    console.error("createTag error:", error);
    return { success: false, error: "创建标签失败" };
  }
}
