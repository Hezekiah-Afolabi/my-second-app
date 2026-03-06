import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!prompt || dismissed) return null;

  const install = async () => {
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setPrompt(null);
  };

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 rounded p-4 flex items-center gap-3 animate-fade-in"
      style={{
        background: 'rgba(8,0,31,0.95)',
        border: '1px solid rgba(37,211,102,0.4)',
        boxShadow: '0 0 30px rgba(37,211,102,0.2)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="w-10 h-10 rounded shrink-0 flex items-center justify-center text-cyber-green"
        style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)' }}>
        <Download className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-display font-bold text-cyber-green">Install ReadRight</p>
        <p className="text-xs font-mono text-cyber-muted mt-0.5">Add to home screen for offline access</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={install}
          className="btn-cyber px-3 py-1.5 rounded text-xs font-mono"
        >
          Install
        </button>
        <button onClick={() => setDismissed(true)} className="text-cyber-muted hover:text-cyber-text">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
