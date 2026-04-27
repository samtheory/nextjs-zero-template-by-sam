export type ProgressCallback = (percent: number, loaded: number, total: number) => void;

/**
 * Attaches progress tracking to XHR uploads or streaming fetch responses.
 */
export class ProgressTracker {
  /** Attach upload progress to an XHR instance before sending. */
  attachUpload(xhr: XMLHttpRequest, onProgress: ProgressCallback): void {
    xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100), e.loaded, e.total);
      }
    });
  }

  /**
   * Track download progress from a fetch Response via streaming.
   * Falls back to `response.blob()` when ReadableStream is unavailable.
   */
  fromResponse(response: Response, onProgress: ProgressCallback): Promise<Blob> {
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    const reader = response.body?.getReader();
    if (!reader) return response.blob();

    let loaded = 0;
    const chunks: Uint8Array[] = [];

    return new Promise<Blob>((resolve, reject) => {
      const read = (): void => {
        reader.read().then(({ done, value }) => {
          if (done) { resolve(new Blob(chunks)); return; }
          if (value) {
            chunks.push(value);
            loaded += value.length;
            if (total > 0) onProgress(Math.round((loaded / total) * 100), loaded, total);
          }
          read();
        }).catch(reject);
      };
      read();
    });
  }
}

export const progressTracker = new ProgressTracker();
