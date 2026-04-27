"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { debounceService, throttleService, lazyLoad } from "@/core/performance";

export default function HowToPerformance() {
  // Debounce demo
  const [searchInput, setSearchInput] = useState("");
  const [searchFired, setSearchFired] = useState("");
  const [debounceCount, setDebounceCount] = useState(0);
  const [fireCount, setFireCount] = useState(0);

  // Throttle demo
  const [scrollEvents, setScrollEvents] = useState(0);
  const [throttledFires, setThrottledFires] = useState(0);

  // Lazy-load demo
  const lazyRef = useRef<HTMLDivElement>(null);
  const [lazyVisible, setLazyVisible] = useState(false);

  const debouncedSearch = useCallback(
    debounceService.debounce((value: string) => {
      setSearchFired(value);
      setFireCount((c) => c + 1);
    }, 500, "demo-search"),
    []
  );

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setDebounceCount((c) => c + 1);
    debouncedSearch(value);
  };

  const throttledScroll = useCallback(
    throttleService.throttle(() => {
      setThrottledFires((c) => c + 1);
    }, 300),
    []
  );

  const handleScrollSim = () => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        setScrollEvents((c) => c + 1);
        throttledScroll();
      }, i * 50);
    }
  };

  useEffect(() => {
    if (!lazyRef.current) return;
    return lazyLoad.observe(lazyRef.current, () => setLazyVisible(true));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/performance" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / performance
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Performance Utilities</h1>
        <p className="text-sm text-muted mb-10">Debounce, throttle, and lazy-load — prevent redundant work.</p>

        <div className="space-y-8">

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Debounce</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-4">
              <input
                type="text"
                placeholder="Type to search…"
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface-raised text-foreground text-sm outline-none focus:ring-2 focus:ring-primary-400"
              />
              <div className="flex gap-6 text-xs">
                <span className="text-muted">keystrokes: <strong className="text-foreground">{debounceCount}</strong></span>
                <span className="text-muted">search fired: <strong className="text-success-600">{fireCount}</strong></span>
                {searchFired && <span className="text-muted">last query: <strong className="text-foreground">&quot;{searchFired}&quot;</strong></span>}
              </div>
            </div>
            <p className="mt-2 text-xs text-muted font-mono">debounceService.debounce(fn, 500, key)</p>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Throttle</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-4">
              <button
                onClick={handleScrollSim}
                className="px-4 py-2 rounded-xl bg-secondary-500 text-white text-sm font-semibold hover:bg-secondary-600 transition"
              >
                Simulate 10 scroll events
              </button>
              <div className="flex gap-6 text-xs">
                <span className="text-muted">events: <strong className="text-foreground">{scrollEvents}</strong></span>
                <span className="text-muted">throttled fires: <strong className="text-success-600">{throttledFires}</strong></span>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted font-mono">throttleService.throttle(fn, 300)</p>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Lazy load</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
              <p className="text-xs text-muted">The element below uses IntersectionObserver. Scroll into view to trigger:</p>
              <div style={{ height: "120px" }} className="overflow-y-auto border border-border rounded-xl">
                <div style={{ height: "200px" }} className="flex items-end p-3">
                  <div ref={lazyRef} className={`w-full p-4 rounded-xl text-center text-sm font-semibold transition-all duration-500 ${lazyVisible ? "bg-success-100 text-success-700 border border-success-200" : "bg-surface-raised text-muted border border-border"}`}>
                    {lazyVisible ? "Visible! Callback fired." : "Scroll to reveal…"}
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted font-mono">lazyLoad.observe(element, callback)</p>
          </section>

        </div>
      </div>
    </div>
  );
}
