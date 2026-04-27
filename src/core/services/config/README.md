# Config Service

## Purpose

Provides a single frozen `AppConfig` object that surfaces all environment
variables consumed by the application. Values are read once at module-load time
via `getEnv` / `getBoolEnv` helpers that return safe defaults when a variable is
absent. `validateEnv` is available for fail-fast startup validation of required
variables.

---

## Public API

### `AppConfig` (singleton constant)

| Field | Type | Env variable | Default |
|-------|------|-------------|---------|
| `apiBaseUrl` | `string` | `NEXT_PUBLIC_API_BASE_URL` | `'/api/proxy'` |
| `refreshEndpoint` | `string` | `NEXT_PUBLIC_REFRESH_ENDPOINT` | `'/auth/refresh'` |
| `enableLogging` | `boolean` | `NEXT_PUBLIC_ENABLE_LOGGING` | `true` |
| `isDevelopment` | `boolean` | `NODE_ENV` | `NODE_ENV === 'development'` |
| `isProduction` | `boolean` | `NODE_ENV` | `NODE_ENV === 'production'` |
| `featureFlags` | `Record<string, boolean>` | — | `{}` |

### Utility functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `validateEnv` | `(required: string[]): void` | Throws if any variable is missing |
| `getEnv` | `(key: string, fallback?: string): string` | Reads a string env var with fallback |
| `getBoolEnv` | `(key: string, fallback?: boolean): boolean` | Reads a boolean env var with fallback |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | No | Base URL for API requests |
| `NEXT_PUBLIC_REFRESH_ENDPOINT` | No | Token refresh endpoint path |
| `NEXT_PUBLIC_ENABLE_LOGGING` | No | Set to `'false'` to disable logging |

---

## Usage

```ts
import { AppConfig, validateEnv, getEnv } from '@/core/services/config';

// Fail-fast validation at startup (e.g. in a server initialisation file)
validateEnv(['NEXT_PUBLIC_API_BASE_URL', 'DATABASE_URL']);

// Access config values
console.log(AppConfig.apiBaseUrl);      // '/api/proxy'
console.log(AppConfig.isDevelopment);   // true | false

// Read arbitrary env variables
const timeout = getEnv('REQUEST_TIMEOUT', '5000');
```

---

## SSR Considerations

`AppConfig`, `getEnv`, and `getBoolEnv` are pure and work in both server and
client contexts. `NEXT_PUBLIC_*` variables are inlined by the Next.js compiler
at build time and are available in the browser bundle. Server-only variables
(no `NEXT_PUBLIC_` prefix) are only available during server execution.
