import { BaseDetector, AnimeData } from '../base';

/**
 * Detector for Crunchyroll streaming service
 * Extracts anime title and episode number from Crunchyroll pages
 */
export class CrunchyrollDetector extends BaseDetector {
  canHandle(): boolean {
    return window.location.hostname.includes('crunchyroll.com');
  }

  detect(): AnimeData | null {
    try {
      let title: string | undefined;
      let episode: number | undefined;

      // Layer 1: Extract from Open Graph meta tag
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
      if (ogTitle) {
        const parts = ogTitle.split('|');
        if (parts.length > 0) {
          const firstPart = parts[0].trim();
          const titleMatch = firstPart.match(/^([^:]+)/);
          if (titleMatch) {
            title = titleMatch[1].trim();
          }
        }

        if (parts.length > 1) {
          const episodePart = parts[1];
          const episodeMatch = episodePart.match(/E(\d+)/i);
          if (episodeMatch) {
            episode = parseInt(episodeMatch[1]);
          }
        }
      }

      // Layer 2: Extract from DOM selectors
      if (!title) {
        const selectors = [
          '[data-testid="episodeTitle"]',
          '[class*="EpisodeTitle"]',
          'h1',
          '.erc-heading-h1',
          '[class*="SeriesTitle"]',
        ];

        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) {
            title = element.textContent?.trim();
            if (title) break;
          }
        }
      }

      // Layer 3: Extract from URL
      if (!title) {
        const urlMatch = window.location.pathname.match(/watch\/([^/]+)/);
        if (urlMatch) {
          title = decodeURIComponent(urlMatch[1]).replace(/-/g, ' ');
        }
      }

      // Extract episode number from DOM if not found yet
      if (!episode) {
        const episodeSelectors = [
          '[data-testid="episodeNumber"]',
          '[class*="episodeNumber"]',
          '[class*="EpisodeNumber"]',
        ];

        for (const selector of episodeSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            const episodeText = element.textContent?.match(/\d+/);
            if (episodeText) {
              episode = parseInt(episodeText[0]);
              break;
            }
          }
        }
      }

      // Extract episode number from URL if not found yet
      if (!episode) {
        const urlEpisodeMatch = window.location.pathname.match(/episode-(\d+)/);
        if (urlEpisodeMatch) {
          episode = parseInt(urlEpisodeMatch[1]);
        }
      }

      return title ? { title, episode } : null;
    } catch {
      return null;
    }
  }
}
