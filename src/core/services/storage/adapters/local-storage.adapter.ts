import type { IStorage } from '../storage.interface';

/**
 * localStorage-backed storage adapter.
 *
 * SSR-safe: all methods check `typeof window !== 'undefined'` before accessing
 * localStorage. On the server, reads return null and writes are no-ops.
 *
 * JSON serialization is handled internally — you can store any serializable value.
 */
export class LocalStorageAdapter implements IStorage {
  private isAvailable(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Retrieves and deserializes a value from localStorage.
   * Returns null on the server, if the key is missing, or if JSON parsing fails.
   */
  get<T>(key: string): T | null {
    if (!this.isAvailable()) return null;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  /**
   * Serializes a value and stores it in localStorage.
   * No-op on the server or when the storage quota is exceeded.
   */
  set<T>(key: string, value: T): void {
    if (!this.isAvailable()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded or private-browsing restrictions — fail silently.
    }
  }

  /**
   * Removes the key from localStorage.
   * No-op on the server.
   */
  remove(key: string): void {
    if (!this.isAvailable()) return;
    window.localStorage.removeItem(key);
  }

  /**
   * Clears all keys from localStorage.
   * No-op on the server.
   */
  clear(): void {
    if (!this.isAvailable()) return;
    window.localStorage.clear();
  }

  /**
   * Returns true if the key exists in localStorage.
   * Always returns false on the server.
   */
  has(key: string): boolean {
    if (!this.isAvailable()) return false;
    return window.localStorage.getItem(key) !== null;
  }
}
