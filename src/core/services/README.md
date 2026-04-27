# Core Services

## Overview

The `src/core/services/` directory contains the foundational service layer for
this Next.js application. These services provide reusable, framework-agnostic
building blocks — storage, authentication tokens, cookies, structured logging,
configuration, HTTP communication, and error mapping — that feature-level code
builds on top of.

---

## Design Principles

| Principle | Description |
|-----------|-------------|
| **Dependency Injection** | Services accept their dependencies (e.g. `IStorage`) via constructors, making them trivially testable and swappable. |
| **Interface-based contracts** | Public APIs are defined as TypeScript interfaces (`IStorage`, `ITransport`, `IAppConfig`) so implementations can be replaced without touching callers. |
| **SSR safety** | Every browser-only adapter guards against `typeof window === 'undefined'`, returning safe fallbacks during server-side rendering. |
| **Swappable implementations** | `StorageFactory.create('cookie')` vs `'localStorage'` vs `'memory'` — one string changes the entire storage strategy. |
| **No circular imports** | Services never import from feature/presentation layers. `core.bootstrap.ts` is the only entry point that wires everything together. |

---

## Service Overview

| Service | Responsibility | Depends On |
|---------|---------------|-----------|
| `storage` | Unified key-value persistence abstraction | — |
| `token` | Auth token CRUD (access + refresh) | `storage` |
| `cookie` | Server & client cookie read/write | `next/headers` (server) |
| `logger` | Structured logging with pluggable transports | — |
| `error-mapper` | Maps HTTP errors to typed domain errors | `network-client/models/Errors` |
| `config` | Frozen app configuration from env vars | — |
| `http` | Type-safe wrapper over the Axios `api` object | `network-client/middleware/ApiRequest` |

---

## Dependency Graph

```
core.bootstrap.ts
  ├── services/storage      (StorageFactory + LocalStorageAdapter)
  ├── services/token        (TokenService)
  ├── services/config       (AppConfig)
  └── network-client        (configureHttpClient)

services/http
  └── network-client/middleware/ApiRequest  (api)

services/error-mapper
  └── network-client/models/Errors          (ApiError, NetworkError)

services/cookie/server-cookie.service.ts
  └── next/headers                           (cookies)
```

---

## Environment Variables

| Variable | Service | Default | Description |
|----------|---------|---------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | config, network-client | `/api/proxy` | API base URL |
| `NEXT_PUBLIC_REFRESH_ENDPOINT` | config, bootstrap | `/auth/refresh` | Token refresh path |
| `NEXT_PUBLIC_ENABLE_LOGGING` | config, logger | `true` | Set `'false'` to silence all logs |
| `NODE_ENV` | config, logger | — | `development` enables ConsoleTransport |

---

## How to Extend

### Add a new storage adapter

1. Create `src/core/services/storage/adapters/my.adapter.ts` implementing `IStorage`.
2. Add `'my'` to the `StorageType` union in `storage.types.ts`.
3. Add a `case 'my':` branch in `StorageFactory.create()`.
4. Export from `storage/index.ts`.

### Add a new log transport

1. Create `src/core/services/logger/transports/my.transport.ts` implementing `ITransport`.
2. Export from `logger/index.ts`.
3. Pass it to `new LoggerService({ transports: [new MyTransport()] })`.

### Add a new domain error

1. Add a class extending `ApiError` in `error-mapper/domain-errors.ts`.
2. Add a `case` for its HTTP status in `ErrorMapper.map()`.
3. Add a type guard `isMyError` in `error-mapper.service.ts`.
4. Export from `error-mapper/index.ts`.
