import { useState } from 'react';
import { Download, X, Share } from 'lucide-react';
import { useInstallPrompt, isIOS } from '../hooks/useInstallPrompt';

export default function InstallPrompt() {
  const { canInstall, hasNativePrompt, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Hide once installed or dismissed
  if (!canInstall || dismissed) return null;

  const handleInstallClick = async () => {
    if (hasNativePrompt) {
      await install();
    } else if (isIOS()) {
      setShowIOSGuide(v => !v);
    }
  };

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50"
      style={{ animation: 'fadeUp 0.4s ease' }}
    >
      {/* iOS step-by-step guide */}
      {showIOSGuide && (
        <div
          className="mb-2 rounded-lg p-4"
          style={{
            background: 'rgba(8,0,31,0.97)',
            border: '1px solid rgba(37,211,102,0.35)',
            boxShadow: '0 0 24px rgba(37,211,102,0.15)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <p className="text-xs font-mono text-cyber-muted mb-3">
            <span className="text-cyber-green">// </span>add to home screen in Safari:
          </p>
          {[
            { n: 1, icon: <Share className="w-3.5 h-3.5 text-cyber-green inline mx-1" />, text: <>Tap the{<Share className="w-3.5 h-3.5 text-cyber-green inline mx-1" />}Share button</> },
            { n: 2, icon: null, text: <>Scroll and tap <span className="text-cyber-green">"Add to Home Screen"</span></> },
            { n: 3, icon: null, text: <>Tap <span className="text-cyber-green">"Add"</span> to confirm</> },
          ].map(({ n, text }) => (
            <div key={n} className="flex items-center gap-3 mb-2 last:mb-0">
              <span className="w-6 h-6 rounded text-xs font-mono font-bold text-cyber-green flex items-center justify-center shrink-0"
                style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)' }}>
                {n}
              </span>
              <span className="text-xs font-mono text-cyber-text">{text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main banner */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: 'rgba(8,0,31,0.97)',
          border: '1px solid rgba(37,211,102,0.45)',
          boxShadow: '0 0 30px rgba(37,211,102,0.2), 0 8px 32px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Green accent line */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, #25D366, #00d4aa)' }} />

        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
            style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)' }}>
            <Download className="w-5 h-5 text-cyber-green" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-display font-bold text-cyber-green tracking-wider">Install ReadRight</p>
            <p className="text-xs font-mono text-cyber-muted mt-0.5">
              {isIOS() ? 'Add to home screen for the full app' : 'Works offline · loads instantly'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all"
              style={{
                color: '#25D366',
                border: '1px solid rgba(37,211,102,0.5)',
                background: 'rgba(37,211,102,0.08)',
                boxShadow: '0 0 10px rgba(37,211,102,0.15)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.18)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.08)')}
            >
              {isIOS() ? 'How?' : 'Install'}
            </button>
            <button onClick={() => setDismissed(true)} className="text-cyber-muted hover:text-cyber-text">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
