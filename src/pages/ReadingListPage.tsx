import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkPlus, BookOpen, BookCheck, Trash2, FileDown, ArrowLeft } from 'lucide-react';
import { useReadingList } from '../hooks/useReadingList';
import type { ReadingStatus, ReadingListEntry } from '../types';
import { exportReadingListAsPDF } from '../utils/pdf';

const TABS: { key: ReadingStatus; label: string; icon: React.ReactNode; emptyMsg: string }[] = [
  {
    key: 'want-to-read',
    label: 'want_to_read',
    icon: <BookmarkPlus className="w-4 h-4" />,
    emptyMsg: 'No books queued. Browse situations to find your next read.',
  },
  {
    key: 'reading',
    label: 'reading',
    icon: <BookOpen className="w-4 h-4" />,
    emptyMsg: 'Move a book here when you start reading.',
  },
  {
    key: 'finished',
    label: 'finished',
    icon: <BookCheck className="w-4 h-4" />,
    emptyMsg: 'Finished books will appear here.',
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function BookListItem({
  entry,
  onStatusChange,
  onRemove,
}: {
  entry: ReadingListEntry;
  onStatusChange: (s: ReadingStatus) => void;
  onRemove: () => void;
}) {
  const others = TABS.filter(t => t.key !== entry.status);

  return (
    <div className="flex items-start gap-3 p-4 bg-cyber-card border border-cyber-border rounded hover:border-cyber-green transition-colors">
      <div
        className="w-9 h-12 rounded shrink-0 flex items-center justify-center text-base"
        style={{ background: `linear-gradient(160deg, ${entry.coverColor}88, ${entry.coverColor})` }}
      >
        📖
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm text-cyber-text font-medium leading-snug">{entry.bookTitle}</h3>
        <p className="text-xs font-mono text-cyber-dim">{entry.bookAuthor}</p>
        <p className="text-xs font-mono text-cyber-dim mt-0.5">added: {formatDate(entry.addedDate)}</p>
        {entry.finishedDate && (
          <p className="text-xs font-mono text-cyber-green mt-0.5">finished: {formatDate(entry.finishedDate)}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-2">
          {others.map(s => (
            <button
              key={s.key}
              onClick={() => onStatusChange(s.key)}
              className="text-xs font-mono px-2 py-0.5 rounded border border-cyber-border text-cyber-dim hover:border-cyber-green hover:text-cyber-green transition-colors"
            >
              → {s.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onRemove}
        className="p-1.5 rounded text-cyber-dim hover:text-red-400 hover:bg-red-950 transition-colors shrink-0"
        aria-label="Remove"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ReadingListPage() {
  const [activeTab, setActiveTab] = useState<ReadingStatus>('want-to-read');
  const { list, updateStatus, removeBook, getByStatus } = useReadingList();

  const activeEntries = getByStatus(activeTab);
  const total = list.length;

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyber-dim hover:text-cyber-green mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        ../home
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-mono text-xs text-cyber-green mb-1">// reading_list.json</p>
          <h1 className="font-display text-2xl font-bold text-cyber-text">My Reading List</h1>
          <p className="text-xs font-mono text-cyber-dim mt-1">
            {total === 0 ? 'no books tracked yet' : `${total} book${total !== 1 ? 's' : ''} tracked`}
          </p>
        </div>
        {total > 0 && (
          <button
            onClick={() => exportReadingListAsPDF(list)}
            className="flex items-center gap-1.5 px-3 py-2 rounded border border-cyber-border text-xs font-mono text-cyber-muted hover:border-cyber-green hover:text-cyber-green transition-colors"
          >
            <FileDown className="w-4 h-4" />
            export.pdf
          </button>
        )}
      </div>

      {/* Stats */}
      {total > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-6">
          {TABS.map(tab => {
            const count = getByStatus(tab.key).length;
            return (
              <div key={tab.key} className="bg-cyber-card border border-cyber-border rounded p-3 text-center">
                <div className="font-mono font-bold text-cyber-green text-2xl">{count}</div>
                <div className="text-xs font-mono text-cyber-dim mt-0.5">{tab.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border border-cyber-border rounded p-1 mb-4 bg-cyber-card">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded text-xs font-mono transition-all ${
              activeTab === tab.key
                ? 'bg-cyber-raised text-cyber-green border border-cyber-green'
                : 'text-cyber-dim hover:text-cyber-muted'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            {getByStatus(tab.key).length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                activeTab === tab.key ? 'bg-cyber-green text-cyber-bg' : 'bg-cyber-bright text-cyber-muted'
              }`}>
                {getByStatus(tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {activeEntries.length > 0 ? (
        <div className="space-y-2">
          {activeEntries.map(entry => (
            <BookListItem
              key={entry.bookId}
              entry={entry}
              onStatusChange={s => updateStatus(entry.bookId, s)}
              onRemove={() => removeBook(entry.bookId)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-14 border border-cyber-border rounded">
          <div className="font-mono text-cyber-green text-xs mb-2">// empty</div>
          <p className="text-cyber-muted text-sm">
            {TABS.find(t => t.key === activeTab)?.emptyMsg}
          </p>
          {total === 0 && (
            <Link
              to="/"
              className="btn-cyber inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded text-sm font-mono"
            >
              find_next_book()
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
