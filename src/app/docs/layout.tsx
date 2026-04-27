import { DocsSideNav } from "./_components/DocsSideNav";
import type { ReactNode } from "react";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 h-full bg-sidebar-bg border-r border-sidebar-border">
        <DocsSideNav />
      </aside>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
