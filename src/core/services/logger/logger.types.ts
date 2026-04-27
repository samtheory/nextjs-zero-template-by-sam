/** Severity levels for log entries, from least to most critical. */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Optional contextual metadata attached to every log entry produced by a
 * logger that carries this context.
 */
export interface LogContext {
  /** ID of the authenticated user, if available. */
  userId?: string;
  /** Correlation / trace ID for the current request. */
  requestId?: string;
  /** Any additional key-value pairs. */
  [key: string]: unknown;
}

/** A structured log record passed to each registered transport. */
export interface LogEntry {
  level: LogLevel;
  message: string;
  /** ISO 8601 timestamp at the time the log was emitted. */
  timestamp: string;
  context?: LogContext;
  /** Arbitrary additional data (error objects, request payloads, etc.). */
  data?: unknown;
}

/**
 * A transport receives structured log entries and decides where to send them
 * (console, remote endpoint, file system, etc.).
 */
export interface ITransport {
  /**
   * Processes a single log entry.
   *
   * @param entry - The structured log record to handle.
   */
  log(entry: LogEntry): void;
}
