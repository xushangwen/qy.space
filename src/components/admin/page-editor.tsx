"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createPage, updatePage } from "@/lib/actions/pages";
import { toast } from "sonner";
import { TiptapEditor } from "./tiptap-editor";

const pageSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  slug: z.string().min(1, "Slug 不能为空").regex(/^[a-z0-9-]+$/, "Slug 只能包含小写字母、数字和连字符"),
  content: z.string().min(1, "内容不能为空"),
  published: z.boolean(),
});

type FormData = z.infer<typeof pageSchema>;

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
}

interface PageEditorProps {
  page?: Page;
}

export function PageEditor({ page }: PageEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: page?.title ?? "",
      slug: page?.slug ?? "",
      content: page?.content ?? "",
      published: page?.published ?? false,
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      if (page) {
        await updatePage(page.id, data);
        toast.success("页面已更新");
      } else {
        await createPage(data);
        toast.success("页面已创建");
      }
      router.push("/admin/pages");
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
              placeholder="输入页面标题"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input id="slug" placeholder="page-slug" {...register("slug")} />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>内容</Label>
            <TiptapEditor
              initialContent={page?.content ?? ""}
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
              {isLoading ? "保存中..." : page ? "更新" : "创建"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
