import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function AuthDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Backend &amp; Services</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Authentication</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        Auth flow using PocketBase JWTs, stored in HTTP-only cookies via the token service. Server components read cookies directly; client components use the auth store.
      </p>

      <div className="space-y-10">

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Auth Flow Overview</h2>
          <div className="bg-surface border border-border rounded-xl p-4 text-xs font-mono text-muted space-y-1">
            <p>1. User submits login form (React Hook Form + Zod)</p>
            <p>2. <code className="text-primary-600">useLogin()</code> mutation calls PocketBase auth API</p>
            <p>3. On success → <code className="text-primary-600">tokenService.setToken(token)</code> saves to HTTP-only cookie</p>
            <p>4. Zustand auth store updated with user object</p>
            <p>5. Protected routes check token via Next.js middleware</p>
            <p>6. RSC pages access user via <code className="text-primary-600">serverCookieService.get()</code></p>
            <p>7. On logout → <code className="text-primary-600">tokenService.clearToken()</code> + store reset</p>
          </div>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">TokenService</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// Already implemented in core/services/token
// Access it via CoreProvider context:

import { useTokenService } from "@/presentation/providers/CoreProvider";

function SomeClientComponent() {
  const tokenService = useTokenService();

  // Store token (after login)
  tokenService.setToken(authToken);

  // Get token (for manual auth header — usually not needed, httpClient does it)
  const token = tokenService.getToken();

  // Clear token (on logout)
  tokenService.clearToken();
}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Auth Store (Zustand)</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// features/auth/store/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../models/auth.entity";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }
  )
);`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Login Mutation</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// features/auth/api/auth.api.ts
"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTokenService } from "@/presentation/providers/CoreProvider";
import { useAuthStore } from "../store/auth.store";
import { loginUser } from "./auth.server-api";

export function useLogin() {
  const tokenService = useTokenService();
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: ({ token, user }) => {
      tokenService.setToken(token);
      setUser(user);
      router.push("/dashboard");
    },
  });
}

export function useLogout() {
  const tokenService = useTokenService();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  return () => {
    tokenService.clearToken();
    logout();
    router.push("/login");
  };
}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Route Protection (Next.js Middleware)</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup", "/"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const isPublic = PUBLIC_PATHS.some((p) => request.nextUrl.pathname.startsWith(p));

  if (!token && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Reading Auth in Server Components</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// app/dashboard/page.tsx — Server Component
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  // Decode token or fetch user data here
  return <div>Welcome!</div>;
}`}
          </CodeBlock>
        </DocsSection>

        <WorkingExampleCard href="/how-to-auth" label="src/features/how-to-auth" />
      </div>
    </>
  );
}
