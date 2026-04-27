/**
 * Download service — trigger browser file downloads from URLs, Blobs, or raw data.
 *
 * @example
 * ```ts
 * download.fromUrl('/exports/report.pdf', 'report.pdf');
 * download.fromData({ items }, 'export.json');
 * ```
 */
export class DownloadService {
  /** Trigger download from a URL (works for same-origin or with CORS headers). */
  fromUrl(url: string, filename?: string): void {
    const a = document.createElement('a');
    a.href = url;
    if (filename) a.download = filename;
    a.rel = 'noopener noreferrer';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /** Trigger download from a Blob. Object URL is revoked after 10 s. */
  fromBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    this.fromUrl(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  /** Trigger download from arbitrary data. Strings are used as-is; objects are JSON-stringified. */
  fromData(data: unknown, filename: string, mimeType = 'application/json'): void {
    const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: mimeType });
    this.fromBlob(blob, filename);
  }
}

export const download = new DownloadService();
