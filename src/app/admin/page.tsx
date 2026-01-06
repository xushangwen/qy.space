import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, Clock } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [totalPosts, publishedPosts] = await Promise.all([
      db.post.count(),
      db.post.count({ where: { published: true } }),
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
    };
  } catch {
    return { totalPosts: 0, publishedPosts: 0, draftPosts: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">仪表盘</h1>
      <p className="mt-2 text-muted-foreground">欢迎回来，这是你的博客概览。</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">总文章数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">已发布</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">草稿</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftPosts}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
