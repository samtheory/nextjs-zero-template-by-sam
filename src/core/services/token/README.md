# Token Service

## Purpose

`TokenService` manages the persistence of short-lived access tokens and
long-lived refresh tokens. It is storage-agnostic — the backing store is
injected via the `IStorage` constructor argument, so the strategy can be
switched from localStorage to cookies or in-memory without modifying the service.
The class is designed to be passed to `configureHttpClient()` so that the Axios
interceptor can silently refresh tokens on 401 responses.

---

## Public API

| Method | Signature | Description |
|--------|-----------|-------------|
| `getAccessToken` | `(): string \| null` | Returns the stored access token, or null |
| `setAccessToken` | `(token: string): void` | Persists the access token |
| `getRefreshToken` | `(): string \| null` | Returns the stored refresh token, or null |
| `setRefreshToken` | `(token: string): void` | Persists the refresh token |
| `clearTokens` | `(): void` | Removes both tokens from storage |
| `isAuthenticated` | `(): boolean` | Returns true when an access token is present |

### Constants — `TOKEN_KEYS`

| Key | Value |
|-----|-------|
| `TOKEN_KEYS.ACCESS` | `'auth_access_token'` |
| `TOKEN_KEYS.REFRESH` | `'auth_refresh_token'` |

---

## Usage

```ts
import { StorageFactory } from '@/core/services/storage';
import { TokenService } from '@/core/services/token';

const storage = StorageFactory.create('localStorage');
const tokenService = new TokenService(storage);

// After a successful login:
tokenService.setAccessToken(loginResponse.accessToken);
tokenService.setRefreshToken(loginResponse.refreshToken);

// Guard a route:
if (!tokenService.isAuthenticated()) {
  router.push('/login');
}

// On logout:
tokenService.clearTokens();
```

---

## SSR Considerations

`TokenService` delegates all storage operations to the injected `IStorage`
implementation. If `LocalStorageAdapter` is used (the default in
`bootstrapCore`), all operations are no-ops on the server and return null on
reads. For server-side token access, inject a `MemoryStorageAdapter` or use
`ServerCookieService` directly.
