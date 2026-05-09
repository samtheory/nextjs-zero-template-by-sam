"use client";

import Link from "next/link";
import { useState } from "react";
import { clipboard } from "@/core/clipboard";

const SNIPPETS = [
  { label: "npm install", text: "npm install @/core/clipboard" },
  { label: "Copy text", text: `import { clipboard } from "@/core/clipboard";\nawait clipboard.copy("hello!");` },
  { label: "Paste demo", text: "paste to see clipboard content →" },
];

export default function HowToClipboard() {
  const [copied, setCopied] = useState<string | null>(null);
  const [pasted, setPasted] = useState<string>("");
  const [pasteError, setPasteError] = useState<string>("");
  const [customText, setCustomText] = useState("Hello from clipboard demo!");
  const [supported] = useState(() => clipboard.isSupported());

  const handleCopy = async (text: string, key: string) => {
    await clipboard.copy(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePaste = async () => {
    setPasteError("");
    try {
      const text = await clipboard.paste();
      setPasted(text);
    } catch {
      setPasteError("Permission denied — allow clipboard access in your browser.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/clipboard" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / clipboard
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Clipboard Service</h1>
        <p className="text-sm text-muted mb-10">Copy to and paste from the system clipboard.</p>

        <div className="space-y-8">

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Copy snippets</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
              {SNIPPETS.slice(0, 2).map((s) => (
                <div key={s.label} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-surface-raised">
                  <code className="flex-1 text-xs font-mono text-foreground whitespace-pre">{s.text}</code>
                  <button
                    onClick={() => handleCopy(s.text, s.label)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${copied === s.label ? "bg-success-500 text-white" : "bg-primary-500 text-white hover:bg-primary-600"}`}
                  >
                    {copied === s.label ? "Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted font-mono">clipboard.copy(text)</p>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Copy custom text</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface-raised text-foreground text-sm outline-none focus:ring-2 focus:ring-primary-400"
              />
              <button
                onClick={() => handleCopy(customText, "custom")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${copied === "custom" ? "bg-success-500 text-white" : "bg-primary-500 text-white hover:bg-primary-600"}`}
              >
                {copied === "custom" ? "Copied!" : "Copy to clipboard"}
              </button>
            </div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Paste</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
              <button
                onClick={handlePaste}
                className="px-4 py-2 rounded-xl bg-secondary-500 text-white text-sm font-semibold hover:bg-secondary-600 transition"
              >
                Paste from clipboard
              </button>
              {pasted && (
                <div className="p-3 rounded-xl border border-success-200 bg-success-50 text-xs text-success-700 font-mono break-all">
                  {pasted}
                </div>
              )}
              {pasteError && (
                <p className="text-xs text-error-500">{pasteError}</p>
              )}
            </div>
            <p className="mt-2 text-xs text-muted font-mono">clipboard.paste()</p>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-error-500 mb-3">4 — Support check</p>
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${supported ? "bg-success-100 text-success-700" : "bg-warning-100 text-warning-700"}`}>
                <span>{supported ? "✓" : "⚠"}</span>
                {supported ? "Modern Clipboard API supported" : "Using execCommand fallback"}
              </div>
            </div>
            <p className="mt-2 text-xs text-muted font-mono">clipboard.isSupported()</p>
          </section>

        </div>
      </div>
    </div>
  );
}
