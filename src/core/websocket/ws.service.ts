import { ReconnectController, type ReconnectOptions } from './reconnect.strategy';

export type WsStatus = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'closed';
type WsEventHandler<T = unknown> = (data: T) => void;

export interface WsOptions {
  /** Pass `false` to disable auto-reconnect. Default: exponential strategy. */
  reconnect?: ReconnectOptions | false;
  protocols?: string | string[];
  onStatusChange?: (status: WsStatus) => void;
}

/**
 * WebSocket service with auto-reconnect and typed event listeners.
 *
 * @example
 * ```ts
 * ws.connect('wss://api.example.com/ws');
 *
 * const off = ws.on('message', (data) => console.log(data));
 * ws.send({ type: 'ping' });
 *
 * ws.disconnect();
 * off();
 * ```
 */
export class WsService {
  private socket: WebSocket | null = null;
  private readonly listeners = new Map<string, Set<WsEventHandler>>();
  private status: WsStatus = 'idle';
  private attempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private url = '';
  private options: WsOptions = {};
  private reconnect: ReconnectController | null = null;
  private destroyed = false;

  connect(url: string, options: WsOptions = {}): void {
    this.url = url;
    this.options = options;
    this.destroyed = false;
    this.attempt = 0;

    if (options.reconnect !== false) {
      this.reconnect = new ReconnectController(
        typeof options.reconnect === 'object' ? options.reconnect : {},
      );
    }

    this.open();
  }

  disconnect(): void {
    this.destroyed = true;
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close(1000, 'Intentional disconnect');
    this.setStatus('closed');
  }

  send(data: unknown): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.warn('[WsService] Cannot send — socket is not open');
      return;
    }
    this.socket.send(typeof data === 'string' ? data : JSON.stringify(data));
  }

  /** Subscribe to a named event. Returns an unsubscribe function. */
  on<T = unknown>(event: string, handler: WsEventHandler<T>): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler as WsEventHandler);
    return () => this.listeners.get(event)?.delete(handler as WsEventHandler);
  }

  getStatus(): WsStatus {
    return this.status;
  }

  private open(): void {
    this.setStatus(this.attempt === 0 ? 'connecting' : 'reconnecting');

    const socket = new WebSocket(this.url, this.options.protocols);
    this.socket = socket;

    socket.onopen = () => {
      this.attempt = 0;
      this.setStatus('connected');
      this.emit('open', undefined);
    };

    socket.onmessage = (e: MessageEvent) => {
      let parsed: unknown;
      try { parsed = JSON.parse(e.data as string); } catch { parsed = e.data; }
      this.emit('message', parsed);
    };

    socket.onerror = (e) => {
      this.emit('error', e);
    };

    socket.onclose = (e: CloseEvent) => {
      this.emit('close', e);
      if (this.destroyed || e.code === 1000) {
        this.setStatus('closed');
        return;
      }
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (!this.reconnect || !this.reconnect.shouldRetry(this.attempt)) {
      this.setStatus('closed');
      return;
    }
    const delay = this.reconnect.getDelay(this.attempt);
    this.attempt++;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.open();
    }, delay);
  }

  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach((h) => h(data));
  }

  private setStatus(status: WsStatus): void {
    this.status = status;
    this.options.onStatusChange?.(status);
    this.emit('status', status);
  }
}

export const ws = new WsService();
