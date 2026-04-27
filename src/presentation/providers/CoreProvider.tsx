'use client';

import { bootstrapCore } from '@/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import type { TokenService } from '@/core';

// ─── Token Context ────────────────────────────────────────────────────────────

const CoreContext = createContext<TokenService | null>(null);

export function useTokenService(): TokenService {
  const ctx = useContext(CoreContext);
  if (!ctx) throw new Error('useTokenService must be used inside <CoreProvider>');
  return ctx;
}

// ─── Query Client (singleton) ─────────────────────────────────────────────────

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error: unknown) => {
          // Never retry on 4xx
          if (
            typeof error === 'object' &&
            error !== null &&
            'status' in error &&
            typeof (error as { status: number }).status === 'number' &&
            (error as { status: number }).status >= 400 &&
            (error as { status: number }).status < 500
          ) {
            return false;
          }
          return failureCount < 1;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // SSR: always create new client
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

// ─── Core Provider ────────────────────────────────────────────────────────────

export function CoreProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const tokenServiceRef = useRef<TokenService | null>(null);
  const queryClient = getQueryClient();

  if (tokenServiceRef.current === null) {
    tokenServiceRef.current = bootstrapCore(() => {
      router.push('/login');
    });
  }

  return (
    <CoreContext.Provider value={tokenServiceRef.current}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </CoreContext.Provider>
  );
}
