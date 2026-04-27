# Error Mapper Service

## Purpose

Maps raw `ApiError` / `NetworkError` instances (from the network client) into
semantically typed domain errors. Feature-level code catches domain errors
(`AuthenticationError`, `ValidationError`, etc.) rather than matching on
raw HTTP status codes, keeping business logic clean and explicit.

All domain errors extend `ApiError`, preserving the TanStack Query retry
heuristic (skips retries for `ApiError` 4xx) without any modification.

---

## Public API

### `ErrorMapper`

| Method | Signature | Description |
|--------|-----------|-------------|
| `map` | `static map(error: unknown): ApiError \| NetworkError` | Maps any error to a typed domain error |

#### Mapping table

| Status | Input type | Output type |
|--------|-----------|-------------|
| 401 | `ApiError` | `AuthenticationError` |
| 403 | `ApiError` | `AuthorizationError` |
| 404 | `ApiError` | `NotFoundError` |
| 422 | `ApiError` | `ValidationError` |
| 5xx | `ApiError` | `ServerError` |
| Other 4xx | `ApiError` | `ApiError` (unchanged) |
| — | `NetworkError` | `NetworkError` (unchanged) |
| — | anything else | `new NetworkError(String(e), 0)` |

### Domain error classes

| Class | Status | Extra fields |
|-------|--------|-------------|
| `AuthenticationError` | 401 | — |
| `AuthorizationError` | 403 | — |
| `NotFoundError` | 404 | — |
| `ValidationError` | 422 | `fields?: Record<string, string[]>` |
| `ServerError` | 5xx | — |

### Type guards

| Guard | Signature | Matches |
|-------|-----------|---------|
| `isValidationError` | `(e: unknown): e is ValidationError` | 422 domain error |
| `isAuthenticationError` | `(e: unknown): e is AuthenticationError` | 401 domain error |
| `isAuthorizationError` | `(e: unknown): e is AuthorizationError` | 403 domain error |
| `isNotFoundError` | `(e: unknown): e is NotFoundError` | 404 domain error |
| `isServerError` | `(e: unknown): e is ServerError` | 5xx domain error |

---

## Usage

```ts
import { httpClient } from '@/core/services/http';
import {
  ErrorMapper,
  isAuthenticationError,
  isValidationError,
  isNotFoundError,
} from '@/core/services/error-mapper';

async function updateUser(id: string, payload: unknown) {
  try {
    return await httpClient.put(`/users/${id}`, payload);
  } catch (err) {
    const mapped = ErrorMapper.map(err);

    if (isValidationError(mapped)) {
      // mapped.fields contains per-field messages
      console.error('Validation failed', mapped.fields);
      return;
    }
    if (isAuthenticationError(mapped)) {
      router.push('/login');
      return;
    }
    if (isNotFoundError(mapped)) {
      notFound();
    }

    throw mapped; // re-throw unhandled errors
  }
}
```

---

## SSR Considerations

`ErrorMapper` and the domain error classes are pure TypeScript — they have no
browser or Node.js API dependencies and are fully SSR-safe.
