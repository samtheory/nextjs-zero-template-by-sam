import Link from "next/link";
import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";

export default function BuildUIDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Architecture</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">How to Build a Reusable UI Component</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        Reusable components live in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">presentation/components/</code>. Use <code className="font-mono bg-surface-raised px-1 rounded text-foreground">cva</code> for variants and <code className="font-mono bg-surface-raised px-1 rounded text-foreground">cn</code> for className merging.
      </p>

      <div className="space-y-10">

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Folder Conventions</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`presentation/components/
├── ui/            ← Primitive building blocks (Button, Input, Badge, Card…)
├── shared/        ← Composite components used across features (DataTable, EmptyState…)
└── layouts/       ← Page-level layout shells (Sidebar, TopNav, PageHeader…)`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">cn Helper — className merging</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// shared/utils/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Combines clsx (conditional classes) + tailwind-merge (removes duplicate Tailwind classes)`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Button with cva Variants</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// presentation/components/ui/Button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";
import type { ButtonHTMLAttributes } from "react";

// 1. Define variants with cva
const buttonVariants = cva(
  // Base classes (always applied)
  "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:   "bg-primary-600 text-white hover:bg-primary-700",
        secondary: "bg-surface border border-border text-foreground hover:bg-surface-raised",
        ghost:     "text-muted hover:text-foreground hover:bg-surface-raised",
        danger:    "bg-error-600 text-white hover:bg-error-700",
      },
      size: {
        sm: "text-xs px-3 py-1.5 h-8",
        md: "text-sm px-4 py-2 h-9",
        lg: "text-base px-6 py-2.5 h-11",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// 2. Merge variant props with HTML button attributes
interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

// 3. Build the component
export function Button({
  variant,
  size,
  isLoading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  );
}

// Usage:
// <Button>Save</Button>
// <Button variant="ghost" size="sm">Cancel</Button>
// <Button variant="danger" isLoading={isPending}>Delete</Button>
// <Button className="w-full">Full width override</Button>`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Input Component</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// presentation/components/ui/Input.tsx
import { cn } from "@/shared/utils/cn";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "px-3 py-2 bg-surface border rounded-lg text-sm text-foreground",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error
            ? "border-error-500 focus:ring-error-500"
            : "border-border",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-error-600">{error}</p>}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Compound Component Pattern</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// presentation/components/ui/Card.tsx
import { cn } from "@/shared/utils/cn";
import type { HTMLAttributes } from "react";

function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-surface border border-border rounded-xl shadow-sm", className)}
      {...props}
    />
  );
}
function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4 border-b border-border", className)} {...props} />;
}
function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}
function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-3 border-t border-border bg-surface-raised rounded-b-xl", className)} {...props} />;
}

// Attach sub-components for a clean API
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card };

// Usage:
// <Card>
//   <Card.Header><h3>Title</h3></Card.Header>
//   <Card.Body>Content</Card.Body>
//   <Card.Footer><Button>Save</Button></Card.Footer>
// </Card>`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-3 pb-2 border-b border-border">Rules</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li>✓ Always use <code className="font-mono bg-surface-raised px-1 rounded text-foreground">cn()</code> for className — enables safe overrides</li>
            <li>✓ Use semantic color tokens (<code className="font-mono bg-surface-raised px-1 rounded text-foreground">bg-surface</code>, <code className="font-mono bg-surface-raised px-1 rounded text-foreground">border-border</code>) not raw colors</li>
            <li>✓ Spread <code className="font-mono bg-surface-raised px-1 rounded text-foreground">{`...props`}</code> last so callers can extend/override</li>
            <li>✓ Extend native HTML element types — always forward all HTML attributes</li>
            <li>✓ Keep components in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">presentation/components/ui/</code> — no business logic</li>
          </ul>
        </DocsSection>

        <DocsSection className="p-4 bg-secondary-50/80 border border-secondary-200 rounded-xl transition-colors duration-200 dark:bg-secondary-950/80 dark:border-secondary-700">
          <p className="text-sm font-semibold text-secondary-700 mb-1 dark:text-secondary-200">Working Example</p>
          <p className="text-xs text-secondary-600 mb-3 dark:text-secondary-300">Open the working example for this topic.</p>
          <Link
            href="/how-to-build-ui"
            className="inline-flex items-center gap-2 rounded-full border border-secondary-300 bg-secondary-100 px-4 py-2 text-xs font-semibold text-secondary-700 transition duration-200 hover:bg-secondary-200 hover:text-secondary-900 dark:border-secondary-700 dark:bg-secondary-900 dark:text-secondary-200 dark:hover:bg-secondary-800 dark:hover:text-secondary-50"
          >
            <span className="inline-flex items-center gap-1">
              <code className="rounded bg-surface-raised px-2 py-0.5 text-[0.7rem] font-mono text-foreground dark:bg-surface dark:text-foreground">src/features/how-to-build-ui</code>
            </span>
            <span>→</span>
          </Link>
        </DocsSection>
      </div>
    </>
  );
}
