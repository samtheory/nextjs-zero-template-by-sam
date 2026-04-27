import Link from "next/link";
import { CodeBlock } from "../_components/CodeBlock";

export default function PocketBaseDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Backend &amp; Services</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">PocketBase</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        Open-source backend — SQLite database, REST API, file storage, auth, and realtime subscriptions. Runs locally via <code className="font-mono bg-surface-raised px-1 rounded text-foreground">pnpm dev</code>.
      </p>

      <div className="space-y-10">

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Local Setup</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`# Start PocketBase + Next.js together:
pnpm dev

# PocketBase admin UI:
http://127.0.0.1:8090/_/

# API base URL (in .env):
NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">PocketBase Client Singleton</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// lib/pocketbase.ts — create once, reuse everywhere
import PocketBase from "pocketbase";

let pb: PocketBase | null = null;

export function getPocketBase(): PocketBase {
  if (!pb) {
    pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
  }
  return pb;
}`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">CRUD Operations</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { getPocketBase } from "@/lib/pocketbase";

const pb = getPocketBase();

// LIST — with filter, sort, pagination
const result = await pb.collection("posts").getList(1, 20, {
  filter: 'author = "user123" && status = "published"',
  sort: "-created",          // - prefix = descending
  expand: "author",          // join related collection
});
// result.items, result.totalPages, result.totalItems

// GET FULL LIST (no pagination)
const all = await pb.collection("posts").getFullList({ sort: "-created" });

// GET ONE
const post = await pb.collection("posts").getOne("RECORD_ID");

// CREATE
const created = await pb.collection("posts").create({ title: "Hello", body: "World" });

// UPDATE
const updated = await pb.collection("posts").update("RECORD_ID", { title: "Updated" });

// DELETE
await pb.collection("posts").delete("RECORD_ID");`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Authentication</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// Email + password login
const authData = await pb.collection("users").authWithPassword(email, password);
// authData.token — JWT
// authData.record — user record

// Check if logged in
const isValid = pb.authStore.isValid;
const user = pb.authStore.model;
const token = pb.authStore.token;

// Logout
pb.authStore.clear();

// Refresh token
await pb.collection("users").authRefresh();

// OAuth2 (Google, GitHub, etc.)
await pb.collection("users").authWithOAuth2({ provider: "google" });`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Realtime Subscriptions</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`"use client";
import { useEffect } from "react";
import { getPocketBase } from "@/lib/pocketbase";
import { useQueryClient } from "@tanstack/react-query";
import { postKeys } from "@/features/posts/api/posts.keys";

export function usePostsRealtime() {
  const pb = getPocketBase();
  const qc = useQueryClient();

  useEffect(() => {
    // Subscribe to all changes on the "posts" collection
    pb.collection("posts").subscribe("*", (e) => {
      // e.action: "create" | "update" | "delete"
      // e.record: the changed record
      qc.invalidateQueries({ queryKey: postKeys.lists() });
    });

    return () => {
      pb.collection("posts").unsubscribe("*");
    };
  }, []);
}`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">File Uploads</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// Upload a file field (use FormData, not JSON)
const formData = new FormData();
formData.append("title", "My Post");
formData.append("cover", fileInput.files[0]);  // file field

await pb.collection("posts").create(formData);

// Get file URL
const url = pb.files.getUrl(record, record.cover);
// e.g. http://127.0.0.1:8090/api/files/posts/RECORD_ID/filename.jpg

// Thumbnail (for images)
const thumb = pb.files.getUrl(record, record.cover, { thumb: "100x100" });`}
          </CodeBlock>
        </section>

        <section className="p-4 bg-info-50 border border-info-200 rounded-xl">
          <p className="text-sm font-semibold text-info-700 mb-1">Working Example</p>
          <Link href="/how-to-pocketbase" className="inline-flex items-center gap-1.5 text-xs font-semibold text-info-600 hover:text-info-800">
            <code className="bg-info-100 px-1.5 py-0.5 rounded">src/features/how-to-pocketbase</code>
            <span>→</span>
          </Link>
        </section>
      </div>
    </>
  );
}
