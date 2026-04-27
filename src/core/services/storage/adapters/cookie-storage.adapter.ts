import type { IStorage } from '../storage.interface';

/**
 * Client-side cookie storage adapter (document.cookie).
 *
 * **CLIENT-SIDE ONLY** — does not support httpOnly cookies (those can only be
 * set by the server). Use `ServerCookieService` for httpOnly cookies.
 *
 * SSR-safe: all methods check `typeof window !== 'undefined'`. On the server,
 * reads return null and writes are no-ops.
 *
 * JSON serialization is handled internally.
 */
export class CookieStorageAdapter implements IStorage {
  private isAvailable(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Reads a cookie value and deserializes it.
   * Returns null on the server, if the cookie is absent, or if JSON parsing fails.
   */
  get<T>(key: string): T | null {
    if (!this.isAvailable()) return null;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const separatorIndex = cookie.indexOf('=');
      if (separatorIndex === -1) continue;
      const cookieKey = cookie.slice(0, separatorIndex).trim();
      if (cookieKey !== key) continue;
      const rawValue = cookie.slice(separatorIndex + 1).trim();
      try {
        return JSON.parse(decodeURIComponent(rawValue)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Serializes a value and writes it as a cookie.
   * No-op on the server.
   */
  set<T>(key: string, value: T): void {
    if (!this.isAvailable()) return;
    const encoded = encodeURIComponent(JSON.stringify(value));
    document.cookie = `${key}=${encoded}; path=/`;
  }

  /**
   * Deletes a cookie by setting its maxAge to 0.
   * No-op on the server.
   */
  remove(key: string): void {
    if (!this.isAvailable()) return;
    document.cookie = `${key}=; path=/; max-age=0`;
  }

  /**
   * Removes all cookies accessible via document.cookie.
   * No-op on the server.
   */
  clear(): void {
    if (!this.isAvailable()) return;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const separatorIndex = cookie.indexOf('=');
      const cookieKey = separatorIndex === -1
        ? cookie.trim()
        : cookie.slice(0, separatorIndex).trim();
      if (cookieKey) {
        document.cookie = `${cookieKey}=; path=/; max-age=0`;
      }
    }
  }

  /**
   * Returns true if the cookie exists.
   * Always returns false on the server.
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}
