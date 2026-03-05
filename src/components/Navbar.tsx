import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookMarked, X, Menu, Terminal } from 'lucide-react';
import { searchSituations } from '../data/situations';
import type { Situation } from '../types';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Situation[]>([]);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length > 1) {
      setResults(searchSituations(value).slice(0, 6));
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  };

  const handleSelect = (situation: Situation) => {
    setQuery('');
    setResults([]);
    setOpen(false);
    navigate(`/situation/${situation.id}`);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-cyber-bg border-b border-cyber-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <Terminal className="w-5 h-5 text-cyber-green" />
          <span className="font-mono font-bold text-base tracking-tight">
            <span className="text-cyber-muted">//</span>
            <span className="text-cyber-text"> Read</span>
            <span className="text-cyber-green text-glow">Right</span>
          </span>
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-md mx-auto">
          <div className="flex items-center bg-cyber-card border border-cyber-border rounded px-3 py-1.5 focus-within:border-cyber-green focus-within:glow-green-sm transition-all">
            <Search className="w-4 h-4 text-cyber-dim shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="search situations or books..."
              className="flex-1 bg-transparent outline-none text-sm px-2 text-cyber-text placeholder-cyber-dim font-mono"
            />
            {query && (
              <button onClick={clearSearch} className="text-cyber-dim hover:text-cyber-green">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {open && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-cyber-card border border-cyber-border rounded overflow-hidden z-50">
              {results.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cyber-raised text-left transition-colors border-b border-cyber-border last:border-0"
                >
                  <span className="text-base">{s.emoji}</span>
                  <div>
                    <div className="text-sm text-cyber-text font-medium">{s.title}</div>
                    <div className="text-xs text-cyber-dim font-mono">
                      <span className="text-cyber-green">//</span> {s.category.replace(/-/g, ' ')}
                    </div>
                  </div>
                  {s.books.length > 0 && (
                    <span className="ml-auto text-xs text-cyber-green font-mono">{s.books.length} books</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {open && results.length === 0 && query.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-cyber-card border border-cyber-border rounded px-4 py-3 text-sm text-cyber-muted font-mono">
              <span className="text-cyber-green">// </span>no results for "{query}"
            </div>
          )}
        </div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            to="/reading-list"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-mono text-cyber-muted hover:text-cyber-green hover:bg-cyber-card border border-transparent hover:border-cyber-border transition-all"
          >
            <BookMarked className="w-4 h-4" />
            my_list
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="sm:hidden p-1.5 rounded text-cyber-muted hover:text-cyber-green hover:bg-cyber-card"
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-cyber-border bg-cyber-card px-4 py-3">
          <Link
            to="/reading-list"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded text-sm font-mono text-cyber-muted hover:text-cyber-green"
          >
            <BookMarked className="w-4 h-4 text-cyber-green" />
            my_reading_list
          </Link>
        </div>
      )}
    </nav>
  );
}
