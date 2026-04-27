"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { device, browser } from "@/core/device";

export default function HowToDevice() {
  const [mounted, setMounted] = useState(false);
  const [online, setOnline] = useState(true);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);
    setOnline(device.isOnline());
    setViewport(device.getViewport());
    const off = device.onConnectivityChange((status) => setOnline(status));
    const handleResize = () => setViewport(device.getViewport());
    window.addEventListener("resize", handleResize);
    return () => {
      off();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const Row = ({ label, value }: { label: string; value: string | boolean }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <code className="text-xs font-mono text-muted">{label}</code>
      <span className={`text-xs font-semibold ${value === true ? "text-success-600" : value === false ? "text-error-500" : "text-foreground"}`}>
        {String(value)}
      </span>
    </div>
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-6 w-32 rounded bg-surface-raised animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/device" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / device
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Device & Browser Detection</h1>
        <p className="text-sm text-muted mb-10">Live readout of your current device, browser, and environment.</p>

        <div className="space-y-8">

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Device info</p>
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <Row label="device.isMobile()" value={device.isMobile()} />
              <Row label="device.isTablet()" value={device.isTablet()} />
              <Row label="device.isDesktop()" value={device.isDesktop()} />
              <Row label="device.hasTouchScreen()" value={device.hasTouchScreen()} />
              <Row label="device.getViewport()" value={`${viewport.width} × ${viewport.height}`} />
            </div>
            <p className="mt-2 text-xs text-muted font-mono">import {"{ device }"} from &quot;@/core/device&quot;</p>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Connectivity</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${online ? "border-success-200 bg-success-50" : "border-error-200 bg-error-50"}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${online ? "bg-success-500" : "bg-error-500"} animate-pulse`} />
                <span className={`text-sm font-semibold ${online ? "text-success-700" : "text-error-600"}`}>
                  {online ? "Online" : "Offline"}
                </span>
              </div>
              <p className="text-xs text-muted">Try disconnecting your network to see this update in real time.</p>
            </div>
            <p className="mt-2 text-xs text-muted font-mono">device.onConnectivityChange(callback)</p>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Preferences</p>
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <Row label="device.prefersDark()" value={device.prefersDark()} />
              <Row label="device.prefersReducedMotion()" value={device.prefersReducedMotion()} />
              <Row label="device.isOnline()" value={online} />
            </div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-error-500 mb-3">4 — Browser</p>
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <Row label="browser.getName()" value={browser.getName()} />
              <Row label="browser.supportsWebP()" value={browser.supportsWebP()} />
              <Row label="browser.supportsWebSocket()" value={browser.supportsWebSocket()} />
              <Row label="browser.supportsServiceWorker()" value={browser.supportsServiceWorker()} />
            </div>
            <p className="mt-2 text-xs text-muted font-mono">import {"{ browser }"} from &quot;@/core/device&quot;</p>
          </section>

        </div>
      </div>
    </div>
  );
}
