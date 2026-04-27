import Link from "next/link";
import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";

export default function FormValidationDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Best Practices</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Form Validation &amp; Error Handling</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        How to validate forms, handle server errors, and give users clear feedback — using React Hook Form, Zod, and the error-mapper service.
      </p>

      <div className="space-y-10">

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Validation Layers</h2>
          <div className="space-y-2 text-sm">
            {[
              { layer: "1. Client schema", tool: "Zod", when: "On blur / submit — instant feedback" },
              { layer: "2. Form state", tool: "React Hook Form", when: "Tracks touched, dirty, invalid fields" },
              { layer: "3. Server error mapping", tool: "error-mapper service", when: "Maps HTTP error codes to user messages" },
              { layer: "4. Field-level server errors", tool: "setError()", when: "Attaches server response errors to specific fields" },
            ].map((r) => (
              <div key={r.layer} className="flex gap-3 p-3 bg-surface border border-border rounded-lg items-start">
                <span className="text-xs font-semibold text-primary-600 w-40 flex-shrink-0">{r.layer}</span>
                <div>
                  <code className="text-xs font-mono text-foreground">{r.tool}</code>
                  <p className="text-xs text-muted mt-0.5">{r.when}</p>
                </div>
              </div>
            ))}
          </div>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Complete Form with Error Handling</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await loginUser(data);
    } catch (err) {
      // Map known server errors to specific fields:
      if (err instanceof ApiError) {
        if (err.code === "INVALID_CREDENTIALS") {
          setError("email", { message: "Email or password is incorrect" });
          setError("password", { message: " " }); // highlight without text
        } else if (err.code === "ACCOUNT_LOCKED") {
          setError("root", { message: "Account locked. Contact support." });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Root-level error (not tied to a field) */}
      {errors.root && (
        <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-700">
          {errors.root.message}
        </div>
      )}

      <div>
        <input type="email" {...register("email")} placeholder="Email" />
        {errors.email && <p className="text-xs text-error-600">{errors.email.message}</p>}
      </div>

      <div>
        <input type="password" {...register("password")} placeholder="Password" />
        {errors.password && <p className="text-xs text-error-600">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Error Mapper Service</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// core/services/error-mapper maps HTTP/PocketBase errors to domain errors.
// The httpClient interceptor applies this automatically.
// You can also use it manually:

import { errorMapper } from "@/core/services/error-mapper";

try {
  await createPost(payload);
} catch (raw) {
  const err = errorMapper.map(raw);
  // err.message — user-readable message
  // err.code    — machine-readable code ("VALIDATION_ERROR", "NOT_FOUND", etc.)
  // err.fields  — per-field errors (from PocketBase validation failures)

  // Map field errors to RHF:
  if (err.fields) {
    for (const [field, message] of Object.entries(err.fields)) {
      setError(field as keyof FormData, { message });
    }
  }
}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">UX Patterns</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// 1. Show errors only after user has touched the field
//    RHF does this by default with mode: "onBlur"

// 2. Disable submit while pending — prevent double submission
<button disabled={isSubmitting || isPending}>Submit</button>

// 3. Reset form after successful submission
const { reset } = useForm(...);
mutate(data, { onSuccess: () => reset() });

// 4. Validate on change for immediate feedback (use sparingly)
const form = useForm({ mode: "onChange" });

// 5. Watch a field value to conditionally show/hide fields
const role = form.watch("role");
{role === "admin" && <input {...register("adminCode")} />}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection className="p-4 bg-secondary-50/80 border border-secondary-200 rounded-xl transition-colors duration-200 dark:bg-secondary-950/80 dark:border-secondary-700">
          <p className="text-sm font-semibold text-secondary-700 mb-1 dark:text-secondary-200">Working Example</p>
          <p className="text-xs text-secondary-600 mb-3 dark:text-secondary-300">Open the working example for this topic.</p>
          <Link
            href="/how-to-form-validation"
            className="inline-flex items-center gap-2 rounded-full border border-secondary-300 bg-secondary-100 px-4 py-2 text-xs font-semibold text-secondary-700 transition duration-200 hover:bg-secondary-200 hover:text-secondary-900 dark:border-secondary-700 dark:bg-secondary-900 dark:text-secondary-200 dark:hover:bg-secondary-800 dark:hover:text-secondary-50"
          >
            <span className="inline-flex items-center gap-1">
              <code className="rounded bg-surface-raised px-2 py-0.5 text-[0.7rem] font-mono text-foreground dark:bg-surface dark:text-foreground">src/features/how-to-form-validation</code>
            </span>
            <span>→</span>
          </Link>
        </DocsSection>
      </div>
    </>
  );
}
