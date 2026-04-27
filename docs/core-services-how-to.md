# Core Services — How-To Guide

This guide covers common usage patterns for every service in `src/core/services/`.
All examples assume imports from `@/core/services/<service>` or the barrel
`@/core` (see caveats for server-only services).

---

## 1. Initialize the Core Layer (`bootstrapCore`)

Call `bootstrapCore` **once**, as early as possible in the client render lifecycle.
A root `'use client'` Provider is the recommended location.

```tsx
// src/app/providers/CoreProvider.tsx
'use client';

import { bootstrapCore } from '@/core';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import type { TokenService } from '@/core';

const CoreContext = createContext<TokenService | null>(null);

export function CoreProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const tokenServiceRef = useRef<TokenService | null>(null);

  // bootstrapCore is idempotent in practice, but we guard with a ref
  // to avoid reconfiguring the Axios instance on every render.
  if (tokenServiceRef.current === null) {
    tokenServiceRef.current = bootstrapCore(() => {
      router.push('/login');
    });
  }

  return (
    <CoreContext.Provider value={tokenServiceRef.current}>
      {children}
    </CoreContext.Provider>
  );
}

export function useTokenService(): TokenService {
  const ctx = useContext(CoreContext);
  if (!ctx) throw new Error('useTokenService must be used inside <CoreProvider>');
  return ctx;
}
```

```tsx
// src/app/layout.tsx
import { CoreProvider } from './providers/CoreProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CoreProvider>{children}</CoreProvider>
      </body>
    </html>
  );
}
```

---

## 2. Switch Storage to Cookie

`StorageFactory` makes it trivial to change the backing store. To use
`document.cookie` instead of `localStorage`:

```ts
import { StorageFactory, TokenService } from '@/core';

// Swap 'localStorage' → 'cookie'
const storage = StorageFactory.create('cookie');
const tokenService = new TokenService(storage);
```

Or pass your own storage to `configureHttpClient` directly:

```ts
import { StorageFactory, TokenService } from '@/core';
import { configureHttpClient, AppConfig } from '@/core';

const storage = StorageFactory.create('cookie');
const tokenService = new TokenService(storage);

configureHttpClient({
  getAccessToken:   () => tokenService.getAccessToken(),
  getRefreshToken:  () => tokenService.getRefreshToken(),
  setAccessToken:   (t) => tokenService.setAccessToken(t),
  setRefreshToken:  (t) => tokenService.setRefreshToken(t),
  removeAuthTokens: ()  => tokenService.clearTokens(),
  refreshEndpoint:  AppConfig.refreshEndpoint,
});
```

For in-memory storage (e.g. unit tests or SSR-only contexts):

```ts
const storage = StorageFactory.create('memory');
```

---

## 3. Axios + Token Auto-Injection (Interceptor Explanation)

Once `configureHttpClient()` is called (via `bootstrapCore`), every request made
through `api` or `httpClient` automatically:

1. **Injects `Authorization: Bearer <accessToken>`** via the request interceptor.
2. On a **401 response**, silently calls the `refreshEndpoint` with the stored
   refresh token, updates both tokens, and **retries the original request**.
3. Queues any concurrent requests that arrive during a refresh, then resolves
   them all with the new access token.
4. If the refresh itself fails (no refresh token, or refresh endpoint returns 401),
   calls `onAuthFailure` (or falls back to `window.location.href = '/login'`).

```ts
// This just works — no extra auth setup needed in feature code:
import { httpClient } from '@/core/services/http';

const user = await httpClient.get<ApiResponse<User>>('/users/me');
```

---

## 4. Error Handling with Domain Errors

Use `ErrorMapper.map()` in repository / service functions to translate HTTP errors
into semantic domain errors. Catch specific types in feature code.

```ts
// src/features/users/user.repository.ts
import { httpClient } from '@/core/services/http';
import { ErrorMapper } from '@/core/services/error-mapper';
import type { ApiResponse } from '@/core';

interface User { id: string; name: string }

export async function fetchUser(id: string): Promise<User> {
  try {
    const response = await httpClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  } catch (err) {
    throw ErrorMapper.map(err);
  }
}
```

```tsx
// src/features/users/UserPage.tsx
'use client';

import { fetchUser } from './user.repository';
import {
  isAuthenticationError,
  isNotFoundError,
  isValidationError,
} from '@/core/services/error-mapper';
import { useRouter } from 'next/navigation';

export function useUser(id: string) {
  const router = useRouter();

  async function load() {
    try {
      return await fetchUser(id);
    } catch (err) {
      if (isAuthenticationError(err)) {
        router.push('/login');
        return;
      }
      if (isNotFoundError(err)) {
        router.push('/404');
        return;
      }
      if (isValidationError(err)) {
        console.error('Validation errors:', err.fields);
        return;
      }
      throw err;
    }
  }

  return { load };
}
```

---

## 5. Server Component Cookie Usage (`ServerCookieService`)

