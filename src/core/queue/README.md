# Queue Service

In-browser background task queue with concurrency, auto-retry, and named workers.

## Usage

```ts
import { queue, registerSyncWorker } from '@/core/queue';

// 1. Register a handler (once, at bootstrap)
registerSyncWorker();

// Or define your own inline:
queue.process('image-processing', async (job) => {
  await processImage(job.data.imageId);
});

// 2. Enqueue jobs anywhere
queue.add('sync-courses', { userId: '42' });
queue.add('image-processing', { imageId: 'img_123' });

// 3. Inspect state
queue.getJob(id);        // single job by ID
queue.getJobs('sync-courses');  // all jobs with that name
queue.clear('sync-courses');    // remove non-running jobs
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `maxRetries` | `3` | Retry count before marking job as `'failed'` |
| `concurrency` | `1` | Max parallel jobs |

## Workers

| Worker | Name | Description |
|--------|------|-------------|
| `sync.worker.ts` | `sync-courses` | Background data sync |
| `upload.worker.ts` | `file-upload` | File upload with progress |

## Good for

- Bulk operations
- File uploads (queue + progress)
- Data sync
- Image processing
