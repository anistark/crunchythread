import { CSSProperties, MouseEvent } from 'react';
import { COLORS, glassEffect } from '../styles';

interface ThreadCardProps {
  title: string;
  upvotes: number;
  comments: number;
  url: string;
}

export function ThreadCard({ title, upvotes, comments, url }: ThreadCardProps) {
  const cardStyle: CSSProperties = {
    ...glassEffect,
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '16px',
    transform: 'translateY(0)',
  };

  const handleOpenReddit = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (url) {
      chrome.tabs.create({ url });
    }
  };

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = 'rgba(60, 60, 70, 0.35)';
    e.currentTarget.style.borderColor = 'rgba(244, 117, 33, 0.25)';
    e.currentTarget.style.transform = 'translateY(-4px)';
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = 'rgba(50, 50, 60, 0.25)';
    e.currentTarget.style.borderColor = 'rgba(244, 117, 33, 0.15)';
    e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <div
      onClick={handleOpenReddit}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
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
        {title}
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
            <img
              src={chrome.runtime.getURL('icons/upvote.png')}
              alt="Upvotes"
              style={{ width: '24px', height: '24px' }}
            />
            <span style={{ fontWeight: '600', fontSize: '14px', color: COLORS.text }}>
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
            <img
              src={chrome.runtime.getURL('icons/comment.png')}
              alt="Comments"
              style={{ width: '24px', height: '24px' }}
            />
            <span style={{ fontWeight: '600', fontSize: '14px', color: COLORS.text }}>
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
}
