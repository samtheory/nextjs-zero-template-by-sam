"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { z } from "zod";

// ─── Feature: Posts ────────────────────────────────────────────
// This mirrors the real feature structure: api, models, validators

// models/post.entity.ts
interface Post {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  published: boolean;
  createdAt: string;
}

// validators/post.schema.ts
const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(200),
  author: z.string().min(2, "Author name required"),
});

type CreatePostInput = z.infer<typeof createPostSchema>;

// api/post.api.ts (simulated)
const mockApi = {
  list: async (): Promise<Post[]> => {
    await new Promise((r) => setTimeout(r, 300));
    return initialPosts;
  },
  create: async (input: CreatePostInput): Promise<Post> => {
    await new Promise((r) => setTimeout(r, 400));
    return { id: String(Date.now()), ...input, published: false, createdAt: new Date().toISOString() };
  },
  toggle: async (id: string, published: boolean): Promise<void> => {
    await new Promise((r) => setTimeout(r, 200));
    void id; void published;
  },
  delete: async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 200));
    void id;
  },
};

const initialPosts: Post[] = [
  { id: "1", title: "Feature folder structure", excerpt: "How to organize your code by feature, not by type.", author: "Alice", published: true, createdAt: "2024-01-10T10:00:00Z" },
  { id: "2", title: "Barrel exports with index.ts", excerpt: "Use index.ts to create a clean public API for your feature.", author: "Bob", published: true, createdAt: "2024-01-11T12:00:00Z" },
  { id: "3", title: "Naming conventions", excerpt: "Consistent naming makes features predictable and findable.", author: "Alice", published: false, createdAt: "2024-01-12T15:00:00Z" },
];

// ─── Post Form Component ──────────────────────────────────────
function PostForm({ onCreated }: { onCreated: (post: Post) => void }) {
  const [form, setForm] = useState({ title: "", excerpt: "", author: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof CreatePostInput, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = createPostSchema.safeParse(form);
    if (!result.success) {
      const fe: typeof errors = {};
      result.error.issues.forEach((i) => { fe[i.path[0] as keyof CreatePostInput] = i.message; });
      setErrors(fe); return;
    }
    setErrors({});
    setLoading(true);
    const post = await mockApi.create(result.data);
    onCreated(post);
    setForm({ title: "", excerpt: "", author: "" });
    setLoading(false);
  };

  const cls = (k: keyof CreatePostInput) =>
    `w-full text-sm bg-background border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-muted transition ${errors[k] ? "border-error-400" : "border-border"}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {(["title", "excerpt", "author"] as const).map((k) => (
        <div key={k}>
          <label className="block text-xs text-muted mb-1 capitalize">{k}</label>
          {k === "excerpt" ? (
            <textarea value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} rows={2} className={cls(k) + " resize-none"} placeholder={`Post ${k}...`} />
          ) : (
            <input value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} className={cls(k)} placeholder={k === "title" ? "Post title" : "Author name"} />
          )}
          {errors[k] && <p className="text-xs text-error-500 mt-1">{errors[k]}</p>}
        </div>
      ))}
      <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 transition">
        {loading ? "Creating..." : "Create post"}
      </button>
    </form>
  );
}

// ─── Post List ────────────────────────────────────────────────
function PostList({ posts, onToggle, onDelete }: { posts: Post[]; onToggle: (id: string, pub: boolean) => void; onDelete: (id: string) => void; }) {
  return (
    <div className="space-y-2">
      {posts.length === 0 && <p className="text-sm text-muted text-center py-6">No posts yet.</p>}
      {posts.map((post) => (
        <div key={post.id} className="p-4 rounded-xl border border-border bg-surface group">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-foreground">{post.title}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${post.published ? "bg-success-50 text-success-700" : "bg-surface-raised text-muted"}`}>
                  {post.published ? "published" : "draft"}
                </span>
              </div>
              <p className="text-xs text-muted line-clamp-1">{post.excerpt}</p>
              <p className="text-[10px] text-muted mt-1">by {post.author} · {new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => onToggle(post.id, !post.published)} className={`px-2.5 py-1 text-xs rounded-lg border transition ${post.published ? "border-warning-200 text-warning-600 hover:bg-warning-50" : "border-success-200 text-success-600 hover:bg-success-50"}`}>
                {post.published ? "unpublish" : "publish"}
              </button>
              <button onClick={() => onDelete(post.id)} className="px-2.5 py-1 text-xs rounded-lg border border-error-200 text-error-500 hover:bg-error-50 transition">delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Feature Structure Display ────────────────────────────────
const featureStructure = `features/
  posts/
    index.ts              ← barrel export
    api/
      posts.keys.ts       ← query key factory
      posts.api.ts        ← useQuery/useMutation hooks
      posts.server-api.ts ← server-side fetch functions
    models/
      post.entity.ts      ← domain types
      post.dto.ts         ← API response types
      post.payload.ts     ← request body types
    mappers/
      post.mapper.ts      ← DTO → Entity transforms
    validators/
      post.schema.ts      ← Zod schemas
    components/
      PostCard.tsx
      PostForm.tsx
      PostList.tsx`;

export default function HowToBuildFeature() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [tab, setTab] = useState<"demo" | "structure">("demo");

  const handleToggle = useCallback(async (id: string, pub: boolean) => {
    await mockApi.toggle(id, pub);
    setPosts((p) => p.map((post) => post.id === id ? { ...post, published: pub } : post));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await mockApi.delete(id);
    setPosts((p) => p.filter((post) => post.id !== id));
  }, []);

  const handleCreated = useCallback((post: Post) => {
    setPosts((p) => [post, ...p]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/build-feature" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / build-feature
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Build a Feature</h1>
        <p className="text-sm text-muted mb-8">A complete Posts feature: models, validators, API hooks, and components all in one place.</p>

        <div className="flex gap-2 mb-6">
          {(["demo", "structure"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition capitalize ${tab === t ? "bg-foreground text-background border-foreground" : "bg-surface-raised border-border text-muted hover:text-foreground"}`}
            >
              {t === "demo" ? "Working Demo" : "File Structure"}
            </button>
          ))}
        </div>

        {tab === "demo" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-4">Create Post</p>
              <PostForm onCreated={handleCreated} />
            </div>
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-4">Posts ({posts.length})</p>
              <PostList posts={posts} onToggle={handleToggle} onDelete={handleDelete} />
            </div>
          </div>
        )}

        {tab === "structure" && (
          <div className="space-y-4">
            <pre className="p-6 rounded-2xl border border-border bg-surface text-xs font-mono text-foreground leading-relaxed whitespace-pre">
              {featureStructure}
            </pre>
            <div className="grid grid-cols-2 gap-3">
              {[
                { file: "index.ts", desc: "Barrel export — public API of the feature" },
                { file: "posts.keys.ts", desc: "['posts', 'list'] — stable cache keys" },
                { file: "post.entity.ts", desc: "Domain types used across the app" },
                { file: "post.mapper.ts", desc: "Converts raw API response to entity" },
              ].map((item) => (
                <div key={item.file} className="p-3 rounded-xl border border-border bg-surface-raised">
                  <code className="text-xs font-mono font-semibold text-primary-600 dark:text-primary-400">{item.file}</code>
                  <p className="text-xs text-muted mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
