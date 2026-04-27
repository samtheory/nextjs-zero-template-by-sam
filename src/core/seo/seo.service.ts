import type { Metadata } from 'next';
import { generateJsonLd, generateMeta, type JsonLdOptions, type SeoOptions } from './meta.generator';

/**
 * Class-based SEO service for injecting site-wide defaults.
 *
 * @example
 * ```ts
 * // In a shared module:
 * export const seo = new SeoService({ siteName: 'My App', locale: 'en_US' });
 *
 * // In a page:
 * export const metadata = seo.buildMetadata({ title: 'About', description: '...' });
 * ```
 */
export class SeoService {
  private readonly defaults: Partial<SeoOptions>;

  constructor(defaults: Partial<SeoOptions> = {}) {
    this.defaults = defaults;
  }

  buildMetadata(options: SeoOptions): Metadata {
    return generateMeta({ ...this.defaults, ...options });
  }

  /** Create a child SeoService with merged defaults. */
  withDefaults(overrides: Partial<SeoOptions>): SeoService {
    return new SeoService({ ...this.defaults, ...overrides });
  }

  buildJsonLd(options: JsonLdOptions): string {
    return generateJsonLd(options);
  }
}

export const seo = new SeoService();
