import { cookies } from 'next/headers';
import type { CookieOptions } from './cookie.types';

/**
 * Server-side cookie service using Next.js `next/headers`.
 *
 * In Next.js 15+, `cookies()` is an async function that must be awaited.
 * All methods on this service are therefore async.
 *
 * This service is **server-only** — do NOT import it in Client Components.
 * It is safe to use in Server Components, Route Handlers, and Server Actions.
 * Supports `httpOnly` cookies (unlike `ClientCookieService`).
 *
 * @example
 * ```ts
 * // In a Server Component or Server Action:
 * const cookieService = new ServerCookieService();
 * await cookieService.set('session', token, { httpOnly: true, secure: true });
 * const session = await cookieService.get('session');
 * ```
 */
export class ServerCookieService {
  /**
   * Reads a cookie value from the incoming request.
   *
   * @param name - The name of the cookie to read.
   * @returns The cookie value string, or null if not present.
   */
  async get(name: string): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(name);
    return cookie?.value ?? null;
  }

  /**
   * Sets a cookie on the response.
   *
   * @param name    - The cookie name.
   * @param value   - The cookie value string.
   * @param options - Optional cookie attributes (httpOnly, secure, sameSite, etc.).
   */
  async set(name: string, value: string, options?: CookieOptions): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
      httpOnly: options?.httpOnly,
      secure: options?.secure,
      sameSite: options?.sameSite,
      maxAge: options?.maxAge,
      path: options?.path ?? '/',
      domain: options?.domain,
    });
  }

  /**
   * Removes a cookie by setting its maxAge to 0.
   *
   * @param name - The cookie name to remove.
   */
  async remove(name: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(name, '', { maxAge: 0, path: '/' });
  }
}
