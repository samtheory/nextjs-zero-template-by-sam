export interface LazyLoadOptions extends IntersectionObserverInit {
  /** Disconnect after first intersection. Default: true */
  once?: boolean;
}

/**
 * Lazy-load helper backed by IntersectionObserver.
 * Returns a cleanup function that disconnects the observer.
 *
 * @example
 * ```ts
 * const cleanup = lazyLoad.observe(imgEl, () => { img.src = img.dataset.src; });
 * // later:
 * cleanup();
 * ```
 */
export class LazyLoadService {
  observe(
    element: Element,
    callback: (entry: IntersectionObserverEntry) => void,
    options: LazyLoadOptions = {},
  ): () => void {
    const { once = true, ...observerOptions } = options;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          callback(entry);
          if (once) observer.unobserve(element);
        }
      }
    }, observerOptions);

    observer.observe(element);
    return () => observer.disconnect();
  }
}

export const lazyLoad = new LazyLoadService();
