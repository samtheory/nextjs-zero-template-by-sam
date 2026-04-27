/**
 * Cryptographic hashing using the Web Crypto API.
 * `hashPassword` uses PBKDF2 (100,000 iterations) — safe for password storage.
 *
 * @example
 * ```ts
 * const digest = await hashService.sha256('hello');
 * const { hash, salt } = await hashService.hashPassword('mypassword');
 * const valid = await hashService.verifyPassword('mypassword', hash, salt);
 * ```
 */
export class HashService {
  private async digest(algorithm: AlgorithmIdentifier, data: string): Promise<string> {
    const encoded = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest(algorithm, encoded);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async sha256(data: string): Promise<string> {
    return this.digest('SHA-256', data);
  }

  async sha512(data: string): Promise<string> {
    return this.digest('SHA-512', data);
  }

  /**
   * Derive a secure hash from a password using PBKDF2 + SHA-256 (100k iterations).
   * Pass `salt` to verify an existing hash; omit it to generate a new one.
   */
  async hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const saltBytes = salt
      ? Uint8Array.from(atob(salt), (c) => c.charCodeAt(0))
      : crypto.getRandomValues(new Uint8Array(16));

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits'],
    );

    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: saltBytes, iterations: 100_000, hash: 'SHA-256' },
      keyMaterial,
      256,
    );

    return {
      hash: btoa(String.fromCharCode(...new Uint8Array(bits))),
      salt: btoa(String.fromCharCode(...saltBytes)),
    };
  }

  async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const { hash: derived } = await this.hashPassword(password, salt);
    return derived === hash;
  }
}

export const hashService = new HashService();
