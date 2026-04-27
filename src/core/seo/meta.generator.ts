import type { Metadata } from 'next';

export interface SeoOptions {
  title: string;
  description: string;
  url?: string;
  image?: string;
  imageAlt?: string;
  siteName?: string;
  locale?: string;
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
  keywords?: string[];
  author?: string;
  publishedAt?: string;
  modifiedAt?: string;
}

export interface JsonLdOptions {
  type: string;
  data: Record<string, unknown>;
}

/**
 * Build a Next.js `Metadata` object for a page.
 *
 * @example
 * ```ts
 * export const metadata = generateMeta({
 *   title: 'Blog | My App',
 *   description: 'Latest articles',
 *   url: 'https://example.com/blog',
 * });
 * ```
 */
export function generateMeta(options: SeoOptions): Metadata {
  const {
    title,
    description,
    url,
    image,
    imageAlt = title,
    siteName,
    locale = 'en_US',
    type = 'website',
    noIndex = false,
    keywords,
    author,
    publishedAt,
    modifiedAt,
  } = options;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    ...(author ? { authors: [{ name: author }] } : {}),
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      ...(url ? { url } : {}),
      ...(siteName ? { siteName } : {}),
      locale,
      type,
      ...(image ? { images: [{ url: image, alt: imageAlt }] } : {}),
      ...(publishedAt ? { publishedTime: publishedAt } : {}),
      ...(modifiedAt ? { modifiedTime: modifiedAt } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/**
 * Generate a JSON-LD script tag string for structured data.
 *
 * @example
 * ```tsx
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: generateJsonLd({ type: 'Article', data: { name: 'Title' } }) }}
 * />
 * ```
 */
export function generateJsonLd({ type, data }: JsonLdOptions): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@type': type, ...data });
}
