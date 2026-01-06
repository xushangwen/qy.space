import { notFound } from "next/navigation";
import { getPageById } from "@/lib/actions/pages";
import { PageEditor } from "@/components/admin/page-editor";

interface EditPagePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPagePage({ params }: EditPagePageProps) {
  const { id } = await params;
  const page = await getPageById(id);

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">编辑页面</h1>
      </div>
      <PageEditor page={page} />
    </div>
  );
}
