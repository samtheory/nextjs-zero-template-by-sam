# Performance Utilities

Debounce, throttle, and lazy-load helpers for UI performance.

## Debounce

```ts
import { debounceService } from '@/core/performance';

// Create a debounced function (fires 300 ms after last call)
const search = debounceService.debounce(fetchResults, 300, 'search');
input.addEventListener('input', (e) => search(e.target.value));

// Cancel a specific timer
debounceService.cancel('search');
```

## Throttle

```ts
import { throttleService } from '@/core/performance';

// Execute at most once per 100 ms; trailing call always fires
const onScroll = throttleService.throttle(updateHeader, 100);
window.addEventListener('scroll', onScroll);
```

## Lazy Load (IntersectionObserver)

```ts
import { lazyLoad } from '@/core/performance';

const cleanup = lazyLoad.observe(imgEl, () => {
  imgEl.src = imgEl.dataset.src!;
}, { rootMargin: '200px', once: true });

// cleanup() when component unmounts
```
