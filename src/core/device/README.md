# Device & Browser Detection

SSR-safe helpers for device type, connectivity, viewport, and browser detection.

## Device

```ts
import { device } from '@/core/device';

device.isMobile()            // phone UA
device.isTablet()            // tablet UA
device.isDesktop()           // not mobile and not tablet
device.isOnline()            // navigator.onLine
device.hasTouchScreen()      // ontouchstart or maxTouchPoints > 0
device.getViewport()         // { width, height }
device.prefersDark()         // prefers-color-scheme: dark
device.prefersReducedMotion()

// Subscribe to connectivity changes
const off = device.onConnectivityChange((online) => {
  toast(online ? 'Back online' : 'You are offline');
});
// call off() to unsubscribe
```

## Browser

```ts
import { browser } from '@/core/device';

browser.isChrome()
browser.isFirefox()
browser.isSafari()
browser.isEdge()
browser.getName()            // 'Chrome' | 'Firefox' | ...
browser.supportsWebP()
browser.supportsServiceWorker()
browser.supportsWebSocket()
```
