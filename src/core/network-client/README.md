# `core/network-client`

A fully self-contained HTTP client and data-fetching layer for Next.js enterprise projects.  
Combines **Axios** (transport) and **TanStack Query v5** (data sync) into one coherent, independently configurable service.

---

## Table of Contents

1. [Architecture decision — why together?](#1-architecture-decision--why-together)
2. [Module structure](#2-module-structure)
3. [Setup — `configureHttpClient()`](#3-setup--configurehttpclient)
4. [Token & refresh-token flow](#4-token--refresh-token-flow)
5. [Direct API calls — `api.*`](#5-direct-api-calls--api)
6. [React Query hooks](#6-react-query-hooks)
7. [File upload with progress](#7-file-upload-with-progress)
8. [File download](#8-file-download)
9. [Error handling](#9-error-handling)
10. [Environment variables](#10-environment-variables)
11. [What belongs here vs. elsewhere](#11-what-belongs-here-vs-elsewhere)

---

## 1. Architecture decision — why together?

| Concern | Tool |
|---|---|
| HTTP transport, interceptors, token injection | Axios (`ApiRequest.ts`) |
| Caching, background refetch, loading/error states | TanStack Query (`useCustomQuery`, `useCustomMutation`) |

They are kept in the **same module** because they form a single data-fetching service:  
TanStack Query calls Axios, they share the same type contracts, and splitting them would only add cross-package coupling with no real benefit.

Internally the layers are clearly separated:

```
useCustomQuery / useCustomMutation  ← TanStack Query (data sync)
        ↓
      Request()                     ← dispatcher (Axios.ts)
        ↓
      api.*                         ← HTTP methods (ApiRequest.ts)
        ↓
   axiosInstance                    ← Axios + interceptors
```

---

## 2. Module structure

```
core/network-client/
├── index.ts                         ← barrel — import everything from here
├── middleware/
│   ├── ApiRequest.ts                ← axiosInstance, interceptors, api object
│   ├── Axios.ts                     ← Request() dispatcher
│   ├── CustomQuery/
│   │   └── useCustomQuery.ts        ← TanStack Query read hook
│   └── CustomMutation/
│       └── useCustomMutation.ts     ← TanStack Query write hook
└── models/
    ├── Model.ts                     ← TypeMethod, IQueryProps, IMutationProps, IMutateProps
    ├── Types.ts                     ← ApiResponse<T>, PaginatedResponse<T>, HttpResponse<T>
    ├── Errors.ts                    ← NetworkError, ApiError, type guards
    ├── label.ts                     ← HTTP_METHOD_LABEL
    └── enum/
        └── Enums.ts                 ← ValidationResult, HttpStatusCode
```

---

## 3. Setup — `configureHttpClient()`

The client is **decoupled from any specific cookie library or storage strategy**.  
You inject your app's token functions once at startup.

```ts
// src/app/layout.tsx  (or a dedicated <HttpClientProvider> component)
"use client";

import { configureHttpClient } from "@/core/network-client";
import Cookies from "js-cookie";

configureHttpClient({
  getAccessToken:   () => Cookies.get("access_token") ?? null,
  getRefreshToken:  () => Cookies.get("refresh_token") ?? null,
  setAccessToken:   (token, days = 7)  => Cookies.set("access_token",  token, { expires: days }),
  setRefreshToken:  (token, days = 30) => Cookies.set("refresh_token", token, { expires: days }),
  removeAuthTokens: () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
  },
  refreshEndpoint: "/auth/refresh",          // your backend refresh route
  onAuthFailure:   () => router.push("/login"), // optional; defaults to window.location
});
```

> **Call `configureHttpClient` before any authenticated request.**  
> A good place is a root Client Component that wraps the app, or directly in `layout.tsx` with `"use client"`.

---

## 4. Token & refresh-token flow

```
Request → Axios interceptor adds  Bearer <accessToken>  header
              ↓
         Server responds 401
              ↓
         isRefreshing?  YES → queue the request
                        NO  → set isRefreshing = true
                               POST /auth/refresh { refreshToken }
                               ↓
                         SUCCESS → persist new tokens
                                   drain queue (retry all queued requests)
                                   retry original request
                         FAILURE → drain queue with error
                                   call onAuthFailure() → redirect to /login
```

Concurrent requests that arrive while a refresh is in flight are **queued** and retried automatically once the refresh completes — you never get multiple simultaneous refresh calls.

---

## 5. Direct API calls — `api.*`

Use these in **server actions**, route handlers, or any plain `async` function.

```ts
import { api } from "@/core/network-client";

// GET with query params
const res = await api.get("/users", { page: 1, search: "alice" });

// POST
const res = await api.post("/users", { name: "Alice", role: "admin" });

// PUT / PATCH / DELETE
await api.put("/users/1",   { name: "Alice Updated" });
await api.patch("/users/1", { role: "editor" });
await api.delete("/users/1");

// With AbortSignal (manual cancellation)
const controller = new AbortController();
const res = await api.get("/users", undefined, controller.signal);
controller.abort();
```

---

## 6. React Query hooks

### `useCustomQuery<TData>` — for reads

```ts
import { useCustomQuery } from "@/core/network-client";
import type { ApiResponse } from "@/core/network-client";
import type { UserDto } from "@/features/users/models/user.dto";

function UserList() {
  const { data, isLoading, isError, error, refetch } = useCustomQuery<ApiResponse<UserDto[]>>({
    key: ["users", filters],   // cache key — include every variable that affects the result
    method: "get",
    url: "/users",
    params: filters,
    options: {
      enabled: !!filters,      // only run when filters are ready
      staleTime: 30_000,       // keep data fresh for 30 s
    },
  });

  if (isLoading) return <Spinner />;
  if (isError)   return <ErrorBanner error={error} />;
  return <ul>{data?.data.data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

> TanStack Query v5 automatically provides an `AbortSignal` to every `queryFn`.  
> The hook forwards it to Axios — queries are **cancelled automatically** on unmount or key change.

### `useCustomMutation<TData>` — for writes

```ts
import { useCustomMutation, isApiError } from "@/core/network-client";
import type { CreateUserPayload } from "@/features/users/models/user.payload";

function CreateUserForm() {
  const { mutate, isPending, isError, error } = useCustomMutation<CreateUserPayload>({
    method: "post",
    url: "/users",
    options: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    },
  });

  const handleSubmit = (payload: CreateUserPayload) => {
    mutate({ data: payload });
  };

  // Override URL per-call (useful for REST resource IDs):
  // mutate({ url: `/users/${id}`, data: payload });
}
```

**Retry behaviour:**  
- 4xx errors → **never retried** (client mistake; 401 refresh is handled by the Axios interceptor).  
- 5xx / network failures → **retried once** automatically.

---

## 7. File upload with progress

```ts
import { api } from "@/core/network-client";

const formData = new FormData();
formData.append("file", file);

await api.upload({
  url: "/files/upload",
  body: formData,
  callback: (percent) => setUploadProgress(percent), // 0–100
  callMethod: "post", // default
});
```

The Bearer token is sent automatically — the old implementation created a new Axios instance without interceptors, which silently skipped authentication.

---

## 8. File download

```ts
import { api } from "@/core/network-client";

// Triggers a browser Save dialog
await api.download({
  url: "/reports/monthly",
  customfileName: "monthly-report.pdf",   // optional; falls back to last URL segment
  callMethod: "get",                      // default
});
```

The Bearer token is sent automatically — the old implementation used a bare `axios()` call that skipped authentication.

---

## 9. Error handling

Every error thrown by the client is a `NetworkError` or the more specific `ApiError`.

```ts
import { api, isApiError, isNetworkError, isNotFound } from "@/core/network-client";

try {
  await api.delete("/users/99");
} catch (err) {
  if (isNotFound(err)) {
    toast.error("User not found");
  } else if (isApiError(err)) {
    // err.status  — HTTP status code
    // err.message — message from backend or Axios
    // err.data    — raw response body
    toast.error(`API error ${err.status}: ${err.message}`);
  } else if (isNetworkError(err)) {
    // status === 0 → no server response (offline, DNS failure, CORS, …)
    toast.error("Network unreachable");
  }
}
```

### In React Query error handlers

```ts
const { error } = useCustomQuery<UserDto>({ key: ["user", id], method: "get", url: `/users/${id}` });

if (isApiError(error) && error.status === 404) {
  return <NotFound />;
}
```

### Available helpers

| Guard | When true |
|---|---|
| `isNetworkError(e)` | Any `NetworkError` (covers `ApiError` too) |
| `isApiError(e)` | Server responded with an error status |
| `isUnauthorized(e)` | HTTP 401 |
| `isForbidden(e)` | HTTP 403 |
| `isNotFound(e)` | HTTP 404 |
| `isServerError(e)` | HTTP 5xx |

---

## 10. Environment variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `/api/proxy` | Base URL for all requests. The default proxies through a Next.js route handler so the real backend URL is never exposed to the browser. |

---

## 11. What belongs here vs. elsewhere

| Concern | Where it lives |
|---|---|
| Axios instance, interceptors, token injection | ✅ **here** — `ApiRequest.ts` |
| Silent token refresh on 401 | ✅ **here** — `ApiRequest.ts` interceptor |
| React Query wrappers | ✅ **here** — `useCustomQuery`, `useCustomMutation` |
| **Token storage** (cookies, localStorage) | ❌ `core/storage/` or `shared/utils/` — injected via `configureHttpClient()` |
| **Auth feature logic** (login form, session management) | ❌ `features/auth/` |
| **Refresh endpoint path** (`/auth/refresh`) | ❌ `features/auth/` config, passed into `configureHttpClient()` |
| **Redirect on logout** | ❌ `features/auth/` or app router — passed as `onAuthFailure` callback |

> **Rule of thumb:** this module handles *how to send a request and what to do when auth fails*.  
> It does **not** know *where tokens come from* or *what the login screen looks like*.
