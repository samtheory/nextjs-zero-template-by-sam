# Keyboard Shortcuts Service

Register global keyboard shortcuts with automatic modifier normalisation.
Ctrl and Cmd (Meta) are treated as the same key.

## Usage

```ts
import { shortcuts } from '@/core/shortcuts';

// Register — returns an unsubscribe function
const off = shortcuts.register('ctrl+k', (e) => {
  openSearch();
});

// Unregister just this handler
off();

// Remove all handlers for a combo
shortcuts.unregister('ctrl+k');

// Remove everything (e.g. on app teardown)
shortcuts.dispose();
```

## In a React component

```ts
useEffect(() => {
  const off = shortcuts.register('ctrl+s', () => save());
  return off; // cleanup on unmount
}, []);
```

## Options

```ts
shortcuts.register('escape', closeModal, {
  preventDefault: true,    // default true
  stopPropagation: false,  // default false
  repeat: false,           // fire on key-hold? default false
});
```

## Combo syntax

Use `+` to join modifiers and the key: `ctrl+k`, `ctrl+shift+p`, `alt+arrowup`.
Order doesn't matter — `shift+ctrl+k` and `ctrl+k+shift` are the same.
