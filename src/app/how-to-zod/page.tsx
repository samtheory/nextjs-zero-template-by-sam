"use client";

import Link from "next/link";
import { z } from "zod";
import { useState } from "react";

// ─── Schemas ──────────────────────────────────────────────────
const emailSchema = z.string().email("Enter a valid email");

const userSchema = z.object({
  username: z.string().min(3, "Min 3 chars").max(20, "Max 20 chars").regex(/^[a-z0-9_]+$/, "Lowercase, numbers, underscores only"),
  age: z.coerce.number().int("Must be a whole number").min(13, "Must be 13+").max(120),
  website: z.string().url("Must start with https://").optional().or(z.literal("")),
});

const passwordSchema = z
  .string()
  .min(8, "Min 8 characters")
  .regex(/[A-Z]/, "Needs an uppercase letter")
  .regex(/[0-9]/, "Needs a number")
  .regex(/[^a-zA-Z0-9]/, "Needs a special character");

// ─── 1. Email Validator Demo ──────────────────────────────────
function EmailDemo() {
  const [value, setValue] = useState("");
  const result = value ? emailSchema.safeParse(value) : null;
  return (
    <div className="space-y-2">
      <input
        placeholder="type an email..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full text-sm bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-muted"
      />
      {result && (
        <div className={`text-xs px-3 py-2 rounded-lg font-mono ${result.success ? "bg-success-50 text-success-700 border border-success-100" : "bg-error-50 text-error-600 border border-error-100"}`}>
          {result.success ? `✓  "${result.data}"` : `✗  ${result.error.issues[0].message}`}
        </div>
      )}
    </div>
  );
}

// ─── 2. Object Schema + safeParse ────────────────────────────
function ObjectSchemaDemo() {
  const [form, setForm] = useState({ username: "", age: "", website: "" });
  const [result, setResult] = useState<ReturnType<typeof userSchema.safeParse> | null>(null);

  const handleParse = () => setResult(userSchema.safeParse({ ...form }));
  const fieldError = (key: string) =>
    result && !result.success
      ? result.error.issues.find((i) => i.path[0] === key)?.message
      : null;

  return (
    <div className="space-y-3">
      {(["username", "age", "website"] as const).map((key) => (
        <div key={key}>
          <label className="block text-xs text-muted mb-1 capitalize">{key}</label>
          <input
            placeholder={key === "website" ? "https://... (optional)" : ""}
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className={`w-full text-sm bg-background border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-muted ${fieldError(key) ? "border-error-400" : "border-border"}`}
          />
          {fieldError(key) && <p className="text-xs text-error-500 mt-1">{fieldError(key)}</p>}
        </div>
      ))}
      <button
        onClick={handleParse}
        className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition"
      >
        safeParse()
      </button>
      {result?.success && (
        <pre className="text-xs bg-success-50 border border-success-100 text-success-700 rounded-xl p-3 font-mono">
          {JSON.stringify(result.data, null, 2)}
        </pre>
      )}
    </div>
  );
}

// ─── 3. Password Strength Demo ────────────────────────────────
function PasswordDemo() {
  const [value, setValue] = useState("");
  const result = value ? passwordSchema.safeParse(value) : null;
  const checks = [
    { label: "Min 8 characters", pass: value.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(value) },
    { label: "Number", pass: /[0-9]/.test(value) },
    { label: "Special character", pass: /[^a-zA-Z0-9]/.test(value) },
  ];

  return (
    <div className="space-y-3">
      <input
        type="password"
        placeholder="type a password..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full text-sm bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-muted"
      />
      <div className="grid grid-cols-2 gap-1.5">
        {checks.map((c) => (
          <div key={c.label} className={`text-xs flex items-center gap-1.5 px-2 py-1.5 rounded-lg border ${value ? (c.pass ? "bg-success-50 border-success-100 text-success-700" : "bg-error-50 border-error-100 text-error-500") : "bg-surface-raised border-border text-muted"}`}>
            <span>{value ? (c.pass ? "✓" : "✗") : "·"}</span>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
      {result?.success && (
        <p className="text-xs text-success-700 bg-success-50 border border-success-100 px-3 py-2 rounded-lg">✓ Strong password</p>
      )}
    </div>
  );
}

// ─── 4. Transform Demo ───────────────────────────────────────
const slugSchema = z.string()
  .toLowerCase()
  .trim()
  .transform((s) => s.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));

function TransformDemo() {
  const [value, setValue] = useState("Hello World  !!!");
  const result = slugSchema.parse(value);
  return (
    <div className="space-y-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full text-sm bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400"
      />
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted text-xs">→</span>
        <code className="font-mono text-secondary-600 bg-secondary-50 dark:bg-secondary-950 dark:text-secondary-300 px-2 py-1 rounded-lg text-xs border border-secondary-100 dark:border-secondary-800">
          &quot;{result}&quot;
        </code>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function HowToZod() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/zod" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / zod
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Zod</h1>
        <p className="text-sm text-muted mb-10">Live schema validation. Type in each field to see parse results.</p>

        <div className="space-y-10">
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — z.string().email()</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><EmailDemo /></div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — z.object() + safeParse()</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><ObjectSchemaDemo /></div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Chained validators (password rules)</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><PasswordDemo /></div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-info-600 mb-3">4 — .transform() — build a slug</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><TransformDemo /></div>
            <p className="mt-2 text-xs text-muted font-mono">.toLowerCase().trim().transform(s =&gt; ...)</p>
          </section>
        </div>
      </div>
    </div>
  );
}
