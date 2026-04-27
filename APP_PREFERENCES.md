# App Preferences & AI Agent Reference

> **For AI Agents:** Always read this file before generating or modifying any code in this project.
> This is the single source of truth for conventions, color tokens, naming, and architecture.

---

## Project Overview

A Next.js 16 (App Router) **learning template** for studying modern full-stack patterns.  
Backend: PocketBase | State: Zustand | Data: TanStack Query | Forms: React Hook Form + Zod | Styling: Tailwind v4

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS | v4 |
| Client State | Zustand | v5 |
| Server State | TanStack React Query | v5 |
| Forms | React Hook Form + Zod | v7 + v4 |
| HTTP | Axios (via `core/services/http`) | – |
| Backend | PocketBase | v0.26.x |
| Animation | Framer Motion (motion.dev) | v12 |
| Icons | Lucide React | – |
| Package Mgr | pnpm | – |

---

## Color Palette (CSS Variables + Tailwind v4)

All defined in `src/app/globals.css`. See that file for full token list.

### Static Color Scales (use specific shades)
```
bg-neutral-{50..950}   — Zinc grays
bg-primary-{50..950}   — Indigo (brand color)
bg-secondary-{50..950} — Teal
bg-accent-{50..950}    — Amber
bg-success-{50,100,500,600,700}
bg-warning-{50,100,500,600,700}
bg-error-{50,100,500,600,700}
bg-info-{50,100,500,600,700}
```

### Semantic Tokens (prefer these in components — they respond to dark mode)
```
bg-background / text-foreground     — Page background / text
bg-surface                          — Card/panel background
bg-surface-raised                   — Elevated surface (hover states)
border-border                       — Default border color
border-border-subtle                — Faint border
text-muted                          — Secondary text
text-muted-foreground               — Tertiary/placeholder text
bg-sidebar-bg                       — Sidebar background
border-sidebar-border               — Sidebar border
text-sidebar-active / bg-sidebar-active-bg / text-sidebar-active-text — Active nav item
bg-code-bg / border-code-border / text-code-text — Code block tokens
```

---

## Folder Architecture

```
src/
├── app/              — Next.js pages and layouts (App Router)
│   ├── docs/         — Learning documentation pages
│   └── (auth)/       — Auth pages (login, signup)
├── core/             — Framework infrastructure
│   ├── network-client/
│   └── services/     — cookie, http, token, logger, storage, error-mapper, config
├── features/         — Domain feature vertical slices
│   └── how-to-*/     — Learning feature examples
├── presentation/     — Shared UI
│   ├── components/   — layouts/, shared/, ui/
│   ├── providers/    — CoreProvider (QueryClient + TokenService)
│   └── stores/       — Shared Zustand stores
└── shared/           — Cross-cutting helpers
    ├── constants/
    ├── types/
    ├── utils/
    └── validators/
```

---

## Feature Structure (required for every feature)

```
features/[feature-name]/
├── index.ts                  — Public barrel export (REQUIRED)
├── README.md                 — Feature documentation
├── api/
│   ├── [name].api.ts         — Client-side React Query hooks
│   ├── [name].keys.ts        — Query key factory
│   └── [name].server-api.ts  — Server-side fetch calls (RSC)
├── components/               — Feature UI components
├── hooks/                    — Custom hooks
├── mappers/
│   └── [name].mapper.ts      — DTO → Entity transformation
├── models/
│   ├── [name].dto.ts         — API response shape
│   ├── [name].entity.ts      — Domain model
│   ├── [name].payload.ts     — API request shape
│   ├── [name].query.ts       — Query/filter params
│   └── [name].viewmodel.ts   — UI presentation model
├── store/                    — Zustand stores (feature-scoped)
└── validators/
    └── [name].schema.ts      — Zod schemas
```

---

## How-to Feature Names

Learning features are prefixed `how-to-`:

