import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/post-editor";
import { getPostById } from "@/lib/actions/posts";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">编辑文章</h1>
      <p className="mt-2 text-muted-foreground">修改文章内容</p>

      <div className="mt-8">
        <PostEditor post={post} />
      </div>
    </div>
  );
}
