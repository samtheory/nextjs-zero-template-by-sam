"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// ─── Schemas ──────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Needs an uppercase letter")
    .regex(/[0-9]/, "Needs a number"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

// ─── Field component ──────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-error-500 mt-1">{error}</p>}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full text-sm bg-background border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 placeholder:text-muted transition ${hasError ? "border-error-400 focus:ring-error-300" : "border-border focus:ring-primary-400"}`;

// ─── 1. Login Form ────────────────────────────────────────────
function LoginDemo() {
  const [submitted, setSubmitted] = useState<LoginForm | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    await new Promise((r) => setTimeout(r, 600)); // simulate API
    setSubmitted(data);
  };

  return submitted ? (
    <div className="space-y-3">
      <div className="p-4 rounded-xl bg-success-50 border border-success-100">
        <p className="text-sm font-semibold text-success-700 mb-1">✓ Login successful (simulated)</p>
        <pre className="text-xs text-success-600 font-mono">{JSON.stringify(submitted, null, 2)}</pre>
      </div>
      <button onClick={() => setSubmitted(null)} className="text-xs text-muted hover:text-foreground transition">← reset</button>
    </div>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Email" error={errors.email?.message}>
        <input {...register("email")} placeholder="you@example.com" className={inputClass(!!errors.email)} />
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <input {...register("password")} type="password" placeholder="••••••••" className={inputClass(!!errors.password)} />
      </Field>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 transition"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

// ─── 2. Signup Form with cross-field validation ───────────────
function SignupDemo() {
  const [submitted, setSubmitted] = useState<SignupForm | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const password = watch("password", "");
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data: SignupForm) => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(data);
  };

  return submitted ? (
    <div className="space-y-3">
      <div className="p-4 rounded-xl bg-success-50 border border-success-100">
        <p className="text-sm font-semibold text-success-700 mb-2">✓ Account created (simulated)</p>
        <p className="text-xs text-success-600 font-mono">Email: {submitted.email}</p>
        <p className="text-xs text-success-600 font-mono">Name: {submitted.name}</p>
      </div>
      <button onClick={() => setSubmitted(null)} className="text-xs text-muted hover:text-foreground transition">← reset</button>
    </div>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Full Name" error={errors.name?.message}>
        <input {...register("name")} placeholder="Alice Smith" className={inputClass(!!errors.name)} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input {...register("email")} placeholder="alice@example.com" className={inputClass(!!errors.email)} />
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <input {...register("password")} type="password" placeholder="••••••••" className={inputClass(!!errors.password)} />
        {password && (
          <div className="flex gap-2 mt-1.5">
            {checks.map((c) => (
              <span key={c.label} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.pass ? "bg-success-50 text-success-700" : "bg-surface-raised text-muted"}`}>
                {c.pass ? "✓" : "·"} {c.label}
              </span>
            ))}
          </div>
        )}
      </Field>
      <Field label="Confirm Password" error={errors.confirmPassword?.message}>
        <input {...register("confirmPassword")} type="password" placeholder="••••••••" className={inputClass(!!errors.confirmPassword)} />
      </Field>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl bg-secondary-500 text-white text-sm font-semibold hover:bg-secondary-600 disabled:opacity-50 transition"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

// ─── 3. Validation Mode Comparison ───────────────────────────
function ValidationModeDemo() {
  const [mode, setMode] = useState<"onBlur" | "onChange" | "onSubmit">("onBlur");
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(z.object({ email: z.string().email("Invalid email") })),
    mode,
  });

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["onBlur", "onChange", "onSubmit"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${mode === m ? "bg-accent-500 text-white border-accent-500" : "bg-surface-raised border-border text-muted hover:text-foreground"}`}
          >
            {m}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit(() => {})} className="flex gap-2">
        <div className="flex-1">
          <input {...register("email")} placeholder="type an email then tab / type / submit" className={inputClass(!!errors.email)} />
          {errors.email && <p className="text-xs text-error-500 mt-1">{errors.email.message as string}</p>}
        </div>
        <button type="submit" className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition shrink-0">Submit</button>
      </form>
      <p className="text-xs text-muted">Current mode: <code className="bg-surface-raised px-1 rounded font-mono">{`mode: "${mode}"`}</code></p>
    </div>
  );
}

export default function HowToReactHookForm() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/react-hook-form-zod" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / react-hook-form-zod
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">React Hook Form + Zod</h1>
        <p className="text-sm text-muted mb-10">Real forms with schema validation and error display.</p>

        <div className="space-y-10">
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Login form</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><LoginDemo /></div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Signup with cross-field validation</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><SignupDemo /></div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Validation mode comparison</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><ValidationModeDemo /></div>
          </section>
        </div>
      </div>
    </div>
  );
}
