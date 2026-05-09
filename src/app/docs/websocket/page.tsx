import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function WebSocketDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Core Services</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">WebSocket Service</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        Real-time WebSocket client with auto-reconnect in{" "}
        <code className="font-mono bg-surface-raised px-1 rounded text-foreground">src/core/websocket/</code>.
        Supports exponential backoff, named event listeners, and typed messages.
      </p>

      <div className="space-y-10">

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Connect and listen</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { ws } from "@/core/websocket";

ws.connect("wss://api.example.com/ws", {
  reconnect: { strategy: "exponential", maxAttempts: 10 },
  onStatusChange: (status) => console.log("WS status:", status),
});

// Listen to events — returns unsubscribe fn
const offMsg = ws.on("message", (data) => {
  console.log("Received:", data);
});

const offOpen = ws.on("open", () => console.log("Connected!"));
const offClose = ws.on("close", (event) => console.log("Closed", event));

// Clean up
offMsg();
ws.disconnect();`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Send messages</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// Objects are automatically JSON-serialised
ws.send({ type: "subscribe", channel: "notifications" });
ws.send({ type: "ping" });
ws.send("plain text");

// Check connection status
const status = ws.getStatus();
// "idle" | "connecting" | "connected" | "reconnecting" | "closed"`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Reconnect strategies</h2>
          <div className="space-y-2 text-sm">
            {[
              { strategy: "exponential", desc: "baseDelay × 2ⁿ + ±30% jitter — default, prevents thundering herd" },
              { strategy: "linear", desc: "baseDelay × n — steady linear backoff" },
              { strategy: "none", desc: "No auto-reconnect — you handle it" },
            ].map((s) => (
              <div key={s.strategy} className="flex gap-3 p-3 bg-surface border border-border rounded-lg">
                <code className="text-xs font-mono text-primary-600 w-28 shrink-0">{s.strategy}</code>
                <p className="text-xs text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
          <CodeBlock language="typescript" className="border border-code-border mt-4">
            {`ws.connect(url, { reconnect: false }); // disable reconnect
ws.connect(url, { reconnect: { strategy: "linear", baseDelay: 2000 } });`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">In React</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`useEffect(() => {
  ws.connect("wss://api.example.com/ws");
  const offMsg = ws.on("message", handleMessage);
  return () => {
    offMsg();
    ws.disconnect();
  };
}, []);`}
          </CodeBlock>
        </DocsSection>

        <WorkingExampleCard href="/docs/how-to-websocket" label="src/core/websocket" />
      </div>
    </>
  );
}
