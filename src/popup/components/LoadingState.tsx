import { COLORS, glassEffect } from '../styles';

export function LoadingState() {
  return (
    <div
      style={{
        ...glassEffect,
        padding: '24px',
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
  );
}
