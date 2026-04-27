"use client";

import Link from "next/link";
import { useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";

// ─── Auth Store (mirrors real auth feature) ───────────────────
interface AuthUser { id: string; name: string; email: string; role: "admin" | "user"; }
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "how-to-auth-demo", partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }) }
  )
);

// ─── Login schema ─────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

// ─── Mock users ───────────────────────────────────────────────
const MOCK_USERS: (AuthUser & { password: string })[] = [
  { id: "usr_1", name: "Alice Admin", email: "admin@example.com", role: "admin", password: "Admin1234!" },
  { id: "usr_2", name: "Bob User", email: "user@example.com", role: "user", password: "User1234!" },
];

// ─── Login Form ───────────────────────────────────────────────
function LoginForm() {
  const { login } = useAuthStore();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin1234!");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); setError("");

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((i) => { fieldErrors[i.path[0] as keyof typeof fieldErrors] = i.message; });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700)); // simulate network

    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!user) {
      setLoading(false);
      setError("Invalid email or password");
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    const mockToken = `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify({ sub: user.id, exp: Date.now() + 3600000 }))}`;
    login(userWithoutPassword, mockToken);
    setLoading(false);
  };

  const inputCls = (hasError: boolean) =>
    `w-full text-sm bg-background border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 placeholder:text-muted transition ${hasError ? "border-error-400 focus:ring-error-300" : "border-border focus:ring-primary-400"}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2 mb-4">
        {MOCK_USERS.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => { setEmail(u.email); setPassword(u.password); }}
            className="p-2.5 rounded-xl border border-border bg-surface-raised text-left hover:border-primary-300 transition"
          >
            <p className="text-xs font-semibold text-foreground">{u.name}</p>
            <p className="text-[10px] text-muted">{u.email}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block ${u.role === "admin" ? "bg-primary-100 text-primary-700" : "bg-surface text-muted"}`}>{u.role}</span>
          </button>
        ))}
      </div>
      <div>
        <label className="block text-xs font-medium text-muted mb-1">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls(!!errors.email)} />
        {errors.email && <p className="text-xs text-error-500 mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium text-muted mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls(!!errors.password)} />
        {errors.password && <p className="text-xs text-error-500 mt-1">{errors.password}</p>}
      </div>
      {error && <p className="text-xs text-error-500 bg-error-50 border border-error-100 px-3 py-2 rounded-lg">⚠ {error}</p>}
      <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 transition">
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

// ─── Auth Status Display ─────────────────────────────────────
function AuthStatus() {
  const { user, token, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="p-4 rounded-xl border border-border bg-surface-raised text-center">
        <p className="text-sm text-muted">Not authenticated</p>
        <p className="text-xs text-muted mt-1">Sign in below</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-4 rounded-xl border border-success-200 bg-success-50 dark:border-success-700/50 dark:bg-success-950/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.name[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{user?.name}</p>
              <p className="text-xs text-muted">{user?.email}</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${user?.role === "admin" ? "bg-primary-100 text-primary-700" : "bg-surface-raised text-muted"}`}>{user?.role}</span>
        </div>
        <div className="text-xs font-mono text-muted bg-surface rounded-lg px-3 py-2 break-all">
          token: {token?.slice(0, 60)}...
        </div>
      </div>
      <button onClick={logout} className="w-full py-2 rounded-xl border border-border text-sm text-muted hover:text-foreground hover:border-foreground transition">
        Sign out
      </button>
    </div>
  );
}

// ─── Protected Content ────────────────────────────────────────
function ProtectedContent() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="p-4 rounded-xl border border-error-200 bg-error-50 dark:border-error-700/50 dark:bg-error-950/30">
        <p className="text-sm font-semibold text-error-700 dark:text-error-300">🔒 Protected content</p>
        <p className="text-xs text-error-600 dark:text-error-400 mt-1">You must be signed in to view this.</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-success-200 bg-success-50 dark:border-success-700/50 dark:bg-success-950/30">
      <p className="text-sm font-semibold text-success-700 dark:text-success-300">🔓 Protected content</p>
      <p className="text-xs text-success-600 dark:text-success-400 mt-1">Visible only to {user?.name} ({user?.role}).</p>
      {user?.role === "admin" && (
        <div className="mt-3 p-3 rounded-xl border border-primary-200 bg-primary-50 dark:border-primary-700/50 dark:bg-primary-950/30">
          <p className="text-xs font-semibold text-primary-700 dark:text-primary-300">⚡ Admin-only panel</p>
          <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">Rendered because role === &quot;admin&quot;</p>
        </div>
      )}
    </div>
  );
}

export default function HowToAuth() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/authentication" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / authentication
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Authentication</h1>
        <p className="text-sm text-muted mb-10">Auth store with persist, form validation, token display, and role-based content.</p>

        <div className="space-y-10">
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Auth State (persisted in localStorage)</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><AuthStatus /></div>
          </section>

          {!isAuthenticated && (
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Login form</p>
              <div className="p-6 rounded-2xl border border-border bg-surface"><LoginForm /></div>
            </section>
          )}

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Role-based rendering</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><ProtectedContent /></div>
            <p className="mt-2 text-xs text-muted font-mono">if (!isAuthenticated) redirect(&quot;/login&quot;) — in middleware or layout</p>
          </section>
        </div>
      </div>
    </div>
  );
}
