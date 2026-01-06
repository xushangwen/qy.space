import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, FileText, StickyNote } from "lucide-react";

const sidebarItems = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/posts", label: "文章管理", icon: FileText },
  { href: "/admin/pages", label: "页面管理", icon: StickyNote },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Fixed Left */}
      <aside className="flex w-64 flex-col border-r border-border bg-card">
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
          <Link href="/admin" className="text-lg font-semibold">
            QY.Space
          </Link>
          <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            Admin
          </span>
        </div>

        {/* Navigation - Scrollable if needed */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer - Fixed at bottom of sidebar */}
        <div className="shrink-0 border-t border-border p-4">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">管理员</span>
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                返回前台 →
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - Scrollable Right Side */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-8 pb-20">{children}</div>
      </main>
    </div>
  );
}
