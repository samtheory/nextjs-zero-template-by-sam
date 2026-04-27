import Link from "next/link";

export default function TailwindVariablesDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Configuration</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Tailwind CSS Variables</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        Tailwind v4 drops <code className="font-mono bg-surface-raised px-1 rounded text-foreground">tailwind.config.ts</code>. All theme customization happens in CSS using <code className="font-mono bg-surface-raised px-1 rounded text-foreground">@theme</code>. CSS variables drive dark mode and semantic tokens.
      </p>

      <div className="space-y-10">

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">How Tailwind v4 Theming Works</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`/* globals.css */

/* 1. @theme — define NEW design tokens */
/* These become Tailwind utilities: bg-primary-500, text-neutral-200, etc. */
@theme {
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  --font-display: "Cabinet Grotesk", sans-serif;
  --spacing-18: 4.5rem;       /* bg-w-18, p-18, etc. */
  --radius-brand: 0.75rem;    /* rounded-brand */
}

/* 2. :root — define raw CSS vars (semantic, theme-aware) */
:root {
  --background: #fafafa;
  --foreground: #09090b;
}
@media (prefers-color-scheme: dark) {
  :root { --background: #09090b; --foreground: #fafafa; }
}

/* 3. @theme inline — expose CSS vars TO Tailwind (no new CSS var created) */
/* This generates: bg-background, text-foreground, etc. */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Adding Custom Colors</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`/* Add a full color scale to globals.css */
@theme {
  --color-brand-50:  #fdf4ff;
  --color-brand-100: #fae8ff;
  --color-brand-200: #f5d0fe;
  --color-brand-300: #f0abfc;
  --color-brand-400: #e879f9;
  --color-brand-500: #d946ef;
  --color-brand-600: #c026d3;
  --color-brand-700: #a21caf;
  --color-brand-800: #86198f;
  --color-brand-900: #701a75;
  --color-brand-950: #4a044e;
}

/* Now use in JSX: */
/* <div className="bg-brand-100 text-brand-700 border-brand-300" /> */`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Custom Font Families</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`/* 1. Load the font (Next.js font module or Google Fonts link) */
/* In layout.tsx: */
import { Inter, Fira_Code } from "next/font/google";
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fira = Fira_Code({ variable: "--font-fira-code", subsets: ["latin"] });
// Apply to <html className={\`\${inter.variable} \${fira.variable}\`}>

/* 2. Register in @theme inline */
@theme inline {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-fira-code);
}
/* Now: font-sans, font-mono Tailwind utilities use your fonts */

/* 3. Custom display font */
@theme {
  --font-display: "Cabinet Grotesk", sans-serif;
}
/* <h1 className="font-display"> */`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Custom Spacing & Sizing</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`@theme {
  /* Custom spacing values (adds to scale, doesn't replace) */
  --spacing-18: 4.5rem;    /* p-18, m-18, w-18, h-18 */
  --spacing-22: 5.5rem;
  --spacing-128: 32rem;

  /* Custom border radius */
  --radius-pill: 9999px;   /* rounded-pill */
  --radius-card: 0.75rem;  /* rounded-card */

  /* Custom font sizes */
  --text-display: 3.5rem;  /* text-display */
  --text-tiny: 0.625rem;   /* text-tiny */

  /* Custom shadows */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08);
  /* shadow-card */
}

/* Usage: */
/* <div className="p-18 rounded-card shadow-card text-display"> */`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Semantic Dark Mode Pattern (this project)</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`/* The pattern used in this project: */

/* Step 1 — Define semantic vars in :root */
:root { --surface: #ffffff; }
@media (prefers-color-scheme: dark) { :root { --surface: #18181b; } }

/* Step 2 — Expose to Tailwind */
@theme inline { --color-surface: var(--surface); }

/* Step 3 — Use in JSX (auto adapts to dark mode) */
/* <div className="bg-surface"> */

/* You can ALSO use dark: prefix for explicit overrides: */
/* <div className="bg-white dark:bg-zinc-900"> */

/* Semantic tokens in this project:
   bg-background    text-foreground
   bg-surface       bg-surface-raised
   border-border    border-border-subtle
   text-muted       text-muted-foreground
   bg-sidebar-bg    etc.
*/`}</code>
          </pre>
        </section>

        <section className="p-4 bg-warning-50 border border-warning-200 rounded-xl">
          <p className="text-sm font-semibold text-warning-700 mb-1">Working Example</p>
          <Link href="/how-to-tailwind" className="inline-flex items-center gap-1.5 text-xs font-semibold text-warning-600 hover:text-warning-800">
            <code className="bg-warning-100 px-1.5 py-0.5 rounded">src/features/how-to-tailwind</code>
            <span>→</span>
          </Link>
        </section>
      </div>
    </>
  );
}
