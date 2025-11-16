import { detectorRegistry } from './detectors';
import type { AnimeData } from './detectors/base';

/**
 * Main content script for anime detection
 * Loads appropriate detector and communicates with background script
 */

function detectAnimeEpisodePage(): void {
  const detector = detectorRegistry.getDetector();
  const animeData = detector.detect();

  if (animeData) {
    chrome.runtime
      .sendMessage({
        action: 'ANIME_DATA',
        payload: animeData,
      })
      .catch(() => {
        // Popup not open, silently fail
      });
  }
}

// Listen for explicit requests from popup or background
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const req = request as { action?: string };

  if (req.action === 'GET_ANIME_DATA') {
    const detector = detectorRegistry.getDetector();
    const animeData = detector.detect();
    sendResponse({ payload: animeData });
  }
});

// Detect on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    detectAnimeEpisodePage();
  });
} else {
  detectAnimeEpisodePage();
}

// Detect on navigation (for SPAs)
window.addEventListener('popstate', () => {
  detectAnimeEpisodePage();
});
