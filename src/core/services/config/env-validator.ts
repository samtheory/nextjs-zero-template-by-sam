/**
 * Validates that all specified environment variables are present at startup.
 * Throws a descriptive `Error` listing every missing variable if any are absent.
 *
 * Intended to be called once during application bootstrap (e.g. in
 * `app/layout.tsx` or a server-side initialisation file) so that misconfigured
 * deployments fail fast rather than silently at runtime.
 *
 * @param required - Array of environment variable names that must be defined.
 * @throws {Error} If one or more required variables are missing.
 *
 * @example
 * ```ts
 * validateEnv(['NEXT_PUBLIC_API_BASE_URL', 'DATABASE_URL']);
 * ```
 */
export function validateEnv(required: string[]): void {
  const missing = required.filter((key) => process.env[key] === undefined);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`,
    );
  }
}

/**
 * Reads an environment variable and returns its value, or a fallback when the
 * variable is not set.
 *
 * @param key      - The name of the environment variable.
 * @param fallback - Value to return when the variable is absent. Defaults to `''`.
 * @returns The variable value, or the fallback string.
 *
 * @example
 * ```ts
 * const apiUrl = getEnv('NEXT_PUBLIC_API_BASE_URL', '/api/proxy');
 * ```
 */
export function getEnv(key: string, fallback = ''): string {
  const value = process.env[key];
  return value !== undefined ? value : fallback;
}

/**
 * Reads an environment variable and parses it as a boolean.
 *
 * The following values (case-insensitive) are treated as `true`:
 * `'true'`, `'1'`, `'yes'`.
 * Any other value (including absent) returns the fallback.
 *
 * @param key      - The name of the environment variable.
 * @param fallback - Value to return when the variable is absent. Defaults to `false`.
 * @returns Parsed boolean value.
 *
 * @example
 * ```ts
 * const loggingEnabled = getBoolEnv('NEXT_PUBLIC_ENABLE_LOGGING', true);
 * ```
 */
export function getBoolEnv(key: string, fallback = false): boolean {
  const value = process.env[key];
  if (value === undefined) return fallback;
  return ['true', '1', 'yes'].includes(value.toLowerCase());
}
