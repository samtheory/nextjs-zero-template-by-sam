import Link from "next/link";
import { CodeBlock } from "../_components/CodeBlock";

export default function ZustandDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Data &amp; State</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Zustand</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Lightweight client-state management. No providers, no boilerplate. Use it for shared UI state, global settings, and persisted preferences — not for server data (that's React Query's job).

      </p>

      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">When to Use Zustand</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-success-50 border border-success-100 rounded-lg">
              <p className="font-semibold text-success-700 mb-1">✓ Use for</p>
              <ul className="text-success-600 space-y-0.5 text-xs">
                <li>UI state shared across components</li>
                <li>Theme / sidebar / modal open state</li>
                <li>Shopping cart, wizard step</li>
                <li>Auth user object (client-side)</li>
                <li>Persisted preferences</li>
              </ul>
            </div>
            <div className="p-3 bg-error-50 border border-error-100 rounded-lg">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <p className="font-semibold text-error-700 mb-1">✗ Don't use for</p>
              <ul className="text-error-600 space-y-0.5 text-xs">
                <li>API data (use React Query)</li>
                <li>Form state (use RHF)</li>
                <li>Data that belongs in a URL param</li>
                <li>Server state that can go stale</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">1. Basic Store</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// features/how-to-zustand/store/counter.store.ts
import { create } from "zustand";

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Usage in component (NO provider needed):
// const count = useCounterStore((s) => s.count);
// const increment = useCounterStore((s) => s.increment);`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">2. Persisted Store</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ThemeState {
  theme: "light" | "dark" | "system";
  setTheme: (t: ThemeState["theme"]) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",         // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist specific fields:
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">3. Component-Scoped Store (no global state leak)</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { createStore, useStore } from "zustand";
import { createContext, useContext, useRef, type ReactNode } from "react";

// Factory — creates a NEW store per component instance
interface AccordionState { openId: string | null; toggle: (id: string) => void; }
const createAccordionStore = () =>
  createStore<AccordionState>()((set) => ({
    openId: null,
    toggle: (id) => set((s) => ({ openId: s.openId === id ? null : id })),
  }));

// Context to hold the store instance
const AccordionContext = createContext<ReturnType<typeof createAccordionStore> | null>(null);

export function AccordionProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createAccordionStore>>();
  if (!storeRef.current) storeRef.current = createAccordionStore();
  return (
    <AccordionContext.Provider value={storeRef.current}>
      {children}
    </AccordionContext.Provider>
  );
}

export function useAccordion<T>(selector: (s: AccordionState) => T) {
  const store = useContext(AccordionContext);
  if (!store) throw new Error("Must be inside AccordionProvider");
  return useStore(store, selector);
}`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">4. Disposing / Clearing State</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// Reset all state back to initial values
const useAuthStore = create<AuthState>()((set) => {
  const initialState = { user: null, token: null };
  return {
    ...initialState,
    setUser: (user) => set({ user }),
    logout: () => set(initialState),   // ← resets everything
  };
});

// For persisted stores — also clear storage
const { logout } = useAuthStore();
logout();
useAuthStore.persist.clearStorage(); // removes from localStorage`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">5. Preventing Unnecessary Re-renders</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { useShallow } from "zustand/react/shallow";

// ❌ Bad — subscribes to the WHOLE store, re-renders on ANY change
const { count, user } = useStore();

// ✓ Good — only re-renders when count OR user changes
const { count, user } = useStore(
  useShallow((s) => ({ count: s.count, user: s.user }))
);

// ✓ Best for single values — use a selector
const count = useStore((s) => s.count); // only re-renders when count changes`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">Best Practices</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li>✓ One store per concern (<code className="font-mono bg-surface-raised px-1 rounded text-foreground">useAuthStore</code>, <code className="font-mono bg-surface-raised px-1 rounded text-foreground">useCartStore</code>) — not one giant store</li>
            <li>✓ Include actions inside the store (not external handlers)</li>
            <li>✓ Always use a selector: <code className="font-mono bg-surface-raised px-1 rounded text-foreground">useStore((s) =&gt; s.value)</code></li>
            <li>✓ Use <code className="font-mono bg-surface-raised px-1 rounded text-foreground">useShallow</code> when selecting multiple fields</li>
            <li>✓ Put stores in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">features/[name]/store/</code> (feature-scoped) or <code className="font-mono bg-surface-raised px-1 rounded text-foreground">presentation/stores/</code> (global)</li>
          </ul>
        </section>

        <section className="p-4 bg-secondary-50 border border-secondary-200 rounded-xl">
          <p className="text-sm font-semibold text-secondary-700 mb-1">Working Example</p>
          <p className="text-xs text-secondary-600 mb-3">All 4 patterns: basic, persisted, component-scoped, and disposal.</p>
          <Link href="/how-to-zustand" className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-600 hover:text-secondary-800">
            <code className="bg-secondary-100 px-1.5 py-0.5 rounded">src/features/how-to-zustand</code>
            <span>→</span>
          </Link>
        </section>
      </div>
    </>
  );
}
