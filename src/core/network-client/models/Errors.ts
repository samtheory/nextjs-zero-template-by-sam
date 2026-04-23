/**
 * Base class for every network-related error thrown by the HTTP client.
 *
 * `status` is the HTTP status code (0 = no server response / pure network failure).
 * `code` is an optional string identifier from the backend (e.g. `"USER_NOT_FOUND"`).
 */
export class NetworkError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "NetworkError";
    this.status = status;
    this.code = code;
    // Needed for correct `instanceof` checks in transpiled ES5 environments.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the server responded but indicated an error (4xx / 5xx).
 * The raw response body is available via `data` for detailed inspection.
 */
export class ApiError extends NetworkError {
  readonly data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message, status);
    this.name = "ApiError";
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── Type guards ─────────────────────────────────────────────────────────────

/** Returns `true` when `e` is a `NetworkError` (covers `ApiError` too). */
export const isNetworkError = (e: unknown): e is NetworkError => e instanceof NetworkError;

/** Returns `true` when `e` is an `ApiError` (implies `isNetworkError`). */
export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;

/** Returns `true` when the error represents an authentication failure (401). */
export const isUnauthorized = (e: unknown): boolean =>
  isNetworkError(e) && e.status === 401;

/** Returns `true` when the error represents a forbidden resource (403). */
export const isForbidden = (e: unknown): boolean =>
  isNetworkError(e) && e.status === 403;

/** Returns `true` when the error represents a not-found resource (404). */
export const isNotFound = (e: unknown): boolean =>
  isNetworkError(e) && e.status === 404;

/** Returns `true` when the error is a server-side failure (5xx). */
export const isServerError = (e: unknown): boolean =>
  isNetworkError(e) && e.status >= 500;
