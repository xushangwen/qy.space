"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import pinyin from "tiny-pinyin"; // 引入 tiny-pinyin
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createPost, updatePost, type Post } from "@/lib/actions/posts";
import { toast } from "sonner";
import { TiptapEditor } from "./tiptap-editor";
import { ImageUpload } from "./image-upload";
import { TagSelector } from "./tag-selector";

const postSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  slug: z.string().min(1, "Slug 不能为空").regex(/^[a-z0-9-]+$/, "Slug 只能包含小写字母、数字和连字符"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "内容不能为空"),
  coverImage: z.string().optional(),
  published: z.boolean(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof postSchema>;

interface PostEditorProps {
  post?: Post;
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
      coverImage: post?.coverImage ?? "",
      published: post?.published ?? false,
      categoryId: post?.categoryId ?? "",
      tags: post?.tags?.map((t) => t.id) ?? [],
    },
  });

  const coverImage = watch("coverImage");
  const tags = watch("tags");

  function generateSlug(title: string) {
    if (!title) return "";
    
    // 1. 中文转拼音
    if (pinyin.isSupported()) {
      title = pinyin.convertToPinyin(title, '-', true); // true for lowerCase
    }

    // 2. 处理其他字符
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // 非字母数字替换为连字符
      .replace(/^-+|-+$/g, "")     // 去除首尾连字符
      .replace(/-+/g, "-")         // 多个连字符合并为一个
      .substring(0, 100);          // 限制长度
  }

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      // 构造符合 Server Action 要求的 payload
      // Server Action 中的 Schema 允许 coverImage 为 optional string 或 literal ""
      const payload = {
        ...data,
        coverImage: data.coverImage || "", // 确保传递空字符串而不是 undefined，或者 undefined 也可以
      };

      if (post) {
        await updatePost(post.id, payload);
        toast.success("文章已更新");
      } else {
        await createPost(payload);
        toast.success("文章已创建");
      }
      router.push("/admin/posts");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "操作失败");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              placeholder="输入文章标题"
              {...register("title", {
                onChange: (e) => {
                  if (!post) {
                    setValue("slug", generateSlug(e.target.value));
                  }
                },
              })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input id="slug" placeholder="article-slug" {...register("slug")} />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">摘要</Label>
            <Textarea
              id="excerpt"
              placeholder="文章摘要（可选）"
              rows={3}
              {...register("excerpt")}
            />
          </div>

          <div className="space-y-2">
            <Label>内容 (Markdown)</Label>
            <TiptapEditor
              initialContent={post?.content ?? ""}
              onChange={(value) => setValue("content", value)}
              className="min-h-[500px] border rounded-md"
            />
            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label>封面图片</Label>
                <ImageUpload
                  value={coverImage ?? ""}
                  onChange={(url) => {
                    setValue("coverImage", url);
                    trigger("coverImage");
                  }}
                />
                {errors.coverImage && (
                  <p className="text-sm text-destructive">
                    {errors.coverImage.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>标签</Label>
                <TagSelector
                  value={tags ?? []}
                  onChange={(val) => setValue("tags", val)}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  className="h-4 w-4 rounded border-border"
                  {...register("published")}
                />
                <Label htmlFor="published" className="font-normal">
                  立即发布
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "保存中..." : post ? "更新" : "创建"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
