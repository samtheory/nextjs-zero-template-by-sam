import Link from "next/link";

const navGroups = [
  {
    title: null,
    items: [{ label: "Home", href: "/", active: true }],
  },
  {
    title: "Fundamentals",
    items: [
      { label: "Zod", href: "/docs/zod" },
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
      { label: "Build a Feature", href: "/docs/build-feature" },
      { label: "Build a UI Component", href: "/docs/build-ui-component" },
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

const featuredTopics = [
  { label: "Zod", desc: "Schema validation & inference", href: "/docs/zod", color: "bg-primary-50 border-primary-200 text-primary-700" },
  { label: "React Query", desc: "Server state management", href: "/docs/react-query", color: "bg-secondary-50 border-secondary-200 text-secondary-700" },
  { label: "Zustand", desc: "Client state stores", href: "/docs/zustand", color: "bg-accent-50 border-accent-200 text-accent-700" },
  { label: "PocketBase", desc: "Full-stack backend", href: "/docs/pocketbase", color: "bg-info-50 border-info-200 text-info-700" },
];

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* ── Side Navigation ── */}
      <aside className="w-64 shrink-0 h-full flex flex-col bg-sidebar-bg border-r border-sidebar-border">
        <div className="px-4 py-5 border-b border-sidebar-border">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-0.5">Next.js Zero</p>
          <h1 className="text-sm font-bold text-foreground">Learning Template</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {navGroups.map((group, i) => (
            <div key={i}>
              {group.title && (
                <p className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {group.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors ${
                        "active" in item && item.active
                          ? "bg-sidebar-active-bg text-sidebar-active-text font-medium"
                          : "text-muted hover:text-foreground hover:bg-surface-raised"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto flex items-center justify-center px-8 py-16">
        <div className="max-w-xl w-full text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-200">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            14 topics · working code examples
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
            Learn Modern<br />
            <span className="text-primary-600">Next.js Development</span>
          </h2>
          <p className="text-muted text-base leading-relaxed mb-8">
            A hands-on reference covering Zod, React Query, Zustand, PocketBase, Framer Motion, and more — each with working examples and best-practice guides.
          </p>

          {/* Primary CTA */}
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            Browse Documentation
            <span aria-hidden="true">→</span>
          </Link>

          {/* Quick access cards */}
          <div className="mt-10 grid grid-cols-2 gap-3 text-left">
            {featuredTopics.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-3.5 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-sm ${item.color}`}
              >
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs opacity-70 mt-0.5">{item.desc}</p>
              </Link>
            ))}
          </div>

          {/* Footer hint */}
          <p className="mt-8 text-xs text-muted-foreground">
            All examples live in{" "}
            <code className="font-mono bg-surface-raised px-1 py-0.5 rounded text-foreground">
              src/features/how-to-*
            </code>
          </p>
        </div>
      </main>
    </div>
  );
}

