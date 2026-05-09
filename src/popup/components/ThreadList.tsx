import { COLORS } from '../styles';
import { ThreadCard } from './ThreadCard';

interface Thread {
  id?: string;
  title?: string;
  upvotes?: number;
  comments?: number;
  url?: string;
  subreddit?: string;
}

interface ThreadListProps {
  threads: Thread[];
}

export function ThreadList({ threads }: ThreadListProps) {
  const label = threads.length > 1 ? `Top ${threads.length} discussions` : 'Discussion';

  return (
    <div>
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
          {label}
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

      {threads.map((thread, idx) => (
        <ThreadCard
          key={thread.id || idx}
          title={thread.title || 'Discussion Thread'}
          upvotes={Number(thread.upvotes) || 0}
          comments={Number(thread.comments) || 0}
          url={String(thread.url) || ''}
          subreddit={thread.subreddit}
          isBest={idx === 0 && threads.length > 1}
        />
      ))}
    </div>
  );
}
