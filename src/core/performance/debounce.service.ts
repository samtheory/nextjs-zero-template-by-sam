/**
 * Key-based debounce — call fn at most once per `delay` ms after the last invocation.
 * Pass a `key` to cancel/reuse a specific timer by name.
 *
 * @example
 * ```ts
 * const search = debounceService.debounce(fetchResults, 300, 'search');
 * input.addEventListener('input', (e) => search(e.target.value));
 * ```
 */
export class DebounceService {
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  private counter = 0;

  debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    delay: number,
    key?: string,
  ): (...args: Parameters<T>) => void {
    const timerKey = key ?? `debounce-${this.counter++}`;

    return (...args: Parameters<T>): void => {
      const existing = this.timers.get(timerKey);
      if (existing !== undefined) clearTimeout(existing);

      const id = setTimeout(() => {
        this.timers.delete(timerKey);
        fn(...args);
      }, delay);

      this.timers.set(timerKey, id);
    };
  }

  cancel(key: string): void {
    const id = this.timers.get(key);
    if (id !== undefined) {
      clearTimeout(id);
      this.timers.delete(key);
    }
  }

  cancelAll(): void {
    for (const id of this.timers.values()) clearTimeout(id);
    this.timers.clear();
  }
}

export const debounceService = new DebounceService();
