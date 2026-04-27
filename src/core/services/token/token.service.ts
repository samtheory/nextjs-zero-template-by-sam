import type { IStorage } from '../storage/storage.interface';
import { TOKEN_KEYS } from './token.types';

/**
 * Manages persistence of access and refresh tokens through an injectable
 * IStorage implementation.
 *
 * Token strategy (localStorage, cookie, memory) is determined at construction
 * time via the storage argument, keeping this service storage-agnostic.
 *
 * @example
 * ```ts
 * const storage = StorageFactory.create('localStorage');
 * const tokenService = new TokenService(storage);
 *
 * tokenService.setAccessToken('eyJhbGci...');
 * const token = tokenService.getAccessToken(); // 'eyJhbGci...'
 * ```
 */
export class TokenService {
  constructor(private readonly storage: IStorage) {}

  /**
   * Returns the current access token, or null if not set.
   */
  getAccessToken(): string | null {
    return this.storage.get<string>(TOKEN_KEYS.ACCESS);
  }

  /**
   * Persists the access token.
   */
  setAccessToken(token: string): void {
    this.storage.set<string>(TOKEN_KEYS.ACCESS, token);
  }

  /**
   * Returns the current refresh token, or null if not set.
   */
  getRefreshToken(): string | null {
    return this.storage.get<string>(TOKEN_KEYS.REFRESH);
  }

  /**
   * Persists the refresh token.
   */
  setRefreshToken(token: string): void {
    this.storage.set<string>(TOKEN_KEYS.REFRESH, token);
  }

  /**
   * Removes both the access token and the refresh token from storage.
   * Call this on logout or when the authentication session expires.
   */
  clearTokens(): void {
    this.storage.remove(TOKEN_KEYS.ACCESS);
    this.storage.remove(TOKEN_KEYS.REFRESH);
  }

  /**
   * Returns true if an access token is currently stored.
   * Does NOT validate the token signature or expiry.
   */
  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }
}
