import { useState, useEffect } from 'react';

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

interface AnimeData {
  title?: string;
  episode?: number;
}

// Theme colors
const COLORS = {
  dark: '#0F0F0F',
  darkLight: '#1a1a1a',
  glass: 'rgba(30, 30, 30, 0.6)',
  glassLight: 'rgba(40, 40, 40, 0.5)',
  orange: '#F47521',
  orangeHover: '#FF914D',
  orangeLight: '#f47521cc',
  blue: '#1E3A8A',
  text: '#FAFAFA',
  textSecondary: '#B0B0B0',
  border: 'rgba(244, 117, 33, 0.15)',
  borderLight: 'rgba(244, 117, 33, 0.08)',
};

export default function App() {
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [threads, setThreads] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    debugLog('🎬 Popup mounted, initializing...');

    // Listen for messages from content script
    const messageListener = (request: unknown) => {
      const req = request as Record<string, unknown>;
      debugLog('📥 Popup received message from content script', { action: req.action });

      if (req.action === 'ANIME_DATA') {
        const payload = req.payload as AnimeData;
        debugLog('📺 Received anime data from content script', payload);
        setAnimeData(payload);

        // Auto-search for threads when anime is detected
        if (payload.title) {
          debugLog('🔍 Auto-triggering thread search for:', payload.title);
          searchThreads(payload.title, payload.episode);
        } else {
          debugWarn('Anime data received but no title present');
        }
      }
    };

    debugLog('👂 Adding message listener...');
    chrome.runtime.onMessage.addListener(messageListener);

    // Request current anime data from content script
    debugLog('🔍 Querying active tab...');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      debugLog(`📋 Found ${tabs.length} tab(s), checking first one...`, {
        tab: tabs[0]?.url,
        tabId: tabs[0]?.id,
      });

      if (tabs[0] && tabs[0].id) {
        debugLog(`📤 Sending GET_ANIME_DATA request to content script (tab: ${tabs[0].id})...`);
        chrome.tabs
          .sendMessage(tabs[0].id, { action: 'GET_ANIME_DATA' })
          .then((response: unknown) => {
            const resp = response as Record<string, unknown>;
            debugLog('✅ Content script responded', resp);

            if (resp && resp.payload) {
              const payload = resp.payload as AnimeData;
              debugLog('📺 Received anime data:', payload);
              setAnimeData(payload);

              if (payload.title) {
                debugLog('🔍 Starting thread search for:', payload.title);
                searchThreads(payload.title, payload.episode);
              } else {
                debugWarn('Received anime data but no title present');
              }
            } else {
              debugWarn('Content script responded but no payload found');
            }
          })
          .catch((error: unknown) => {
            debugWarn(
              'Failed to get anime data from content script (this is normal if not on Crunchyroll)',
              error instanceof Error ? error.message : error,
            );
          });
      } else {
        debugWarn('No active tab found or tab has no ID');
      }
    });

    return () => {
      debugLog('🧹 Cleaning up: removing message listener');
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const searchThreads = (title: string, episode?: number) => {
    debugLog('🔍 Starting thread search...', { title, episode });
    setLoading(true);

    const query = episode ? `${title}: Episode ${episode}` : title;
    debugLog('📝 Search query:', query);

    debugLog('📤 Sending SEARCH_THREADS request to background worker...');
    chrome.runtime.sendMessage(
      { action: 'SEARCH_THREADS', payload: { title, query, episode } },
      (response) => {
        debugLog('✅ Background worker responded', response);

        if (response && response.threads) {
          debugLog(`✨ Received ${response.threads.length} thread(s)`, response.threads);
          setThreads(response.threads);
        } else if (response && response.error) {
          debugError('Background worker returned an error', response.error);
        } else {
          debugWarn('Unexpected response format from background worker', response);
        }

        debugLog('✅ Search complete, setting loading to false');
        setLoading(false);
      },
    );
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{
        backgroundColor: COLORS.dark,
        color: COLORS.text,
        backgroundImage: `linear-gradient(135deg, ${COLORS.dark} 0%, #1a1a2e 100%)`,
      }}
    >
      {/* Header - Fixed */}
      <div
        className="px-6 py-5 border-b"
        style={{
          borderColor: COLORS.borderLight,
          background: `linear-gradient(180deg, rgba(30,30,30,0.8) 0%, rgba(20,20,20,0.6) 100%)`,
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl drop-shadow-lg">🧵</span>
          <h1
            className="text-4xl font-black tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${COLORS.orange} 0%, ${COLORS.orangeHover} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `0 2px 10px rgba(244, 117, 33, 0.3)`,
            }}
          >
            CrunchyThread
          </h1>
        </div>
        <p className="text-xs tracking-widest uppercase" style={{ color: COLORS.textSecondary, letterSpacing: '0.1em' }}>
          Watch • React • Discuss
        </p>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {animeData && animeData.title ? (
          <>
            {/* Currently Watching Card */}
            <div
              className="p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:border-opacity-100"
              style={{
                background: `linear-gradient(135deg, ${COLORS.glass} 0%, ${COLORS.glassLight} 100%)`,
                backdropFilter: 'blur(20px)',
                border: `1.5px solid ${COLORS.border}`,
                boxShadow: `0 8px 32px rgba(244, 117, 33, 0.08), inset 0 1px 1px rgba(255,255,255,0.1)`,
              }}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLORS.textSecondary }}>
                    ▶ Now Watching
                  </p>
                  <p className="text-2xl font-bold line-clamp-2 leading-tight">{animeData.title}</p>
                </div>

                {animeData.episode && (
                  <div className="flex items-center gap-2 pt-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: COLORS.orange,
                        boxShadow: `0 0 8px ${COLORS.orange}80`,
                      }}
                    />
                    <p className="text-lg font-bold" style={{ color: COLORS.orange }}>
                      Episode {animeData.episode}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Discussion Threads Section */}
            {loading ? (
              <div
                className="p-6 rounded-2xl backdrop-blur-xl border text-center"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.glass} 0%, ${COLORS.glassLight} 100%)`,
                  border: `1.5px solid ${COLORS.border}`,
                  boxShadow: `0 8px 32px rgba(244, 117, 33, 0.08)`,
                }}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl animate-spin">⚙️</span>
                  <p className="font-semibold" style={{ color: COLORS.text }}>
                    Searching Reddit
                  </p>
                </div>
                <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                  Finding the perfect discussion thread...
                </p>
              </div>
            ) : threads.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-1 pt-2">
                  <span className="text-xl">💬</span>
                  <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: COLORS.text }}>
                    Discussion Found
                  </h2>
                  <div
                    className="flex-1 h-0.5 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${COLORS.orange}60 0%, transparent 100%)`,
                    }}
                  />
                </div>

                {threads.map((thread: unknown, idx: number) => {
                  const threadObj = thread as Record<string, unknown>;
                  const threadUrl = threadObj?.url ? String(threadObj.url) : null;
                  const upvotes = threadObj?.upvotes ? Number(threadObj.upvotes) : 0;
                  const comments = threadObj?.comments ? Number(threadObj.comments) : 0;

                  const handleOpenReddit = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    if (threadUrl) {
                      debugLog('🔗 Opening Reddit thread in new tab:', threadUrl);
                      chrome.tabs.create({ url: threadUrl });
                    }
                  };

                  return (
                    <div
                      key={idx}
                      className="group p-5 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:border-opacity-100 cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.glassLight} 0%, rgba(26, 26, 26, 0.4) 100%)`,
                        border: `1.5px solid ${COLORS.borderLight}`,
                        boxShadow: `0 8px 32px rgba(244, 117, 33, 0.06), inset 0 1px 1px rgba(255,255,255,0.05)`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${COLORS.glass} 0%, rgba(35, 35, 35, 0.5) 100%)`;
                        e.currentTarget.style.borderColor = COLORS.border;
                        e.currentTarget.style.boxShadow = `0 12px 40px rgba(244, 117, 33, 0.12), inset 0 1px 1px rgba(255,255,255,0.1)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${COLORS.glassLight} 0%, rgba(26, 26, 26, 0.4) 100%)`;
                        e.currentTarget.style.borderColor = COLORS.borderLight;
                        e.currentTarget.style.boxShadow = `0 8px 32px rgba(244, 117, 33, 0.06), inset 0 1px 1px rgba(255,255,255,0.05)`;
                      }}
                    >
                      <p className="text-sm font-semibold mb-3 line-clamp-2 leading-snug">{threadObj?.title ? String(threadObj.title) : 'Discussion Thread'}</p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs mb-4" style={{ color: COLORS.textSecondary }}>
                        {upvotes > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span>⬆️</span>
                            <span className="font-semibold">{upvotes.toLocaleString()}</span>
                          </div>
                        )}
                        {comments > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span>💬</span>
                            <span className="font-semibold">{comments.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Button */}
                      <a
                        href={threadUrl || '#'}
                        onClick={handleOpenReddit}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs transition-all duration-200 group-hover:shadow-lg group-active:scale-95"
                        style={{
                          backgroundColor: COLORS.orange,
                          color: 'white',
                          boxShadow: `0 4px 15px rgba(244, 117, 33, 0.3)`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.orangeHover;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = `0 6px 25px rgba(244, 117, 33, 0.4)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.orange;
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = `0 4px 15px rgba(244, 117, 33, 0.3)`;
                        }}
                      >
                        <span>🔗</span>
                        <span>Open Thread</span>
                        <span>→</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="p-8 rounded-2xl backdrop-blur-xl border text-center"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.glass} 0%, ${COLORS.glassLight} 100%)`,
                  border: `1.5px solid ${COLORS.border}`,
                  boxShadow: `0 8px 32px rgba(244, 117, 33, 0.06)`,
                }}
              >
                <p className="text-3xl mb-3">🔍</p>
                <p className="font-semibold mb-2">No Thread Found</p>
                <p className="text-xs leading-relaxed" style={{ color: COLORS.textSecondary }}>
                  This episode might not have a discussion thread yet. Be the first to create one on Reddit!
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div
              className="p-8 rounded-2xl backdrop-blur-xl border text-center max-w-xs"
              style={{
                background: `linear-gradient(135deg, ${COLORS.glass} 0%, ${COLORS.glassLight} 100%)`,
                border: `1.5px solid ${COLORS.border}`,
                boxShadow: `0 8px 32px rgba(244, 117, 33, 0.08)`,
              }}
            >
              <p className="text-5xl mb-4">🎬</p>
              <p className="font-semibold mb-2">Not on Crunchyroll</p>
              <p className="text-xs leading-relaxed" style={{ color: COLORS.textSecondary }}>
                Open any anime episode page on Crunchyroll to find and join discussions!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-6 py-4 border-t text-center text-xs"
        style={{
          borderColor: COLORS.borderLight,
          color: COLORS.textSecondary,
          background: `linear-gradient(180deg, rgba(20,20,20,0.4) 0%, rgba(15,15,15,0.6) 100%)`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <p>
          Made with <span style={{ color: COLORS.orange }}>❤️</span> for anime fans
        </p>
      </div>
    </div>
  );
}
