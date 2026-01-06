import Link from "next/link";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getPages, deletePage } from "@/lib/actions/pages";

export const dynamic = "force-dynamic";

interface Page {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  updatedAt: Date;
}

export default async function AdminPagesPage() {
  const pages = await getPages() as Page[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">页面管理</h1>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus className="mr-2 h-4 w-4" />
            新建页面
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>标题</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  暂无页面
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      {page.title}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{page.slug}</TableCell>
                  <TableCell>
                    <Badge variant={page.published ? "default" : "secondary"}>
                      {page.published ? "已发布" : "草稿"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(page.updatedAt).toLocaleDateString("zh-CN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/pages/${page.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">编辑</span>
                        </Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await deletePage(page.id);
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">删除</span>
                        </Button>
                      </form>
                    </div>
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