`ServerCookieService` uses Next.js 15's async `cookies()` from `next/headers`.

```tsx
// src/app/dashboard/page.tsx  — Server Component
import { ServerCookieService } from '@/core/services/cookie';

export default async function DashboardPage() {
  const cookieService = new ServerCookieService();
  const theme = await cookieService.get('user_theme');

  return <main data-theme={theme ?? 'light'}>…</main>;
}
```

```ts
// src/app/api/auth/logout/route.ts  — Route Handler
import { ServerCookieService } from '@/core/services/cookie';
import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
  const cookieService = new ServerCookieService();
  await cookieService.remove('session');
  await cookieService.remove('refresh_token');
  return NextResponse.json({ ok: true });
}
```

**⚠️ Important**: Never import `ServerCookieService` in a `'use client'` file.
`next/headers` is a server-only module.

---

## 6. Logger Usage with Context

```ts
import { LoggerService, RemoteTransport } from '@/core/services/logger';

// Application-level logger
const logger = new LoggerService();

logger.info('Server started', { port: 3000 });
logger.warn('Deprecated API used', { endpoint: '/v1/users' });
logger.error('Database connection failed', error);

// Feature logger — every entry carries { feature: 'checkout' }
const checkoutLogger = logger.withContext({ feature: 'checkout' });
checkoutLogger.info('Order created', { orderId: 'ORD-001' });

// Per-request logger — compose context from multiple sources
export async function handleRequest(req: Request) {
  const requestLogger = logger.withContext({
    requestId: req.headers.get('x-request-id') ?? crypto.randomUUID(),
    userId: 'user-42',
  });
  requestLogger.debug('Request received');
}

// Production setup with remote transport
const prodLogger = new LoggerService({
  transports: [new RemoteTransport('https://logs.example.com/ingest')],
  context: { app: 'my-nextjs-app', env: 'production' },
});
```

---

## 7. AppConfig Usage

```ts
import { AppConfig } from '@/core/services/config';

// Access read-only config values
console.log(AppConfig.apiBaseUrl);      // e.g. '/api/proxy'
console.log(AppConfig.refreshEndpoint); // e.g. '/auth/refresh'
console.log(AppConfig.isDevelopment);   // true | false

// Feature flags
if (AppConfig.featureFlags['new-checkout']) {
  // render new checkout flow
}
```

```ts
// Fail-fast validation at startup
import { validateEnv } from '@/core/services/config';

// In src/app/layout.tsx (server component), or a server-side init file:
validateEnv(['NEXT_PUBLIC_API_BASE_URL', 'DATABASE_URL']);
```

---

## 8. `ErrorMapper.map()` Usage

Use `ErrorMapper.map()` whenever you catch an unknown error from the network
layer to ensure it is a typed, structured error.

```ts
import { ErrorMapper, isServerError, isAuthenticationError } from '@/core/services/error-mapper';

async function saveProfile(payload: unknown) {
  try {
    return await httpClient.post('/profile', payload);
  } catch (err) {
    const domainError = ErrorMapper.map(err);

    if (isServerError(domainError)) {
      // Log and show a generic "something went wrong" message
      logger.error('Server error during profile save', domainError);
      throw domainError;
    }

    if (isAuthenticationError(domainError)) {
      // Session expired — redirect to login
      router.push('/login');
      return;
    }

    throw domainError;
  }
}
```

---

## 9. HttpClient Typed Usage

```ts
import { httpClient } from '@/core/services/http';
import type { ApiResponse, PaginatedResponse } from '@/core';

// ── Simple typed GET ──────────────────────────────────────────────────────
interface User { id: string; name: string; email: string }

const userEnvelope = await httpClient.get<ApiResponse<User>>('/users/me');
const user = userEnvelope.data; // typed as User

// ── Paginated list ────────────────────────────────────────────────────────
const listEnvelope = await httpClient.get<PaginatedResponse<User>>(
  '/users',
  { page: 1, perPage: 20 },
);
console.log(listEnvelope.items); // User[]

// ── POST with typed body and response ─────────────────────────────────────
interface CreateUserPayload { name: string; email: string }

const created = await httpClient.post<ApiResponse<User>>(
  '/users',
  { name: 'Alice', email: 'alice@example.com' } satisfies CreateUserPayload,
);
console.log(created.data.id);

// ── Raw variant — inspect headers ─────────────────────────────────────────
const rawResponse = await httpClient.getRaw<ApiResponse<User>>('/users/me');
const traceId = rawResponse.headers['x-trace-id'];

// ── DELETE with a request body ────────────────────────────────────────────
await httpClient.delete<void>('/sessions', { sessionId: 'abc-123' });

// ── Cancellable request ───────────────────────────────────────────────────
const controller = new AbortController();
const result = await httpClient.get<ApiResponse<User>>(
  '/users/me',
  undefined,
  controller.signal,
);
// Elsewhere: controller.abort();
```
