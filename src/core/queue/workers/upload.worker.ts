import type { Job } from '../queue.types';
import { queue } from '../queue.service';

export interface UploadJobData {
  file: File;
  endpoint: string;
  onProgress?: (percent: number) => void;
}

/**
 * Register the file-upload worker once at app bootstrap.
 *
 * @example
 * ```ts
 * registerUploadWorker();
 * queue.add('file-upload', { file, endpoint: '/api/upload', onProgress: console.log });
 * ```
 */
export function registerUploadWorker(): void {
  queue.process<UploadJobData>('file-upload', async (job: Job<UploadJobData>) => {
    const formData = new FormData();
    formData.append('file', job.data.file);

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', job.data.endpoint);

      xhr.upload.onprogress = (e: ProgressEvent) => {
        if (e.lengthComputable) {
          job.data.onProgress?.(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300
          ? resolve()
          : reject(new Error(`HTTP ${xhr.status}`));

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(formData);
    });
  });
}
