import { MouseEvent } from 'react';
import { COLORS } from '../styles';

export function Footer() {
  const handleLinkHover = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = COLORS.orange;
    e.currentTarget.style.transform = 'scale(1.1)';
  };

  const handleLinkLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = COLORS.textSecondary;
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <div
      style={{
        padding: '20px 32px',
        borderTop: '1px solid rgba(244, 117, 33, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        background: 'rgba(15, 15, 15, 0.3)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
      }}
    >
      <p
        style={{
          fontSize: '12px',
          color: COLORS.textSecondary,
          margin: 0,
          fontWeight: '500',
          letterSpacing: '0.3px',
        }}
      >
        Made with 💚 for anime
      </p>

      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        <a
          href="https://x.com/crunchythread"
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
          onMouseEnter={handleLinkHover}
          onMouseLeave={handleLinkLeave}
        >
          𝕏
        </a>
        {/* <a
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
          onMouseEnter={handleLinkHover}
          onMouseLeave={handleLinkLeave}
        >
          ⚙️
        </a> */}
      </div>
    </div>
  );
}
