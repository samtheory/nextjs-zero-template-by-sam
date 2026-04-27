# HTTP Client Service

## Purpose

`HttpClient` is a thin, type-safe wrapper over the shared `api` object from the
network client. It adds TypeScript generics so callers get typed return values
instead of `Promise<AxiosResponse<unknown>>`. The underlying `api` object handles
Bearer token injection, silent refresh on 401, and error normalisation — `HttpClient`
adds only the generic typing layer.

Use the `*Raw` variants for access to headers or the full Axios envelope. Use the
unwrapped variants for the common case where you only need `response.data`.

The `httpClient` singleton is exported for use throughout the application.

---

## Public API

| Method | Signature | Description |
|--------|-----------|-------------|
| `getRaw<T>` | `(url, params?, signal?): Promise<AxiosResponse<T>>` | GET — full response |
| `get<T>` | `(url, params?, signal?): Promise<T>` | GET — data only |
| `postRaw<T>` | `(url, body?, params?): Promise<AxiosResponse<T>>` | POST — full response |
| `post<T>` | `(url, body?, params?): Promise<T>` | POST — data only |
| `putRaw<T>` | `(url, body?, params?): Promise<AxiosResponse<T>>` | PUT — full response |
| `put<T>` | `(url, body?, params?): Promise<T>` | PUT — data only |
| `patchRaw<T>` | `(url, body?, params?): Promise<AxiosResponse<T>>` | PATCH — full response |
| `patch<T>` | `(url, body?, params?): Promise<T>` | PATCH — data only |
| `deleteRaw<T>` | `(url, body?, params?): Promise<AxiosResponse<T>>` | DELETE — full response |
| `delete<T>` | `(url, body?, params?): Promise<T>` | DELETE — data only |

---

## Usage

```ts
import { httpClient } from '@/core/services/http';
import type { ApiResponse } from '@/core/network-client';

interface User {
  id: string;
  name: string;
  email: string;
}

// Typed GET — response.data is ApiResponse<User>
const envelope = await httpClient.get<ApiResponse<User>>('/users/me');
console.log(envelope.data.name);

// POST with typed response
const created = await httpClient.post<ApiResponse<User>>('/users', {
  name: 'Alice',
  email: 'alice@example.com',
});

// DELETE with request body
await httpClient.delete('/sessions', { sessionId: 'abc' });

// Raw variant — access response headers
const raw = await httpClient.getRaw<ApiResponse<User>>('/users/me');
console.log(raw.headers['x-request-id']);
```

---

## SSR Considerations

`HttpClient` uses the shared Axios instance which makes `XMLHttpRequest` /
`http.request` calls depending on the environment. Both server-side (Node.js)
and client-side (browser) usage is supported. Token injection via the
interceptor requires `configureHttpClient()` to have been called first — this
is handled by `bootstrapCore()`.
