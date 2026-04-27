// ⚠️ ServerCookieService is intentionally NOT exported here.
// It uses `next/headers` which is server-only and would break client bundles.
// Import it directly: import { ServerCookieService } from '@/core/services/cookie/server-cookie.service'
export { ClientCookieService } from './client-cookie.service';
export type { CookieOptions } from './cookie.types';
