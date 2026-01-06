import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { getPosts } from "@/lib/actions/posts";

export const metadata: Metadata = {
  title: "博客",
  description: "所有文章",
};

export const revalidate = 60; // ISR: 每60秒重新验证一次

export default async function BlogPage() {
  const posts = await getPosts({ published: true });

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">博客</h1>
      <p className="mt-4 text-muted-foreground">
        记录设计思考与技术探索
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-12">
            暂无文章，敬请期待...
          </p>
        ) : (
          posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block h-full">
              <article className="group relative flex h-full flex-col rounded-xl border border-border/40 bg-card p-6 transition-colors duration-200 hover:border-foreground/20">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                {post.coverImage ? (
                  <div className="relative z-20 aspect-video w-full overflow-hidden rounded-md">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-md bg-muted" />
                )}
                <div className="flex flex-1 flex-col">
                  <h3 className="mt-4 font-semibold transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt || "暂无摘要"}
                  </p>
                </div>
                <time className="mt-4 block text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("zh-CN").replace(/\//g, "/")}
                </time>
              </article>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
