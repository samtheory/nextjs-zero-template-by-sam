"use client";

import Link from "next/link";
import { useState } from "react";
import { generateMeta, generateJsonLd } from "@/core/seo";
import type { Metadata } from "next";

const DEFAULT_OPTIONS = {
  title: "My Amazing Page | Site",
  description: "This page does something really useful for users.",
  url: "https://example.com/page",
  image: "https://example.com/og/page.png",
  imageAlt: "Page cover image",
  siteName: "My Site",
  author: "Alice",
  type: "article" as const,
  locale: "en_US",
  noIndex: false,
  keywords: ["react", "next.js", "typescript"],
};

export default function HowToSeo() {
  const [title, setTitle] = useState(DEFAULT_OPTIONS.title);
  const [description, setDescription] = useState(DEFAULT_OPTIONS.description);
  const [noIndex, setNoIndex] = useState(false);
  const [type, setType] = useState<"website" | "article" | "profile">("article");
  const [tab, setTab] = useState<"meta" | "jsonld">("meta");

  const meta: Metadata = generateMeta({
    ...DEFAULT_OPTIONS,
    title,
    description,
    noIndex,
    type,
  });

  const jsonLd = generateJsonLd({
    type: "Article",
    data: {
      headline: title,
      author: { "@type": "Person", name: DEFAULT_OPTIONS.author },
      description,
      datePublished: "2025-01-01",
      image: DEFAULT_OPTIONS.image,
    },
  });

  const displayMeta = JSON.stringify(
    {
      title: meta.title,
      description: meta.description,
      robots: meta.robots,
      openGraph: meta.openGraph,
      twitter: meta.twitter,
    },
    null,
    2
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/seo" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / seo
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">SEO Service</h1>
        <p className="text-sm text-muted mb-10">Generate Next.js Metadata and JSON-LD. Edit fields to preview the output.</p>

        <div className="space-y-8">

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Edit fields</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-muted">title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface-raised text-sm text-foreground outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted">description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface-raised text-sm text-foreground outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              </div>
              <div className="flex gap-4 items-center flex-wrap">
                <div className="space-y-1">
                  <label className="text-xs text-muted">type</label>
                  <div className="flex gap-1.5">
                    {(["website", "article", "profile"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${type === t ? "bg-primary-500 text-white" : "border border-border bg-surface-raised text-muted hover:text-foreground"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noIndex}
                    onChange={(e) => setNoIndex(e.target.checked)}
                    className="rounded"
                  />
                  noIndex
                </label>
              </div>
            </div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Generated output</p>
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="flex border-b border-border">
                {(["meta", "jsonld"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-5 py-3 text-xs font-semibold transition ${tab === t ? "border-b-2 border-primary-500 text-primary-500" : "text-muted hover:text-foreground"}`}
                  >
                    {t === "meta" ? "Metadata object" : "JSON-LD"}
                  </button>
                ))}
              </div>
              <pre className="p-5 text-xs font-mono text-foreground overflow-x-auto max-h-96 bg-surface-raised">
                {tab === "meta" ? displayMeta : jsonLd}
              </pre>
            </div>
            <p className="mt-2 text-xs text-muted font-mono">
              {tab === "meta" ? "export const metadata = generateMeta(options)" : "generateJsonLd({ type, data })"}
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
