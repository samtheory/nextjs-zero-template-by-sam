/**
 * Generic storage abstraction.
 * All implementations handle JSON serialization internally.
 */
export interface IStorage {
  /**
   * Retrieves and deserializes a value by key.
   * @returns The typed value, or null if key does not exist or deserialization fails.
   */
  get<T>(key: string): T | null;

  /**
   * Serializes and stores a value by key.
   */
  set<T>(key: string, value: T): void;

  /**
   * Removes the entry associated with the given key.
   */
  remove(key: string): void;

  /**
   * Removes all entries from the storage.
   */
  clear(): void;

  /**
   * Returns true if the given key exists in storage.
   */
  has(key: string): boolean;
}
