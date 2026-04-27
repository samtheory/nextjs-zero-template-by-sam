# SEO Service

Generate Next.js `Metadata` objects and JSON-LD structured data.

## Page metadata

```ts
// app/blog/page.tsx
import { generateMeta } from '@/core/seo';

export const metadata = generateMeta({
  title: 'Blog | My App',
  description: 'Latest articles',
  url: 'https://example.com/blog',
  image: 'https://example.com/og/blog.png',
  keywords: ['blog', 'articles'],
  author: 'Alice',
  type: 'website',
});
```

## Site-wide defaults

```ts
// lib/seo.ts
import { SeoService } from '@/core/seo';

export const seo = new SeoService({
  siteName: 'My App',
  locale: 'en_US',
  image: 'https://example.com/og/default.png',
});

// app/about/page.tsx
export const metadata = seo.buildMetadata({
  title: 'About | My App',
  description: 'Learn about us',
});
```

## JSON-LD structured data

```tsx
import { generateJsonLd } from '@/core/seo';

export default function BlogPost({ post }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateJsonLd({
            type: 'Article',
            data: {
              headline: post.title,
              author: { '@type': 'Person', name: post.author },
              datePublished: post.publishedAt,
            },
          }),
        }}
      />
      {/* ... */}
    </>
  );
}
```
