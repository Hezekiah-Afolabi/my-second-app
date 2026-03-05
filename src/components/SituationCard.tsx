import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Situation } from '../types';

export default function SituationCard({ situation }: { situation: Situation }) {
  const hasBooks = situation.books.length > 0;

  return (
    <Link
      to={`/situation/${situation.id}`}
      className={`cyber-card group flex items-center gap-4 p-4 rounded ${!hasBooks ? 'opacity-50' : ''}`}
    >
      <div
        className="w-10 h-10 rounded flex items-center justify-center text-xl shrink-0"
        style={{ background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.15)' }}
      >
        {situation.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm text-cyber-text font-medium leading-snug">{situation.title}</h3>
        {hasBooks ? (
          <p className="text-xs font-mono text-cyber-green mt-0.5">
            <span className="text-cyber-muted">// </span>
            {situation.books.length} book{situation.books.length !== 1 ? 's' : ''} available
          </p>
        ) : (
          <p className="text-xs font-mono text-cyber-muted mt-0.5">// coming_soon</p>
        )}
      </div>

      <ChevronRight className="w-4 h-4 text-cyber-muted group-hover:text-cyber-green group-hover:translate-x-1 transition-all shrink-0" />
    </Link>
  );
}
