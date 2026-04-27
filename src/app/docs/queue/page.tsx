import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function QueueDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Core Services</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Queue Service</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        In-browser background task queue in{" "}
        <code className="font-mono bg-surface-raised px-1 rounded text-foreground">src/core/queue/</code>.
        Runs heavy work off the main UI thread with concurrency control and automatic retry.
      </p>

      <div className="space-y-10">

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">When to use</h2>
          <ul className="space-y-2 text-sm text-muted list-disc list-inside">
            <li>Bulk operations that would freeze the UI if run synchronously</li>
            <li>File uploads with progress tracking</li>
            <li>Background data sync after going back online</li>
            <li>Image processing / resizing before upload</li>
          </ul>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Basic usage</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { queue } from "@/core/queue";

// 1. Register a handler (once, at bootstrap)
queue.process("sync-courses", async (job) => {
  await syncCourses(job.data.userId);
});

// 2. Enqueue jobs anywhere in your app
queue.add("sync-courses", { userId: "42" });

// 3. Inspect state
const job = queue.getJob(id);
const all = queue.getJobs("sync-courses");
queue.clear("sync-courses"); // remove non-running jobs`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Pre-built workers</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { registerSyncWorker, registerUploadWorker, queue } from "@/core/queue";

// Register at app startup (e.g. in CoreProvider):
registerSyncWorker();
registerUploadWorker();

// Enqueue an upload with progress
queue.add("file-upload", {
  file: myFile,
  endpoint: "/api/upload",
  onProgress: (percent) => setProgress(percent),
});`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Custom queue with options</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { QueueService } from "@/core/queue";

// Create a dedicated queue for image processing
const imageQueue = new QueueService({
  concurrency: 2,   // run up to 2 jobs in parallel
  maxRetries: 5,    // retry up to 5 times before marking as failed
});

imageQueue.process("resize-image", async (job) => {
  await resizeImage(job.data.imageId);
});

imageQueue.add("resize-image", { imageId: "img_123" });`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Job lifecycle</h2>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            {["pending", "running", "done", "failed"].map((s, i, arr) => (
              <span key={s} className="flex items-center gap-2">
                <code className="bg-surface-raised px-2 py-1 rounded-lg text-foreground font-mono text-xs">{s}</code>
                {i < arr.length - 1 && <span className="text-muted">→</span>}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted mt-3">
            On failure, job goes back to <code className="bg-surface-raised px-1 rounded">pending</code> until{" "}
            <code className="bg-surface-raised px-1 rounded">maxRetries</code> is exhausted, then becomes{" "}
            <code className="bg-surface-raised px-1 rounded">failed</code>.
          </p>
        </DocsSection>

        <WorkingExampleCard href="/how-to-queue" label="src/core/queue" />
      </div>
    </>
  );
}
