import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Module-level singleton — only one listener, shared across all components
let _prompt: BeforeInstallPromptEvent | null = null;
let _installed = false;
const _listeners = new Set<() => void>();

function notify() { _listeners.forEach(fn => fn()); }

if (typeof window !== 'undefined') {
  // Already running as PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    _installed = true;
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    _prompt = e as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    _installed = true;
    _prompt = null;
    notify();
  });
}

export function useInstallPrompt() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const update = () => rerender(n => n + 1);
    _listeners.add(update);
    return () => { _listeners.delete(update); };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!_prompt) return false;
    await _prompt.prompt();
    const { outcome } = await _prompt.userChoice;
    if (outcome === 'accepted') {
      _installed = true;
      _prompt = null;
      notify();
      return true;
    }
    return false;
  };

  return {
    canInstall: !_installed,   // show button unless already a PWA
    hasNativePrompt: !!_prompt, // true once beforeinstallprompt fires
    install,
  };
}

export function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}
