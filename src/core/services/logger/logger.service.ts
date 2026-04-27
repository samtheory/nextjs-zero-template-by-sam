import type { ITransport, LogContext, LogEntry, LogLevel } from './logger.types';
import { ConsoleTransport } from './transports/console.transport';

/**
 * Structured, transport-based logger.
 *
 * Emits `LogEntry` records to every registered transport. Supports child
 * loggers with merged context via `withContext()`.
 *
 * Logging can be globally disabled by setting the environment variable
 * `NEXT_PUBLIC_ENABLE_LOGGING=false`.
 *
 * Default transports:
 * - **Development**: `ConsoleTransport` (unless overridden)
 * - **Production**: none (must be explicitly configured)
 *
 * @example
 * ```ts
 * const logger = new LoggerService();
 * logger.info('User signed in', { userId: '42' });
 *
 * const requestLogger = logger.withContext({ requestId: 'abc-123' });
 * requestLogger.error('Handler threw', error);
 * ```
 */
export class LoggerService {
  private readonly transports: readonly ITransport[];
  private readonly context: LogContext;
  private readonly isEnabled: boolean;

  constructor(options?: {
    transports?: ITransport[];
    context?: LogContext;
  }) {
    this.isEnabled = process.env['NEXT_PUBLIC_ENABLE_LOGGING'] !== 'false';
    this.context = options?.context ?? {};

    if (options?.transports !== undefined) {
      this.transports = options.transports;
    } else {
      // Default: ConsoleTransport in development, no transports in production.
      this.transports =
        process.env.NODE_ENV === 'development' ? [new ConsoleTransport()] : [];
    }
  }

  /**
   * Emits a debug-level log entry (verbose / diagnostic information).
   *
   * @param message - Human-readable log message.
   * @param data    - Optional structured data to attach to the entry.
   */
  debug(message: string, data?: unknown): void {
    this.emit('debug', message, data);
  }

  /**
   * Emits an info-level log entry (normal application events).
   *
   * @param message - Human-readable log message.
   * @param data    - Optional structured data to attach to the entry.
   */
  info(message: string, data?: unknown): void {
    this.emit('info', message, data);
  }

  /**
   * Emits a warn-level log entry (unexpected but recoverable situations).
   *
   * @param message - Human-readable log message.
   * @param data    - Optional structured data to attach to the entry.
   */
  warn(message: string, data?: unknown): void {
    this.emit('warn', message, data);
  }

  /**
   * Emits an error-level log entry (failures that require attention).
   *
   * @param message - Human-readable log message.
   * @param data    - Optional structured data to attach to the entry (often an Error).
   */
  error(message: string, data?: unknown): void {
    this.emit('error', message, data);
  }

  /**
   * Creates a child logger that inherits the current transports and merges
   * additional context into every log entry it produces.
   *
   * The parent logger is not affected.
   *
   * @param context - Extra key-value pairs to merge into the child's context.
   * @returns A new LoggerService instance with the merged context.
   *
   * @example
   * ```ts
   * const userLogger = logger.withContext({ userId: user.id });
   * userLogger.info('Profile updated'); // always includes userId
   * ```
   */
  withContext(context: LogContext): LoggerService {
    return new LoggerService({
      transports: [...this.transports],
      context: { ...this.context, ...context },
    });
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private emit(level: LogLevel, message: string, data?: unknown): void {
    if (!this.isEnabled) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: Object.keys(this.context).length > 0 ? this.context : undefined,
      data,
    };

    for (const transport of this.transports) {
      transport.log(entry);
    }
  }
}
