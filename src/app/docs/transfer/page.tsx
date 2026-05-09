import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function TransferDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Core Services</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Transfer Service</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        Upload and download utilities in{" "}
        <code className="font-mono bg-surface-raised px-1 rounded text-foreground">src/core/transfer/</code>.
        XHR-based uploads give you real-time progress; downloads work from URLs, Blobs, or raw data.
      </p>

      <div className="space-y-10">

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Upload with progress</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { upload } from "@/core/transfer";

const result = await upload.file(file, "/api/upload", {
  onProgress: (percent, loaded, total) => setProgress(percent),
  fieldName: "avatar",          // default: "file"
  extraFields: { userId: "42" }, // extra form fields
  headers: { Authorization: \`Bearer \${token}\` },
});

// Upload multiple files
const results = await upload.files([file1, file2], "/api/upload", {
  onProgress: (percent) => console.log(percent),
});`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Download</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { download } from "@/core/transfer";

// From a URL (same-origin or CORS-enabled)
download.fromUrl("/exports/report.pdf", "report.pdf");

// From a Blob (e.g. after processing)
download.fromBlob(blob, "avatar.png");

// From data — strings or objects (JSON-serialised)
download.fromData({ users }, "users.json");
download.fromData("id,name\\n1,Alice", "users.csv", "text/csv");`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Progress tracker (low-level)</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { progressTracker } from "@/core/transfer";

// Attach to an XHR instance before sending
progressTracker.attachUpload(xhr, (percent, loaded, total) => {
  setProgress(percent);
});

// Track a streaming fetch response
const blob = await progressTracker.fromResponse(response, (percent) => {
  setProgress(percent);
});`}
          </CodeBlock>
        </DocsSection>

        <WorkingExampleCard href="/docs/how-to-transfer" label="src/core/transfer" />
      </div>
    </>
  );
}
