import Link from "next/link";
import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";

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

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">Purpose in This Project</h2>
          <ul className="space-y-1.5 text-sm text-muted">
            <li>✓ All server data fetching (lists, details, paginated data)</li>
            <li>✓ CRUD mutations with optimistic updates and cache invalidation</li>
            <li>✓ Replace ad-hoc <code className="font-mono bg-surface-raised px-1 rounded text-foreground">useEffect + useState</code> for async operations</li>
            <li>✓ Automatic background refresh, deduplication, retry logic</li>
          </ul>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Setup</h2>
          <p className="text-sm text-muted mb-3">QueryClient is already configured in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">CoreProvider</code>. All features automatically have access to it.</p>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// src/presentation/providers/CoreProvider.tsx
// QueryClient is created once and provided to the whole app via QueryClientProvider.
// You don't need to set this up — it's already done.`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Query Key Factory</h2>
          <p className="text-sm text-muted mb-3">Always define keys in a dedicated file. This makes invalidation reliable and keeps keys organized.</p>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// features/posts/api/posts.keys.ts
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: PostQuery) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">useQuery — Fetching Data</h2>
          <CodeBlock language="typescript" className="border border-code-border mb-6">
            {`// features/posts/api/posts.api.ts
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
}`}
          </CodeBlock>

          <h3 className="text-sm font-semibold text-foreground mb-2">Using in a component</h3>
          <CodeBlock language="typescript" className="border border-code-border">
            {`"use client";
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
}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">useMutation — Modifying Data</h2>
          <CodeBlock language="typescript" className="border border-code-border mb-6">
            {`// features/posts/api/posts.api.ts
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
}`}
          </CodeBlock>

          <h3 className="text-sm font-semibold text-foreground mb-2">Using a mutation</h3>
          <CodeBlock language="typescript" className="border border-code-border">
            {`"use client";
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
}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">Best Practices</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li>✓ Always use key factories — never inline <code className="font-mono bg-surface-raised px-1 rounded text-foreground">["posts"]</code> directly</li>
            <li>✓ Put hooks in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">features/[name]/api/[name].api.ts</code></li>
            <li>✓ Put actual fetch logic in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">features/[name]/api/[name].server-api.ts</code></li>
            <li>✓ Use <code className="font-mono bg-surface-raised px-1 rounded text-foreground">enabled: !!id</code> for conditional queries</li>
            <li>✓ Invalidate on mutation success — don't manually update the cache unless perf requires it</li>
            <li>✓ Use <code className="font-mono bg-surface-raised px-1 rounded text-foreground">isPending</code> (not <code className="font-mono bg-surface-raised px-1 rounded text-foreground">isLoading</code>) for mutations in v5</li>
          </ul>
        </DocsSection>

        <DocsSection className="p-4 bg-secondary-50/80 border border-secondary-200 rounded-xl transition-colors duration-200 dark:bg-secondary-950/80 dark:border-secondary-700">
          <p className="text-sm font-semibold text-secondary-700 mb-1 dark:text-secondary-200">Working Example</p>
          <p className="text-xs text-secondary-600 mb-3 dark:text-secondary-300">Open the working example for this topic.</p>
          <Link
            href="/how-to-react-query"
            className="inline-flex items-center gap-2 rounded-full border border-secondary-300 bg-secondary-100 px-4 py-2 text-xs font-semibold text-secondary-700 transition duration-200 hover:bg-secondary-200 hover:text-secondary-900 dark:border-secondary-700 dark:bg-secondary-900 dark:text-secondary-200 dark:hover:bg-secondary-800 dark:hover:text-secondary-50"
          >
            <span className="inline-flex items-center gap-1">
              <code className="rounded bg-surface-raised px-2 py-0.5 text-[0.7rem] font-mono text-foreground dark:bg-surface dark:text-foreground">src/features/how-to-react-query</code>
            </span>
            <span>→</span>
          </Link>
        </DocsSection>
      </div>
    </>
  );
}
