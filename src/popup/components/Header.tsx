import { COLORS } from '../styles';

export function Header() {
  return (
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
  );
}
