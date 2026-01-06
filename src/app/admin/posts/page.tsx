import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { PostActions } from "@/components/admin/post-actions";

export const dynamic = "force-dynamic";

async function getPosts() {
  try {
    return await db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
  } catch {
    return [];
  }
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">文章管理</h1>
          <p className="mt-2 text-muted-foreground">管理你的所有博客文章</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            新建文章
          </Link>
        </Button>
      </div>

      <div className="mt-8 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>标题</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  暂无文章，点击右上角创建第一篇文章
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="font-medium hover:underline"
                    >
                      {post.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">{post.slug}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "已发布" : "草稿"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {post.category?.name || (
                      <span className="text-muted-foreground">未分类</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                  </TableCell>
                  <TableCell>
                    <PostActions post={post} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
