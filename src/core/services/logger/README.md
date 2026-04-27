# Logger Service

## Purpose

`LoggerService` is a structured, transport-based logging system. It emits
`LogEntry` objects (with a level, ISO timestamp, message, context, and optional
data) to every registered `ITransport`. Child loggers with merged context can
be created with `withContext()`, making it easy to thread a `requestId` or
`userId` through a call chain without repetition.

Logging can be globally disabled via `NEXT_PUBLIC_ENABLE_LOGGING=false`. By
default, a `ConsoleTransport` is registered in development and no transports
are active in production (add a `RemoteTransport` to capture production logs).

---

## Public API

### `LoggerService`

| Method | Signature | Description |
|--------|-----------|-------------|
| `debug` | `(message: string, data?: unknown): void` | Diagnostic / verbose |
| `info` | `(message: string, data?: unknown): void` | Normal application events |
| `warn` | `(message: string, data?: unknown): void` | Unexpected but recoverable |
| `error` | `(message: string, data?: unknown): void` | Failures requiring attention |
| `withContext` | `(context: LogContext): LoggerService` | Child logger with merged context |

### `ConsoleTransport`

| Method | Signature | Description |
|--------|-----------|-------------|
| `log` | `(entry: LogEntry): void` | Outputs JSON to `console.debug/info/warn/error` |

### `RemoteTransport`

| Constructor | `(endpoint: string)` | HTTP endpoint to POST entries to |
|-------------|---------------------|----------------------------------|
| `log` | `(entry: LogEntry): void` | Fire-and-forget POST (client-only) |

---

## Usage

```ts
import { LoggerService, RemoteTransport } from '@/core/services/logger';

// Default logger (ConsoleTransport in dev, silent in prod)
const logger = new LoggerService();

logger.info('Application started');
logger.warn('Config value missing, using default', { key: 'TIMEOUT' });
logger.error('Unhandled exception', error);

// Child logger — every entry includes { userId }
const userLogger = logger.withContext({ userId: '42' });
userLogger.info('Profile updated');

// Production logger with remote transport
const prodLogger = new LoggerService({
  transports: [new RemoteTransport('https://logs.example.com/ingest')],
});
```

---

## SSR Considerations

- `LoggerService` works on both server and client.
- `RemoteTransport` guards `fetch` calls with `typeof window !== 'undefined'`
  and is therefore client-only. On the server, log entries are silently dropped
  by this transport.
- `ConsoleTransport` works in both environments.
