/**
 * Read-only application configuration object.
 * Data-only — no callbacks or side-effecting functions.
 */
export interface IAppConfig {
  /** Base URL for all API requests (defaults to `/api/proxy`). */
  readonly apiBaseUrl: string;

  /** Endpoint used to refresh the access token. */
  readonly refreshEndpoint: string;

  /** Whether structured logging is enabled. */
  readonly enableLogging: boolean;

  /** True when `NODE_ENV === 'development'`. */
  readonly isDevelopment: boolean;

  /** True when `NODE_ENV === 'production'`. */
  readonly isProduction: boolean;

  /**
   * Key-value feature flags.
   * Populated at startup; all flags default to false unless explicitly set.
   */
  readonly featureFlags: Readonly<Record<string, boolean>>;
}
