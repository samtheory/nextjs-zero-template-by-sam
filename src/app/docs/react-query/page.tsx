import Link from "next/link";

export default function ReactQueryDoc() {
  return (
    <>
      <div className="mb-2">
        <span className="text-xs text-muted">Fundamentals</span>
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">React Query</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        TanStack Query v5 — async state management for server data. Handles caching, background refetching, loading/error states, and mutations with zero boilerplate.
      </p>

      <div className="space-y-10">

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">Purpose in This Project</h2>
          <ul className="space-y-1.5 text-sm text-muted">
            <li>✓ All server data fetching (lists, details, paginated data)</li>
            <li>✓ CRUD mutations with optimistic updates and cache invalidation</li>
            <li>✓ Replace ad-hoc <code className="font-mono bg-surface-raised px-1 rounded text-foreground">useEffect + useState</code> for async operations</li>
            <li>✓ Automatic background refresh, deduplication, retry logic</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Setup</h2>
          <p className="text-sm text-muted mb-3">QueryClient is already configured in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">CoreProvider</code>. All features automatically have access to it.</p>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`// src/presentation/providers/CoreProvider.tsx
// QueryClient is created once and provided to the whole app via QueryClientProvider.
// You don't need to set this up — it's already done.`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Query Key Factory</h2>
          <p className="text-sm text-muted mb-3">Always define keys in a dedicated file. This makes invalidation reliable and keeps keys organized.</p>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`// features/posts/api/posts.keys.ts
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: PostQuery) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">useQuery — Fetching Data</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text mb-6">
            <code>{`// features/posts/api/posts.api.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { postKeys } from "./posts.keys";
import { fetchPosts } from "./posts.server-api";

export function useGetPosts(filters?: PostQuery) {
  return useQuery({
    queryKey: postKeys.list(filters ?? {}),
    queryFn: () => fetchPosts(filters),
    staleTime: 60_000,           // data is fresh for 1 minute
    placeholderData: (prev) => prev, // keep old data while fetching new page
  });
}

export function useGetPost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => fetchPost(id),
    enabled: !!id,               // only run when id is defined
  });
}`}</code>
          </pre>

          <h3 className="text-sm font-semibold text-foreground mb-2">Using in a component</h3>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`"use client";
import { useGetPosts } from "@/features/posts/api";

export function PostList() {
  const { data, isLoading, isError, error } = useGetPosts();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.map((post) => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">useMutation — Modifying Data</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text mb-6">
            <code>{`// features/posts/api/posts.api.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreatePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => {
      // Invalidate — React Query will refetch all post lists automatically
      qc.invalidateQueries({ queryKey: postKeys.lists() });
    },
    onError: (error) => {
      console.error("Create failed:", error);
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: postKeys.lists() });
      qc.removeQueries({ queryKey: postKeys.detail(id) });
    },
  });
}`}</code>
          </pre>

          <h3 className="text-sm font-semibold text-foreground mb-2">Using a mutation</h3>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`"use client";
import { useCreatePost } from "@/features/posts/api";

export function CreatePostButton() {
  const { mutate, isPending, isError } = useCreatePost();

  return (
    <button
      disabled={isPending}
      onClick={() => mutate({ title: "New Post", body: "..." })}
    >
      {isPending ? "Creating..." : "Create Post"}
    </button>
  );
}`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">Best Practices</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li>✓ Always use key factories — never inline <code className="font-mono bg-surface-raised px-1 rounded text-foreground">["posts"]</code> directly</li>
            <li>✓ Put hooks in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">features/[name]/api/[name].api.ts</code></li>
            <li>✓ Put actual fetch logic in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">features/[name]/api/[name].server-api.ts</code></li>
            <li>✓ Use <code className="font-mono bg-surface-raised px-1 rounded text-foreground">enabled: !!id</code> for conditional queries</li>
            <li>✓ Invalidate on mutation success — don't manually update the cache unless perf requires it</li>
            <li>✓ Use <code className="font-mono bg-surface-raised px-1 rounded text-foreground">isPending</code> (not <code className="font-mono bg-surface-raised px-1 rounded text-foreground">isLoading</code>) for mutations in v5</li>
          </ul>
        </section>

        <section className="p-4 bg-secondary-50 border border-secondary-200 rounded-xl">
          <p className="text-sm font-semibold text-secondary-700 mb-1">Working Example</p>
          <p className="text-xs text-secondary-600 mb-3">Full CRUD with useQuery + useMutation, key factory, and error handling.</p>
          <Link href="/how-to-react-query" className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-600 hover:text-secondary-800">
            <code className="bg-secondary-100 px-1.5 py-0.5 rounded">src/features/how-to-react-query</code>
            <span>→</span>
          </Link>
        </section>
      </div>
    </>
  );
}
