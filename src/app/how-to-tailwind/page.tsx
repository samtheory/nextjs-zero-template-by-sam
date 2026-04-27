import Link from "next/link";

// ─── Color swatches ───────────────────────────────────────────
const colorScales = [
  {
    name: "Primary (Indigo)",
    token: "primary",
    shades: [
      { label: "50", cls: "bg-primary-50", text: "text-primary-900" },
      { label: "100", cls: "bg-primary-100", text: "text-primary-900" },
      { label: "200", cls: "bg-primary-200", text: "text-primary-900" },
      { label: "300", cls: "bg-primary-300", text: "text-primary-900" },
      { label: "400", cls: "bg-primary-400", text: "text-white" },
      { label: "500", cls: "bg-primary-500", text: "text-white" },
      { label: "600", cls: "bg-primary-600", text: "text-white" },
      { label: "700", cls: "bg-primary-700", text: "text-white" },
      { label: "800", cls: "bg-primary-800", text: "text-white" },
      { label: "900", cls: "bg-primary-900", text: "text-white" },
    ],
  },
  {
    name: "Secondary (Teal)",
    token: "secondary",
    shades: [
      { label: "50", cls: "bg-secondary-50", text: "text-secondary-900" },
      { label: "100", cls: "bg-secondary-100", text: "text-secondary-900" },
      { label: "200", cls: "bg-secondary-200", text: "text-secondary-900" },
      { label: "300", cls: "bg-secondary-300", text: "text-secondary-900" },
      { label: "400", cls: "bg-secondary-400", text: "text-white" },
      { label: "500", cls: "bg-secondary-500", text: "text-white" },
      { label: "600", cls: "bg-secondary-600", text: "text-white" },
      { label: "700", cls: "bg-secondary-700", text: "text-white" },
      { label: "800", cls: "bg-secondary-800", text: "text-white" },
      { label: "900", cls: "bg-secondary-900", text: "text-white" },
    ],
  },
  {
    name: "Accent (Amber)",
    token: "accent",
    shades: [
      { label: "50", cls: "bg-accent-50", text: "text-accent-900" },
      { label: "100", cls: "bg-accent-100", text: "text-accent-900" },
      { label: "200", cls: "bg-accent-200", text: "text-accent-900" },
      { label: "300", cls: "bg-accent-300", text: "text-accent-900" },
      { label: "400", cls: "bg-accent-400", text: "text-white" },
      { label: "500", cls: "bg-accent-500", text: "text-white" },
      { label: "600", cls: "bg-accent-600", text: "text-white" },
      { label: "700", cls: "bg-accent-700", text: "text-white" },
      { label: "800", cls: "bg-accent-800", text: "text-white" },
      { label: "900", cls: "bg-accent-900", text: "text-white" },
    ],
  },
];

const semanticTokens = [
  { label: "background", bg: "bg-background", border: "border-border", note: "Page background" },
  { label: "surface", bg: "bg-surface", border: "border-border", note: "Card / panel" },
  { label: "surface-raised", bg: "bg-surface-raised", border: "border-border", note: "Slightly lifted" },
  { label: "foreground", bg: "bg-foreground", border: "border-foreground/20", note: "Text color" },
  { label: "muted", bg: "bg-muted", border: "border-muted/20", note: "Secondary text" },
];

const statusColors = [
  { name: "Success", bg: "bg-success-50", border: "border-success-100", dot: "bg-success-500", label: "text-success-700" },
  { name: "Warning", bg: "bg-warning-50", border: "border-warning-100", dot: "bg-warning-500", label: "text-warning-700" },
  { name: "Error", bg: "bg-error-50", border: "border-error-100", dot: "bg-error-500", label: "text-error-700" },
  { name: "Info", bg: "bg-info-50", border: "border-info-100", dot: "bg-info-500", label: "text-info-700" },
];

export default function HowToTailwind() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/tailwind-variables" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / tailwind-variables
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Tailwind CSS Variables</h1>
        <p className="text-sm text-muted mb-10">All color tokens available in this design system. Toggle dark mode in your OS to see semantic tokens adapt.</p>

        <div className="space-y-10">
          {/* Color Scales */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-4">1 — Static Color Scales</p>
            <div className="space-y-6">
              {colorScales.map((scale) => (
                <div key={scale.name}>
                  <p className="text-xs font-semibold text-muted mb-2">{scale.name}</p>
                  <div className="flex rounded-xl overflow-hidden border border-border">
                    {scale.shades.map((shade) => (
                      <div key={shade.label} className={`flex-1 h-12 flex items-end justify-center pb-1 ${shade.cls}`}>
                        <span className={`text-[9px] font-mono font-bold ${shade.text} opacity-70`}>{shade.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted font-mono mt-1">bg-{scale.token}-500, text-{scale.token}-700, border-{scale.token}-200 ...</p>
                </div>
              ))}
            </div>
          </section>

          {/* Semantic Tokens */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-4">2 — Semantic Tokens (dark-mode aware)</p>
            <div className="grid grid-cols-2 gap-3">
              {semanticTokens.map((t) => (
                <div key={t.label} className={`p-4 rounded-xl border ${t.border} ${t.bg} flex items-center justify-between`}>
                  <div>
                    <code className="text-xs font-mono font-bold text-foreground">{t.label}</code>
                    <p className="text-xs text-muted mt-0.5">{t.note}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg border ${t.border} ${t.bg}`} />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-3">These tokens resolve to different hex values in light vs dark mode via CSS <code className="bg-surface-raised px-1 rounded">@media (prefers-color-scheme: dark)</code>.</p>
          </section>

          {/* Status Colors */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-4">3 — Status Colors</p>
            <div className="grid grid-cols-2 gap-3">
              {statusColors.map((s) => (
                <div key={s.name} className={`p-4 rounded-xl border ${s.border} ${s.bg} flex items-center gap-3`}>
                  <span className={`w-3 h-3 rounded-full ${s.dot}`} />
                  <div>
                    <p className={`text-sm font-semibold ${s.label}`}>{s.name}</p>
                    <p className={`text-xs ${s.label} opacity-70`}>bg/border/text-{s.name.toLowerCase()}-50/100/700</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-info-600 mb-4">4 — Typography + Fonts</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
              <p className="text-3xl font-bold text-foreground font-sans">Geist Sans — heading</p>
              <p className="text-base text-muted font-sans">Body text uses <code className="font-mono bg-surface-raised px-1 rounded text-sm">font-sans</code> (Geist Sans). Clean, modern, readable.</p>
              <p className="text-sm font-mono text-foreground bg-surface-raised px-4 py-2 rounded-xl border border-border">
                const code = &quot;Geist Mono — font-mono&quot;;
              </p>
              <p className="text-xs text-muted">Configured in <code className="bg-surface-raised px-1 rounded">@theme inline &#123; --font-sans: var(--font-geist-sans); &#125;</code></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
