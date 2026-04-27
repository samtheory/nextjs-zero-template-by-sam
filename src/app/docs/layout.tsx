import { DocsSideNav } from "./_components/DocsSideNav";
import type { ReactNode } from "react";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-foreground">
      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 z-20 h-screen w-72 border-r border-sidebar-border bg-sidebar-bg text-foreground transition-colors duration-200 dark:bg-sidebar-bg dark:border-sidebar-border">
        <DocsSideNav />
      </aside>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto bg-background ml-72">
        <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-12 xl:py-14">
          <div className="space-y-10">{children}</div>
        </div>
      </main>
    </div>
  );
}
