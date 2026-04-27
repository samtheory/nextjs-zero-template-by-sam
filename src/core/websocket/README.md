# WebSocket Service

Typed WebSocket client with exponential-backoff auto-reconnect.

## Usage

```ts
import { ws } from '@/core/websocket';

ws.connect('wss://api.example.com/ws', {
  reconnect: { strategy: 'exponential', maxAttempts: 10 },
  onStatusChange: (status) => console.log('WS:', status),
});

// Listen to events
const offMsg = ws.on('message', (data) => console.log(data));
const offOpen = ws.on('open', () => console.log('Connected'));
const offClose = ws.on('close', (e) => console.log('Closed', e));

// Send data (objects are JSON-serialised)
ws.send({ type: 'subscribe', channel: 'notifications' });

// Clean up
ws.disconnect();
offMsg();
```

## Reconnect Strategies

| Strategy | Behaviour |
|----------|-----------|
| `exponential` | `baseDelay * 2^attempt` + ±30 % jitter (default) |
| `linear` | `baseDelay * attempt` |
| `none` | No auto-reconnect |

```ts
ws.connect(url, { reconnect: false });                        // disable
ws.connect(url, { reconnect: { strategy: 'linear', baseDelay: 2000 } });
```

## Status values

`'idle'` → `'connecting'` → `'connected'` → `'reconnecting'` → `'closed'`
