export type ReconnectStrategy = 'exponential' | 'linear' | 'none';

export interface ReconnectOptions {
  /** Default: 'exponential' */
  strategy?: ReconnectStrategy;
  /** Base delay in ms. Default: 1000 */
  baseDelay?: number;
  /** Cap delay in ms. Default: 30_000 */
  maxDelay?: number;
  /** Max reconnect attempts. Use -1 for unlimited. Default: 10 */
  maxAttempts?: number;
}

export class ReconnectController {
  private readonly strategy: ReconnectStrategy;
  private readonly baseDelay: number;
  private readonly maxDelay: number;
  readonly maxAttempts: number;

  constructor(options: ReconnectOptions = {}) {
    this.strategy = options.strategy ?? 'exponential';
    this.baseDelay = options.baseDelay ?? 1_000;
    this.maxDelay = options.maxDelay ?? 30_000;
    this.maxAttempts = options.maxAttempts ?? 10;
  }

  getDelay(attempt: number): number {
    if (this.strategy === 'none') return 0;

    if (this.strategy === 'linear') {
      return Math.min(this.baseDelay * (attempt + 1), this.maxDelay);
    }

    // Exponential backoff with ±30 % jitter to spread reconnect storms
    const base = Math.min(this.baseDelay * Math.pow(2, attempt), this.maxDelay);
    const jitter = base * 0.3 * Math.random();
    return Math.floor(base + jitter);
  }

  shouldRetry(attempt: number): boolean {
    return this.maxAttempts < 0 || attempt < this.maxAttempts;
  }
}
