/**
 * Device detection — SSR-safe checks for mobile, tablet, touch, connectivity,
 * viewport, and user preferences.
 *
 * @example
 * ```ts
 * device.isMobile()          // true on phones
 * device.isOnline()          // false when offline
 * device.prefersDark()       // respects prefers-color-scheme
 * device.prefersReducedMotion()
 * ```
 */
export class DeviceService {
  private get ua(): string {
    return typeof navigator !== 'undefined' ? navigator.userAgent : '';
  }

  isMobile(): boolean {
    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.ua);
  }

  isTablet(): boolean {
    return /iPad|Android(?!.*Mobile)/i.test(this.ua);
  }

  isDesktop(): boolean {
    return !this.isMobile() && !this.isTablet();
  }

  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  /** Subscribe to online/offline changes. Returns an unsubscribe function. */
  onConnectivityChange(callback: (online: boolean) => void): () => void {
    if (typeof window === 'undefined') return () => undefined;
    const onOnline = () => callback(true);
    const onOffline = () => callback(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }

  hasTouchScreen(): boolean {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  getViewport(): { width: number; height: number } {
    if (typeof window === 'undefined') return { width: 0, height: 0 };
    return { width: window.innerWidth, height: window.innerHeight };
  }

  prefersDark(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}

export const device = new DeviceService();
