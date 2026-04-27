/**
 * Options accepted by cookie set operations.
 * Not all options are available on the client (e.g. `httpOnly` is server-only).
 */
export interface CookieOptions {
  /**
   * Prevents client-side JavaScript from accessing the cookie.
   * Only valid when set server-side (e.g. via `ServerCookieService`).
   */
  httpOnly?: boolean;

  /** Send the cookie only over HTTPS. */
  secure?: boolean;

  /** Controls cross-site request behaviour. */
  sameSite?: 'strict' | 'lax' | 'none';

  /** Cookie lifetime in seconds. Omit or set 0 to delete. */
  maxAge?: number;

  /** URL path the cookie applies to. Defaults to '/'. */
  path?: string;

  /** Domain the cookie is valid for. */
  domain?: string;
}
