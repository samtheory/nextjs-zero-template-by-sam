import type { IAppConfig } from './app-config.types';
import { getBoolEnv, getEnv } from './env-validator';

/**
 * Frozen, application-wide configuration object.
 *
 * Values are read from environment variables at module-load time.
 * Safe to import in both server and client code (`NEXT_PUBLIC_*` variables
 * are inlined by the Next.js compiler at build time).
 *
 * @example
 * ```ts
 * import { AppConfig } from '@/core/services/config';
 *
 * console.log(AppConfig.apiBaseUrl);  // e.g. '/api/proxy'
 * console.log(AppConfig.isDevelopment); // true | false
 * ```
 */
export const AppConfig: IAppConfig = Object.freeze({
  apiBaseUrl: getEnv('NEXT_PUBLIC_API_BASE_URL', '/api/proxy'),
  refreshEndpoint: getEnv('NEXT_PUBLIC_REFRESH_ENDPOINT', '/auth/refresh'),
  enableLogging: getBoolEnv('NEXT_PUBLIC_ENABLE_LOGGING', true),
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  featureFlags: Object.freeze<Record<string, boolean>>({}),
}) satisfies IAppConfig;
