import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function ZodDoc() {
  return (
    <>
      <div className="mb-2">
        <span className="text-xs text-muted">Fundamentals</span>
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Zod</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        TypeScript-first schema declaration and validation library. Define your data shape once — get validation, parsing, and TypeScript types automatically.
      </p>

      <div className="space-y-10">

        {/* Purpose */}
        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">Purpose in This Project</h2>
          <ul className="space-y-1.5 text-sm text-muted">
            <li>✓ Validate API request/response shapes at runtime</li>
            <li>✓ Validate form inputs (paired with React Hook Form)</li>
            <li>✓ Replace manual TypeScript types with inferred schemas</li>
            <li>✓ Transform and sanitize data at the boundaries of your app</li>
          </ul>
        </DocsSection>

        {/* Where to use */}
        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">Where to Use</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { loc: "features/*/validators/", use: "Form and payload schemas" },
              { loc: "features/*/models/", use: "DTO shape validation" },
              { loc: "core/services/config/", use: "Environment variable validation" },
              { loc: "shared/validators/", use: "Shared/reusable schemas" },
            ].map((r) => (
              <div key={r.loc} className="p-3 bg-surface border border-border rounded-lg">
                <code className="text-xs font-mono text-primary-400">{r.loc}</code>
                <p className="text-muted mt-1">{r.use}</p>
              </div>
            ))}
          </div>
        </DocsSection>

        {/* Key concepts */}
        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Key Concepts & API</h2>

          <h3 className="text-sm font-semibold text-foreground mb-2">1. Define a schema</h3>
          <CodeBlock language="typescript" className="border border-code-border mb-6">
            {`import { z } from "zod";

// Object schema
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150).optional(),
  role: z.enum(["admin", "user", "guest"]),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
});

// Infer the TypeScript type — no duplication!
export type User = z.infer<typeof userSchema>;`}
          </CodeBlock>

          <h3 className="text-sm font-semibold text-foreground mb-2">2. Parse vs SafeParse</h3>
          <CodeBlock language="typescript" className="border border-code-border mb-6">
            {`// .parse() — throws ZodError on failure
const user = userSchema.parse(rawData);

// .safeParse() — returns { success, data } or { success, error }
const result = userSchema.safeParse(rawData);
if (!result.success) {
  console.error(result.error.format());
  return;
}
console.log(result.data); // fully typed User`}
          </CodeBlock>

          <h3 className="text-sm font-semibold text-foreground mb-2">3. Common validators</h3>
          <CodeBlock language="typescript" className="border border-code-border mb-6">
            {`z.string()
  .min(1, "Required")
  .max(255)
  .email()
  .url()
  .regex(/^[a-z]+$/)
  .trim()           // transforms: removes whitespace
  .toLowerCase()    // transforms: lowercases

z.number().positive().int().min(0).max(100)
z.boolean()
z.date()
z.enum(["a", "b", "c"])
z.union([z.string(), z.number()])
z.literal("admin")
z.nullable(z.string())   // string | null
z.optional(z.string())   // string | undefined`}
          </CodeBlock>

          <h3 className="text-sm font-semibold text-foreground mb-2">4. Transform & Pipe</h3>
          <CodeBlock language="typescript" className="border border-code-border mb-6">
            {`// Transform: parse then transform the value
const priceSchema = z.string()
  .transform((val) => parseFloat(val))
  .pipe(z.number().positive());

// Refine: custom async validation
const usernameSchema = z.string().refine(
  async (val) => !(await isUsernameTaken(val)),
  { message: "Username already taken" }
);`}
          </CodeBlock>

          <h3 className="text-sm font-semibold text-foreground mb-2">5. Partial, Pick, Omit</h3>
          <CodeBlock language="typescript" className="border border-code-border mb-6">
            {`// For update payloads — all fields optional
const updateUserSchema = userSchema.partial();

// Only specific fields
const createUserSchema = userSchema.pick({ name: true, email: true });

// Exclude fields
const publicUserSchema = userSchema.omit({ createdAt: true });

// Extend
const adminSchema = userSchema.extend({ permissions: z.array(z.string()) });`}
          </CodeBlock>

          <h3 className="text-sm font-semibold text-foreground mb-2">6. Error formatting</h3>
          <CodeBlock language="typescript" className="border border-code-border">
            {`const result = userSchema.safeParse(bad);
if (!result.success) {
  // Flat list of errors
  result.error.issues.forEach((issue) => {
    console.log(issue.path.join("."), issue.message);
  });

  // Nested format (useful for forms)
  const formatted = result.error.format();
  console.log(formatted.email?._errors); // ["Invalid email"]
}`}
          </CodeBlock>
        </DocsSection>

        {/* Best practices */}
        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">Best Practices</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li>✓ Define schemas in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">features/[name]/validators/[name].schema.ts</code></li>
            <li>✓ Always use <code className="font-mono bg-surface-raised px-1 rounded text-foreground">z.infer&lt;&gt;</code> for types — never write them manually alongside a schema</li>
             {/* eslint-disable-next-line react/no-unescaped-entities */}
            <li>✓ Use <code className="font-mono bg-surface-raised px-1 rounded text-foreground">.safeParse()</code> at API boundaries (returns errors, doesn't throw)</li>
            <li>✓ Use <code className="font-mono bg-surface-raised px-1 rounded text-foreground">.parse()</code> when you trust the data and want to throw on failure</li>
            <li>✓ Colocate update/create schemas with the base schema using <code className="font-mono bg-surface-raised px-1 rounded text-foreground">.partial()</code> / <code className="font-mono bg-surface-raised px-1 rounded text-foreground">.omit()</code></li>
            <li>✗ Never duplicate a Zod type as a manual TypeScript interface</li>
          </ul>
        </DocsSection>

        {/* Feature link */}
        <WorkingExampleCard href="/how-to-zod" label="src/features/how-to-zod" />
      </div>
    </>
  );
}
