import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookMarked, X, Menu, Download } from 'lucide-react';
import { searchSituations } from '../data/situations';
import type { Situation } from '../types';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const install = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setPromptEvent(null);
    }
  };

  const canInstall = !!promptEvent && !isInstalled;
  return { canInstall, install };
}

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Situation[]>([]);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { canInstall, install } = useInstallPrompt();

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
    setQuery(''); setResults([]); setOpen(false);
    navigate(`/situation/${situation.id}`);
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(8,0,31,0.80)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(37,211,102,0.15)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">

        {/* Logo */}
        <Link to="/" className="flex flex-col shrink-0 leading-none" onClick={() => setMenuOpen(false)}>
          <span className="font-display font-black text-sm tracking-widest text-cyber-green text-glow">
            SYNTHORYNE
          </span>
          <span className="font-mono text-sm tracking-wider mt-0.5">
            <span className="text-cyber-muted">// </span>
            <span className="gradient-text font-semibold">READRIGHT</span>
          </span>
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-md mx-auto">
          <div
            className="flex items-center rounded px-3 py-1.5 transition-all"
            style={{
              background: 'rgba(37,211,102,0.04)',
              border: '1px solid rgba(37,211,102,0.15)',
            }}
          >
            <Search className="w-4 h-4 text-cyber-muted shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="search situations or books..."
              className="flex-1 bg-transparent outline-none text-sm px-2 text-cyber-text placeholder-cyber-muted font-mono"
            />
            {query && (
              <button onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
                className="text-cyber-muted hover:text-cyber-green">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {open && results.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded overflow-hidden z-50"
              style={{ background: '#120030', border: '1px solid rgba(37,211,102,0.2)' }}
            >
              {results.map(s => (
                <button key={s.id} onClick={() => handleSelect(s)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-cyber-raised border-b last:border-0"
                  style={{ borderColor: 'rgba(37,211,102,0.08)' }}
                >
                  <span className="text-base">{s.emoji}</span>
                  <div>
                    <div className="text-sm text-cyber-text font-medium">{s.title}</div>
                    <div className="text-xs font-mono text-cyber-muted">
                      <span className="text-cyber-green">//</span> {s.category.replace(/-/g, ' ')}
                    </div>
                  </div>
                  {s.books.length > 0 && (
                    <span className="ml-auto text-xs font-mono text-cyber-green">{s.books.length} books</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {open && results.length === 0 && query.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded px-4 py-3 text-sm font-mono text-cyber-muted"
              style={{ background: '#120030', border: '1px solid rgba(37,211,102,0.15)' }}>
              <span className="text-cyber-green">// </span>no results for "{query}"
            </div>
          )}
        </div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-2">
          {canInstall && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-mono transition-all"
              style={{
                color: '#25D366',
                border: '1px solid rgba(37,211,102,0.5)',
                background: 'rgba(37,211,102,0.06)',
                boxShadow: '0 0 12px rgba(37,211,102,0.15)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(37,211,102,0.12)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(37,211,102,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(37,211,102,0.06)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(37,211,102,0.15)';
              }}
            >
              <Download className="w-3.5 h-3.5" />
              install_app
            </button>
          )}

          <Link to="/reading-list"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-mono text-cyber-muted transition-all hover:text-cyber-green"
            style={{ border: '1px solid transparent' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(37,211,102,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
          >
            <BookMarked className="w-4 h-4" />
            my_list
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="sm:hidden p-1.5 text-cyber-muted hover:text-cyber-green"
          onClick={() => setMenuOpen(v => !v)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden px-4 py-3 flex flex-col gap-1" style={{ borderTop: '1px solid rgba(37,211,102,0.1)' }}>
          {canInstall && (
            <button
              onClick={() => { setMenuOpen(false); install(); }}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm font-mono w-full transition-all"
              style={{
                color: '#25D366',
                border: '1px solid rgba(37,211,102,0.4)',
                background: 'rgba(37,211,102,0.06)',
              }}
            >
              <Download className="w-4 h-4" />
              install_app
            </button>
          )}
          <Link to="/reading-list" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-mono text-cyber-muted hover:text-cyber-green">
            <BookMarked className="w-4 h-4 text-cyber-green" />
            my_reading_list
          </Link>
        </div>
      )}
    </nav>
  );
}
