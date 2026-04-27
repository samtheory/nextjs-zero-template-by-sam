/**
 * Well-known keys used to persist auth tokens in storage.
 * Use these constants instead of raw strings to avoid typos.
 */
export const TOKEN_KEYS = {
  /** Key for the short-lived access token. */
  ACCESS: 'auth_access_token',
  /** Key for the long-lived refresh token. */
  REFRESH: 'auth_refresh_token',
} as const;
