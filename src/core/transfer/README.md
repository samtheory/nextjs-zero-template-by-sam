# Transfer Service

Upload with progress tracking and download to file.

## Upload

```ts
import { upload } from '@/core/transfer';

// Single file with progress
const result = await upload.file(file, '/api/upload', {
  onProgress: (percent, loaded, total) => setProgress(percent),
  fieldName: 'avatar',
  extraFields: { userId: '42' },
});

// Multiple files
await upload.files([file1, file2], '/api/upload');
```

## Download

```ts
import { download } from '@/core/transfer';

download.fromUrl('/exports/data.csv', 'data.csv');      // URL
download.fromBlob(blob, 'image.png');                   // Blob
download.fromData({ items }, 'export.json');            // JSON serialized
download.fromData('csv,content', 'data.csv', 'text/csv');
```

## Progress Tracker (low-level)

```ts
import { progressTracker } from '@/core/transfer';

// Attach to XHR manually
progressTracker.attachUpload(xhr, (percent) => console.log(percent));

// Track a streaming fetch response
const blob = await progressTracker.fromResponse(response, (percent) => setProgress(percent));
```
