"use client";

import Link from "next/link";
import { useState, useCallback, useRef } from "react";
import { QueueService } from "@/core/queue";

// Dedicated demo queue
const demoQueue = new QueueService({ concurrency: 1, maxRetries: 2 });

export default function HowToQueue() {
  const [jobs, setJobs] = useState<{ id: string; name: string; progress: number; status: string }[]>([]);
  const [processing, setProcessing] = useState(false);
  const refreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPolling = useCallback(() => {
    if (refreshRef.current) return;
    setProcessing(true);
    refreshRef.current = setInterval(() => {
      const all = demoQueue.getJobs();
      setJobs(all.map((j) => ({ id: j.id, name: j.name, progress: 0, status: j.status })));
      const anyRunning = all.some((j) => j.status === "pending" || j.status === "running");
      if (!anyRunning) {
        clearInterval(refreshRef.current!);
        refreshRef.current = null;
        setProcessing(false);
      }
    }, 100);
  }, []);

  const addJob = useCallback((name: string, durationMs: number, shouldFail = false) => {
    demoQueue.process(name, async () => {
      await new Promise<void>((resolve, reject) =>
        setTimeout(() => (shouldFail ? reject(new Error("Job failed")) : resolve()), durationMs)
      );
    });
    const id = demoQueue.add(name, {});
    setJobs((prev) => [...prev, { id, name, progress: 0, status: "pending" }]);
    startPolling();
    return id;
  }, [startPolling]);

  const clearJobs = () => {
    demoQueue.clear();
    setJobs([]);
  };

  const statusColor = (s: string) =>
    s === "done" ? "text-success-600" : s === "failed" ? "text-error-500" : s === "running" ? "text-primary-500" : "text-muted";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/queue" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / queue
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Queue Service</h1>
        <p className="text-sm text-muted mb-10">Background tasks — enqueue, track status, handle failures and retries.</p>

        <div className="space-y-8">

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Enqueue tasks</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Fast task (200ms)", name: "fast-task", ms: 200 },
                  { label: "Slow task (1.5s)", name: "slow-task", ms: 1500 },
                  { label: "Failing task", name: "failing-task", ms: 300, fail: true },
                ].map(({ label, name, ms, fail }) => (
                  <button
                    key={label}
                    onClick={() => addJob(`${name}-${Date.now()}`, ms, fail)}
                    className="px-3 py-2 rounded-xl border border-border bg-surface-raised text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                  >
                    + {label}
                  </button>
                ))}
                <button onClick={clearJobs} className="px-3 py-2 rounded-xl border border-error-200 text-error-500 text-xs hover:bg-error-50 transition">
                  clear
                </button>
              </div>

              {jobs.length === 0 ? (
                <p className="text-xs text-muted italic">No jobs yet. Add one above.</p>
              ) : (
                <div className="space-y-2">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface text-xs">
                      <code className="font-mono text-foreground">{job.name.split("-").slice(0, 2).join("-")}</code>
                      <span className={`font-semibold ${statusColor(job.status)}`}>{job.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {processing && (
                <p className="text-xs text-primary-500 animate-pulse">Processing queue…</p>
              )}
            </div>
            <pre className="mt-2 text-xs text-muted font-mono bg-surface-raised rounded-xl px-4 py-3 overflow-x-auto">{`demoQueue.process("name", async (job) => { ... });
const id = demoQueue.add("name", data);
demoQueue.getJobs(); // all jobs`}</pre>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Concurrency & retry</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
              <button
                onClick={() => {
                  for (let i = 0; i < 5; i++) addJob(`batch-${i}-${Date.now()}`, 600);
                }}
                className="px-4 py-2 rounded-xl bg-secondary-500 text-white text-sm font-semibold hover:bg-secondary-600 transition"
              >
                Enqueue 5 tasks (concurrency: 1)
              </button>
              <p className="text-xs text-muted">With <code className="bg-surface-raised px-1 rounded">concurrency: 1</code>, tasks run one-by-one. Watch them transition: pending → running → done.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
