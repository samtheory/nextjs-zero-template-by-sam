export interface ShortcutOptions {
  /** Stop the default browser action (e.g. Ctrl+S saving the page). Default: true */
  preventDefault?: boolean;
  stopPropagation?: boolean;
  /** Fire on key repeat (holding the key). Default: false */
  repeat?: boolean;
}

type ShortcutHandler = (event: KeyboardEvent) => void;

interface ShortcutEntry {
  handler: ShortcutHandler;
  options: ShortcutOptions;
}

/**
 * Global keyboard shortcut manager.
 * Handles modifier normalisation: Ctrl and Meta are treated as the same key.
 *
 * @example
 * ```ts
 * const off = shortcuts.register('ctrl+k', openSearch);
 * // later:
 * off(); // unregister just this handler
 * shortcuts.unregister('ctrl+k'); // remove all handlers for the combo
 * shortcuts.dispose(); // remove everything and detach listener
 * ```
 */
export class ShortcutsService {
  private readonly handlers = new Map<string, ShortcutEntry[]>();
  private mounted = false;
  private readonly listener: (e: KeyboardEvent) => void;

  constructor() {
    this.listener = (e: KeyboardEvent) => this.handleKeyDown(e);
  }

  /** Register a handler. Returns an unregister function. */
  register(shortcut: string, handler: ShortcutHandler, options: ShortcutOptions = {}): () => void {
    const key = this.normalize(shortcut);
    const existing = this.handlers.get(key) ?? [];
    const entry: ShortcutEntry = { handler, options };
    this.handlers.set(key, [...existing, entry]);

    if (!this.mounted) this.mount();

    return () => {
      const current = this.handlers.get(key) ?? [];
      const updated = current.filter((h) => h !== entry);
      if (updated.length === 0) {
        this.handlers.delete(key);
      } else {
        this.handlers.set(key, updated);
      }
      if (this.handlers.size === 0) this.unmount();
    };
  }

  /** Remove all handlers for a shortcut combo. */
  unregister(shortcut: string): void {
    this.handlers.delete(this.normalize(shortcut));
    if (this.handlers.size === 0) this.unmount();
  }

  /** Remove all shortcuts and detach the global event listener. */
  dispose(): void {
    this.handlers.clear();
    this.unmount();
  }

  private normalize(shortcut: string): string {
    return shortcut
      .toLowerCase()
      .replace(/meta/g, 'ctrl') // treat cmd same as ctrl
      .split('+')
      .map((k) => k.trim())
      .sort()
      .join('+');
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const parts: string[] = [];
    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');

    const key = e.key.toLowerCase();
    if (!['control', 'alt', 'shift', 'meta'].includes(key)) parts.push(key);

    const combo = parts.sort().join('+');
    const entries = this.handlers.get(combo);
    if (!entries) return;

    for (const { handler, options } of entries) {
      if (!options.repeat && e.repeat) continue;
      if (options.preventDefault !== false) e.preventDefault();
      if (options.stopPropagation) e.stopPropagation();
      handler(e);
    }
  }

  private mount(): void {
    if (typeof window === 'undefined' || this.mounted) return;
    window.addEventListener('keydown', this.listener);
    this.mounted = true;
  }

  private unmount(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('keydown', this.listener);
    this.mounted = false;
  }
}

export const shortcuts = new ShortcutsService();
