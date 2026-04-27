import { ApiError } from '../../network-client/models/Errors';

/**
 * Thrown when the request body or query parameters fail backend validation.
 * HTTP 422 Unprocessable Entity.
 *
 * Extends `ApiError` so that the TanStack Query retry heuristic (skip retries
 * for 4xx `ApiError` instances) still applies correctly to domain errors.
 */
export class ValidationError extends ApiError {
  /**
   * Per-field validation messages keyed by field name.
   * Populated when the server returns a structured `{ fields: { ... } }` payload.
   */
  readonly fields?: Record<string, string[]>;

  constructor(message: string, status: number, data?: unknown) {
    super(message, status, data);
    this.name = 'ValidationError';

    if (
      data !== null &&
      data !== undefined &&
      typeof data === 'object' &&
      'fields' in data
    ) {
      const rawData = data as Record<string, unknown>;
      const rawFields = rawData['fields'];
      if (rawFields !== null && rawFields !== undefined && typeof rawFields === 'object') {
        this.fields = rawFields as Record<string, string[]>;
      }
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the request lacks valid authentication credentials.
 * HTTP 401 Unauthorized.
 */
export class AuthenticationError extends ApiError {
  constructor(message: string, status: number, data?: unknown) {
    super(message, status, data);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the authenticated user does not have permission to perform the action.
 * HTTP 403 Forbidden.
 */
export class AuthorizationError extends ApiError {
  constructor(message: string, status: number, data?: unknown) {
    super(message, status, data);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the requested resource could not be found.
 * HTTP 404 Not Found.
 */
export class NotFoundError extends ApiError {
  constructor(message: string, status: number, data?: unknown) {
    super(message, status, data);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the server encounters an unexpected failure.
 * HTTP 5xx Server Error.
 */
export class ServerError extends ApiError {
  constructor(message: string, status: number, data?: unknown) {
    super(message, status, data);
    this.name = 'ServerError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
