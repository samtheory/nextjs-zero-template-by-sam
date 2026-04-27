import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IStorage } from '../storage.interface';

interface StoreState {
  items: Record<string, string>;
}

interface StoreActions {
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clearItems: () => void;
}

type ZustandAdapterStore = StoreState & StoreActions;

const zustandAdapterStore = create<ZustandAdapterStore>()(
  persist(
    (set) => ({
      items: {},
      setItem: (key: string, value: string) =>
        set((state) => ({ items: { ...state.items, [key]: value } })),
      removeItem: (key: string) =>
        set((state) => {
          const next: Record<string, string> = { ...state.items };
          delete next[key];
          return { items: next };
        }),
      clearItems: () => set({ items: {} }),
    }),
    { name: 'core-zustand-storage-adapter' },
  ),
);

/**
 * Zustand-backed storage adapter with `persist` middleware.
 *
 * ⚠️ **Hydration timing warning**: Zustand `persist` hydrates **asynchronously**.
 * Do not use this adapter as the source of truth for auth tokens unless you
 * explicitly gate requests on hydration completion (e.g. check
 * `useStore.persist.hasHydrated()`). On the first render, `get()` may return
 * null even if a value was previously persisted. See README for details.
 *
 * SSR behavior: the store is created at module-load time. On the server (SSR),
 * the in-memory state starts empty and is not hydrated from localStorage.
 * Prefer `MemoryStorageAdapter` for SSR-safe use cases.
 *
 * JSON serialization is handled internally.
 */
export class ZustandStorageAdapter implements IStorage {
  /**
   * Retrieves and deserializes a value from the Zustand store.
   * Returns null if the key is absent, or if JSON parsing fails.
   */
  get<T>(key: string): T | null {
    const value = zustandAdapterStore.getState().items[key];
    if (value === undefined) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  /**
   * Serializes a value and stores it in the Zustand store.
   */
  set<T>(key: string, value: T): void {
    zustandAdapterStore.getState().setItem(key, JSON.stringify(value));
  }

  /**
   * Removes the key from the Zustand store.
   */
  remove(key: string): void {
    zustandAdapterStore.getState().removeItem(key);
  }

  /**
   * Clears all entries from the Zustand store.
   */
  clear(): void {
    zustandAdapterStore.getState().clearItems();
  }

  /**
   * Returns true if the key exists in the Zustand store.
   */
  has(key: string): boolean {
    return zustandAdapterStore.getState().items[key] !== undefined;
  }
}
