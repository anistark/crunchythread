import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { AnimeInfoCard } from './components/AnimeInfoCard';
import { LoadingState } from './components/LoadingState';
import { ThreadList } from './components/ThreadList';
import { NoThreadFound, NotOnCrunchyroll } from './components/EmptyStates';
import { Footer } from './components/Footer';
import { COLORS, gradientBackground } from './styles';

interface AnimeData {
  title?: string;
  episode?: number;
}

interface Thread {
  id?: string;
  title?: string;
  upvotes?: number;
  comments?: number;
  url?: string;
}

export default function App() {
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
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
        ...gradientBackground,
        color: COLORS.text,
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Header />

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
            <AnimeInfoCard title={animeData.title} episode={animeData.episode} />

            {loading ? (
              <LoadingState />
            ) : threads.length > 0 ? (
              <ThreadList threads={threads} />
            ) : (
              <NoThreadFound />
            )}
          </>
        ) : (
          <NotOnCrunchyroll />
        )}
      </div>

      <Footer />

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
