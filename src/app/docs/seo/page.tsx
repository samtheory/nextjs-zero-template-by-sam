import { CodeBlock } from "../_components/CodeBlock";
import { DocsSection } from "../_components/DocsSection";
import { WorkingExampleCard } from "../_components/WorkingExampleCard";

export default function SeoDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">Core Services</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">SEO Service</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        Generate Next.js <code className="font-mono bg-surface-raised px-1 rounded text-foreground">Metadata</code> objects
        and JSON-LD structured data from{" "}
        <code className="font-mono bg-surface-raised px-1 rounded text-foreground">src/core/seo/</code>.
      </p>

      <div className="space-y-10">

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Page metadata</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// app/blog/page.tsx
import { generateMeta } from "@/core/seo";

export const metadata = generateMeta({
  title: "Blog | My App",
  description: "Latest articles",
  url: "https://example.com/blog",
  image: "https://example.com/og/blog.png",
  imageAlt: "Blog cover",
  keywords: ["blog", "articles"],
  author: "Alice",
  type: "website",    // "website" | "article" | "profile"
  locale: "en_US",
  noIndex: false,     // true to exclude from search engines
});`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Site-wide defaults</h2>
          <CodeBlock language="typescript" className="border border-code-border">
            {`// lib/seo.ts — create once with your defaults
import { SeoService } from "@/core/seo";

export const seo = new SeoService({
  siteName: "My App",
  locale: "en_US",
  image: "https://example.com/og/default.png",
});

// app/about/page.tsx — override per page
export const metadata = seo.buildMetadata({
  title: "About | My App",
  description: "Learn about us",
});`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">JSON-LD structured data</h2>
          <CodeBlock language="tsx" className="border border-code-border">
            {`// In a Server Component page:
import { generateJsonLd } from "@/core/seo";

export default function BlogPost({ post }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateJsonLd({
            type: "Article",
            data: {
              headline: post.title,
              author: { "@type": "Person", name: post.author },
              datePublished: post.publishedAt,
              image: post.coverImage,
            },
          }),
        }}
      />
      {/* page content */}
    </>
  );
}`}
          </CodeBlock>
        </DocsSection>

        <DocsSection>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">What generateMeta sets</h2>
          <div className="space-y-1.5 text-sm">
            {[
              { tag: "title", desc: "Page title" },
              { tag: "description", desc: "Meta description" },
              { tag: "keywords", desc: "Meta keywords (if provided)" },
              { tag: "robots", desc: "noindex/nofollow (if noIndex: true)" },
              { tag: "og:title / og:description", desc: "Open Graph tags" },
              { tag: "og:image / og:url / og:type", desc: "Open Graph visual data" },
              { tag: "twitter:card / twitter:image", desc: "Twitter card tags" },
            ].map((row) => (
              <div key={row.tag} className="flex gap-3 items-start p-2 rounded-lg border border-border bg-surface">
                <code className="text-xs font-mono text-secondary-600 w-44 shrink-0">{row.tag}</code>
                <p className="text-xs text-muted">{row.desc}</p>
              </div>
            ))}
          </div>
        </DocsSection>

        <WorkingExampleCard href="/how-to-seo" label="src/core/seo" />
      </div>
    </>
  );
}
