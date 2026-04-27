/**
 * Identifies the backing store strategy for StorageFactory.
 *
 * - `localStorage`  — browser-only, survives page refresh (SSR-safe no-op on server)
 * - `cookie`        — browser document.cookie; no httpOnly support (SSR-safe no-op on server)
 * - `memory`        — in-process Map; resets on page reload; SSR-safe
 * - `zustand`       — Zustand store with persist; async hydration on first render
 */
export type StorageType = 'localStorage' | 'cookie' | 'memory' | 'zustand';
