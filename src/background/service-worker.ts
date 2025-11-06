import { getSubredditsForAnime } from '../config/anime-mappings';

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

chrome.runtime.onMessage.addListener((request: MessageRequest, _sender, sendResponse) => {
  if (request.action === 'SEARCH_THREADS') {
    const payload = request.payload as Record<string, string>;

    handleThreadSearch(payload)
      .then((result) => {
        sendResponse(result);
      })
      .catch((error) => {
        sendResponse({
          threads: [],
          error: error instanceof Error ? error.message : String(error),
        });
      });
    return true;
  }
});

async function handleThreadSearch(
  payload: Record<string, unknown>,
): Promise<{ threads: RedditThread[] }> {
  const title = payload.title as string | undefined;
  const query = payload.query as string | undefined;

  if (!query) {
    return { threads: [] };
  }

  try {
    let subreddits: string[] = [];
    if (title) {
      subreddits = getSubredditsForAnime(title);
    }

    if (subreddits.length === 0) {
      return { threads: [] };
    }

    const allThreads: RedditThread[] = [];

    for (const subreddit of subreddits) {
      try {
        const threads = await searchRedditSubreddit(subreddit, query);
        allThreads.push(...threads);
      } catch {
        // Subreddit search failed, continue with others
      }
    }

    const episodeMatch = query.match(/[Ee]pisode\s+(\d+)/);
    const targetEpisode = episodeMatch ? episodeMatch[1] : null;

    const scoredThreads = allThreads.map((thread) => {
      let score = thread.upvotes;

      if (targetEpisode && thread.title.includes(`${targetEpisode}`)) {
        score += 10000;
      }

      if (/discussion|episode|thread|talk/i.test(thread.title)) {
        score += 1000;
      }

      return { thread, score };
    });

    const sortedThreads = scoredThreads
      .sort((a, b) => b.score - a.score)
      .slice(0, 1)
      .map(({ thread }) => thread);

    return { threads: sortedThreads };
  } catch {
    return { threads: [] };
  }
}

async function searchRedditSubreddit(subreddit: string, query: string): Promise<RedditThread[]> {
  const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=on&sort=relevance&t=week&limit=5`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'CrunchyThread/0.1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Reddit API returned ${response.status}: ${response.statusText}`);
  }

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
      }
    }
  }

  return threads;
}

chrome.tabs.onUpdated.addListener((_tabId, _changeInfo, _tab) => {
  // Placeholder for future tab tracking logic
});
