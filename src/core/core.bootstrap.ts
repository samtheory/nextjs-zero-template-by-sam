'use client'; // IMPORTANT: Must be client-only. Never import this in server components.

import { StorageFactory } from './services/storage/storage.factory';
import { TokenService } from './services/token/token.service';
import { configureHttpClient } from './network-client/middleware/ApiRequest';
import { AppConfig } from './services/config/app-config';

/**
 * Bootstraps the Core Layer for the current client session.
 *
 * Call this **once**, early in the client render lifecycle — typically inside a
 * root `'use client'` Provider or layout component — before any authenticated
 * HTTP request is made.
 *
 * Responsibilities:
 * 1. Creates a `TokenService` backed by `localStorage`.
 * 2. Wires the `TokenService` into the shared Axios instance via
 *    `configureHttpClient`, enabling automatic token injection and silent refresh.
 *
 * @param onAuthFailure - Optional callback invoked when authentication fully
 *   fails (no refresh token, or the refresh request itself failed).
 *   Typically used to redirect the user to the login page.
 *   Passed from the app layer to keep the core layer dependency-free of routing.
 *
 * @returns The `TokenService` instance, which can be stored in a React context
 *   so feature code can call `tokenService.isAuthenticated()` etc.
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { bootstrapCore } from '@/core';
 * import { useRouter } from 'next/navigation';
 * import { useEffect, useRef } from 'react';
 *
 * export function CoreProvider({ children }: { children: React.ReactNode }) {
 *   const router = useRouter();
 *   const bootstrapped = useRef(false);
 *
 *   if (!bootstrapped.current) {
 *     bootstrapped.current = true;
 *     bootstrapCore(() => router.push('/login'));
 *   }
 *
 *   return <>{children}</>;
 * }
 * ```
 */
export function bootstrapCore(onAuthFailure?: () => void): TokenService {
  const storage = StorageFactory.create('localStorage');
  const tokenService = new TokenService(storage);

  configureHttpClient({
    getAccessToken: () => tokenService.getAccessToken(),
    getRefreshToken: () => tokenService.getRefreshToken(),
    setAccessToken: (token) => tokenService.setAccessToken(token),
    setRefreshToken: (token) => tokenService.setRefreshToken(token),
    removeAuthTokens: () => tokenService.clearTokens(),
    refreshEndpoint: AppConfig.refreshEndpoint,
    onAuthFailure,
  });

  return tokenService;
}
