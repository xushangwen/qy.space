import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { getPosts } from "@/lib/actions/posts";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getPosts({ published: true, limit: 3 });

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <BackgroundBeams className="-z-10" />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            QY
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          设计师 / 开发者 / 创作者
          <br />
          记录设计思考与技术探索
        </p>
        <div className="mt-10 flex gap-4">
          <Button asChild size="lg">
            <Link href="/blog">
              浏览文章
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">关于我</Link>
          </Button>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">最新文章</h2>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            查看全部 →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    <div className="relative aspect-video w-full overflow-hidden rounded-md">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
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
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                  </time>
                </article>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
