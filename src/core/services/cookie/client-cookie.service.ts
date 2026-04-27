import type { CookieOptions } from './cookie.types';

/**
 * Client-side cookie service using `document.cookie`.
 *
 * **CLIENT-SIDE ONLY** — `httpOnly` cookies cannot be set via JavaScript and
 * are therefore omitted from the `set` signature. Use `ServerCookieService`
 * for httpOnly cookies.
 *
 * SSR-safe: all methods check `typeof window !== 'undefined'` and return
 * gracefully (null / no-op) on the server.
 *
 * @example
 * ```ts
 * const cookieService = new ClientCookieService();
 * cookieService.set('locale', 'en-US', { maxAge: 86400, sameSite: 'lax' });
 * const locale = cookieService.get('locale'); // 'en-US'
 * ```
 */
export class ClientCookieService {
  private isAvailable(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Reads a cookie value by name.
   *
   * @param name - The cookie name to look up.
   * @returns The cookie value, or null if not found or called on the server.
   */
  get(name: string): string | null {
    if (!this.isAvailable()) return null;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const separatorIndex = cookie.indexOf('=');
      if (separatorIndex === -1) continue;
      const cookieName = cookie.slice(0, separatorIndex).trim();
      if (cookieName !== name) continue;
      return decodeURIComponent(cookie.slice(separatorIndex + 1).trim());
    }
    return null;
  }

  /**
   * Writes a cookie via `document.cookie`.
   * No-op on the server. Does not support `httpOnly`.
   *
   * @param name    - The cookie name.
   * @param value   - The cookie value.
   * @param options - Optional cookie attributes (excludes httpOnly).
   */
  set(name: string, value: string, options?: Omit<CookieOptions, 'httpOnly'>): void {
    if (!this.isAvailable()) return;

    const parts: string[] = [
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
      `path=${options?.path ?? '/'}`,
    ];

    if (options?.maxAge !== undefined) parts.push(`max-age=${options.maxAge}`);
    if (options?.sameSite) parts.push(`samesite=${options.sameSite}`);
    if (options?.secure) parts.push('secure');
    if (options?.domain) parts.push(`domain=${options.domain}`);

    document.cookie = parts.join('; ');
  }

  /**
   * Deletes a cookie by setting its maxAge to 0.
   * No-op on the server.
   *
   * @param name - The cookie name to delete.
   */
  remove(name: string): void {
    if (!this.isAvailable()) return;
    document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0`;
  }
}
