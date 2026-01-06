"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { z } from "zod";

const PostSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  slug: z.string().min(1, "Slug 不能为空").regex(/^[a-z0-9-]+$/, "Slug 只能包含小写字母、数字和连字符"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "内容不能为空"),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type PostFormData = z.infer<typeof PostSchema>;

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
  category: { id: string; name: string; slug: string } | null;
  tags: { id: string; name: string; slug: string }[];
};

export async function getPosts(options?: { published?: boolean; limit?: number }): Promise<Post[]> {
  const { published, limit } = options ?? {};
  
  return db.post.findMany({
    where: published !== undefined ? { published } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { 
      category: true,
      tags: true, 
    },
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return db.post.findUnique({
    where: { slug },
    include: { 
      category: true,
      tags: true,
    },
  });
}

export async function getPostById(id: string): Promise<Post | null> {
  return db.post.findUnique({
    where: { id },
    include: { 
      category: true,
      tags: true,
    },
  });
}

export type ActionResult<T = unknown> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function createPost(data: PostFormData): Promise<ActionResult<Post>> {
  try {
    const validated = PostSchema.parse(data);
    
    const post = await db.post.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt || null,
        content: validated.content,
        coverImage: validated.coverImage || null,
        published: validated.published,
        categoryId: validated.categoryId || null,
        tags: validated.tags ? {
          connect: validated.tags.map(id => ({ id }))
        } : undefined,
      },
      include: {
        category: true,
        tags: true,
      }
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/posts");

    return { success: true, data: post };
  } catch (error) {
    console.error("createPost error:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(", "),
      };
    }
    return {
      success: false,
      error: "创建文章失败",
    };
  }
}

export async function updatePost(id: string, data: PostFormData): Promise<ActionResult<Post>> {
  try {
    const validated = PostSchema.parse(data);

    const post = await db.post.update({
      where: { id },
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt || null,
        content: validated.content,
        coverImage: validated.coverImage || null,
        published: validated.published,
        categoryId: validated.categoryId || null,
        tags: validated.tags ? {
          set: validated.tags.map(id => ({ id }))
        } : undefined,
      },
      include: {
        category: true,
        tags: true,
      }
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/posts");

    return { success: true, data: post };
  } catch (error) {
    console.error("updatePost error:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(", "),
      };
    }
    return {
      success: false,
      error: "更新文章失败",
    };
  }
}

export async function deletePost(id: string) {
  const post = await db.post.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/posts");

  return post;
}

export async function togglePostPublished(id: string): Promise<ActionResult<Post>> {
  try {
    const post = await db.post.findUnique({ where: { id } });
    if (!post) {
      return { success: false, error: "文章不存在" };
    }

    const updated = await db.post.update({
      where: { id },
      data: { published: !post.published },
      include: {
        category: true,
        tags: true,
      }
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug}`);
    revalidatePath("/admin/posts");

    return { success: true, data: updated };
  } catch (error) {
    console.error("togglePostPublished error:", error);
    return { success: false, error: "切换发布状态失败" };
  }
}
