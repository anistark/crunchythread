/**
 * Content Script: Detects Crunchyroll anime episode pages
 * Extracts anime title and episode number from DOM
 * Sends data to popup on request
 */

// Debug indicator prefix - makes it easy to find our logs
const DEBUG_PREFIX = '[🧵 CrunchyThread]';

interface AnimeData {
  title?: string;
  episode?: number;
}

// Helper function for consistent debug logging
function debugLog(message: string, data?: unknown): void {
  if (data !== undefined) {
    console.log(`${DEBUG_PREFIX} ${message}`, data);
  } else {
    console.log(`${DEBUG_PREFIX} ${message}`);
  }
}

function debugWarn(message: string, data?: unknown): void {
  if (data !== undefined) {
    console.warn(`${DEBUG_PREFIX} ⚠️  ${message}`, data);
  } else {
    console.warn(`${DEBUG_PREFIX} ⚠️  ${message}`);
  }
}

function debugError(message: string, error?: unknown): void {
  if (error !== undefined) {
    console.error(`${DEBUG_PREFIX} ❌ ${message}`, error);
  } else {
    console.error(`${DEBUG_PREFIX} ❌ ${message}`);
  }
}

function extractAnimeData(): AnimeData | null {
  debugLog('🔍 Starting anime data extraction...');
  try {
    // Try multiple selectors for different Crunchyroll page layouts
    let title: string | undefined;
    let episode: number | undefined;

    debugLog(`📍 Current URL: ${window.location.href}`);
    debugLog(`📍 Current path: ${window.location.pathname}`);

    // Method 1: Try meta tags (most reliable)
    debugLog('🔎 Method 1: Checking meta tags (og:title)');
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
    if (ogTitle) {
      debugLog('📋 Raw og:title content', { ogTitle });

      // Parse format: "One Piece: Egghead Island (1123-Current) | E1148 - The Lost History - Joyboy, the First Pirate"
      // Extract anime title (before the pipe |) and episode number (E####)
      const parts = ogTitle.split('|');
      if (parts.length > 0) {
        // Get the first part before the pipe, then extract just the anime title
        const firstPart = parts[0].trim();
        // Anime title is before the colon (if exists) or before the parentheses
        const titleMatch = firstPart.match(/^([^:]+)/);
        if (titleMatch) {
          title = titleMatch[1].trim();
          debugLog('✅ Parsed anime title from og:title', { title });
        }
      }

      // Extract episode number from the part after the pipe (e.g., "E1148 - The Lost History...")
      if (parts.length > 1) {
        const episodePart = parts[1];
        const episodeMatch = episodePart.match(/E(\d+)/i);
        if (episodeMatch) {
          episode = parseInt(episodeMatch[1]);
          debugLog('✅ Parsed episode number from og:title', { episode });
        }
      }
    } else {
      debugLog('❌ No og:title meta tag found');
    }

    // Method 2: Try data attributes and specific Crunchyroll selectors
    if (!title) {
      debugLog('🔎 Method 2: Checking DOM elements for title');
      const selectors = [
        '[data-testid="episodeTitle"]',
        '[class*="EpisodeTitle"]',
        'h1',
        '.erc-heading-h1',
        '[class*="SeriesTitle"]',
      ];

      for (const selector of selectors) {
        debugLog(`  ↳ Trying selector: ${selector}`);
        const element = document.querySelector(selector);
        if (element) {
          title = element.textContent?.trim();
          if (title) {
            debugLog(`  ✅ Found title with selector: ${selector}`, { title });
            break;
          }
        }
      }

      if (!title) {
        debugLog('❌ No title found in DOM elements');
      }
    }

    // Method 3: Try URL parsing
    if (!title) {
      debugLog('🔎 Method 3: Trying URL parsing');
      const urlMatch = window.location.pathname.match(/watch\/([^/]+)/);
      if (urlMatch) {
        title = decodeURIComponent(urlMatch[1]).replace(/-/g, ' ');
        debugLog('✅ Found title from URL pattern', { title });
      } else {
        debugLog('❌ No match in URL pattern /watch/([^/]+)');
      }
    }

    // Extract episode number
    debugLog('🔎 Extracting episode number');
    const episodeSelectors = [
      '[data-testid="episodeNumber"]',
      '[class*="episodeNumber"]',
      '[class*="EpisodeNumber"]',
    ];

    for (const selector of episodeSelectors) {
      debugLog(`  ↳ Trying selector: ${selector}`);
      const element = document.querySelector(selector);
      if (element) {
        const episodeText = element.textContent?.match(/\d+/);
        if (episodeText) {
          episode = parseInt(episodeText[0]);
          debugLog(`  ✅ Found episode with selector: ${selector}`, { episode });
          break;
        }
      }
    }

    // Fallback: extract episode from URL
    if (episode === undefined) {
      debugLog('🔎 Method 2 (Episode): Trying URL pattern /episode-(\\d+)');
      const urlEpisodeMatch = window.location.pathname.match(/episode-(\d+)/);
      if (urlEpisodeMatch) {
        episode = parseInt(urlEpisodeMatch[1]);
        debugLog('✅ Found episode from URL pattern', { episode });
      } else {
        debugLog('⚠️ No episode number found (might not be an episode page)');
      }
    }

    if (title) {
      debugLog('✨ Successfully extracted anime data', { title, episode });
      return { title, episode };
    }

    debugWarn('No anime title found on this page - may not be a Crunchyroll anime episode page');
    return null;
  } catch (error) {
    debugError('Unexpected error during extraction', error);
    return null;
  }
}

function detectAnimeEpisodePage() {
  debugLog('🚀 Starting anime episode detection...');
  const animeData = extractAnimeData();

  if (animeData) {
    debugLog('📤 Anime detected! Sending to popup...', animeData);
    // Send to popup (it might not be open, so we silently fail)
    chrome.runtime.sendMessage({
      action: 'ANIME_DATA',
      payload: animeData,
    }).catch((err) => {
      debugLog('💭 Popup not open (this is normal):', err instanceof Error ? err.message : err);
    });
  } else {
    debugWarn('No anime data to send');
  }
}

// Listen for requests from popup
debugLog('👂 Setting up message listener for popup requests');
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const req = request as { action?: string };
  debugLog(`📥 Received message from popup: action="${req.action}"`, {
    sender: sender.url,
  });

  if (req.action === 'GET_ANIME_DATA') {
    debugLog('🔄 Popup requesting anime data...');
    const animeData = extractAnimeData();
    debugLog('📤 Responding to popup with anime data', animeData);
    sendResponse({ payload: animeData });
  } else {
    debugWarn(`Unknown action: ${req.action}`);
  }
});

// Run on page load
debugLog(`📄 Page readyState: ${document.readyState}`);
if (document.readyState === 'loading') {
  debugLog('⏳ Page still loading, waiting for DOMContentLoaded event...');
  document.addEventListener('DOMContentLoaded', () => {
    debugLog('✅ DOMContentLoaded fired, running detection');
    detectAnimeEpisodePage();
  });
} else {
  debugLog('✅ Page already loaded, running detection immediately');
  detectAnimeEpisodePage();
}

// Re-run on history changes (SPA navigation)
debugLog('👂 Setting up listener for URL changes (SPA navigation)');
window.addEventListener('popstate', () => {
  debugLog('🔄 URL changed via history API, re-running detection');
  detectAnimeEpisodePage();
});
