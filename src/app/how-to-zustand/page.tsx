"use client";

import Link from "next/link";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useRef, useState } from "react";

// ─── 1. Basic Counter Store ──────────────────────────────────
interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}
const useCounterStore = create<CounterState>()((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// ─── 2. Persisted Theme Store ──────────────────────────────────
interface ThemeState {
  theme: "light" | "dark" | "system";
  setTheme: (t: ThemeState["theme"]) => void;
}
const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({ theme: "system", setTheme: (theme) => set({ theme }) }),
    { name: "how-to-theme-demo" }
  )
);

// ─── 3. Multi-field Store (shallow selector demo) ────────────
interface ProfileState {
  name: string;
  score: number;
  setName: (n: string) => void;
  setScore: (s: number) => void;
}
const useProfileStore = create<ProfileState>()((set) => ({
  name: "Alice",
  score: 42,
  setName: (name) => set({ name }),
  setScore: (score) => set({ score }),
}));

// ─── 4. Form Draft Store (auto-dispose on unmount) ───────────
interface FormDraftState {
  title: string;
  body: string;
  isDirty: boolean;
  setTitle: (t: string) => void;
  setBody: (b: string) => void;
  reset: () => void;
}
const DRAFT_INIT = { title: "", body: "", isDirty: false };
const useFormDraftStore = create<FormDraftState>()((set) => ({
  ...DRAFT_INIT,
  setTitle: (title) => set({ title, isDirty: true }),
  setBody: (body) => set({ body, isDirty: true }),
  reset: () => set(DRAFT_INIT),
}));

