import { PostEditor } from "@/components/admin/post-editor";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">新建文章</h1>
      <p className="mt-2 text-muted-foreground">创建一篇新的博客文章</p>

      <div className="mt-8">
        <PostEditor />
      </div>
    </div>
  );
}
