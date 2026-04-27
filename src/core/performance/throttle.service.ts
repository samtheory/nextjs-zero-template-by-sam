/**
 * Throttle — execute fn at most once per `limit` ms.
 * Trailing calls are preserved: the last call within a window always fires.
 *
 * @example
 * ```ts
 * const onScroll = throttleService.throttle(updateHeader, 100);
 * window.addEventListener('scroll', onScroll);
 * ```
 */
export class ThrottleService {
  throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    limit: number,
  ): (...args: Parameters<T>) => void {
    let lastRun = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    return (...args: Parameters<T>): void => {
      const now = Date.now();
      const remaining = limit - (now - lastRun);

      if (remaining <= 0) {
        if (timer !== undefined) {
          clearTimeout(timer);
          timer = undefined;
        }
        lastRun = now;
        fn(...args);
      } else {
        if (timer !== undefined) clearTimeout(timer);
        timer = setTimeout(() => {
          lastRun = Date.now();
          timer = undefined;
          fn(...args);
        }, remaining);
      }
    };
  }
}

export const throttleService = new ThrottleService();
