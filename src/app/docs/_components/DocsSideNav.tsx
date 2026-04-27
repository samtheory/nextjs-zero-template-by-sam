"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navGroups = [
  {
    title: "Getting Started",
    items: [{ label: "Introduction", href: "/docs" }],
  },
  {
    title: "Fundamentals",
    items: [
      { label: "Zod — Schema Validation", href: "/docs/zod" },
      { label: "React Query", href: "/docs/react-query" },
      { label: "React Hook Form + Zod", href: "/docs/react-hook-form-zod" },
      { label: "TypeScript Concepts", href: "/docs/typescript" },
    ],
  },
  {
    title: "Data & State",
    items: [{ label: "Zustand", href: "/docs/zustand" }],
  },
  {
    title: "Architecture",
    items: [
      { label: "How to Build a Feature", href: "/docs/build-feature" },
      { label: "How to Build a UI Component", href: "/docs/build-ui-component" },
    ],
  },
  {
    title: "Backend & Services",
    items: [
      { label: "PocketBase", href: "/docs/pocketbase" },
      { label: "Authentication", href: "/docs/authentication" },
      { label: "Core Services", href: "/docs/core-services" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { label: "Environment Variables", href: "/docs/env-config" },
      { label: "Tailwind CSS Variables", href: "/docs/tailwind-variables" },
    ],
  },
  {
    title: "UI & Animation",
    items: [{ label: "Framer Motion", href: "/docs/framer-motion" }],
  },
  {
    title: "Best Practices",
    items: [{ label: "Form Validation & Errors", href: "/docs/form-validation" }],
  },
];

export function DocsSideNav() {
  const pathname = usePathname();

  return (
    <nav className="h-full flex flex-col text-foreground">
      {/* Header */}
      <div className="px-5 py-6 border-b border-sidebar-border bg-surface-raised transition-colors duration-200 dark:bg-surface dark:border-sidebar-border">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors mb-3 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          Back to Home
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 mb-1">Documentation</p>
        <h2 className="text-sm font-bold text-foreground">Next.js Zero Template</h2>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-5 px-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-2xl transition-colors duration-200 ${isActive
                          ? "bg-sidebar-active-bg text-sidebar-active-text font-semibold"
                          : "text-muted hover:text-foreground hover:bg-surface-raised dark:hover:bg-surface"
                        }`}
                    >
                      {isActive && (
                        <span className="mr-2 w-2 h-2 rounded-full bg-sidebar-active shrink-0" />
                      )}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
