import { BaseDetector, AnimeData } from './base';

/**
 * Generic detector for unknown/unsupported streaming services
 * Falls back to common patterns found on most websites
 */
export class GenericDetector extends BaseDetector {
  detect(): AnimeData | null {
    try {
      let title: string | undefined;
      let episode: number | undefined;

      // Try Open Graph meta tags (most common standard)
      title = this.extractFromMeta('og:title');
      if (!title) {
        title = this.extractFromMeta('title');
      }
      if (!title) {
        title = this.extractFromMeta('description');
      }

      // Try to extract from page title
      if (!title) {
        const pageTitle = document.title;
        if (pageTitle) {
          // Remove common suffixes like " - Site Name" or " | Service"
          title = pageTitle.split(/[-|]/)[0].trim();
        }
      }

      // Extract episode number from various sources
      episode = this.extractEpisodeNumber();

      return title ? { title, episode } : null;
    } catch {
      return null;
    }
  }

  private extractFromMeta(property: string): string | undefined {
    let selector = `meta[property="${property}"]`;
    let element = document.querySelector(selector);

    if (!element) {
      selector = `meta[name="${property}"]`;
      element = document.querySelector(selector);
    }

    const content = element?.getAttribute('content');
    if (!content) return undefined;

    // Clean up common patterns
    let cleaned = content
      .split(/[-|]/)[0] // Take first part before dash or pipe
      .trim();

    // Remove common suffixes
    cleaned = cleaned
      .replace(/\s*(episode|ep|e)\s*\d+/i, '')
      .replace(/\s*\|\s*.*$/, '')
      .trim();

    return cleaned || undefined;
  }

  private extractEpisodeNumber(): number | undefined {
    // Check page title first
    const titleMatch = document.title.match(/[Ee]pisode\s*(\d+)|[Ee]p\.?\s*(\d+)|[Ee](\d+)/);
    if (titleMatch) {
      return parseInt(titleMatch[1] || titleMatch[2] || titleMatch[3]);
    }

    // Check meta description
    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
    if (metaDesc) {
      const descMatch = metaDesc.match(/[Ee]pisode\s*(\d+)|[Ee]p\.?\s*(\d+)/);
      if (descMatch) {
        return parseInt(descMatch[1] || descMatch[2]);
      }
    }

    // Check URL for episode patterns
    const urlMatch = window.location.pathname.match(/episode[/-]?(\d+)|ep[/-]?(\d+)/i);
    if (urlMatch) {
      return parseInt(urlMatch[1] || urlMatch[2]);
    }

    // Check visible page content (h1, h2, etc.)
    const headings = document.querySelectorAll('h1, h2, h3');
    for (const heading of headings) {
      const headingMatch = heading.textContent?.match(
        /[Ee]pisode\s*(\d+)|[Ee]p\.?\s*(\d+)|[Ee](\d+)/,
      );
      if (headingMatch) {
        return parseInt(headingMatch[1] || headingMatch[2] || headingMatch[3]);
      }
    }

    return undefined;
  }
}
