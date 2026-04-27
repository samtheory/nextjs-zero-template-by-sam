# how-to-react-query

**Purpose:** Full CRUD example using TanStack React Query v5.

## What You'll Learn
- Query key factory pattern
- `useQuery` with filters, pagination, and enabled flag
- `useMutation` with `onSuccess` cache invalidation
- Loading, error, and empty states
- `placeholderData` for smooth pagination

## Files
```
api/
  posts.keys.ts        — query key factory
  posts.api.ts         — useQuery + useMutation hooks
  posts.server-api.ts  — raw fetch functions
models/
  post.dto.ts
  post.entity.ts
  post.payload.ts
mappers/
  posts.mapper.ts
components/
  PostList.tsx         — list with loading/error/empty states
  PostDetail.tsx       — single post with useQuery
  CreatePostForm.tsx   — mutation example
```

## Doc Page
`/docs/react-query`
