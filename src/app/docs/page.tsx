import Link from "next/link";
import { DocsSection } from "./_components/DocsSection";

const topics = [
  {
    group: "Fundamentals",
    color: "border-primary-200 bg-primary-50",
    labelColor: "text-primary-700",
    items: [
      { label: "Zod", href: "/docs/zod", desc: "Schema validation, type inference, transforms" },
      { label: "React Query", href: "/docs/react-query", desc: "useQuery, useMutation, cache invalidation" },
      { label: "React Hook Form + Zod", href: "/docs/react-hook-form-zod", desc: "Controlled forms with schema validation" },
      { label: "TypeScript Concepts", href: "/docs/typescript", desc: "Utility types, generics, type guards" },
    ],
  },
  {
    group: "State Management",
    color: "border-secondary-200 bg-secondary-50",
    labelColor: "text-secondary-700",
    items: [
      { label: "Zustand", href: "/docs/zustand", desc: "Client state, persist, slices, disposal" },
    ],
  },
  {
    group: "Architecture",
    color: "border-accent-200 bg-accent-50",
    labelColor: "text-accent-700",
    items: [
      { label: "How to Build a Feature", href: "/docs/build-feature", desc: "Feature structure, naming, barrel exports" },
      { label: "How to Build a UI Component", href: "/docs/build-ui-component", desc: "cva, Tailwind, polymorphic patterns" },
    ],
  },
  {
    group: "Backend & Services",
    color: "border-info-200 bg-info-50",
    labelColor: "text-info-700",
    items: [
      { label: "PocketBase", href: "/docs/pocketbase", desc: "Collections, CRUD, auth, realtime" },
      { label: "Authentication", href: "/docs/authentication", desc: "JWT, cookies, token service, guards" },
      { label: "Core Services", href: "/docs/core-services", desc: "Cookie, storage, http, token services" },
    ],
  },
  {
    group: "Configuration",
    color: "border-warning-200 bg-warning-50",
    labelColor: "text-warning-700",
    items: [
      { label: "Environment Variables", href: "/docs/env-config", desc: "Multi-env setup, validation, NEXT_PUBLIC" },
      { label: "Tailwind CSS Variables", href: "/docs/tailwind-variables", desc: "@theme, semantic tokens, dark mode" },
    ],
  },
  {
    group: "UI & Animation",
    color: "border-error-200 bg-error-50",
    labelColor: "text-error-700",
    items: [
      { label: "Framer Motion", href: "/docs/framer-motion", desc: "motion, AnimatePresence, variants, gestures" },
    ],
  },
  {
    group: "Best Practices",
    color: "border-success-200 bg-success-50",
    labelColor: "text-success-700",
    items: [
      { label: "Form Validation & Error Handling", href: "/docs/form-validation", desc: "Zod + RHF patterns, error mapping, UX" },
    ],
  },
];

export default function DocsHome() {
  return (
    <>
      {/* Hero */}
      <div className="mb-12">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Next.js Zero Template</p>
        <h1 className="text-3xl font-bold text-foreground mb-3 leading-tight">Documentation</h1>
        <p className="text-muted text-base leading-relaxed max-w-xl">
          Each topic includes a concept guide, best practices for this project structure, and a working example in{" "}
          <code className="font-mono bg-surface-raised px-1 py-0.5 rounded text-foreground text-sm">
            src/features/how-to-*
          </code>
          .
        </p>
      </div>

      {/* Topics by group */}
      <div className="space-y-8">
        {topics.map((group) => (
          <DocsSection key={group.group}>
            <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 ${group.labelColor}`}>
              {group.group}
            </h2>
            <div className="grid gap-2">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-start justify-between p-4 rounded-xl border transition-all ring-4 ring-transparent hover:ring-secondary-700/30 hover:shadow-md ${group.color}`}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-muted-foreground mt-0.5 ml-4 shrink-0">→</span>
                </Link>
              ))}
            </div>
          </DocsSection>
        ))}
      </div>
    </>
  );
}
