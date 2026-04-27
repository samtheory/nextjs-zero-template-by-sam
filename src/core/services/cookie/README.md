# Cookie Service

## Purpose

Provides typed, class-based wrappers for reading and writing HTTP cookies on
both the server and the client. Two implementations are provided:

- **`ServerCookieService`** — uses Next.js `next/headers` (async `cookies()`).
  Supports `httpOnly` cookies. For use in Server Components, Route Handlers,
  and Server Actions only.
- **`ClientCookieService`** — uses `document.cookie`. Does **not** support
  `httpOnly`. SSR-safe (no-ops on the server). For use in Client Components.

---

## Public API

### `ServerCookieService` (server-only)

| Method | Signature | Description |
|--------|-----------|-------------|
| `get` | `(name: string): Promise<string \| null>` | Reads a cookie value |
| `set` | `(name: string, value: string, options?: CookieOptions): Promise<void>` | Writes a cookie |
| `remove` | `(name: string): Promise<void>` | Deletes a cookie (sets maxAge=0) |

### `ClientCookieService` (client-only)

| Method | Signature | Description |
|--------|-----------|-------------|
| `get` | `(name: string): string \| null` | Reads a cookie value |
| `set` | `(name: string, value: string, options?: Omit<CookieOptions, 'httpOnly'>): void` | Writes a cookie |
| `remove` | `(name: string): void` | Deletes a cookie (sets maxAge=0) |

### `CookieOptions`

| Field | Type | Description |
|-------|------|-------------|
| `httpOnly` | `boolean?` | Prevent JS access (server-only) |
| `secure` | `boolean?` | HTTPS only |
| `sameSite` | `'strict' \| 'lax' \| 'none'?` | Cross-site policy |
| `maxAge` | `number?` | Lifetime in seconds |
| `path` | `string?` | URL path scope |
| `domain` | `string?` | Domain scope |

---

## Usage

### Server Component / Server Action

```ts
import { ServerCookieService } from '@/core/services/cookie';

const cookieService = new ServerCookieService();

// Set a secure, httpOnly session cookie
await cookieService.set('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
});

// Read it later
const session = await cookieService.get('session');

// Remove it on logout
await cookieService.remove('session');
```

### Client Component

```ts
import { ClientCookieService } from '@/core/services/cookie';

const cookieService = new ClientCookieService();

cookieService.set('locale', 'fr-FR', { sameSite: 'lax', maxAge: 86400 });
const locale = cookieService.get('locale'); // 'fr-FR'
```

---

## SSR Considerations

- **`ServerCookieService`**: server-only. Do NOT import it in Client Components —
  `next/headers` is a server-only module and will cause a build error if bundled
  into a client bundle.
- **`ClientCookieService`**: guards all operations with `typeof window !== 'undefined'`.
  Safe to instantiate in shared code, but `get` returns null and `set`/`remove`
  are no-ops during SSR.
- When importing from the barrel (`@/core/services/cookie`), ensure the
  importing file is a Server Component when using `ServerCookieService`.
