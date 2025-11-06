import React, { useState, useEffect, useCallback } from 'react';

interface AnimeData {
  title?: string;
  episode?: number;
}

const COLORS = {
  dark: '#0F0F0F',
  darkGradientEnd: '#1a1a2e',
  orange: '#F47521',
  orangeHover: '#FF914D',
  text: '#FAFAFA',
  textSecondary: '#B0B0B0',
};

export default function App() {
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [threads, setThreads] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);

  const searchThreads = useCallback((title: string, episode?: number) => {
    setLoading(true);

    const query = episode ? `${title}: Episode ${episode}` : title;

    chrome.runtime.sendMessage(
      { action: 'SEARCH_THREADS', payload: { title, query, episode } },
      (response) => {
        if (response && response.threads) {
          setThreads(response.threads);
        }

        setLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    const messageListener = (request: unknown) => {
      const req = request as Record<string, unknown>;

      if (req.action === 'ANIME_DATA') {
        const payload = req.payload as AnimeData;
        setAnimeData(payload);

        if (payload.title) {
          searchThreads(payload.title, payload.episode);
        }
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs
          .sendMessage(tabs[0].id, { action: 'GET_ANIME_DATA' })
          .then((response: unknown) => {
            const resp = response as Record<string, unknown>;

            if (resp && resp.payload) {
              const payload = resp.payload as AnimeData;
              setAnimeData(payload);

              if (payload.title) {
                searchThreads(payload.title, payload.episode);
              }
            }
          })
          .catch(() => {
            // Failed to get anime data (normal if not on Crunchyroll)
          });
      }
    });

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [searchThreads]);

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkGradientEnd} 100%)`,
        color: COLORS.text,
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header with Logo */}
      <div
        style={{
          padding: '24px 32px',
          background: 'rgba(15, 15, 15, 0.3)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(244, 117, 33, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <img
          src={chrome.runtime.getURL('logo.png')}
          alt="CrunchyThread Logo"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
          }}
        />
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '900',
            color: COLORS.orange,
            margin: 0,
            letterSpacing: '-0.5px',
          }}
        >
          CrunchyThread
        </h1>
      </div>

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px 32px 24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {animeData && animeData.title ? (
          <>
            {/* Anime Info Card */}
            <div
              style={{
                background: 'rgba(50, 50, 60, 0.25)',
                border: '1px solid rgba(244, 117, 33, 0.15)',
                borderRadius: '16px',
                padding: '20px',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 32px rgba(244, 117, 33, 0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }}
                />
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: COLORS.textSecondary,
                    margin: 0,
                  }}
                >
                  Now Watching
                </p>
              </div>
              <p
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: COLORS.text,
                  marginBottom: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {animeData.title}
              </p>

              {animeData.episode && (
                <div
                  style={{
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(244, 117, 33, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: COLORS.textSecondary,
                    }}
                  >
                    Episode
                  </span>
                  <span
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: COLORS.orange,
                    }}
                  >
                    {animeData.episode}
                  </span>
                </div>
              )}
            </div>

            {/* Discussion Section */}
            {loading ? (
              <div
                style={{
                  background: 'rgba(50, 50, 60, 0.25)',
                  border: '1px solid rgba(244, 117, 33, 0.15)',
                  borderRadius: '16px',
                  padding: '24px',
                  backdropFilter: 'blur(15px)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '24px',
                      animation: 'spin 1s linear infinite',
                    }}
                  >
                    ⚙️
                  </span>
                  <p
                    style={{
                      fontWeight: '600',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    Searching
                  </p>
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    color: COLORS.textSecondary,
                    margin: 0,
                  }}
                >
                  Finding discussion thread...
                </p>
              </div>
            ) : threads.length > 0 ? (
              <div>
                {/* Section Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>💬</span>
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      margin: 0,
                    }}
                  >
                    Discussion
                  </p>
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      background: `linear-gradient(90deg, ${COLORS.orange}40 0%, transparent 100%)`,
                      borderRadius: '1px',
                    }}
                  />
                </div>

                {/* Thread Card */}
                {threads.map((thread: unknown, idx: number) => {
                  const threadObj = thread as Record<string, unknown>;
                  const threadUrl = threadObj?.url ? String(threadObj.url) : null;
                  const upvotes = threadObj?.upvotes ? Number(threadObj.upvotes) : 0;
                  const comments = threadObj?.comments ? Number(threadObj.comments) : 0;

                  const handleOpenReddit = (e: React.MouseEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    if (threadUrl) {
                      // debugLog('🔗 Opening Reddit thread in new tab:', threadUrl);
                      chrome.tabs.create({ url: threadUrl });
                    }
                  };

                  return (
                    <div
                      key={idx}
                      onClick={handleOpenReddit}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(60, 60, 70, 0.35)';
                        e.currentTarget.style.borderColor = 'rgba(244, 117, 33, 0.25)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(50, 50, 60, 0.25)';
                        e.currentTarget.style.borderColor = 'rgba(244, 117, 33, 0.15)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      style={{
                        background: 'rgba(50, 50, 60, 0.25)',
                        border: '1px solid rgba(244, 117, 33, 0.15)',
                        borderRadius: '16px',
                        padding: '20px',
                        backdropFilter: 'blur(15px)',
                        boxShadow: '0 8px 32px rgba(244, 117, 33, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        marginBottom: '16px',
                        transform: 'translateY(0)',
                      }}
                    >
                      {/* Title */}
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '20px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          color: COLORS.text,
                        }}
                      >
                        {threadObj?.title ? String(threadObj.title) : 'Discussion Thread'}
                      </p>

                      {/* Stats - More Prominent Below Title */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          justifyContent: 'center',
                          marginBottom: '20px',
                        }}
                      >
                        {upvotes > 0 && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span style={{ fontSize: '24px' }}>⬆️</span>
                            <span
                              style={{ fontWeight: '600', fontSize: '14px', color: COLORS.text }}
                            >
                              {upvotes.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {comments > 0 && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span style={{ fontSize: '24px' }}>💬</span>
                            <span
                              style={{ fontWeight: '600', fontSize: '14px', color: COLORS.text }}
                            >
                              {comments.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Hover hint text */}
                      <p
                        style={{
                          textAlign: 'center',
                          fontSize: '12px',
                          color: COLORS.textSecondary,
                          margin: 0,
                        }}
                      >
                        Click to open on Reddit
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(50, 50, 60, 0.25)',
                  border: '1px solid rgba(244, 117, 33, 0.15)',
                  borderRadius: '16px',
                  padding: '32px 24px',
                  backdropFilter: 'blur(15px)',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: '32px',
                    marginBottom: '12px',
                    margin: 0,
                  }}
                >
                  🔍
                </p>
                <p
                  style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    marginBottom: '8px',
                    margin: '12px 0 8px',
                  }}
                >
                  No Thread Found
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    color: COLORS.textSecondary,
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  Be the first to create a discussion on Reddit!
                </p>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  margin: 0,
                }}
              >
                🎬
              </p>
              <p
                style={{
                  fontWeight: '600',
                  fontSize: '14px',
                  marginBottom: '8px',
                  margin: '16px 0 8px',
                }}
              >
                Not on Crunchyroll
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: COLORS.textSecondary,
                  margin: 0,
                  lineHeight: '1.5',
                }}
              >
                Open an anime episode to find discussions
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Social Icons */}
      <div
        style={{
          padding: '20px 32px',
          borderTop: '1px solid rgba(244, 117, 33, 0.08)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          flexShrink: 0,
          background: 'rgba(15, 15, 15, 0.3)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
        }}
      >
        <a
          href="https://twitter.com/crunchythread"
          target="_blank"
          rel="noopener noreferrer"
          title="Follow on Twitter"
          style={{
            fontSize: '18px',
            color: COLORS.textSecondary,
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = COLORS.orange;
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = COLORS.textSecondary;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          𝕏
        </a>
        <a
          href="https://github.com/anistark/crunchythread"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Repository"
          style={{
            fontSize: '18px',
            color: COLORS.textSecondary,
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = COLORS.orange;
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = COLORS.textSecondary;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ⚙️
        </a>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
