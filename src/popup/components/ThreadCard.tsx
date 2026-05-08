import { CSSProperties, MouseEvent } from 'react';
import { COLORS, glassEffect } from '../styles';

interface ThreadCardProps {
  title: string;
  upvotes: number;
  comments: number;
  url: string;
  subreddit?: string;
  isBest?: boolean;
}

export function ThreadCard({ title, upvotes, comments, url, subreddit, isBest }: ThreadCardProps) {
  const cardStyle: CSSProperties = {
    ...glassEffect,
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    marginBottom: '10px',
    transform: 'translateY(0)',
    position: 'relative',
    borderColor: isBest ? 'rgba(244, 117, 33, 0.35)' : 'rgba(244, 117, 33, 0.15)',
  };

  const handleOpenReddit = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (url) {
      chrome.tabs.create({ url });
    }
  };

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = 'rgba(60, 60, 70, 0.35)';
    e.currentTarget.style.borderColor = 'rgba(244, 117, 33, 0.4)';
    e.currentTarget.style.transform = 'translateY(-2px)';
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = 'rgba(50, 50, 60, 0.25)';
    e.currentTarget.style.borderColor = isBest
      ? 'rgba(244, 117, 33, 0.35)'
      : 'rgba(244, 117, 33, 0.15)';
    e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <div
      onClick={handleOpenReddit}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
    >
      {isBest && (
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            left: '12px',
            padding: '2px 8px',
            fontSize: '9px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            color: COLORS.dark,
            background: COLORS.orange,
            borderRadius: '8px',
          }}
        >
          Best match
        </span>
      )}

      <p
        style={{
          fontSize: '13px',
          fontWeight: '600',
          margin: 0,
          marginBottom: '10px',
          lineHeight: '1.4',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          color: COLORS.text,
        }}
      >
        {title}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: COLORS.textSecondary,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {upvotes > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <img
                src={chrome.runtime.getURL('icons/upvote.png')}
                alt=""
                style={{ width: '14px', height: '14px' }}
              />
              <span style={{ fontWeight: '600', color: COLORS.text }}>
                {upvotes.toLocaleString()}
              </span>
            </span>
          )}
          {comments > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <img
                src={chrome.runtime.getURL('icons/comment.png')}
                alt=""
                style={{ width: '14px', height: '14px' }}
              />
              <span style={{ fontWeight: '600', color: COLORS.text }}>
                {comments.toLocaleString()}
              </span>
            </span>
          )}
        </div>
        {subreddit && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: COLORS.orange,
            }}
          >
            r/{subreddit}
          </span>
        )}
      </div>
    </div>
  );
}
