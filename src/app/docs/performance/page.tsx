import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function PerformanceDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Core Services</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Performance Utilities</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        Debounce, throttle, and lazy-load helpers in{" "}
        <code className="font-mono bg-surface-raised px-1 rounded text-foreground">src/core/performance/</code>.
        Prevent excessive re-renders and API calls from scroll, resize, and input events.
      </p>

      <div className="space-y-10">

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Debounce</h2>
          <p className="text-sm text-muted mb-4">
            Fire a function <strong>at most once</strong> after the last invocation within a time window.
            Perfect for search inputs — wait until the user stops typing.
          </p>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { debounceService } from "@/core/performance";

// Create a debounced handler — fires 300 ms after last keystroke
const search = debounceService.debounce(fetchResults, 300, "search");

input.addEventListener("input", (e) => search(e.target.value));

// Cancel a pending call by key
debounceService.cancel("search");

// In React:
const debouncedSearch = useMemo(
  () => debounceService.debounce(fetchResults, 300, "search"),
  []
);
useEffect(() => () => debounceService.cancel("search"), []);`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Throttle</h2>
          <p className="text-sm text-muted mb-4">
            Execute a function <strong>at most once per interval</strong>, but always fire the last call.
            Perfect for scroll/resize events.
          </p>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { throttleService } from "@/core/performance";

// Execute at most once per 100 ms
const onScroll = throttleService.throttle(updateStickyHeader, 100);
window.addEventListener("scroll", onScroll);

// Resize tracking
const onResize = throttleService.throttle((e) => {
  setViewportWidth(window.innerWidth);
}, 200);
window.addEventListener("resize", onResize);`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Lazy Load (IntersectionObserver)</h2>
          <p className="text-sm text-muted mb-4">
            Defer expensive work until an element enters the viewport.
          </p>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { lazyLoad } from "@/core/performance";

// Lazy-load an image
const cleanup = lazyLoad.observe(imgEl, (entry) => {
  imgEl.src = imgEl.dataset.src!;
}, { rootMargin: "200px", once: true });

// In a React component:
useEffect(() => {
  if (!ref.current) return;
  return lazyLoad.observe(ref.current, () => {
    setVisible(true);
  }, { once: true });
}, []);`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Debounce vs Throttle</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl border border-primary-200 bg-primary-50/50">
              <p className="font-semibold text-primary-700 mb-2">Debounce</p>
              <p className="text-muted">Waits for a <em>quiet period</em> after the last call. Good for: search, auto-save.</p>
            </div>
            <div className="p-4 rounded-xl border border-secondary-200 bg-secondary-50/50">
              <p className="font-semibold text-secondary-700 mb-2">Throttle</p>
              <p className="text-muted">Fires at a steady <em>maximum rate</em>. Good for: scroll, resize, mouse move.</p>
            </div>
          </div>
        </DocsSection>

        <WorkingExampleCard href="/how-to-performance" label="src/core/performance" />
      </div>
    </>
  );
}
