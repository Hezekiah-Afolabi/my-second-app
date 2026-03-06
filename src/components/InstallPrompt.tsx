import { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIOSSafari() {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  // Not in standalone mode already
  const standalone = ('standalone' in navigator && (navigator as Navigator & { standalone: boolean }).standalone) ||
    window.matchMedia('(display-mode: standalone)').matches;
  return isIOS && !standalone;
}

function isAlreadyInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as Navigator & { standalone: boolean }).standalone === true);
}

const DISMISSED_KEY = 'readright-install-dismissed';

export default function InstallPrompt() {
  const [androidPrompt, setAndroidPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOS, setShowIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed or previously dismissed this session
    if (isAlreadyInstalled()) return;
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    if (isIOSSafari()) {
      // Show after a short delay so it doesn't feel intrusive
      const t = setTimeout(() => setShowIOS(true), 3500);
      return () => clearTimeout(t);
    }

    // Android / desktop Chrome / Edge
    const handler = (e: Event) => {
      e.preventDefault();
      setAndroidPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      setAndroidPrompt(null);
      setDismissed(true);
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, '1');
    setDismissed(true);
    setAndroidPrompt(null);
    setShowIOS(false);
  };

  const installAndroid = async () => {
    if (!androidPrompt) return;
    await androidPrompt.prompt();
    const { outcome } = await androidPrompt.userChoice;
    if (outcome === 'accepted') {
      setAndroidPrompt(null);
      setDismissed(true);
    }
  };

  const visible = !dismissed && (!!androidPrompt || showIOS);
  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 rounded-lg animate-fade-in"
      style={{
        background: 'rgba(8,0,31,0.96)',
        border: '1px solid rgba(37,211,102,0.45)',
        boxShadow: '0 0 30px rgba(37,211,102,0.2), 0 8px 32px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Top bar accent */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, #25D366, #00d4aa)',
        borderRadius: '8px 8px 0 0',
      }} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
            style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)' }}>
            <Download className="w-5 h-5 text-cyber-green" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-display font-bold text-cyber-green tracking-wider">
              Install ReadRight
            </p>
            <p className="text-xs font-mono text-cyber-muted mt-0.5">
              {showIOS ? 'Add to your home screen for the full app experience' : 'Install as an app — works offline, loads instantly'}
            </p>
          </div>

          <button onClick={dismiss} className="text-cyber-muted hover:text-cyber-text shrink-0 mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Android / desktop: one-tap install */}
        {androidPrompt && (
          <button
            onClick={installAndroid}
            className="mt-3 w-full py-2 rounded text-sm font-mono font-semibold transition-all"
            style={{
              background: 'rgba(37,211,102,0.1)',
              border: '1px solid rgba(37,211,102,0.5)',
              color: '#25D366',
              boxShadow: '0 0 12px rgba(37,211,102,0.15)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.18)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.1)')}
          >
            <Download className="w-4 h-4 inline mr-2" />
            install_app()
          </button>
        )}

        {/* iOS Safari: step-by-step instructions */}
        {showIOS && (
          <div className="mt-3 rounded p-3 space-y-2"
            style={{ background: 'rgba(37,211,102,0.04)', border: '1px solid rgba(37,211,102,0.12)' }}>
            <p className="text-xs font-mono text-cyber-muted mb-2">
              <span className="text-cyber-green">// </span>tap these in Safari:
            </p>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 text-cyber-green font-mono text-xs font-bold"
                style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)' }}>1</div>
              <span className="text-xs font-mono text-cyber-text flex items-center gap-1.5">
                Tap the <Share className="w-3.5 h-3.5 text-cyber-green inline" /> Share button at the bottom
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 text-cyber-green font-mono text-xs font-bold"
                style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)' }}>2</div>
              <span className="text-xs font-mono text-cyber-text">
                Scroll down and tap <span className="text-cyber-green">"Add to Home Screen"</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 text-cyber-green font-mono text-xs font-bold"
                style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)' }}>3</div>
              <span className="text-xs font-mono text-cyber-text">
                Tap <span className="text-cyber-green">"Add"</span> to confirm
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
