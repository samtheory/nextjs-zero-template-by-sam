# how-to-pocketbase

**Purpose:** PocketBase integration patterns.

## What You'll Learn
- PocketBase client singleton setup
- Collection CRUD (getList, getOne, create, update, delete)
- Filter syntax and sort
- Expanding related collections
- Email/password authentication
- File uploads and URL generation
- Realtime subscriptions with React Query invalidation

## Files
```
lib/
  pocketbase.ts          — singleton client
api/
  posts.server-api.ts    — CRUD with PocketBase client
  auth.server-api.ts     — auth with PocketBase
components/
  PostsWithRealtime.tsx  — realtime subscription + React Query
  FileUploadDemo.tsx     — file upload and display
```

## Doc Page
`/docs/pocketbase`
