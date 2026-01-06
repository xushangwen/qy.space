import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Tag as TagIcon } from "lucide-react";
import { getPostBySlug } from "@/lib/actions/posts";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Badge } from "@/components/ui/badge";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  // Calculate reading time (approximation for Chinese/English mixed)
  const readingTime = Math.max(1, Math.ceil(post.content.length / 500));

  return (
    <article className="min-h-screen bg-background pb-20 pt-16">
      <div className="mx-auto max-w-[680px] px-6">
        <Link
          href="/blog"
          className="group mb-12 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          返回博客
        </Link>

        <header className="mb-10 text-center">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-zinc-400">
            <time className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.createdAt).toLocaleDateString("zh-CN", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span className="opacity-30">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readingTime} 分钟阅读
            </span>
          </div>

          <h1 className="mb-6 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mx-auto max-w-2xl text-[16px] leading-[1.6] text-zinc-500 dark:text-zinc-400">
              {post.excerpt}
            </p>
          )}
          
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {post.tags.map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="secondary" 
                  className="bg-zinc-100 px-3 py-1 font-normal text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  <TagIcon className="mr-1.5 h-3 w-3 opacity-70" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </header>
      </div>

      {post.coverImage && (
        <div className="mx-auto mb-16 max-w-4xl px-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-200/50 bg-zinc-100 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-800">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[680px] px-6">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  );
}
