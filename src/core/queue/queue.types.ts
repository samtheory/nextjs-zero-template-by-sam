export type JobStatus = 'pending' | 'running' | 'done' | 'failed';

export interface Job<T = unknown> {
  id: string;
  name: string;
  data: T;
  status: JobStatus;
  attempts: number;
  createdAt: number;
  error?: string;
}

export type JobHandler<T = unknown> = (job: Job<T>) => Promise<void>;

export interface QueueOptions {
  /** How many times to retry a failed job before marking it 'failed'. Default: 3 */
  maxRetries?: number;
  /** Max jobs running in parallel. Default: 1 */
  concurrency?: number;
}
