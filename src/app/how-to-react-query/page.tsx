"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────
interface Post { id: number; title: string; body: string; userId: number; }
interface Todo { id: number; title: string; completed: boolean; }

// ─── API Helpers ──────────────────────────────────────────────
const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
};

const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
};

const createTodo = async (title: string): Promise<Todo> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed: false, userId: 1 }),
  });
  if (!res.ok) throw new Error("Failed to create");
  return res.json();
};

// ─── 1. useQuery Demo ─────────────────────────────────────────
function UseQueryDemo() {
  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["demo-posts"],
    queryFn: fetchPosts,
    staleTime: 30_000,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className={`text-xs px-2 py-1 rounded-full font-mono font-semibold ${isLoading ? "bg-warning-50 text-warning-700" : isError ? "bg-error-50 text-error-600" : "bg-success-50 text-success-700"}`}>
          {isLoading ? "loading..." : isError ? "error" : isFetching ? "refetching..." : "success"}
        </div>
        <button onClick={() => refetch()} className="text-xs px-3 py-1 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground transition">
          refetch()
        </button>
      </div>
      {isError && <p className="text-xs text-error-500">{(error as Error).message}</p>}
      {data && (
        <div className="space-y-2">
          {data.map((post) => (
            <div key={post.id} className="p-3 rounded-xl border border-border bg-surface-raised">
              <p className="text-xs font-semibold text-foreground truncate">{post.title}</p>
              <p className="text-xs text-muted mt-0.5 line-clamp-1">{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 2. useMutation + Query Invalidation ─────────────────────
function UseMutationDemo() {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["demo-todos"],
    queryFn: fetchTodos,
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo) => {
      // Optimistic update — insert at top without refetch
      queryClient.setQueryData<Todo[]>(["demo-todos"], (old = []) => [newTodo, ...old]);
      setNewTitle("");
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New todo title..."
          onKeyDown={(e) => e.key === "Enter" && newTitle && mutation.mutate(newTitle)}
          className="flex-1 text-sm bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-muted"
        />
        <button
          onClick={() => newTitle && mutation.mutate(newTitle)}
          disabled={mutation.isPending || !newTitle}
          className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition disabled:opacity-40"
        >
          {mutation.isPending ? "..." : "Add"}
        </button>
      </div>
      {mutation.isError && <p className="text-xs text-error-500">{(mutation.error as Error).message}</p>}
      {isLoading ? (
        <p className="text-xs text-muted">Loading...</p>
      ) : (
        <div className="space-y-1.5">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface-raised">
              <span className={`w-3 h-3 rounded-full border-2 shrink-0 ${todo.completed ? "bg-success-500 border-success-500" : "border-border"}`} />
              <span className={`text-xs ${todo.completed ? "line-through text-muted" : "text-foreground"}`}>{todo.title}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted font-mono">onSuccess: queryClient.setQueryData([&quot;demo-todos&quot;], ...)</p>
    </div>
  );
}

// ─── 3. Query Keys & Stale Time ───────────────────────────────
function StaleTimeDemo() {
  const [userId, setUserId] = useState(1);
  const { data, isLoading, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      return res.json() as Promise<{ id: number; name: string; email: string; company: { name: string } }>;
    },
    staleTime: 60_000,
  });

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {[1, 2, 3].map((id) => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${userId === id ? "bg-secondary-500 text-white border-secondary-500" : "bg-surface-raised border-border text-muted hover:text-foreground"}`}
          >
            User {id}
          </button>
        ))}
        <span className="self-center text-xs text-muted ml-1">{isFetching ? "fetching..." : ""}</span>
      </div>
      {data && !isLoading && (
        <div className="p-4 rounded-xl border border-border bg-surface-raised space-y-1">
          <p className="text-sm font-semibold text-foreground">{data.name}</p>
          <p className="text-xs text-muted">{data.email}</p>
          <p className="text-xs text-muted">{data.company.name}</p>
          <p className="text-xs text-muted font-mono mt-2">Cached at: {new Date(dataUpdatedAt).toLocaleTimeString()}</p>
        </div>
      )}
      <p className="text-xs text-muted font-mono">queryKey: [&quot;user&quot;, userId] — different key = separate cache</p>
    </div>
  );
}

// ─── QueryClient Provider ─────────────────────────────────────
const queryClient = new QueryClient();

export default function HowToReactQuery() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
          <Link href="/docs/react-query" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / react-query
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-1">React Query</h1>
          <p className="text-sm text-muted mb-10">Live API calls with caching, mutations, and query key isolation.</p>

          <div className="space-y-10">
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — useQuery (staleTime: 30s)</p>
              <div className="p-6 rounded-2xl border border-border bg-surface"><UseQueryDemo /></div>
            </section>

            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — useMutation + optimistic update</p>
              <div className="p-6 rounded-2xl border border-border bg-surface"><UseMutationDemo /></div>
            </section>

            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Query keys isolate cache per user</p>
              <div className="p-6 rounded-2xl border border-border bg-surface"><StaleTimeDemo /></div>
            </section>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
