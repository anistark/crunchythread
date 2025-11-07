import { COLORS, glassEffect } from '../styles';

interface AnimeInfoCardProps {
  title: string;
  episode?: number;
}

export function AnimeInfoCard({ title, episode }: AnimeInfoCardProps) {
  return (
    <div
      style={{
        ...glassEffect,
        padding: '20px',
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
        {title}
      </p>

      {episode && (
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
            {episode}
          </span>
        </div>
      )}
    </div>
  );
}
