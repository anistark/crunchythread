import { CSSProperties, MouseEvent } from 'react';
import { COLORS, glassEffect } from '../styles';

const REPO_URL = 'https://github.com/anistark/crunchythread';
const CONTRIBUTE_URL = `${REPO_URL}/blob/main/data/ANIMESUBREDDITS.yaml`;

type NoThreadReason = 'unmapped' | 'no-results';

interface NoThreadFoundProps {
  reason?: NoThreadReason;
  title?: string;
  episode?: number;
}

export function NoThreadFound({ reason = 'no-results', title, episode }: NoThreadFoundProps) {
  const isUnmapped = reason === 'unmapped';

  const heading = isUnmapped ? 'Not in our list yet' : 'No discussion yet';
  const body = isUnmapped
    ? 'This anime isn’t mapped to a subreddit. Help the community by adding it.'
    : 'Be the first to start the conversation, or browse Reddit for related posts.';
  const emoji = isUnmapped ? '📚' : '🔍';

  const primaryLabel = isUnmapped ? 'Add to mapping' : 'Search Reddit';
  const primaryUrl = isUnmapped ? CONTRIBUTE_URL : buildRedditSearchUrl(title, episode);

  return (
    <div
      style={{
        ...glassEffect,
        padding: '28px 24px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontSize: '32px',
          margin: 0,
          marginBottom: '12px',
        }}
      >
        {emoji}
      </p>
      <p
        style={{
          fontWeight: '700',
          fontSize: '14px',
          margin: '8px 0 6px',
          color: COLORS.text,
        }}
      >
        {heading}
      </p>
      <p
        style={{
          fontSize: '12px',
          color: COLORS.textSecondary,
          margin: 0,
          marginBottom: '16px',
          lineHeight: '1.5',
        }}
      >
        {body}
      </p>
      <ActionButton url={primaryUrl} label={primaryLabel} />
    </div>
  );
}

export function NotOnCrunchyroll() {
  return (
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
            margin: 0,
            marginBottom: '16px',
          }}
        >
          🎬
        </p>
        <p
          style={{
            fontWeight: '600',
            fontSize: '14px',
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
  );
}

function ActionButton({ url, label }: { url: string; label: string }) {
  const baseStyle: CSSProperties = {
    display: 'inline-block',
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    color: COLORS.dark,
    background: COLORS.orange,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background 0.2s ease, transform 0.2s ease',
  };

  const handleClick = () => {
    chrome.tabs.create({ url });
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = COLORS.orangeHover;
    e.currentTarget.style.transform = 'translateY(-1px)';
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = COLORS.orange;
    e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={baseStyle}
    >
      {label}
    </button>
  );
}

function buildRedditSearchUrl(title?: string, episode?: number): string {
  if (!title) return 'https://www.reddit.com/r/anime/';
  const query = episode ? `${title} episode ${episode}` : title;
  return `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`;
}
