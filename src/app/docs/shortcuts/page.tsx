import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function ShortcutsDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Core Services</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Keyboard Shortcuts</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        Register global keyboard shortcuts in{" "}
        <code className="font-mono bg-surface-raised px-1 rounded text-foreground">src/core/shortcuts/</code>.
        Ctrl and Cmd (Meta) are treated as the same key. Returns an unsubscribe function.
      </p>

      <div className="space-y-10">

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Register a shortcut</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { shortcuts } from "@/core/shortcuts";

// Returns an unsubscribe function
const off = shortcuts.register("ctrl+k", (e) => {
  openSearch();
});

// Remove just this handler
off();

// Remove all handlers for a combo
shortcuts.unregister("ctrl+k");

// Remove everything and detach the global listener
shortcuts.dispose();`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">In a React component</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`useEffect(() => {
  const off = shortcuts.register("ctrl+s", () => save());
  return off; // automatically unregisters on unmount
}, []);

// Multiple shortcuts:
useEffect(() => {
  const offs = [
    shortcuts.register("ctrl+k", openSearch),
    shortcuts.register("escape", closeModal),
    shortcuts.register("ctrl+shift+p", openCommandPalette),
  ];
  return () => offs.forEach((off) => off());
}, []);`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Options</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`shortcuts.register("escape", closeModal, {
  preventDefault: true,    // stop browser default (default: true)
  stopPropagation: false,  // stop event bubbling (default: false)
  repeat: false,           // fire while key is held (default: false)
});`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Combo syntax</h2>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {[
              "ctrl+k", "ctrl+shift+p", "alt+arrowup", "escape",
              "ctrl+s", "ctrl+z", "ctrl+y", "ctrl+/",
            ].map((s) => (
              <code key={s} className="px-3 py-2 rounded-lg bg-surface-raised border border-border text-foreground">
                {s}
              </code>
            ))}
          </div>
          <p className="text-xs text-muted mt-3">
            Key order doesn&apos;t matter — <code className="bg-surface-raised px-1 rounded">shift+ctrl+k</code> and{" "}
            <code className="bg-surface-raised px-1 rounded">ctrl+shift+k</code> are the same.
          </p>
        </DocsSection>

        <WorkingExampleCard href="/docs/how-to-shortcuts" label="src/core/shortcuts" />
      </div>
    </>
  );
}
