import { Metadata } from "next";
import { getPageBySlug } from "@/lib/actions/pages";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 QiaoYa.Studio",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const page = await getPageBySlug("about");

  // 如果没有找到数据库中的 about 页面，显示默认内容
  if (!page || !page.published) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">关于我</h1>
        <div className="mt-8 text-muted-foreground">
          <p>内容正在建设中...</p>
          <p className="mt-2 text-sm">
            请在后台创建一个 Slug 为 "about" 的页面。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.title}</h1>
      <div className="mt-12">
        <MarkdownRenderer content={page.content} />
      </div>
    </div>
  );
}
