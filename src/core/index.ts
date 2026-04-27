// ─────────────────────────────────────────────────────────────────────────────
// Network client
// ─────────────────────────────────────────────────────────────────────────────
export * from './network-client';

// ─────────────────────────────────────────────────────────────────────────────
// Core Services
// ─────────────────────────────────────────────────────────────────────────────
export * from './services';

// Both `network-client` and `services/error-mapper` export `isServerError`.
// Explicitly re-export the domain version so it wins at the barrel level.
// For the HTTP-status-based guard use: import { isServerError } from '@/core/network-client'
export { isServerError } from './services/error-mapper';

// ─────────────────────────────────────────────────────────────────────────────
// Bootstrap
// ─────────────────────────────────────────────────────────────────────────────
export { bootstrapCore } from './core.bootstrap';
