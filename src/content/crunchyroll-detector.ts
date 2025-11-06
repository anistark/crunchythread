interface AnimeData {
  title?: string;
  episode?: number;
}

function extractAnimeData(): AnimeData | null {
  try {
    let title: string | undefined;
    let episode: number | undefined;

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

    if (!title) {
      const urlMatch = window.location.pathname.match(/watch\/([^/]+)/);
      if (urlMatch) {
        title = decodeURIComponent(urlMatch[1]).replace(/-/g, ' ');
      }
    }

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

function detectAnimeEpisodePage() {
  const animeData = extractAnimeData();

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

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const req = request as { action?: string };

  if (req.action === 'GET_ANIME_DATA') {
    const animeData = extractAnimeData();
    sendResponse({ payload: animeData });
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    detectAnimeEpisodePage();
  });
} else {
  detectAnimeEpisodePage();
}

window.addEventListener('popstate', () => {
  detectAnimeEpisodePage();
});
