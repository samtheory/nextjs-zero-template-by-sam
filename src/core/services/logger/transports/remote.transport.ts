import type { ITransport, LogEntry } from '../logger.types';

/**
 * Fire-and-forget transport that POSTs log entries to a remote HTTP endpoint.
 *
 * Client-side only — entries are silently dropped on the server (SSR/SSG).
 * Network errors are swallowed to ensure logging never disrupts the application.
 *
 * @example
 * ```ts
 * const logger = new LoggerService({
 *   transports: [new RemoteTransport('https://logs.example.com/ingest')],
 * });
 * logger.error('Payment failed', { orderId: '123' });
 * ```
 */
export class RemoteTransport implements ITransport {
  constructor(private readonly endpoint: string) {}

  /**
   * Posts the log entry to the configured endpoint.
   * Does nothing on the server. Errors are silently ignored.
   *
   * @param entry - The structured log record to send.
   */
  log(entry: LogEntry): void {
    if (typeof window === 'undefined') return;

    fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    }).catch(() => {
      // Intentionally swallow errors — logging must never break the app.
    });
  }
}
