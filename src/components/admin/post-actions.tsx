"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deletePost, togglePostPublished } from "@/lib/actions/posts";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
}

export function PostActions({ post }: { post: Post }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleTogglePublished() {
    setIsLoading(true);
    try {
      await togglePostPublished(post.id);
      toast.success(post.published ? "已取消发布" : "已发布");
    } catch {
      toast.error("操作失败");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    setIsLoading(true);
    try {
      await deletePost(post.id);
      toast.success("文章已删除");
      setShowDeleteDialog(false);
    } catch {
      toast.error("删除失败");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/posts/${post.id}`}>
              <Pencil className="mr-2 h-4 w-4" />
              编辑
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleTogglePublished} disabled={isLoading}>
            {post.published ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                取消发布
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                发布
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除文章「{post.title}」吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "删除中..." : "删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
