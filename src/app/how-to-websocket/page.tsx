"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

type WsStatus = "idle" | "connecting" | "connected" | "reconnecting" | "closed";
type Strategy = "exponential" | "linear" | "none";

export default function HowToWebSocket() {
  const [status, setStatus] = useState<WsStatus>("idle");
  const [messages, setMessages] = useState<{ text: string; dir: "in" | "out"; time: string }[]>([]);
  const [strategy, setStrategy] = useState<Strategy>("exponential");
  const [messageText, setMessageText] = useState("{ \"type\": \"ping\" }");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(0);

  const addMessage = (text: string, dir: "in" | "out") => {
    setMessages((prev) => [
      { text, dir, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 14),
    ]);
  };

  const getReconnectDelay = (attempt: number) => {
    if (strategy === "exponential") return Math.min(1000 * Math.pow(2, attempt), 30000) * (0.7 + Math.random() * 0.6);
    if (strategy === "linear") return 2000 * (attempt + 1);
    return null;
  };

  const connect = () => {
    if (wsRef.current) return;
    setStatus("connecting");
    addMessage("Connecting to wss://echo.websocket.org…", "in");

    const ws = new WebSocket("wss://echo.websocket.org");
    wsRef.current = ws;

    ws.onopen = () => {
      attemptRef.current = 0;
      setStatus("connected");
      addMessage("Connected!", "in");
    };

    ws.onmessage = (e) => {
      addMessage(typeof e.data === "string" ? e.data : "[binary]", "in");
    };

    ws.onclose = (e) => {
      wsRef.current = null;
      if (e.wasClean) {
        setStatus("closed");
        addMessage("Connection closed.", "in");
        return;
      }
      const delay = getReconnectDelay(attemptRef.current);
      if (delay !== null && strategy !== "none") {
        setStatus("reconnecting");
        addMessage(`Connection lost. Reconnecting in ${Math.round(delay / 1000)}s… (attempt ${attemptRef.current + 1})`, "in");
        attemptRef.current++;
        reconnectRef.current = setTimeout(connect, delay);
      } else {
        setStatus("closed");
        addMessage("Connection closed. Not reconnecting.", "in");
      }
    };

    ws.onerror = () => {
      addMessage("WebSocket error.", "in");
    };
  };

  const disconnect = () => {
    if (reconnectRef.current) clearTimeout(reconnectRef.current);
    if (wsRef.current) {
      wsRef.current.close(1000, "Manual disconnect");
      wsRef.current = null;
    }
    setStatus("idle");
  };

  const sendMessage = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(messageText);
    addMessage(messageText, "out");
  };

  useEffect(() => () => disconnect(), []);

  const statusBadge: Record<WsStatus, string> = {
    idle: "bg-surface-raised text-muted",
    connecting: "bg-warning-100 text-warning-700",
    connected: "bg-success-100 text-success-700",
    reconnecting: "bg-info-100 text-info-700",
    closed: "bg-error-100 text-error-600",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/websocket" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / websocket
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">WebSocket Service</h1>
        <p className="text-sm text-muted mb-10">Real-time connection with auto-reconnect. Uses the public echo server.</p>

        <div className="space-y-8">

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Connect</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[status]}`}>{status}</span>
                <div className="flex gap-2">
                  <button
                    onClick={connect}
                    disabled={status !== "idle" && status !== "closed"}
                    className="px-3 py-2 rounded-xl bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 disabled:opacity-40 transition"
                  >
                    Connect
                  </button>
                  <button
                    onClick={disconnect}
                    disabled={status === "idle"}
                    className="px-3 py-2 rounded-xl border border-error-300 text-error-500 text-xs font-semibold hover:bg-error-50 disabled:opacity-40 transition"
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted">Reconnect strategy:</label>
                <div className="flex gap-2">
                  {(["exponential", "linear", "none"] as Strategy[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStrategy(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${strategy === s ? "bg-primary-500 text-white" : "border border-border bg-surface-raised text-muted hover:text-foreground"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted font-mono">ws.connect(url, {"{ reconnect: { strategy } }"})</p>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Send message</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
              <input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface-raised text-sm font-mono text-foreground outline-none focus:ring-2 focus:ring-secondary-400"
              />
              <button
                onClick={sendMessage}
                disabled={status !== "connected"}
                className="px-4 py-2 rounded-xl bg-secondary-500 text-white text-sm font-semibold hover:bg-secondary-600 disabled:opacity-40 transition"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-xs text-muted font-mono">ws.send(data) — echo server reflects it back</p>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Message log</p>
            <div className="p-4 rounded-2xl border border-border bg-surface min-h-32 space-y-1.5">
              {messages.length === 0 && <p className="text-xs text-muted italic">No messages yet.</p>}
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 text-xs ${msg.dir === "out" ? "flex-row-reverse" : ""}`}>
                  <span className="text-muted font-mono shrink-0">{msg.time}</span>
                  <span className={`px-2 py-0.5 rounded font-mono break-all ${msg.dir === "out" ? "bg-primary-100 text-primary-700" : "bg-surface-raised text-muted"}`}>{msg.text}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
