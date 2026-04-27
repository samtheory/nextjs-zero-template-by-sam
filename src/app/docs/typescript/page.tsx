import Link from "next/link";
import { CodeBlock } from "../_components/CodeBlock";

export default function TypeScriptDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Fundamentals</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">TypeScript Concepts</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        The most useful TypeScript patterns you'll use daily in this project. Focus on utility types, generics, and type narrowing.
      </p>

      <div className="space-y-10">

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Utility Types</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`type User = { id: string; name: string; email: string; role: "admin" | "user" };

// Partial — all fields optional (useful for update payloads)
type UpdateUser = Partial<User>;  // { id?: string; name?: string; ... }

// Required — all fields required (opposite of Partial)
type StrictUser = Required<User>;

// Pick — only selected fields
type UserPreview = Pick<User, "id" | "name">;  // { id: string; name: string }

// Omit — all fields except selected
type PublicUser = Omit<User, "email">;  // { id, name, role }

// Record — object with known key type and value type
type RoleMap = Record<User["role"], string[]>;  // { admin: string[]; user: string[] }

// Readonly — prevent mutation
type ImmutableUser = Readonly<User>;

// ReturnType — infer return type of a function
function getUser() { return { id: "1", name: "Sam" }; }
type UserReturn = ReturnType<typeof getUser>;  // { id: string; name: string }

// Parameters — infer parameter types of a function
function createPost(title: string, body: string) {}
type CreatePostArgs = Parameters<typeof createPost>;  // [string, string]

// Awaited — unwrap a Promise type
type ApiData = Awaited<ReturnType<typeof fetchUser>>;`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Extract & Exclude (Union manipulation)</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`type Status = "pending" | "active" | "deleted" | "archived";

// Extract — keep only matching union members
type ActiveStatuses = Extract<Status, "pending" | "active">;  // "pending" | "active"

// Exclude — remove matching union members
type VisibleStatuses = Exclude<Status, "deleted">;  // "pending" | "active" | "archived"

// NonNullable — remove null and undefined
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;  // string`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Generics</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// Generic API response wrapper
interface ApiResponse<T> {
  data: T;
  meta: { total: number; page: number };
  success: boolean;
}

// Generic hook return pattern (used in custom hooks)
interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

// Constrained generics
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const name = getProperty(user, "name");  // TypeScript knows this is string

// Generic with default
interface Pagination<T = unknown> {
  items: T[];
  total: number;
}`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Type Guards & Narrowing</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// Type guard function
function isApiError(error: unknown): error is { message: string; code: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error
  );
}

// Usage
catch (error) {
  if (isApiError(error)) {
    console.log(error.code, error.message);  // narrowed type here
  }
}

// Discriminated union
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {   // TypeScript narrows in each branch
    case "circle": return Math.PI * shape.radius ** 2;
    case "rect":   return shape.width * shape.height;
  }
}`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Template Literal Types</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`type EventName = "click" | "focus" | "blur";
type HandlerName = \`on\${Capitalize<EventName>}\`;
// "onClick" | "onFocus" | "onBlur"

// Useful for query keys pattern
type CollectionName = "posts" | "users" | "comments";
type QueryKey = \`\${CollectionName}:list\` | \`\${CollectionName}:detail\`;`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">as const & satisfies</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// as const — makes type literal (narrow), prevents widening
const ROLES = ["admin", "user", "guest"] as const;
type Role = typeof ROLES[number];  // "admin" | "user" | "guest"

// satisfies — validate shape while keeping literal types
const config = {
  timeout: 5000,
  retries: 3,
} satisfies Partial<AppConfig>;
// config.timeout is number (not narrowed away), but shape is validated`}
          </CodeBlock>
        </section>

        <section className="p-4 bg-accent-50 border border-accent-200 rounded-xl">
          <p className="text-sm font-semibold text-accent-700 mb-1">Working Example</p>
          <p className="text-xs text-accent-600 mb-3">Practical TypeScript patterns applied throughout the feature structure.</p>
          <Link href="/how-to-typescript" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-600 hover:text-accent-800">
            <code className="bg-accent-100 px-1.5 py-0.5 rounded">src/features/how-to-typescript</code>
            <span>→</span>
          </Link>
        </section>
      </div>
    </>
  );
}
