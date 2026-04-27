import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function CoreServicesDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Backend &amp; Services</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Core Services</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        Infrastructure services in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">src/core/services/</code>. These handle HTTP, cookies, tokens, storage, logging, and config — so your features don't touch these APIs directly.
      </p>

      <div className="space-y-10">

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Service Map</h2>
          <div className="space-y-2 text-sm">
            {[
              { name: "http", file: "http/http-client.service.ts", desc: "Axios wrapper — use this for all API calls, never raw axios" },
              { name: "token", file: "token/token.service.ts", desc: "Get/set/clear JWT token from secure cookie" },
              { name: "cookie (client)", file: "cookie/client-cookie.service.ts", desc: "Read/write cookies in Client Components" },
              { name: "cookie (server)", file: "cookie/server-cookie.service.ts", desc: "Read cookies in Server Components and middleware" },
              { name: "storage", file: "storage/storage.factory.ts", desc: "localStorage/sessionStorage adapter — SSR-safe" },
              { name: "logger", file: "logger/logger.service.ts", desc: "Structured logging with transports" },
              { name: "error-mapper", file: "error-mapper/error-mapper.service.ts", desc: "Maps API errors to domain errors" },
              { name: "config", file: "config/app-config.ts", desc: "Validated environment config via Zod" },
            ].map((s) => (
              <div key={s.name} className="flex gap-3 p-3 bg-surface border border-border rounded-lg">
                <code className="text-xs font-mono text-primary-600 w-36 flex-shrink-0">{s.name}</code>
                <div>
                  <code className="text-xs text-muted block">{s.file}</code>
                  <p className="text-xs text-muted mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">HTTP Client</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// The http service is an Axios instance with:
// - Base URL from env config
// - Request interceptor: injects auth token
// - Response interceptor: maps errors to domain errors

// Use in server-api.ts files:
import { httpClient } from "@/core/services/http";

const posts = await httpClient.get("/posts");          // GET
const post  = await httpClient.post("/posts", body);   // POST
await httpClient.patch(\`/posts/\${id}\`, body);          // PATCH
await httpClient.delete(\`/posts/\${id}\`);               // DELETE`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Storage Service (SSR-safe localStorage)</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// Never use localStorage directly in Next.js — it crashes on the server.
// Use the storage service instead:

import { storageFactory } from "@/core/services/storage";

const storage = storageFactory("local");  // "local" | "session"

storage.set("user-prefs", { theme: "dark" });
const prefs = storage.get<UserPrefs>("user-prefs");
storage.remove("user-prefs");
storage.clear();

// Also used by Zustand persist middleware:
import { createJSONStorage } from "zustand/middleware";
import { storageFactory } from "@/core/services/storage";

persist(storeCreator, {
  name: "my-store",
  storage: createJSONStorage(() => storageFactory("local")),
})`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Cookie Service</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// ── CLIENT (in "use client" components) ──
import { clientCookieService } from "@/core/services/cookie";

clientCookieService.set("key", "value", { maxAge: 60 * 60 * 24 * 7 }); // 7 days
const value = clientCookieService.get("key");
clientCookieService.remove("key");

// ── SERVER (in Server Components, middleware, route handlers) ──
import { serverCookieService } from "@/core/services/cookie";
import { cookies } from "next/headers";

// In a Server Component:
const cookieStore = await cookies();
const value = serverCookieService.get(cookieStore, "key");`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Accessing Services from Client Components</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// TokenService is exposed via CoreProvider context:
import { useTokenService } from "@/presentation/providers/CoreProvider";

function MyComponent() {
  const tokenService = useTokenService();
  // tokenService.getToken()
  // tokenService.setToken(token)
  // tokenService.clearToken()
}

// For other services — import directly (they handle SSR themselves):
import { storageFactory } from "@/core/services/storage";
import { clientCookieService } from "@/core/services/cookie";`}
          </CodeBlock>
        </DocsSection>

        <WorkingExampleCard href="/how-to-core-services" label="src/features/how-to-core-services" />
      </div>
    </>
  );
}
