import { COLORS, glassEffect } from '../styles';

export function NoThreadFound() {
  return (
    <div
      style={{
        ...glassEffect,
        padding: '32px 24px',
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
        🔍
      </p>
      <p
        style={{
          fontWeight: '600',
          fontSize: '14px',
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
