# how-to-zod

**Purpose:** Demonstrates Zod schema validation with real-world examples.

## What You'll Learn
- Defining object, string, number, enum, and array schemas
- Using `z.infer<>` to derive TypeScript types
- `.parse()` vs `.safeParse()` — when to use each
- Transforms and `.refine()` for custom validation
- `.partial()`, `.pick()`, `.omit()`, `.extend()` for schema composition
- Formatting errors for display

## Files
```
validators/
  user.schema.ts     — full user schema with all validator types
  signup.schema.ts   — signup form schema with .refine() (password confirm)
  query.schema.ts    — query param schema with coercion
components/
  ZodDemo.tsx        — interactive demo showing parse results
```

## Doc Page
`/docs/zod`

## Key Concepts
| Concept | File |
|---|---|
| Schema definition | `validators/user.schema.ts` |
| Type inference | everywhere via `z.infer<>` |
| Safe parsing | `validators/signup.schema.ts` |
| Error formatting | `components/ZodDemo.tsx` |
