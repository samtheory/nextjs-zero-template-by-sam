"use client";

import Link from "next/link";
import { useState } from "react";

// ─── Mock data ─────────────────────────────────────────────────
interface Post { id: string; title: string; content: string; created: string; }

const mockPosts: Post[] = [
  { id: "1", title: "Getting started with PocketBase", content: "PocketBase is an open-source backend in a single file.", created: "2024-01-15T10:00:00Z" },
  { id: "2", title: "Collections and records", content: "Collections are like database tables. Records are rows.", created: "2024-01-16T14:30:00Z" },
  { id: "3", title: "Realtime subscriptions", content: "Use pb.collection().subscribe() to listen for changes.", created: "2024-01-17T09:15:00Z" },
];

let idCounter = 4;

// ─── CRUD Demo ────────────────────────────────────────────────
function CrudDemo() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const simulate = (ms = 400) => new Promise<void>((r) => { setLoading(true); setTimeout(() => { setLoading(false); r(); }, ms); });

  const handleCreate = async () => {
    if (!title.trim()) return;
    await simulate();
    const newPost: Post = { id: String(idCounter++), title, content, created: new Date().toISOString() };
    setPosts((p) => [newPost, ...p]);
    setTitle(""); setContent("");
    setStatus(`✓ Created "${newPost.title}"`);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    await simulate();
    setPosts((p) => p.map((post) => post.id === editing.id ? { ...post, title: editing.title, content: editing.content } : post));
    setStatus(`✓ Updated "${editing.title}"`);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    await simulate(200);
    setPosts((p) => p.filter((post) => post.id !== id));
    setStatus(`✓ Deleted post ${id}`);
  };

  return (
    <div className="space-y-4">
      {/* Create form */}
      {!editing && (
        <div className="p-4 rounded-xl border border-border bg-surface-raised space-y-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">pb.collection(&quot;posts&quot;).create(&#123;...&#125;)</p>
          <input
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-muted"
          />
          <textarea
            placeholder="Content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            className="w-full text-sm bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-muted resize-none"
          />
          <button
            onClick={handleCreate}
            disabled={loading || !title.trim()}
            className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 transition"
          >
            {loading ? "Creating..." : "Create post"}
          </button>
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="p-4 rounded-xl border border-secondary-200 bg-secondary-50/60 dark:border-secondary-700 dark:bg-secondary-950/40 space-y-3">
          <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wider dark:text-secondary-400">pb.collection(&quot;posts&quot;).update(&quot;{editing.id}&quot;, &#123;...&#125;)</p>
          <input
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            className="w-full text-sm bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary-400"
          />
          <textarea
            value={editing.content}
            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            rows={2}
            className="w-full text-sm bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary-400 resize-none"
          />
          <div className="flex gap-2">
            <button onClick={handleUpdate} disabled={loading} className="px-4 py-2 rounded-xl bg-secondary-500 text-white text-sm font-semibold hover:bg-secondary-600 disabled:opacity-50 transition">{loading ? "Saving..." : "Save"}</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border border-border text-muted text-sm hover:text-foreground transition">Cancel</button>
          </div>
        </div>
      )}

      {/* Status */}
      {status && <p className="text-xs font-mono text-success-600 bg-success-50 border border-success-100 px-3 py-2 rounded-lg">{status}</p>}

      {/* List */}
      <div className="space-y-2">
        {posts.length === 0 && <p className="text-sm text-muted text-center py-6">No posts yet. Create one above.</p>}
        {posts.map((post) => (
          <div key={post.id} className="p-4 rounded-xl border border-border bg-surface group">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{post.title}</p>
                <p className="text-xs text-muted mt-0.5 line-clamp-1">{post.content}</p>
                <p className="text-[10px] text-muted mt-1 font-mono">id: {post.id} · {new Date(post.created).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => setEditing(post)} className="px-2.5 py-1 text-xs rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground transition">edit</button>
                <button onClick={() => handleDelete(post.id)} className="px-2.5 py-1 text-xs rounded-lg border border-error-200 text-error-500 hover:bg-error-50 transition">delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── API Code Examples ────────────────────────────────────────
const codeExamples = [
  {
    label: "pb.collection().getList()",
    code: `const result = await pb
  .collection("posts")
  .getList(1, 20, {
    filter: 'published = true',
    sort: "-created",
    expand: "author",
  });

// result.items: Post[]
// result.totalPages: number`,
  },
  {
    label: "pb.collection().create()",
    code: `const newPost = await pb
  .collection("posts")
  .create({
    title: "Hello World",
    content: "...",
    published: false,
    author: currentUser.id,
  });`,
  },
  {
    label: "pb.collection().update()",
    code: `const updated = await pb
  .collection("posts")
  .update(post.id, {
    title: "Updated title",
    published: true,
  });`,
  },
  {
    label: "subscribe() — realtime",
    code: `pb.collection("posts").subscribe("*", (e) => {
  if (e.action === "create") addPost(e.record);
  if (e.action === "update") updatePost(e.record);
  if (e.action === "delete") removePost(e.record.id);
});

// cleanup:
pb.collection("posts").unsubscribe("*");`,
  },
];

function ApiExamples() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {codeExamples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition ${selected === i ? "bg-foreground text-background border-foreground" : "bg-surface-raised border-border text-muted hover:text-foreground"}`}
          >
            {ex.label.split("(")[0]}()
          </button>
        ))}
      </div>
      <pre className="p-4 rounded-xl border border-border bg-surface-raised text-xs font-mono text-foreground leading-relaxed whitespace-pre overflow-x-auto">
        {codeExamples[selected].code}
      </pre>
      <p className="text-xs text-muted font-mono">{codeExamples[selected].label}</p>
    </div>
  );
}

export default function HowToPocketbase() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/pocketbase" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / pocketbase
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">PocketBase</h1>
        <p className="text-sm text-muted mb-10">CRUD operations with mock data. Hover cards to see edit/delete. API examples show real PocketBase SDK calls.</p>

        <div className="space-y-10">
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — CRUD demo (simulated)</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><CrudDemo /></div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — SDK API reference</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><ApiExamples /></div>
          </section>
        </div>
      </div>
    </div>
  );
}
