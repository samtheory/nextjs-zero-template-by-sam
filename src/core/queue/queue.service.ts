import type { Job, JobHandler, QueueOptions } from './queue.types';

/**
 * In-browser background task queue with concurrency control and auto-retry.
 *
 * @example
 * ```ts
 * queue.process('sync-courses', async (job) => { ... });
 * queue.add('sync-courses', { userId: '42' });
 * ```
 */
export class QueueService {
  private readonly handlers = new Map<string, JobHandler>();
  private readonly jobs = new Map<string, Job>();
  private running = 0;
  private readonly maxRetries: number;
  private readonly concurrency: number;

  constructor(options: QueueOptions = {}) {
    this.maxRetries = options.maxRetries ?? 3;
    this.concurrency = options.concurrency ?? 1;
  }

  /** Enqueue a job. Returns the job ID. */
  add<T = unknown>(name: string, data: T): string {
    const id = `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const job: Job<T> = { id, name, data, status: 'pending', attempts: 0, createdAt: Date.now() };
    this.jobs.set(id, job as Job);
    void this.flush();
    return id;
  }

  /** Register a handler for jobs with the given name. */
  process<T = unknown>(name: string, handler: JobHandler<T>): void {
    this.handlers.set(name, handler as JobHandler);
  }

  getJob(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  getJobs(name?: string): Job[] {
    const all = Array.from(this.jobs.values());
    return name ? all.filter((j) => j.name === name) : all;
  }

  /** Remove all non-running jobs, optionally filtered by name. */
  clear(name?: string): void {
    if (!name) {
      for (const [id, job] of this.jobs) {
        if (job.status !== 'running') this.jobs.delete(id);
      }
      return;
    }
    for (const [id, job] of this.jobs) {
      if (job.name === name && job.status !== 'running') this.jobs.delete(id);
    }
  }

  private async flush(): Promise<void> {
    if (this.running >= this.concurrency) return;

    const job = Array.from(this.jobs.values()).find((j) => j.status === 'pending');
    if (!job) return;

    const handler = this.handlers.get(job.name);
    if (!handler) {
      job.status = 'failed';
      job.error = `No handler registered for "${job.name}"`;
      return;
    }

    job.status = 'running';
    job.attempts += 1;
    this.running++;

    try {
      await handler(job);
      job.status = 'done';
    } catch (err) {
      job.error = err instanceof Error ? err.message : String(err);
      job.status = job.attempts < this.maxRetries ? 'pending' : 'failed';
    } finally {
      this.running--;
      void this.flush();
    }
  }
}

export const queue = new QueueService();
