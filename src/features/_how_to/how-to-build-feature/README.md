# how-to-build-feature

**Purpose:** A complete working feature following the project's vertical slice architecture.

## What You'll Learn
- The full feature folder structure
- Models: DTO → Entity → Payload → Query
- Mapper: transforming API responses
- Validators: Zod schemas for forms and payloads
- Server API: raw fetch calls
- Query keys: key factory pattern
- React Query hooks: useQuery + useMutation
- Barrel export via index.ts

## This feature implements a simple "Notes" CRUD as the example

## Files
```
index.ts
README.md
api/
  notes.keys.ts
  notes.api.ts
  notes.server-api.ts
models/
  note.dto.ts
  note.entity.ts
  note.payload.ts
  note.query.ts
mappers/
  notes.mapper.ts
validators/
  note.schema.ts
components/
  NoteList.tsx
  NoteCard.tsx
  CreateNoteForm.tsx
```

## Doc Page
`/docs/build-feature`
