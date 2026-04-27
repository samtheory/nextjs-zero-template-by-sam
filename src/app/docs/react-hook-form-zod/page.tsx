import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function ReactHookFormZodDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Fundamentals</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">React Hook Form + Zod</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        The standard pattern for forms in this project: React Hook Form manages form state and submission, Zod handles validation. Zero unnecessary re-renders.
      </p>

      <div className="space-y-10">
        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">Purpose</h2>
          <ul className="space-y-1.5 text-sm text-muted">
            <li>✓ Type-safe forms with schema-driven validation</li>
            <li>✓ Automatic error messages from Zod without extra code</li>
            <li>✓ Uncontrolled inputs = minimal re-renders = great performance</li>
            <li>✓ Native integration with any UI input component</li>
          </ul>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">1. Define the Schema</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// features/auth/validators/login.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

// Infer the type — use this as the form's type
export type LoginSchema = z.infer<typeof loginSchema>;`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">2. Build the Form Component</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "../validators/login.schema";
import { useLogin } from "../api/auth.api";

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,           // manually set server errors
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = (data: LoginSchema) => {
    login(data, {
      onError: (err) => {
        // Map server error back to a field
        setError("email", { message: err.message });
      },
      onSuccess: () => reset(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-error-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Password</label>
        <input
          type="password"
          {...register("password")}
          className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-error-600">{errors.password.message}</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" {...register("rememberMe")} />
        Remember me
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg
                   font-medium transition-colors disabled:opacity-50"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Key useForm Options</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`const form = useForm<MySchema>({
  resolver: zodResolver(mySchema),    // connect Zod
  defaultValues: { name: "" },         // initial values
  mode: "onBlur",                      // validate on blur (default: onSubmit)
  // mode options: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all"
});

// Destructure what you need:
const {
  register,          // connect native inputs
  control,           // for Controller (custom inputs)
  handleSubmit,      // wraps your submit fn
  formState: {
    errors,          // ZodError messages per field
    isSubmitting,    // true while submit fn is running
    isDirty,         // true if any field changed
    isValid,         // true if no errors
  },
  watch,             // subscribe to field value reactively
  setValue,          // programmatically set a value
  setError,          // set a server-side error
  reset,             // reset to default values
  getValues,         // get current values without subscribe
} = form;`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Using Controller for Custom Inputs</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`import { Controller } from "react-hook-form";

// For inputs that don't support ref (like custom selects, date pickers)
<Controller
  name="role"
  control={control}
  render={({ field, fieldState }) => (
    <SelectInput
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  )}
/>`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">Best Practices</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li>✓ Schema lives in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">validators/[name].schema.ts</code></li>
            <li>✓ Always pass <code className="font-mono bg-surface-raised px-1 rounded text-foreground">resolver: zodResolver(schema)</code></li>
            <li>✓ Always provide <code className="font-mono bg-surface-raised px-1 rounded text-foreground">defaultValues</code> — prevents uncontrolled/controlled warnings</li>
            <li>✓ Use <code className="font-mono bg-surface-raised px-1 rounded text-foreground">noValidate</code> on the form tag — Zod handles all validation</li>
            <li>✓ Use <code className="font-mono bg-surface-raised px-1 rounded text-foreground">setError</code> to attach server errors back to specific fields</li>
            <li>✗ Never use both <code className="font-mono bg-surface-raised px-1 rounded text-foreground">register</code> AND controlled <code className="font-mono bg-surface-raised px-1 rounded text-foreground">value/onChange</code> on the same input</li>
          </ul>
        </DocsSection>

        <WorkingExampleCard href="/how-to-react-hook-form" label="src/features/how-to-react-hook-form" />
      </div>
    </>
  );
}
