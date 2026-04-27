import Link from "next/link";

// ─── Simulate reading env config (static display) ─────────────
// In a real app these would come from process.env

const envGroups = [
  {
    title: "App",
    color: "primary",
    vars: [
      { key: "NEXT_PUBLIC_APP_URL", value: "http://localhost:3000", visibility: "public", description: "Base URL of the app" },
      { key: "NEXT_PUBLIC_APP_NAME", value: "Next.js Zero Template", visibility: "public", description: "Display name" },
    ],
  },
  {
    title: "PocketBase",
    color: "secondary",
    vars: [
      { key: "NEXT_PUBLIC_PB_URL", value: "http://127.0.0.1:8090", visibility: "public", description: "PocketBase server URL" },
      { key: "PB_ADMIN_EMAIL", value: "admin@example.com", visibility: "server", description: "Admin email (server only)" },
      { key: "PB_ADMIN_PASSWORD", value: "•••••••••••", visibility: "server", description: "Admin password (server only)" },
    ],
  },
  {
    title: "Auth",
    color: "accent",
    vars: [
      { key: "JWT_SECRET", value: "•••••••••••", visibility: "server", description: "JWT signing secret" },
      { key: "TOKEN_COOKIE_NAME", value: "auth_token", visibility: "server", description: "Cookie name for auth token" },
    ],
  },
];

const configCode = `// src/core/services/config/app.config.ts
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_PB_URL: z.string().url(),
  // Server-only (never NEXT_PUBLIC_)
  JWT_SECRET: z.string().min(32),
  TOKEN_COOKIE_NAME: z.string().default("auth_token"),
});

// Throws at startup if any var is missing or invalid
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid env variables:", parsed.error.format());
  process.exit(1);
}

export const appConfig = parsed.data;
`;

const usageCode = `// ✓ In Server Component / API route
import { appConfig } from "@/core/services/config/app.config";

const pb = new PocketBase(appConfig.NEXT_PUBLIC_PB_URL);

// ✓ In Client Component (NEXT_PUBLIC_ only)
const pbUrl = process.env.NEXT_PUBLIC_PB_URL;

// ✗ NEVER — leaks secret to browser bundle
// const secret = process.env.JWT_SECRET; // undefined in client
`;

const envFileCode = `# .env.local  (git-ignored — local dev only)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=My App
NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090
JWT_SECRET=change-me-to-a-very-long-random-string-here
TOKEN_COOKIE_NAME=auth_token

# .env.production  (production values — set in CI/CD secrets)
NEXT_PUBLIC_APP_URL=https://myapp.com
...`;

export default function HowToEnvConfig() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/env-config" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / env-config
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Environment Variables</h1>
        <p className="text-sm text-muted mb-10">Validated env config using Zod. Fails fast at startup if variables are missing.</p>

        <div className="space-y-10">
          {/* Current env overview */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-4">1 — Variables in this project</p>
            <div className="space-y-4">
              {envGroups.map((group) => (
                <div key={group.title} className="rounded-2xl border border-border bg-surface overflow-hidden">
                  <div className={`px-4 py-2.5 border-b border-border bg-${group.color}-50/60 dark:bg-${group.color}-950/30`}>
                    <p className={`text-xs font-bold text-${group.color}-700 dark:text-${group.color}-300`}>{group.title}</p>
                  </div>
                  <div className="divide-y divide-border">
                    {group.vars.map((v) => (
                      <div key={v.key} className="px-4 py-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono font-semibold text-foreground">{v.key}</p>
                          <p className="text-xs text-muted mt-0.5">{v.description}</p>
                        </div>
                        <code className="text-xs font-mono text-muted bg-surface-raised px-2 py-0.5 rounded max-w-[180px] truncate">{v.value}</code>
                        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${v.visibility === "public" ? "bg-success-50 text-success-700" : "bg-warning-50 text-warning-700"}`}>
                          {v.visibility === "public" ? "🌐 public" : "🔒 server"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Validation schema */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Zod validation schema</p>
            <pre className="p-5 rounded-2xl border border-border bg-surface text-xs font-mono text-foreground overflow-x-auto leading-relaxed whitespace-pre">
              {configCode}
            </pre>
          </section>

          {/* Usage */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Usage in components</p>
            <pre className="p-5 rounded-2xl border border-border bg-surface text-xs font-mono text-foreground overflow-x-auto leading-relaxed whitespace-pre">
              {usageCode}
            </pre>
          </section>

          {/* .env files */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-info-600 mb-3">4 — .env file setup</p>
            <pre className="p-5 rounded-2xl border border-border bg-surface text-xs font-mono text-muted overflow-x-auto leading-relaxed whitespace-pre">
              {envFileCode}
            </pre>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-success-100 bg-success-50">
                <p className="text-xs font-semibold text-success-700 mb-1">✓ Safe to commit</p>
                <p className="text-xs text-success-600">.env.example with placeholder values</p>
              </div>
              <div className="p-3 rounded-xl border border-error-100 bg-error-50">
                <p className="text-xs font-semibold text-error-700 mb-1">✗ Never commit</p>
                <p className="text-xs text-error-600">.env.local, .env.production with real secrets</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
