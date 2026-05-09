import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function ClipboardDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Core Services</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Clipboard Service</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        Copy and paste via{" "}
        <code className="font-mono bg-surface-raised px-1 rounded text-foreground">src/core/clipboard/</code>.
        Uses the modern Clipboard API with a textarea fallback for older browsers.
      </p>

      <div className="space-y-10">

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Copy to clipboard</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { clipboard } from "@/core/clipboard";

// In an async handler:
await clipboard.copy("Hello, world!");

// With feedback:
async function handleCopy(text: string) {
  await clipboard.copy(text);
  toast.success("Copied to clipboard");
}

// In a React component:
<button onClick={() => clipboard.copy(code).then(() => setCopied(true))}>
  Copy
</button>`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Paste from clipboard</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { clipboard } from "@/core/clipboard";

// Requires user permission — browser may prompt
const text = await clipboard.paste();

// Always handle the case where permission is denied:
try {
  const text = await clipboard.paste();
  setInput(text);
} catch {
  toast.error("Clipboard access denied");
}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Support check</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`if (clipboard.isSupported()) {
  // Modern Clipboard API — works in most browsers
} else {
  // Falls back to document.execCommand('copy') automatically
}`}
          </CodeBlock>
          <p className="text-xs text-muted mt-3">
            The service falls back to <code className="bg-surface-raised px-1 rounded">execCommand</code> for copy
            automatically. Paste without the modern API will throw — handle with try/catch.
          </p>
        </DocsSection>

        <WorkingExampleCard href="/docs/how-to-clipboard" label="src/core/clipboard" />
      </div>
    </>
  );
}
