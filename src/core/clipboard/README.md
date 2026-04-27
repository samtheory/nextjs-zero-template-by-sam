# Clipboard Service

Copy and paste with Clipboard API + textarea fallback.

```ts
import { clipboard } from '@/core/clipboard';

// Copy to clipboard
await clipboard.copy('Hello world');

// Read from clipboard (requires user permission)
const text = await clipboard.paste();

// Check support
if (clipboard.isSupported()) { ... }
```

> **Note:** `paste()` requires the `clipboard-read` permission. Browsers may prompt the user.
