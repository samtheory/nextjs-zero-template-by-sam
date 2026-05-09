import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function DeviceDoc() {
  return (
    <>
      <div className="mb-2">
        <span className="text-xs text-muted">Core Services</span>
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Device & Browser Detection
      </h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        SSR-safe device and browser detection in{" "}
        <code className="font-mono bg-surface-raised px-1 rounded text-foreground">
          src/core/device/
        </code>
        . All methods return safe fallbacks when called on the server.
      </p>

      <div className="space-y-10">
        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
            Device detection
          </h2>
          <CodeBlock
            language="typescript"
            className="border border-code-border"
          >
            {`import { device } from "@/core/device";

device.isMobile()             // phone UA string
device.isTablet()             // tablet UA string
device.isDesktop()            // not mobile and not tablet
device.hasTouchScreen()       // ontouchstart || maxTouchPoints > 0
device.getViewport()          // { width: number, height: number }
device.isOnline()             // navigator.onLine
device.prefersDark()          // prefers-color-scheme: dark
device.prefersReducedMotion() // prefers-reduced-motion: reduce

// Subscribe to connectivity changes
const off = device.onConnectivityChange((online) => {
  if (!online) toast.warn("You are offline");
  else toast.success("Back online");
});
// call off() to unsubscribe (e.g. on component unmount)`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
            Browser detection
          </h2>
          <CodeBlock
            language="typescript"
            className="border border-code-border"
          >
            {`import { browser } from "@/core/device";

browser.isChrome()            // true in Google Chrome
browser.isFirefox()
browser.isSafari()
browser.isEdge()
browser.isOpera()
browser.getName()             // "Chrome" | "Firefox" | "Safari" | "Edge" | "Opera" | "Unknown"
browser.supportsWebP()
browser.supportsServiceWorker()
browser.supportsWebSocket()`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
            In React components
          </h2>
          <CodeBlock
            language="typescript"
            className="border border-code-border"
          >
            {`// Always use in useEffect or event handlers — never in render
// (device methods are SSR-safe but return defaults on server)

useEffect(() => {
  if (device.isMobile()) setLayout("mobile");

  const off = device.onConnectivityChange(setOnline);
  return off;
}, []);

// Conditional rendering with mounted guard:
const [mounted, setMounted] = useState(false);
useEffect(() => {
  const timer = window.setTimeout(() => setMounted(true), 0);
  return () => window.clearTimeout(timer);
}, []);
if (!mounted) return null;
return device.isDesktop() ? <DesktopView /> : <MobileView />;`}
          </CodeBlock>
        </DocsSection>

        <WorkingExampleCard
          href="/docs/how-to-device"
          label="src/core/device"
        />
      </div>
    </>
  );
}
