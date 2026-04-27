import { ApiError, NetworkError } from '../../network-client/models/Errors';
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ServerError,
  ValidationError,
} from './domain-errors';

/**
 * Maps raw `ApiError` / `NetworkError` instances to semantically typed domain
 * errors (`AuthenticationError`, `ValidationError`, etc.).
 *
 * Use this in repository or service layers to translate low-level HTTP errors
 * into application-level error types that feature-code can handle with
 * confidence.
 *
 * Because all domain errors extend `ApiError`, the TanStack Query retry
 * heuristic (skip retries for 4xx `ApiError`) continues to work correctly.
 *
 * @example
 * ```ts
 * try {
 *   await httpClient.post('/users', payload);
 * } catch (err) {
 *   throw ErrorMapper.map(err);
 * }
 * ```
 */
export class ErrorMapper {
  /**
   * Maps an unknown error value to the most specific domain error type.
   *
   * - `ApiError` 401 → `AuthenticationError`
   * - `ApiError` 403 → `AuthorizationError`
   * - `ApiError` 404 → `NotFoundError`
   * - `ApiError` 422 → `ValidationError`
   * - `ApiError` 5xx → `ServerError`
   * - `ApiError` other 4xx → returned as-is
   * - `NetworkError` → returned as-is
   * - Anything else → wrapped in a new `NetworkError` with status 0
   *
   * @param error - Any caught value.
   * @returns A typed `ApiError` or `NetworkError` subclass.
   */
  static map(error: unknown): ApiError | NetworkError {
    if (error instanceof ApiError) {
      const { message, status, data } = error;

      if (status === 401) return new AuthenticationError(message, status, data);
      if (status === 403) return new AuthorizationError(message, status, data);
      if (status === 404) return new NotFoundError(message, status, data);
      if (status === 422) return new ValidationError(message, status, data);
      if (status >= 500) return new ServerError(message, status, data);

      // Other 4xx: return the original ApiError unchanged.
      return error;
    }

    if (error instanceof NetworkError) return error;

    return new NetworkError(String(error), 0);
  }
}

// ─── Domain error type guards ─────────────────────────────────────────────────

/** Returns true when `e` is a `ValidationError` (HTTP 422). */
export const isValidationError = (e: unknown): e is ValidationError =>
  e instanceof ValidationError;

/** Returns true when `e` is an `AuthenticationError` (HTTP 401). */
export const isAuthenticationError = (e: unknown): e is AuthenticationError =>
  e instanceof AuthenticationError;

/** Returns true when `e` is an `AuthorizationError` (HTTP 403). */
export const isAuthorizationError = (e: unknown): e is AuthorizationError =>
  e instanceof AuthorizationError;

/** Returns true when `e` is a `NotFoundError` (HTTP 404). */
export const isNotFoundError = (e: unknown): e is NotFoundError =>
  e instanceof NotFoundError;

/** Returns true when `e` is a `ServerError` (HTTP 5xx). */
export const isServerError = (e: unknown): e is ServerError =>
  e instanceof ServerError;
