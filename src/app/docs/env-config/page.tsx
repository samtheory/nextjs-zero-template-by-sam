import Link from "next/link";

export default function EnvConfigDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Configuration</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Environment Variables</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        How to define, validate, and use environment variables safely across local, staging, and production — using Zod for runtime validation.
      </p>

      <div className="space-y-10">

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">File Conventions</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`.env                  # Shared defaults — COMMITTED to git (no secrets)
.env.local            # Local overrides — NOT committed (in .gitignore)
.env.development      # Dev-specific — committed
.env.production       # Production — committed (use for non-secret defaults)
.env.production.local # Production secrets — NOT committed

# Next.js loads these automatically based on NODE_ENV.
# More specific files override less specific ones.`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">NEXT_PUBLIC_ vs Server-Only</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`# .env.local

# ✓ Available in browser (bundled into JS) — only for non-secret values
NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090
NEXT_PUBLIC_APP_NAME="My App"

# ✓ Server-only (NOT in browser bundle) — for secrets
PB_ADMIN_EMAIL=admin@example.com
PB_ADMIN_PASSWORD=supersecret
JWT_SECRET=my-jwt-secret`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Validated Config with Zod</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`// core/services/config/env-validator.ts
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_PB_URL: z.string().url("NEXT_PUBLIC_PB_URL must be a valid URL"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Next.js App"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // Server-only (only validate on server — these won't exist in browser)
  JWT_SECRET: z.string().min(32).optional(),
});

// Validate at app startup — fails fast if misconfigured
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">App Config Service</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`// core/services/config/app-config.ts
// Wraps validated env vars into a typed config object

import { env } from "./env-validator";

export const appConfig = {
  pocketbase: {
    url: env.NEXT_PUBLIC_PB_URL,
  },
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    isDevelopment: env.NODE_ENV === "development",
    isProduction: env.NODE_ENV === "production",
  },
} as const;

// Usage anywhere:
// import { appConfig } from "@/core/services/config";
// const pb = new PocketBase(appConfig.pocketbase.url);`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Multi-Environment Setup</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`# .env (committed — shared defaults)
NEXT_PUBLIC_APP_NAME="Zero Template"

# .env.development (committed)
NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090

# .env.production (committed — no secrets)
NEXT_PUBLIC_PB_URL=https://your-pb-host.com

# .env.local (NOT committed — local overrides)
# Override any value here for your machine only
NEXT_PUBLIC_PB_URL=http://localhost:8091

# In CI/CD — set env vars as secrets in your pipeline:
# GitHub Actions: Settings → Secrets → NEXT_PUBLIC_PB_URL
# Vercel: Project → Settings → Environment Variables`}</code>
          </pre>
        </section>

        <section className="p-4 bg-warning-50 border border-warning-200 rounded-xl">
          <p className="text-sm font-semibold text-warning-700 mb-1">Working Example</p>
          <Link href="/how-to-env-config" className="inline-flex items-center gap-1.5 text-xs font-semibold text-warning-600 hover:text-warning-800">
            <code className="bg-warning-100 px-1.5 py-0.5 rounded">src/features/how-to-env-config</code>
            <span>→</span>
          </Link>
        </section>
      </div>
    </>
  );
}
