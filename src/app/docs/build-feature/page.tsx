import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function BuildFeatureDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Architecture</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">How to Build a Feature</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        Every feature is a self-contained vertical slice under <code className="font-mono bg-surface-raised px-1 rounded text-foreground">src/features/</code>. This structure keeps related code together and makes features easy to delete, move, or reuse.
      </p>

      <div className="space-y-10">

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Folder Structure</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`features/
└── posts/                     ← feature name (kebab-case, plural noun)
    ├── index.ts               ← PUBLIC barrel export — REQUIRED
    ├── README.md              ← feature docs
    ├── api/
    │   ├── posts.keys.ts      ← query key factory
    │   ├── posts.api.ts       ← React Query hooks (client)
    │   └── posts.server-api.ts← raw fetch calls (RSC / server actions)
    ├── components/
    │   ├── PostCard.tsx
    │   └── PostList.tsx
    ├── hooks/
    │   └── usePostFilters.ts
    ├── mappers/
    │   └── posts.mapper.ts    ← DTO → Entity
    ├── models/
    │   ├── post.dto.ts        ← API response shape
    │   ├── post.entity.ts     ← domain model
    │   ├── post.payload.ts    ← API request body
    │   ├── post.query.ts      ← filter/sort params
    │   └── post.viewmodel.ts  ← UI presentation model
    ├── store/
    │   └── posts.store.ts     ← feature Zustand store (if needed)
    └── validators/
        └── post.schema.ts     ← Zod schemas`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Step 1 — Models</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// models/post.dto.ts — what the API returns
export interface PostDto {
  id: string;
  collectionId: string;
  title: string;
  body: string;
  author_id: string;
  created: string;
  updated: string;
}

// models/post.entity.ts — your clean domain model
export interface Post {
  id: string;
  title: string;
  body: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// models/post.payload.ts — what you SEND to the API
export interface CreatePostPayload {
  title: string;
  body: string;
}
export interface UpdatePostPayload extends Partial<CreatePostPayload> {}

// models/post.query.ts — filter/sort/pagination
export interface PostQuery {
  authorId?: string;
  page?: number;
  perPage?: number;
}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Step 2 — Mapper</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// mappers/posts.mapper.ts — transforms API DTO → clean entity
import type { PostDto } from "../models/post.dto";
import type { Post } from "../models/post.entity";

export const postsMapper = {
  toEntity(dto: PostDto): Post {
    return {
      id: dto.id,
      title: dto.title,
      body: dto.body,
      authorId: dto.author_id,        // snake_case → camelCase
      createdAt: new Date(dto.created),
      updatedAt: new Date(dto.updated),
    };
  },
  toEntityList(dtos: PostDto[]): Post[] {
    return dtos.map(postsMapper.toEntity);
  },
};`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Step 3 — Validator</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// validators/post.schema.ts
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  body: z.string().min(10, "Body is too short"),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostSchema = z.infer<typeof createPostSchema>;
export type UpdatePostSchema = z.infer<typeof updatePostSchema>;`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Step 4 — Server API</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// api/posts.server-api.ts — raw HTTP calls (no React hooks)
import { httpClient } from "@/core/services/http";
import { postsMapper } from "../mappers/posts.mapper";
import type { Post } from "../models/post.entity";
import type { CreatePostPayload, PostQuery } from "../models/post.payload";

export async function fetchPosts(query?: PostQuery): Promise<Post[]> {
  const response = await httpClient.get("/posts", { params: query });
  return postsMapper.toEntityList(response.data);
}

export async function fetchPost(id: string): Promise<Post> {
  const response = await httpClient.get(\`/posts/\${id}\`);
  return postsMapper.toEntity(response.data);
}

export async function createPost(payload: CreatePostPayload): Promise<Post> {
  const response = await httpClient.post("/posts", payload);
  return postsMapper.toEntity(response.data);
}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Step 5 — Query Keys + React Query Hooks</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// api/posts.keys.ts
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (q: PostQuery) => [...postKeys.lists(), q] as const,
  detail: (id: string) => [...postKeys.all, "detail", id] as const,
};

// api/posts.api.ts
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "./posts.keys";
import { fetchPosts, createPost } from "./posts.server-api";

export function useGetPosts(query?: PostQuery) {
  return useQuery({
    queryKey: postKeys.list(query ?? {}),
    queryFn: () => fetchPosts(query),
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => qc.invalidateQueries({ queryKey: postKeys.lists() }),
  });
}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Step 6 — Barrel Export</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// index.ts — ONLY export what other features/pages should use
export { useGetPosts, useCreatePost } from "./api/posts.api";
export { fetchPosts } from "./api/posts.server-api";
export type { Post } from "./models/post.entity";
export type { CreatePostPayload } from "./models/post.payload";
export { createPostSchema } from "./validators/post.schema";
export type { CreatePostSchema } from "./validators/post.schema";

// Usage from outside:
// import { useGetPosts, type Post } from "@/features/posts";`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">Rules</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li>✓ Only expose through <code className="font-mono bg-surface-raised px-1 rounded text-foreground">index.ts</code> — never deep-import between features</li>
            <li>✓ Feature folders are deleted as a unit — no cross-feature internal imports</li>
            <li>✓ Use <code className="font-mono bg-surface-raised px-1 rounded text-foreground">shared/</code> for code used by 3+ features</li>
            <li>✓ Pages live in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">app/</code> — they import from features, not the other way</li>
            <li>✓ Server components call <code className="font-mono bg-surface-raised px-1 rounded text-foreground">server-api.ts</code> directly; client components use React Query hooks</li>
          </ul>
        </DocsSection>

        <WorkingExampleCard href="/how-to-build-feature" label="src/features/how-to-build-feature" />
      </div>
    </>
  );
}
