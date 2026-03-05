import { useState } from 'react';
import { ShoppingBag, Check, BookmarkPlus, BookOpen, BookCheck, ChevronDown, ChevronUp } from 'lucide-react';
import type { Book, ReadingStatus } from '../types';
import { useReadingList } from '../hooks/useReadingList';
import StarRating from './StarRating';

interface BookCardProps {
  book: Book;
  situationId: string;
}

const STATUS_CONFIG: Record<ReadingStatus, { label: string; icon: React.ReactNode; cls: string }> = {
  'want-to-read': {
    label: 'want_to_read',
    icon: <BookmarkPlus className="w-4 h-4" />,
    cls: 'border-yellow-800 bg-yellow-950 text-yellow-400',
  },
  reading: {
    label: 'reading',
    icon: <BookOpen className="w-4 h-4" />,
    cls: 'border-blue-800 bg-blue-950 text-blue-400',
  },
  finished: {
    label: 'finished',
    icon: <BookCheck className="w-4 h-4" />,
    cls: 'border-cyber-green bg-green-950 text-cyber-green',
  },
};

export default function BookCard({ book, situationId }: BookCardProps) {
  const { addBook, removeBook, updateStatus, getStatus, isInList } = useReadingList();
  const [expanded, setExpanded] = useState(false);
  const [showStores, setShowStores] = useState(false);
  const [statusMenu, setStatusMenu] = useState(false);

  const currentStatus = getStatus(book.id);
  const inList = isInList(book.id);

  const handleAdd = () => {
    addBook({
      bookId: book.id,
      situationId,
      bookTitle: book.title,
      bookAuthor: book.author,
      coverColor: book.coverColor,
      status: 'want-to-read',
      notes: '',
    });
  };

  const difficultyColor =
    book.difficulty === 'Easy'
      ? 'border-green-800 text-green-400'
      : book.difficulty === 'Medium'
      ? 'border-yellow-800 text-yellow-400'
      : 'border-red-800 text-red-400';

  return (
    <article className="book-card rounded overflow-hidden animate-fade-in">
      {/* Top accent line matching cover color */}
      <div className="h-px w-full" style={{ background: book.coverColor }} />

      <div className="flex gap-4 p-5">
        {/* Cover */}
        <div
          className="shrink-0 w-16 h-24 rounded flex items-center justify-center text-2xl shadow-lg"
          style={{
            background: `linear-gradient(160deg, ${book.coverColor}99, ${book.coverColor}ff)`,
            boxShadow: `0 4px 20px ${book.coverColor}44`,
          }}
          aria-hidden="true"
        >
          📖
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-cyber-text text-base leading-tight">{book.title}</h3>
          <p className="text-xs text-cyber-muted font-mono mt-0.5">{book.author}</p>

          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded border font-mono ${difficultyColor} bg-transparent`}>
              {book.difficulty.toLowerCase()}
            </span>
            <span className="text-xs px-2 py-0.5 rounded border border-cyber-border text-cyber-dim font-mono">
              {book.bookType.toLowerCase()}
            </span>
            <span className="text-xs px-2 py-0.5 rounded border border-cyber-border text-cyber-dim font-mono">
              {book.readingTime}
            </span>
          </div>

          <div className="mt-2">
            <StarRating rating={book.rating} size="sm" />
          </div>
        </div>
      </div>

      {/* Match reason */}
      <div className="px-5 pb-3">
        <div className="p-3 rounded border border-cyber-green border-opacity-30 bg-green-950 bg-opacity-30">
          <p className="text-xs font-mono text-cyber-green mb-1">// why_this_book</p>
          <p className="text-sm text-green-200 leading-relaxed">{book.matchReason}</p>
        </div>
      </div>

      {/* Expandable details */}
      <div className="px-5 pb-3">
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1.5 text-xs font-mono text-cyber-muted hover:text-cyber-green transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? 'hide_details()' : 'show_details()'}
        </button>

        {expanded && (
          <div className="mt-4 space-y-4 animate-fade-in">
            {/* Key takeaways */}
            <div>
              <p className="text-xs font-mono text-cyber-green mb-2">// key_takeaways</p>
              <ul className="space-y-2">
                {book.keyTakeaways.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-cyber-muted">
                    <span className="font-mono text-cyber-green text-xs shrink-0 mt-0.5">0{i + 1}.</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Review */}
            <div>
              <p className="text-xs font-mono text-cyber-green mb-2">// quick_review</p>
              <p className="text-sm text-cyber-muted italic leading-relaxed border-l-2 border-cyber-green pl-3">
                "{book.reviewSnippet}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Where to buy */}
      <div className="px-5 pb-3">
        <button
          onClick={() => setShowStores(v => !v)}
          className="flex items-center gap-1.5 text-xs font-mono text-cyber-dim hover:text-cyber-muted transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          buy_in_nigeria()
          {showStores ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showStores && (
          <div className="mt-2 p-3 rounded border border-cyber-border bg-cyber-raised animate-fade-in">
            <p className="text-xs font-mono text-cyber-green mb-2">// price: {book.priceRange}</p>
            <ul className="space-y-1">
              {book.whereToFind.map((store, i) => (
                <li key={i} className="text-xs text-cyber-muted font-mono flex items-center gap-2">
                  <span className="text-cyber-green">›</span> {store}
                </li>
              ))}
            </ul>
            {!book.nigerianAvailability && (
              <p className="text-xs text-cyber-dim font-mono mt-2">// may need to be ordered</p>
            )}
          </div>
        )}
      </div>

      {/* Reading list CTA */}
      <div className="px-5 pb-5">
        {!inList ? (
          <button
            onClick={handleAdd}
            className="btn-cyber w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded text-sm font-mono"
          >
            <BookmarkPlus className="w-4 h-4" />
            add_to_list()
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setStatusMenu(v => !v)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded border font-mono text-sm ${STATUS_CONFIG[currentStatus!].cls}`}
            >
              {STATUS_CONFIG[currentStatus!].icon}
              {STATUS_CONFIG[currentStatus!].label}
              <ChevronDown className="w-3 h-3 ml-auto" />
            </button>

            {statusMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-cyber-card border border-cyber-border rounded overflow-hidden z-10">
                {(Object.keys(STATUS_CONFIG) as ReadingStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => { updateStatus(book.id, s); setStatusMenu(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-mono hover:bg-cyber-raised transition-colors ${
                      currentStatus === s ? 'text-cyber-green' : 'text-cyber-muted'
                    }`}
                  >
                    {currentStatus === s && <Check className="w-3 h-3" />}
                    {STATUS_CONFIG[s].icon}
                    {STATUS_CONFIG[s].label}
                  </button>
                ))}
                <div className="border-t border-cyber-border">
                  <button
                    onClick={() => { removeBook(book.id); setStatusMenu(false); }}
                    className="w-full px-4 py-2.5 text-xs font-mono text-red-500 hover:bg-red-950 text-left"
                  >
                    remove()
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
