"use client";

import Link from "next/link";
import { useState, useCallback } from "react";

// ─── Simulated core services (browser-compatible) ─────────────

// LocalStorage Service
const storage = {
  get: <T>(key: string): T | null => {
    try {
      const v = localStorage.getItem(key);
      return v ? (JSON.parse(v) as T) : null;
    } catch {
      return null;
    }
  },
  set: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string): void => localStorage.removeItem(key),
};

// Cookie Service (simplified client-side)
const cookie = {
  get: (name: string): string | null => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  },
  set: (name: string, value: string, maxAgeSeconds = 3600): void => {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Strict`;
  },
  remove: (name: string): void => {
    document.cookie = `${name}=; path=/; max-age=0`;
  },
};

// Logger
const logger = {
  info: (msg: string, data?: unknown) => console.info(`[INFO] ${msg}`, data ?? ""),
  warn: (msg: string, data?: unknown) => console.warn(`[WARN] ${msg}`, data ?? ""),
  error: (msg: string, err?: unknown) => console.error(`[ERROR] ${msg}`, err ?? ""),
};

// ─── Storage Demo ─────────────────────────────────────────────
function StorageDemo() {
  const [key, setKey] = useState("user");
  const [value, setValue] = useState('{"name":"Alice","role":"admin"}');
  const [retrieved, setRetrieved] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const handleSet = () => {
    try {
      storage.set(key, JSON.parse(value));
      setStatus(`✓ Saved "${key}" to localStorage`);
    } catch {
      setStatus("✗ Invalid JSON value");
    }
  };

  const handleGet = () => {
    const result = storage.get(key);
    setRetrieved(result ? JSON.stringify(result, null, 2) : null);
    setStatus(result ? `✓ Found "${key}"` : `✗ Key "${key}" not found`);
  };

  const handleRemove = () => {
    storage.remove(key);
    setRetrieved(null);
    setStatus(`✓ Removed "${key}"`);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1">
          <label className="block text-xs text-muted mb-1">Key</label>
          <input value={key} onChange={(e) => setKey(e.target.value)} className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-muted mb-1">Value (JSON)</label>
          <input value={value} onChange={(e) => setValue(e.target.value)} className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSet} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 transition">set()</button>
        <button onClick={handleGet} className="px-3 py-1.5 rounded-lg bg-secondary-500 text-white text-xs font-semibold hover:bg-secondary-600 transition">get()</button>
        <button onClick={handleRemove} className="px-3 py-1.5 rounded-lg border border-error-300 text-error-600 text-xs font-semibold hover:bg-error-50 transition">remove()</button>
      </div>
      {status && <p className={`text-xs font-mono px-3 py-2 rounded-lg border ${status.startsWith("✓") ? "bg-success-50 border-success-100 text-success-700" : "bg-error-50 border-error-100 text-error-600"}`}>{status}</p>}
      {retrieved && (
        <pre className="text-xs font-mono bg-surface-raised border border-border rounded-xl p-3">{retrieved}</pre>
      )}
    </div>
  );
}

// ─── Cookie Demo ──────────────────────────────────────────────
function CookieDemo() {
  const [name, setName] = useState("session_token");
  const [val, setVal] = useState("eyJhbGciOiJIUzI1NiJ9.demo");
  const [status, setStatus] = useState("");
  const [retrieved, setRetrieved] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-muted mb-1">Cookie name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Value</label>
          <input value={val} onChange={(e) => setVal(e.target.value)} className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => { cookie.set(name, val); setStatus(`✓ Set cookie "${name}"`); }} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 transition">set()</button>
        <button onClick={() => { const r = cookie.get(name); setRetrieved(r); setStatus(r ? `✓ Found "${name}"` : `✗ Not found`); }} className="px-3 py-1.5 rounded-lg bg-secondary-500 text-white text-xs font-semibold hover:bg-secondary-600 transition">get()</button>
        <button onClick={() => { cookie.remove(name); setRetrieved(null); setStatus(`✓ Removed "${name}"`); }} className="px-3 py-1.5 rounded-lg border border-error-300 text-error-600 text-xs font-semibold hover:bg-error-50 transition">remove()</button>
      </div>
      {status && <p className={`text-xs font-mono px-3 py-2 rounded-lg border ${status.startsWith("✓") ? "bg-success-50 border-success-100 text-success-700" : "bg-error-50 border-error-100 text-error-600"}`}>{status}</p>}
      {retrieved && <p className="text-xs font-mono bg-surface-raised border border-border px-3 py-2 rounded-xl break-all">{retrieved}</p>}
      <p className="text-xs text-muted">Cookies are set with <code className="bg-surface-raised px-1 rounded">SameSite=Strict; max-age=3600</code></p>
    </div>
  );
}

// ─── Logger Demo ──────────────────────────────────────────────
function LoggerDemo() {
  const [logs, setLogs] = useState<{ level: string; msg: string; data?: string }[]>([]);

  const addLog = useCallback((level: "info" | "warn" | "error") => {
    const examples = {
      info: { msg: "User authenticated", data: '{"userId":"abc-123"}' },
      warn: { msg: "Token expiring soon", data: '{"expiresIn":300}' },
      error: { msg: "API request failed", data: '{"status":500,"url":"/api/users"}' },
    };
    const entry = examples[level];
    logger[level](entry.msg, JSON.parse(entry.data));
    setLogs((prev) => [...prev, { level, ...entry }]);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={() => addLog("info")} className="px-3 py-1.5 rounded-lg bg-info-500 text-white text-xs font-semibold hover:bg-info-600 transition">logger.info()</button>
        <button onClick={() => addLog("warn")} className="px-3 py-1.5 rounded-lg bg-warning-500 text-white text-xs font-semibold hover:bg-warning-600 transition">logger.warn()</button>
        <button onClick={() => addLog("error")} className="px-3 py-1.5 rounded-lg bg-error-500 text-white text-xs font-semibold hover:bg-error-600 transition">logger.error()</button>
        {logs.length > 0 && <button onClick={() => setLogs([])} className="px-3 py-1.5 rounded-lg border border-border text-muted text-xs hover:text-foreground transition">clear</button>}
      </div>
      <p className="text-xs text-muted">Also check browser DevTools console.</p>
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {logs.map((l, i) => (
          <div key={i} className={`text-xs font-mono px-3 py-2 rounded-lg border ${l.level === "info" ? "bg-info-50 border-info-100 text-info-700" : l.level === "warn" ? "bg-warning-50 border-warning-100 text-warning-700" : "bg-error-50 border-error-100 text-error-600"}`}>
            <span className="font-bold">[{l.level.toUpperCase()}]</span> {l.msg} {l.data}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HowToCoreServices() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/core-services" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / core-services
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Core Services</h1>
        <p className="text-sm text-muted mb-10">Live demos of the storage, cookie, and logger services.</p>

        <div className="space-y-10">
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — LocalStorage Service</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><StorageDemo /></div>
            <p className="mt-2 text-xs text-muted font-mono">storage.set(key, value) · storage.get&lt;T&gt;(key) · storage.remove(key)</p>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Cookie Service</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><CookieDemo /></div>
            <p className="mt-2 text-xs text-muted font-mono">cookie.set(name, value) · cookie.get(name) · cookie.remove(name)</p>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Logger</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><LoggerDemo /></div>
            <p className="mt-2 text-xs text-muted font-mono">logger.info(msg, data) · .warn() · .error()</p>
          </section>
        </div>
      </div>
    </div>
  );
}
