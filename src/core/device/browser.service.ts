/**
 * Browser detection based on user-agent string.
 * All methods are SSR-safe (return false on server).
 *
 * @example
 * ```ts
 * browser.isChrome()    // true in Google Chrome
 * browser.getName()     // 'Firefox'
 * browser.supportsWebp()
 * ```
 */
export class BrowserService {
  private get ua(): string {
    return typeof navigator !== 'undefined' ? navigator.userAgent : '';
  }

  isChrome(): boolean {
    return /Chrome\//.test(this.ua) && !/Chromium\/|Edg\/|OPR\//.test(this.ua);
  }

  isFirefox(): boolean {
    return /Firefox\//.test(this.ua);
  }

  isSafari(): boolean {
    return /Safari\//.test(this.ua) && !/Chrome\//.test(this.ua);
  }

  isEdge(): boolean {
    return /Edg\//.test(this.ua);
  }

  isOpera(): boolean {
    return /OPR\//.test(this.ua);
  }

  getName(): string {
    if (this.isChrome()) return 'Chrome';
    if (this.isFirefox()) return 'Firefox';
    if (this.isSafari()) return 'Safari';
    if (this.isEdge()) return 'Edge';
    if (this.isOpera()) return 'Opera';
    return 'Unknown';
  }

  supportsWebP(): boolean {
    if (typeof document === 'undefined') return false;
    const canvas = document.createElement('canvas');
    if (canvas.getContext('2d') === null) return false;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  }

  supportsServiceWorker(): boolean {
    return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
  }

  supportsWebSocket(): boolean {
    return typeof WebSocket !== 'undefined';
  }
}

export const browser = new BrowserService();
