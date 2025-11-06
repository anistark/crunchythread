/**
 * Background Service Worker
 * Handles Reddit API calls for anonymous/read-only access
 */

import { getSubredditsForAnime } from '../config/anime-mappings';

// Debug helpers
const DEBUG_PREFIX = '[🧵 CrunchyThread]';

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

interface MessageRequest {
  action: string;
  payload?: Record<string, unknown>;
}

interface RedditThread {
  id: string;
  title: string;
  subreddit: string;
  url: string;
  upvotes: number;
  comments: number;
  created_utc: number;
}

// Listen for messages from content script and popup
debugLog('👂 Setting up message listener for popup/content script...');
chrome.runtime.onMessage.addListener((request: MessageRequest, sender, sendResponse) => {
  debugLog(`📥 Background worker received message: action="${request.action}"`, {
    sender: sender.url,
  });

  if (request.action === 'SEARCH_THREADS') {
    const payload = request.payload as Record<string, string>;
    debugLog('🔍 Starting thread search...', { query: payload.query });

    handleThreadSearch(payload)
      .then((result) => {
        debugLog(`✅ Thread search completed, sending ${result.threads.length} results`, result);
        sendResponse(result);
      })
      .catch((error) => {
        debugError('Thread search failed', error);
        sendResponse({ threads: [], error: error instanceof Error ? error.message : String(error) });
      });
    return true; // Keep channel open for async response
  } else {
    debugWarn(`Unknown action: "${request.action}"`);
  }
});

/**
 * Search Reddit for anime discussion threads (anonymous access)
 */
async function handleThreadSearch(payload: Record<string, unknown>): Promise<{ threads: RedditThread[] }> {
  const title = payload.title as string | undefined;
  const query = payload.query as string | undefined;

  if (!query) {
    debugWarn('No query provided for thread search');
    return { threads: [] };
  }

  debugLog('📝 Query:', query);

  try {
    // Get subreddit list from anime mapping (or fallback to empty array)
    let subreddits: string[] = [];
    if (title) {
      debugLog('🎬 Anime title provided:', title);
      subreddits = getSubredditsForAnime(title);
      if (subreddits.length === 0) {
        debugWarn(`📚 No mapping found for "${title}" - no subreddits to search`);
      }
    } else {
      debugWarn('No anime title provided - cannot use anime mapping');
    }

    if (subreddits.length === 0) {
      debugWarn('No subreddits to search');
      return { threads: [] };
    }

    debugLog('🌐 Will search in subreddits:', subreddits);

    const allThreads: RedditThread[] = [];
    const searchResults: Record<string, number> = {};

    // Search in each subreddit
    for (const subreddit of subreddits) {
      debugLog(`🔍 Searching r/${subreddit}...`);
      try {
        const threads = await searchRedditSubreddit(subreddit, query);
        debugLog(`✅ r/${subreddit}: Found ${threads.length} thread(s)`, threads);
        allThreads.push(...threads);
        searchResults[subreddit] = threads.length;
      } catch (error) {
        debugWarn(`❌ r/${subreddit} search failed`, error instanceof Error ? error.message : error);
      }
    }

    // Filter and rank threads intelligently
    debugLog(`📊 Total threads found across all subreddits: ${allThreads.length}`, searchResults);

    // Extract episode number from query (e.g., "One Piece: Episode 1148" → 1148)
    const episodeMatch = query.match(/[Ee]pisode\s+(\d+)/);
    const targetEpisode = episodeMatch ? episodeMatch[1] : null;

    debugLog('🔍 Filtering and ranking threads...', { targetEpisode, queryLength: query.length });

    // Score each thread based on how well it matches
    const scoredThreads = allThreads.map((thread) => {
      let score = thread.upvotes; // Base score: upvotes

      // Boost score if title contains the exact episode number
      if (targetEpisode && thread.title.includes(`${targetEpisode}`)) {
        score += 10000; // Heavy boost for episode number match
        debugLog(`  ✅ Episode match: "${thread.title}"`, { episode: targetEpisode, boost: 10000 });
      }

      // Boost score if title is a discussion/discussion thread format
      if (/discussion|episode|thread|talk/i.test(thread.title)) {
        score += 1000;
      }

      return { thread, score };
    });

    // Sort by score (episode match > upvotes)
    const sortedThreads = scoredThreads
      .sort((a, b) => b.score - a.score)
      .slice(0, 1) // Return only the best match
      .map(({ thread }) => thread);

    debugLog(`🏆 Best matching thread:`, sortedThreads);

    return { threads: sortedThreads };
  } catch (error) {
    debugError('Unexpected error in thread search', error);
    return { threads: [] };
  }
}

/**
 * Search a specific subreddit on Reddit (anonymous)
 */
async function searchRedditSubreddit(subreddit: string, query: string): Promise<RedditThread[]> {
  const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=on&sort=relevance&t=week&limit=5`;
  debugLog(`  🌐 URL: ${url}`);

  debugLog(`  ⏳ Fetching from Reddit...`);
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'CrunchyThread/0.1.0',
    },
  });

  debugLog(`  📡 Response status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorMsg = `Reddit API returned ${response.status}: ${response.statusText}`;
    debugError(`  API Error for r/${subreddit}`, errorMsg);
    throw new Error(errorMsg);
  }

  debugLog(`  📥 Parsing JSON response...`);
  const data = (await response.json()) as {
    data?: {
      children?: Array<{
        data?: {
          id: string;
          title: string;
          subreddit: string;
          url: string;
          ups: number;
          num_comments: number;
          created_utc: number;
        };
      }>;
    };
  };

  const threads: RedditThread[] = [];

  if (data.data?.children) {
    debugLog(`  📦 Found ${data.data.children.length} raw results from Reddit`);

    for (const child of data.data.children) {
      if (child.data) {
        const thread: RedditThread = {
          id: child.data.id,
          title: child.data.title,
          subreddit: child.data.subreddit,
          url: child.data.url,
          upvotes: child.data.ups,
          comments: child.data.num_comments,
          created_utc: child.data.created_utc,
        };
        threads.push(thread);
        debugLog(`    • ${thread.title} (${thread.upvotes} upvotes)`, {
          subreddit: thread.subreddit,
          comments: thread.comments,
        });
      }
    }
  } else {
    debugLog(`  📦 No results found (data.data.children is empty or null)`);
  }

  return threads;
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((_tabId, _changeInfo, _tab) => {
  // Placeholder for future tab tracking logic
});

debugLog('🚀 Background service worker loaded and ready!');
