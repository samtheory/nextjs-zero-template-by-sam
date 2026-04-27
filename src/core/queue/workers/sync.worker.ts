import type { Job } from '../queue.types';
import { queue } from '../queue.service';

export interface SyncJobData {
  userId: string;
  entity?: string;
}

/**
 * Register the sync-courses worker once at app bootstrap.
 *
 * @example
 * ```ts
 * registerSyncWorker();
 * queue.add('sync-courses', { userId: '42' });
 * ```
 */
export function registerSyncWorker(): void {
  queue.process<SyncJobData>('sync-courses', async (job: Job<SyncJobData>) => {
    // Replace with real sync logic (fetch from API + write to local cache)
    await Promise.resolve();
    console.info('[sync-worker] synced courses for', job.data.userId);
  });
}
