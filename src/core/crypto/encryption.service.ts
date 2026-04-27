/**
 * AES-GCM symmetric encryption using the Web Crypto API.
 * Works in browser and Node.js 16+.
 *
 * @example
 * ```ts
 * const key = await encryption.generateKey();
 * const ciphertext = await encryption.encrypt('secret', key);
 * const plaintext  = await encryption.decrypt(ciphertext, key);
 * ```
 */
export class EncryptionService {
  private readonly algorithm = 'AES-GCM' as const;

  async generateKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      { name: this.algorithm, length: 256 },
      true,
      ['encrypt', 'decrypt'],
    );
  }

  /** Export key to base64 string for storage. */
  async exportKey(key: CryptoKey): Promise<string> {
    const raw = await crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(raw)));
  }

  /** Import a base64 key string exported by `exportKey`. */
  async importKey(base64: string): Promise<CryptoKey> {
    const raw = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return crypto.subtle.importKey(
      'raw',
      raw,
      { name: this.algorithm },
      true,
      ['encrypt', 'decrypt'],
    );
  }

  /**
   * Encrypt plaintext. Returns a base64 string containing the random IV
   * prepended to the ciphertext (IV is needed for decryption).
   */
  async encrypt(plaintext: string, key: CryptoKey): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);
    const cipherBuffer = await crypto.subtle.encrypt({ name: this.algorithm, iv }, key, encoded);

    const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(cipherBuffer), iv.length);
    return btoa(String.fromCharCode(...combined));
  }

  /** Decrypt a ciphertext string produced by `encrypt`. */
  async decrypt(ciphertext: string, key: CryptoKey): Promise<string> {
    const combined = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const plainBuffer = await crypto.subtle.decrypt({ name: this.algorithm, iv }, key, data);
    return new TextDecoder().decode(plainBuffer);
  }
}

export const encryption = new EncryptionService();
