"use client";

import Link from "next/link";
import { useState } from "react";

// ─── 1. Utility Types Demo ────────────────────────────────────
// These types are REAL TypeScript — we show them as visual examples
// with interactive fields that simulate what TS would do.

// Simulated TypeScript output for display
const utilityExamples = [
  {
    title: "Partial<T>",
    description: "Makes all fields optional",
    original: `type User = {
  id: string;
  name: string;
  email: string;
};`,
    result: `type PartialUser = Partial<User>;
// {
//   id?: string | undefined;
//   name?: string | undefined;
//   email?: string | undefined;
// }`,
    color: "primary",
  },
  {
    title: "Pick<T, K>",
    description: "Select specific keys",
    original: `type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};`,
    result: `type PublicUser = Pick<User, "id" | "name">;
// { id: string; name: string; }`,
    color: "secondary",
  },
  {
    title: "Omit<T, K>",
    description: "Remove specific keys",
    original: `type CreateUserPayload =
  Omit<User, "id" | "createdAt">;
// { name: string; email: string; password: string; }`,
    result: `// Use when building DTO/payload types
// Never send id / timestamps from client`,
    color: "accent",
  },
  {
    title: "ReturnType<T>",
    description: "Extract a function's return type",
    original: `function getUser() {
  return { id: "1", name: "Alice" };
}`,
    result: `type User = ReturnType<typeof getUser>;
// { id: string; name: string; }`,
    color: "info",
  },
];

// ─── 2. Generic function demo ─────────────────────────────────
function GenericDemo() {
  const [input, setInput] = useState("hello");
  const [wrapType, setWrapType] = useState<"array" | "nullable" | "response">("array");

  const outputs = {
    array: `wrap<string>("${input}") → ["${input}"]`,
    nullable: `wrap<string>("${input}") → { value: "${input}" | null }`,
    response: `wrap<string>("${input}") → { data: "${input}", ok: true }`,
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["array", "nullable", "response"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setWrapType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition ${wrapType === t ? "bg-primary-500 text-white border-primary-500" : "bg-surface-raised border-border text-muted hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full text-sm bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400"
        placeholder="Type a value..."
      />
      <div className="p-3 rounded-xl bg-surface-raised border border-border font-mono text-xs text-foreground">
        {outputs[wrapType]}
      </div>
      <p className="text-xs text-muted">
        Generic functions work on any type: <code className="bg-surface-raised px-1 rounded">function wrap&lt;T&gt;(value: T)</code>
      </p>
    </div>
  );
}

// ─── 3. Type Guard Demo ───────────────────────────────────────
function TypeGuardDemo() {
  const [value, setValue] = useState('{"name":"Alice","email":"alice@example.com"}');
  const [result, setResult] = useState<string>("");

  interface ApiUser { name: string; email: string; }

  const isApiUser = (obj: unknown): obj is ApiUser =>
    typeof obj === "object" && obj !== null &&
    typeof (obj as ApiUser).name === "string" &&
    typeof (obj as ApiUser).email === "string";

  const checkType = () => {
    try {
      const parsed = JSON.parse(value);
      if (isApiUser(parsed)) {
        setResult(`✓ Valid ApiUser — name: "${parsed.name}", email: "${parsed.email}"`);
      } else {
        setResult(`✗ Not an ApiUser — missing name or email string fields`);
      }
    } catch {
      setResult("✗ Invalid JSON");
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        className="w-full text-sm font-mono bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
      />
      <button
        onClick={checkType}
        className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition"
      >
        Run type guard
      </button>
      {result && (
        <div className={`text-xs px-3 py-2 rounded-xl border font-mono ${result.startsWith("✓") ? "bg-success-50 border-success-100 text-success-700" : "bg-error-50 border-error-100 text-error-600"}`}>
          {result}
        </div>
      )}
      <p className="text-xs text-muted font-mono">isApiUser(obj): obj is ApiUser — narrows unknown → known type</p>
    </div>
  );
}

// ─── 4. Discriminated Union ───────────────────────────────────
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function DiscriminatedUnionDemo() {
  const [state, setState] = useState<RequestState<{ name: string }>>({ status: "idle" });

  const simulate = async () => {
    setState({ status: "loading" });
    await new Promise((r) => setTimeout(r, 800));
    if (Math.random() > 0.3) {
      setState({ status: "success", data: { name: "Alice" } });
    } else {
      setState({ status: "error", message: "Network request failed" });
    }
  };

  return (
    <div className="space-y-3">
      <button onClick={simulate} disabled={state.status === "loading"} className="px-4 py-2 rounded-xl bg-secondary-500 text-white text-sm font-semibold hover:bg-secondary-600 disabled:opacity-50 transition">
        {state.status === "loading" ? "Loading..." : "Simulate fetch (70% success)"}
      </button>
      <div className="p-4 rounded-xl border border-border bg-surface-raised font-mono text-xs">
        {state.status === "idle" && <span className="text-muted">status: &quot;idle&quot; — no data access possible</span>}
        {state.status === "loading" && <span className="text-warning-600">status: &quot;loading&quot; — TypeScript blocks data access</span>}
        {state.status === "success" && <span className="text-success-600">status: &quot;success&quot; — data.name = &quot;{state.data.name}&quot; ✓</span>}
        {state.status === "error" && <span className="text-error-600">status: &quot;error&quot; — message: &quot;{state.message}&quot;</span>}
      </div>
      <p className="text-xs text-muted">TypeScript narrows the union in each branch — <code className="bg-surface-raised px-1 rounded">data</code> only accessible in success branch.</p>
    </div>
  );
}

export default function HowToTypeScript() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/typescript" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / typescript
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">TypeScript Concepts</h1>
        <p className="text-sm text-muted mb-10">Real type patterns used in this codebase. Interactive where possible.</p>

        <div className="space-y-10">
          {/* Utility Types */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-4">1 — Utility Types</p>
            <div className="space-y-3">
              {utilityExamples.map((ex) => (
                <div key={ex.title} className="p-5 rounded-2xl border border-border bg-surface">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <code className={`text-sm font-mono font-bold text-${ex.color}-600 dark:text-${ex.color}-400`}>{ex.title}</code>
                      <p className="text-xs text-muted mt-0.5">{ex.description}</p>
                    </div>
                  </div>
                  <pre className="text-xs font-mono text-foreground bg-surface-raised rounded-xl p-3 whitespace-pre-wrap overflow-x-auto leading-relaxed">{ex.original}</pre>
                  <pre className="mt-2 text-xs font-mono text-muted bg-surface-raised rounded-xl p-3 whitespace-pre-wrap overflow-x-auto leading-relaxed">{ex.result}</pre>
                </div>
              ))}
            </div>
          </section>

          {/* Generics */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Generic Functions</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><GenericDemo /></div>
          </section>

          {/* Type Guards */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Type Guards (obj is T)</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><TypeGuardDemo /></div>
          </section>

          {/* Discriminated Unions */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-info-600 mb-3">4 — Discriminated Unions (request state)</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><DiscriminatedUnionDemo /></div>
          </section>
        </div>
      </div>
    </div>
  );
}
