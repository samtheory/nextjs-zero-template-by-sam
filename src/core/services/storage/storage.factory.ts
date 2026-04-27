import type { IStorage } from './storage.interface';
import type { StorageType } from './storage.types';
import { LocalStorageAdapter } from './adapters/local-storage.adapter';
import { CookieStorageAdapter } from './adapters/cookie-storage.adapter';
import { MemoryStorageAdapter } from './adapters/memory.adapter';
import { ZustandStorageAdapter } from './adapters/zustand-storage.adapter';

/**
 * Factory that creates the appropriate IStorage adapter for the requested strategy.
 *
 * @example
 * ```ts
 * const storage = StorageFactory.create('localStorage');
 * storage.set('theme', 'dark');
 * const theme = storage.get<string>('theme'); // 'dark'
 * ```
 */
export class StorageFactory {
  /**
   * Creates and returns an IStorage instance for the given storage type.
   *
   * @param type - The storage strategy to use.
   * @returns An IStorage implementation.
   */
  static create(type: StorageType): IStorage {
    switch (type) {
      case 'localStorage':
        return new LocalStorageAdapter();
      case 'cookie':
        return new CookieStorageAdapter();
      case 'memory':
        return new MemoryStorageAdapter();
      case 'zustand':
        return new ZustandStorageAdapter();
      default: {
        const _exhaustive: never = type;
        throw new Error(`StorageFactory: unknown storage type "${String(_exhaustive)}"`);
      }
    }
  }
}
