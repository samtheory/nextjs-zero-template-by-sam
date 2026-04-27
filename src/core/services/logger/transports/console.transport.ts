import type { ITransport, LogEntry } from '../logger.types';

/**
 * Writes log entries to the browser / Node.js console.
 *
 * Each entry is serialized as a JSON string and forwarded to the corresponding
 * `console` method (`debug`, `info`, `warn`, `error`) based on the log level.
 */
export class ConsoleTransport implements ITransport {
  /**
   * Outputs the log entry to the console as a JSON string.
   *
   * @param entry - The structured log record to output.
   */
  log(entry: LogEntry): void {
    const output = JSON.stringify(entry);
    switch (entry.level) {
      case 'debug':
        console.debug(output);
        break;
      case 'info':
        console.info(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'error':
        console.error(output);
        break;
    }
  }
}
