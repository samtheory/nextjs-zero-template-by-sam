/**
 * Clipboard service — copy/paste with browser-API fallback.
 *
 * @example
 * ```ts
 * await clipboard.copy('Hello world');
 * const text = await clipboard.paste();
 * ```
 */
export class ClipboardService {
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'clipboard' in navigator;
  }

  async copy(text: string): Promise<void> {
    if (this.isSupported()) {
      await navigator.clipboard.writeText(text);
      return;
    }

    // Fallback for older browsers / non-HTTPS
    const el = document.createElement('textarea');
    el.value = text;
    el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  async paste(): Promise<string> {
    if (this.isSupported()) {
      return navigator.clipboard.readText();
    }
    throw new Error('Clipboard paste API is not available in this browser.');
  }
}

export const clipboard = new ClipboardService();
