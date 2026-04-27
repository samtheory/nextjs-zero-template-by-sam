import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function CryptoDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Core Services</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Crypto Service</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        AES-256-GCM encryption and PBKDF2 password hashing in{" "}
        <code className="font-mono bg-surface-raised px-1 rounded text-foreground">src/core/crypto/</code>.
        Uses the native Web Crypto API — no external dependencies.
      </p>

      <div className="space-y-10">

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Encryption (AES-256-GCM)</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { encryption } from "@/core/crypto";

// Generate a key
const key = await encryption.generateKey();

// Encrypt
const ciphertext = await encryption.encrypt("sensitive data", key);

// Decrypt
const plaintext = await encryption.decrypt(ciphertext, key);

// Persist the key (e.g. in localStorage or env var)
const exported = await encryption.exportKey(key);  // base64 string
const imported = await encryption.importKey(exported);`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Hashing (SHA-256 / SHA-512)</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { hashService } from "@/core/crypto";

const digest256 = await hashService.sha256("hello");
const digest512 = await hashService.sha512("hello");

// Use for: content fingerprinting, cache busting, deduplication`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Password hashing (PBKDF2)</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { hashService } from "@/core/crypto";

// Hash a password — always store { hash, salt }, never the plaintext
const { hash, salt } = await hashService.hashPassword("mypassword");

// Verify later
const isValid = await hashService.verifyPassword("mypassword", hash, salt);`}
          </CodeBlock>
          <div className="mt-4 p-3 rounded-xl border border-warning-200 bg-warning-50 text-xs text-warning-700">
            <strong>Security note:</strong> Never store plaintext passwords. Always persist both{" "}
            <code className="bg-warning-100 px-1 rounded">hash</code> and{" "}
            <code className="bg-warning-100 px-1 rounded">salt</code> in your database.
          </div>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Browser support</h2>
          <p className="text-sm text-muted">
            The Web Crypto API is available in all modern browsers and Node.js 16+. It requires a secure context (HTTPS or localhost).
          </p>
        </DocsSection>

        <WorkingExampleCard href="/how-to-crypto" label="src/core/crypto" />
      </div>
    </>
  );
}
