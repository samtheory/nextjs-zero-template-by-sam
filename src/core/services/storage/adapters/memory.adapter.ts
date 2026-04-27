import type { IStorage } from '../storage.interface';

/**
 * In-memory storage adapter backed by a `Map<string, string>`.
 *
 * SSR-safe by design — works identically on the server and client.
 * Note: all state is lost on page reload or server request completion.
 *
 * JSON serialization is handled internally.
 */
export class MemoryStorageAdapter implements IStorage {
  private readonly store = new Map<string, string>();

  /**
   * Retrieves and deserializes a value from memory.
   * Returns null if the key is missing or if JSON parsing fails.
   */
  get<T>(key: string): T | null {
    const raw = this.store.get(key);
    if (raw === undefined) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  /**
   * Serializes a value and stores it in memory.
   */
  set<T>(key: string, value: T): void {
    this.store.set(key, JSON.stringify(value));
  }

  /**
   * Removes the key from the in-memory store.
   */
  remove(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clears all entries from the in-memory store.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Returns true if the key exists in the in-memory store.
   */
  has(key: string): boolean {
    return this.store.has(key);
  }
}