| Feature Folder | Doc Page |
|---|---|
| `how-to-zod` | `/docs/zod` |
| `how-to-react-query` | `/docs/react-query` |
| `how-to-react-hook-form` | `/docs/react-hook-form-zod` |
| `how-to-zustand` | `/docs/zustand` |
| `how-to-typescript` | `/docs/typescript` |
| `how-to-build-feature` | `/docs/build-feature` |
| `how-to-build-ui` | `/docs/build-ui-component` |
| `how-to-auth` | `/docs/authentication` |
| `how-to-core-services` | `/docs/core-services` |
| `how-to-form-validation` | `/docs/form-validation` |
| `how-to-pocketbase` | `/docs/pocketbase` |
| `how-to-env-config` | `/docs/env-config` |
| `how-to-tailwind` | `/docs/tailwind-variables` |
| `how-to-framer-motion` | `/docs/framer-motion` |

---

## Coding Conventions

### Naming
- Files: `kebab-case` — `user-card.tsx`, `auth.api.ts`
- Components / Classes: `PascalCase` — `UserCard`, `AuthService`
- Hooks: `camelCase` prefixed `use` — `useAuthUser`
- Stores: `camelCase` prefixed `use` — `useCartStore`
- Zod schemas: `camelCase` suffixed `Schema` — `loginSchema`
- Types inferred from Zod: same name suffixed `Schema` → `type LoginSchema = z.infer<typeof loginSchema>`

### Exports
- Every folder has a barrel `index.ts`
- Never deep-import when a barrel exists — use `@/features/auth` not `@/features/auth/models/auth.entity`

### React / Next.js
- Prefer **Server Components** (RSC) by default
- Add `"use client"` only when you need: browser APIs, event handlers, hooks, context
- Use `@/` alias for all `src/` imports
- For data fetching in RSC: use server-api + async/await
- For data fetching in Client Components: use React Query hooks

### API Layer
- All HTTP calls go through `core/services/http` (Axios wrapper)
- Query key factories live in `[name].keys.ts` — never inline query keys
- Mutations always `invalidateQueries` on success

### State Management
| State type | Tool |
|---|---|
| Local UI state | `useState` / `useReducer` |
| Shared client state | Zustand store |
| Server/async state | TanStack React Query |
| Form state | React Hook Form |
| Persisted state | Zustand `persist` middleware |

### Forms
- Always pair React Hook Form with `zodResolver`
- Schema in `validators/[name].schema.ts`
- Never validate manually — always use Zod

### CSS / Tailwind
- Tailwind v4: no `tailwind.config.ts` — all theme config in `globals.css` via `@theme`
- Always use semantic tokens in components (`bg-surface`, `text-muted`, `border-border`)
- Only use raw scale values (`bg-primary-600`) for brand-specific decorative elements
- For component variants: use `cva` (class-variance-authority) + `cn` helper
- Dark mode: handled by `@media (prefers-color-scheme: dark)` (no `.dark` class needed, but `dark:` Tailwind prefix still works in v4 for media-query strategy)

---

## Navigation Map

```
/                        — Home (side nav + docs CTA)
/docs                    — Documentation home
/docs/zod                — Zod schema validation
/docs/react-query        — React Query (useQuery + useMutation)
/docs/react-hook-form-zod — React Hook Form + Zod
/docs/zustand            — Zustand state management
/docs/typescript         — TypeScript useful concepts
/docs/build-feature      — How to build a feature
/docs/build-ui-component — How to build a reusable UI component
/docs/authentication     — Authentication flow
/docs/core-services      — Cookie, localStorage, tokens in Next.js
/docs/form-validation    — Form validation & error handling
/docs/pocketbase         — PocketBase integration
/docs/env-config         — Environment variables
/docs/tailwind-variables — Tailwind CSS variables & customization
/docs/framer-motion      — Framer Motion (motion.dev)
/(auth)/login            — Login page
/(auth)/signup           — Signup page
```

---

## Common Mistakes to Avoid

- ❌ Don't add `"use client"` to a component that doesn't need it
- ❌ Don't inline query keys — always use key factories
- ❌ Don't use raw Tailwind colors in semantic contexts — use tokens
- ❌ Don't deep-import when a barrel `index.ts` exists
- ❌ Don't manually validate — always use Zod schemas
- ❌ Don't put API calls directly in components — use React Query hooks
- ❌ Don't use `localStorage` directly in Next.js — use `core/services/storage`
- ❌ Don't add `tailwind.config.ts` — Tailwind v4 uses CSS-only config
