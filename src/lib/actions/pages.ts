"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PageSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  slug: z.string().min(1, "Slug 不能为空").regex(/^[a-z0-9-]+$/, "Slug 只能包含小写字母、数字和连字符"),
  content: z.string().min(1, "内容不能为空"),
  published: z.boolean().default(false),
});

export type PageFormData = z.infer<typeof PageSchema>;

export async function getPages() {
  return db.page.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPageBySlug(slug: string) {
  return db.page.findUnique({
    where: { slug },
  });
}

export async function getPageById(id: string) {
  return db.page.findUnique({
    where: { id },
  });
}

export async function createPage(data: PageFormData) {
  try {
    const validated = PageSchema.parse(data);
    const page = await db.page.create({
      data: validated,
    });
    revalidatePath("/admin/pages");
    return { success: true, data: page };
  } catch (error) {
    console.error("createPage error:", error);
    return { success: false, error: "创建页面失败" };
  }
}

export async function updatePage(id: string, data: PageFormData) {
  try {
    const validated = PageSchema.parse(data);
    const page = await db.page.update({
      where: { id },
      data: validated,
    });
    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);
    return { success: true, data: page };
  } catch (error) {
    console.error("updatePage error:", error);
    return { success: false, error: "更新页面失败" };
  }
}

export async function deletePage(id: string) {
  try {
    const page = await db.page.delete({
      where: { id },
    });
    revalidatePath("/admin/pages");
    return { success: true, data: page };
  } catch (error) {
    console.error("deletePage error:", error);
    return { success: false, error: "删除页面失败" };
  }
}
