"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { shortcuts } from "@/core/shortcuts";

const DEMO_SHORTCUTS = [
  { combo: "ctrl+k", description: "Open search" },
  { combo: "ctrl+shift+p", description: "Command palette" },
  { combo: "ctrl+/", description: "Toggle comment" },
  { combo: "escape", description: "Close modal" },
];

export default function HowToShortcuts() {
  const [log, setLog] = useState<{ combo: string; time: string }[]>([]);
  const [registered, setRegistered] = useState<string[]>([]);
  const [inputFocused, setInputFocused] = useState(false);

  const addLog = (combo: string) => {
    setLog((prev) => [
      { combo, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9),
    ]);
  };

  useEffect(() => {
    const offs = DEMO_SHORTCUTS.map(({ combo }) =>
      shortcuts.register(combo, (e) => {
        e.preventDefault();
        addLog(combo);
      })
    );
    setRegistered(DEMO_SHORTCUTS.map((s) => s.combo));
    return () => offs.forEach((off) => off());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/shortcuts" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / shortcuts
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Keyboard Shortcuts</h1>
        <p className="text-sm text-muted mb-10">Register global keyboard combos. Ctrl and Cmd are treated the same.</p>

        <div className="space-y-8">

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Registered shortcuts</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-2">
              {DEMO_SHORTCUTS.map(({ combo, description }) => (
                <div key={combo} className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-raised">
                  <kbd className="px-2 py-1 rounded-lg bg-background border border-border text-xs font-mono text-foreground">{combo}</kbd>
                  <span className="text-xs text-muted">{description}</span>
                  <span className={`w-2 h-2 rounded-full ${registered.includes(combo) ? "bg-success-500" : "bg-surface"}`} />
                </div>
              ))}
              <p className="text-xs text-muted mt-2">These shortcuts are active globally on this page. Try them!</p>
            </div>
            <p className="mt-2 text-xs text-muted font-mono">shortcuts.register(combo, handler)</p>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Event log</p>
            <div className="p-6 rounded-2xl border border-border bg-surface">
              {log.length === 0 ? (
                <p className="text-xs text-muted italic">No shortcuts fired yet. Press one above.</p>
              ) : (
                <div className="space-y-1.5">
                  {log.map((entry, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span className="text-muted font-mono">{entry.time}</span>
                      <kbd className="px-2 py-0.5 rounded bg-surface-raised border border-border font-mono text-foreground">{entry.combo}</kbd>
                      <span className="text-success-600">fired</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Focus & context</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
              <input
                type="text"
                placeholder="Type here — shortcuts still fire globally"
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface-raised text-sm text-foreground outline-none focus:ring-2 focus:ring-primary-400"
              />
              <p className="text-xs text-muted">
                Input focused: <strong className={inputFocused ? "text-primary-500" : "text-muted"}>{String(inputFocused)}</strong>{" "}
                — global shortcuts fire even inside inputs. Use the <code className="bg-surface-raised px-1 rounded">stopPropagation</code> option to change this.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
