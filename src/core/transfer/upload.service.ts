import { progressTracker, type ProgressCallback } from './progress.tracker';

export interface UploadOptions {
  onProgress?: ProgressCallback;
  headers?: Record<string, string>;
  /** Form field name for the file. Default: 'file' */
  fieldName?: string;
  /** Extra form fields to include alongside the file. */
  extraFields?: Record<string, string>;
}

/**
 * Upload service with real-time progress tracking via XHR.
 *
 * @example
 * ```ts
 * await upload.file(file, '/api/upload', {
 *   onProgress: (percent) => setProgress(percent),
 * });
 * ```
 */
export class UploadService {
  async file<T = unknown>(file: File, url: string, options: UploadOptions = {}): Promise<T> {
    const { onProgress, headers = {}, fieldName = 'file', extraFields = {} } = options;
    const formData = new FormData();
    formData.append(fieldName, file);

    for (const [k, v] of Object.entries(extraFields)) {
      formData.append(k, v);
    }

    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      for (const [k, v] of Object.entries(headers)) {
        xhr.setRequestHeader(k, v);
      }

      if (onProgress) progressTracker.attachUpload(xhr, onProgress);

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try { resolve(JSON.parse(xhr.responseText) as T); }
          catch { resolve(xhr.responseText as unknown as T); }
        } else {
          reject(new Error(`Upload failed: HTTP ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Upload network error'));
      xhr.send(formData);
    });
  }

  /** Upload multiple files sequentially with individual progress callbacks. */
  async files<T = unknown>(files: File[], url: string, options: UploadOptions = {}): Promise<T[]> {
    return Promise.all(files.map((f) => this.file<T>(f, url, options)));
  }
}

export const upload = new UploadService();
