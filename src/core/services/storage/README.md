# Storage Service

## Purpose

The storage service provides a uniform `IStorage` abstraction over four concrete
backing stores: `localStorage`, `document.cookie`, an in-memory `Map`, and a
Zustand `persist` store. All adapters handle JSON serialization internally, so
callers deal only with typed values, not raw strings. The `StorageFactory`
creates the correct adapter from a `StorageType` string, making it trivial to
swap strategies at the application or test level.

---

## Public API

### `IStorage` interface

| Method | Signature | Description |
|--------|-----------|-------------|
| `get` | `get<T>(key: string): T \| null` | Deserializes and returns a value, or null |
| `set` | `set<T>(key: string, value: T): void` | Serializes and stores a value |
| `remove` | `remove(key: string): void` | Deletes an entry |
| `clear` | `clear(): void` | Removes all entries |
| `has` | `has(key: string): boolean` | Returns true if the key exists |

### `StorageFactory`

| Method | Signature | Description |
|--------|-----------|-------------|
| `create` | `static create(type: StorageType): IStorage` | Returns an adapter instance |

### Adapters

| Class | Backing store | SSR-safe |
|-------|--------------|----------|
| `LocalStorageAdapter` | `window.localStorage` | ✅ (no-op on server) |
| `CookieStorageAdapter` | `document.cookie` | ✅ (no-op on server) |
| `MemoryStorageAdapter` | `Map<string, string>` | ✅ (always works) |
| `ZustandStorageAdapter` | Zustand `persist` store | ⚠️ (async hydration) |

---

## Usage

```ts
import { StorageFactory } from '@/core/services/storage';

// Switch strategy with a single string
const storage = StorageFactory.create('localStorage');

storage.set('user_prefs', { theme: 'dark', lang: 'en' });
const prefs = storage.get<{ theme: string; lang: string }>('user_prefs');
// → { theme: 'dark', lang: 'en' }

storage.has('user_prefs'); // true
storage.remove('user_prefs');
storage.has('user_prefs'); // false
```

---

## SSR Considerations

- **`LocalStorageAdapter`** and **`CookieStorageAdapter`**: guard every operation
  with `typeof window !== 'undefined'`. Reads return `null`, writes are no-ops
  during SSR.
- **`MemoryStorageAdapter`**: fully SSR-safe; state is local to the process/request.
- **`ZustandStorageAdapter`**: ⚠️ Zustand `persist` hydrates **asynchronously**.
  On the first client render, the store may not yet be hydrated from localStorage.
  Do not use this adapter as the source of truth for auth tokens. Prefer
  `LocalStorageAdapter` for token storage and `MemoryStorageAdapter` for SSR-only
  scenarios.
