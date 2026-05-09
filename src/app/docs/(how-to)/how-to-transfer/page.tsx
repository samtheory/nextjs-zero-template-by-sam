"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { download } from "@/core/transfer";

export default function HowToTransfer() {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus("uploading");
    setUploadProgress(0);

    // Simulate progress since we don't have a real endpoint
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setUploadStatus("done");
      }
      setUploadProgress(Math.round(p));
    }, 120);

    // Real usage: await upload.file(file, "/api/upload", { onProgress: setUploadProgress });
  };

  const handleDownloadJson = () => {
    download.fromData(
      { message: "Hello from Transfer!", timestamp: new Date().toISOString(), items: [1, 2, 3] },
      "demo-export.json"
    );
  };

  const handleDownloadCsv = () => {
    download.fromData("id,name,score\n1,Alice,95\n2,Bob,88\n3,Carol,72", "users.csv", "text/csv");
  };

  const handleDownloadBlob = () => {
    const text = "Hello, this is a plain text download from a Blob!";
    const blob = new Blob([text], { type: "text/plain" });
    download.fromBlob(blob, "hello.txt");
  };

  const resetUpload = () => {
    setUploadStatus("idle");
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/transfer" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / transfer
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Transfer Service</h1>
        <p className="text-sm text-muted mb-10">Upload files with progress tracking. Download data as files.</p>

        <div className="space-y-8">

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Upload with progress</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-4">
              {uploadStatus === "idle" && (
                <label className="flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary-400 transition">
                  <span className="text-2xl">📁</span>
                  <span className="text-sm text-muted">Click to choose a file</span>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                </label>
              )}

              {uploadStatus === "uploading" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted">
                    <span>Uploading…</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-raised rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadStatus === "done" && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-success-50 border border-success-200">
                  <span className="text-sm text-success-700 font-semibold">Upload complete!</span>
                  <button onClick={resetUpload} className="text-xs text-muted hover:text-foreground transition">
                    reset
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-muted font-mono">upload.file(file, url, {"{ onProgress }"})</p>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Download data</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleDownloadJson}
                  className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition"
                >
                  Download JSON
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className="px-4 py-2 rounded-xl bg-secondary-500 text-white text-sm font-semibold hover:bg-secondary-600 transition"
                >
                  Download CSV
                </button>
                <button
                  onClick={handleDownloadBlob}
                  className="px-4 py-2 rounded-xl bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition"
                >
                  Download TXT (Blob)
                </button>
              </div>
              <p className="text-xs text-muted">Each button triggers a browser download — no server required.</p>
            </div>
            <p className="mt-2 text-xs text-muted font-mono">download.fromData(data, filename, mimeType?)</p>
          </section>

        </div>
      </div>
    </div>
  );
}