// ─── 5. Shared Cart Store (parent ↔ child) ───────────────────
interface CartItem { id: string; name: string; }
interface CartState {
  items: CartItem[];
  addItem: (name: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}
const useCartStore = create<CartState>()((set) => ({
  items: [],
  addItem: (name) => set((s) => ({
    items: [...s.items, { id: `${name}-${Date.now()}`, name }],
  })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clearCart: () => set({ items: [] }),
}));

// ─── Counter Demo Component ───────────────────────────────────
function CounterDemo() {
  const count = useCounterStore((s) => s.count);
  const { increment, decrement, reset } = useCounterStore(
    useShallow((s) => ({ increment: s.increment, decrement: s.decrement, reset: s.reset }))
  );
  return (
    <div className="flex items-center gap-4">
      <button onClick={decrement} className="w-9 h-9 rounded-lg border border-border bg-surface-raised text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold text-lg transition">−</button>
      <span className="text-4xl font-bold font-mono text-foreground w-16 text-center tabular-nums">{count}</span>
      <button onClick={increment} className="w-9 h-9 rounded-lg border border-border bg-surface-raised text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold text-lg transition">+</button>
      <button onClick={reset} className="ml-2 px-3 py-1 rounded-lg text-xs border border-border text-muted hover:text-foreground hover:border-foreground transition">reset</button>
    </div>
  );
}

// ─── Theme Demo Component ─────────────────────────────────────
// The persist middleware reads localStorage only on the client.
// Using a `mounted` guard prevents the SSR output from differing
// from the first client render → fixes the hydration error.
function ThemeDemo() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { theme, setTheme } = useThemeStore(
    useShallow((s) => ({ theme: s.theme, setTheme: s.setTheme }))
  );

  if (!mounted) {
    return <div className="h-10 rounded-lg bg-surface-raised animate-pulse" />;
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {(["light", "dark", "system"] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition capitalize ${theme === t ? "bg-secondary-500 text-white border-secondary-500" : "bg-surface-raised border-border text-muted hover:text-foreground"}`}
        >
          {t}
        </button>
      ))}
      <span className="ml-2 self-center text-sm text-muted">
        Saved to <code className="bg-surface-raised px-1 rounded text-xs">localStorage</code> as <code className="bg-surface-raised px-1 rounded text-xs">&quot;how-to-theme-demo&quot;</code>
      </span>
    </div>
  );
}

// ─── Shallow Selector Demo ────────────────────────────────────
function ShallowDemo() {
  const nameRenders = useRef(0);
  const scoreRenders = useRef(0);
  const [, tick] = useState(0);

  const name = useProfileStore((s) => s.name);
  const score = useProfileStore((s) => s.score);
  const setName = useProfileStore((s) => s.setName);
  const setScore = useProfileStore((s) => s.setScore);

  nameRenders.current += 1;
  scoreRenders.current += 1;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-xl border border-border bg-surface-raised">
          <label className="block text-xs text-muted mb-1">Name <span className="text-primary-500 font-mono">renders: {nameRenders.current}</span></label>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); tick((n) => n + 1); }}
            className="w-full text-sm bg-background border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <div className="p-3 rounded-xl border border-border bg-surface-raised">
          <label className="block text-xs text-muted mb-1">Score <span className="text-primary-500 font-mono">renders: {scoreRenders.current}</span></label>
          <input
            type="number"
            value={score}
            onChange={(e) => { setScore(Number(e.target.value)); tick((n) => n + 1); }}
            className="w-full text-sm bg-background border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </div>
      <p className="text-xs text-muted">Each input subscribes only to its own value — changing one doesn&apos;t re-render the other.</p>
    </div>
  );
}

// ─── Auto-dispose: Editor component ─────────────────────────
// Resets the shared draft store when it unmounts.
function FormDraftEditor() {
  const { title, body, isDirty, setTitle, setBody } = useFormDraftStore(
    useShallow((s) => ({ title: s.title, body: s.body, isDirty: s.isDirty, setTitle: s.setTitle, setBody: s.setBody }))
  );

  // Cleanup: when this component is removed from the tree, reset store to initial.
  useEffect(() => {
    return () => { useFormDraftStore.getState().reset(); };
  }, []);

  return (
    <div className="space-y-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title..."
        className="w-full text-sm bg-background border border-border rounded-xl px-4 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-400"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body..."
        rows={2}
        className="w-full text-sm bg-background border border-border rounded-xl px-4 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
      />
      {isDirty && (
        <p className="text-xs text-warning-500">Draft is dirty. On unmount it will reset.</p>
      )}
    </div>
  );
}

// Auto-dispose: outer demo that toggles the editor in/out of the tree
function AutoDisposeDemo() {
  const [show, setShow] = useState(true);
  const { title, body, isDirty } = useFormDraftStore(
    useShallow((s) => ({ title: s.title, body: s.body, isDirty: s.isDirty }))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShow((v) => !v)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition ${show ? "border-error-300 text-error-600 hover:bg-error-50" : "border-success-300 text-success-600 hover:bg-success-50"}`}
        >
          {show ? "Unmount editor" : "Mount editor"}
        </button>
        <span className="text-xs text-muted">{show ? "component is in the tree" : "component removed — store was reset"}</span>
      </div>

      {/* Store snapshot — always visible so you can see the reset happen */}
      <div className="p-3 rounded-xl border border-border bg-surface-raised text-xs font-mono space-y-0.5">
        <p className="text-muted">Store snapshot (always visible):</p>
        <p><span className="text-muted">title:</span> <span className="text-foreground">{title || <span className="opacity-40">(empty)</span>}</span></p>
        <p><span className="text-muted">body:</span> <span className="text-foreground">{body || <span className="opacity-40">(empty)</span>}</span></p>
        <p><span className="text-muted">isDirty:</span> <span className={isDirty ? "text-warning-500" : "text-success-500"}>{String(isDirty)}</span></p>
      </div>

      {show && (
        <div className="p-4 rounded-xl border border-primary-200 bg-primary-50/50 dark:border-primary-700/30 dark:bg-primary-950/20">
          <p className="text-xs text-muted mb-3">Editor component (type here, then unmount):</p>
          <FormDraftEditor />
        </div>
      )}
    </div>
  );
}

// ─── Parent ↔ Child shared store demo ────────────────────────
const PRODUCTS = ["Coffee ☕", "Donut 🍩", "Apple 🍎", "Cookie 🍪"];

// Child component — only knows how to add items
function CartAdder() {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <div className="p-4 rounded-xl border border-secondary-200 bg-secondary-50/50 dark:border-secondary-700/30 dark:bg-secondary-950/20">
      <p className="text-xs font-semibold text-secondary-600 dark:text-secondary-400 mb-2">Child — CartAdder</p>
      <p className="text-xs text-muted mb-3">Calls <code className="bg-surface-raised px-1 rounded">useCartStore((s) =&gt; s.addItem)</code></p>
      <div className="flex flex-wrap gap-2">
        {PRODUCTS.map((name) => (
          <button key={name} onClick={() => addItem(name)} className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs hover:bg-surface-raised transition">
            + {name}
          </button>
        ))}
      </div>
    </div>
  );
}

// Parent component — reads items and manages the list
function CartParent() {
  const { items, removeItem, clearCart } = useCartStore(
    useShallow((s) => ({ items: s.items, removeItem: s.removeItem, clearCart: s.clearCart }))
  );
  return (
    <div className="space-y-3">
      <div className="p-4 rounded-xl border border-primary-200 bg-primary-50/50 dark:border-primary-700/30 dark:bg-primary-950/20">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">Parent — CartSummary</p>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-xs text-error-500 hover:text-error-700 transition">clear all</button>
          )}
        </div>
        <p className="text-xs text-muted mb-3">
          Calls <code className="bg-surface-raised px-1 rounded">useCartStore(useShallow(...))</code> — <strong>{items.length}</strong> item{items.length !== 1 ? "s" : ""}
        </p>
        {items.length === 0 ? (
          <p className="text-xs text-muted italic">Cart is empty. Add items from the child below.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <span key={item.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface border border-border text-xs">
                {item.name}
                <button onClick={() => removeItem(item.id)} className="text-muted hover:text-error-500 transition ml-0.5">×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      <CartAdder />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function HowToZustand() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        {/* Header */}
        <Link href="/docs/zustand" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / zustand
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Zustand</h1>
        <p className="text-sm text-muted mb-10">Live working examples. Inspect DevTools to see state updates.</p>

        <div className="space-y-10">
          {/* Example 1 */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Basic Store</p>
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <CounterDemo />
            </div>
            <p className="mt-2 text-xs text-muted font-mono">useCounterStore((s) =&gt; s.count)</p>
          </section>

          {/* Example 2 */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Persisted Store (localStorage)</p>
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <ThemeDemo />
            </div>
            <p className="mt-2 text-xs text-muted font-mono">persist(set =&gt; (&#123; ... &#125;), &#123; name: &quot;key&quot; &#125;)</p>
          </section>

          {/* Example 3 */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Selector Per Field (no extra re-renders)</p>
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <ShallowDemo />
            </div>
          </section>

          {/* Example 4 */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-error-500 mb-1">4 — Auto-dispose on unmount</p>
            <p className="text-xs text-muted mb-3">
              Reset shared store state when a component leaves the tree via <code className="bg-surface-raised px-1 rounded">useEffect</code> cleanup.
            </p>
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <AutoDisposeDemo />
            </div>
            <pre className="mt-2 text-xs text-muted font-mono bg-surface-raised rounded-xl px-4 py-3 overflow-x-auto">{`useEffect(() => {
  return () => {
    useFormDraftStore.getState().reset(); // runs on unmount
  };
}, []);`}</pre>
          </section>

          {/* Example 5 */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-info-500 mb-1">5 — Shared state: parent ↔ child</p>
            <p className="text-xs text-muted mb-3">
              Both components call <code className="bg-surface-raised px-1 rounded">useCartStore</code> independently — no props, no context.
            </p>
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <CartParent />
            </div>
            <p className="mt-2 text-xs text-muted font-mono">Global store = shared by all subscribers. Any component can read/write it.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
