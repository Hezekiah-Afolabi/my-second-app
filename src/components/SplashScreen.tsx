import { useEffect, useState } from 'react';

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<'enter' | 'sub' | 'bar' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('sub'),  800);
    const t2 = setTimeout(() => setPhase('bar'),  1400);
    const t3 = setTimeout(() => setPhase('exit'), 2600);
    const t4 = setTimeout(() => onDone(),         3200);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#08001f',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 0.6s ease-in-out' : 'none',
        overflow: 'hidden',
      }}
    >
      {/* Blobs */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', top: -150, left: -150, background: 'rgba(220,0,180,0.3)', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', bottom: -100, right: -100, background: 'rgba(0,80,255,0.25)', filter: 'blur(120px)', pointerEvents: 'none' }} />

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(37,211,102,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,211,102,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', textAlign: 'center' }}>

        {/* Code comment prefix */}
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 13,
          color: 'rgba(37,211,102,0.5)', letterSpacing: 4,
          marginBottom: 16,
          opacity: phase === 'enter' ? 0 : 1,
          transform: phase === 'enter' ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          // initializing...
        </div>

        {/* SYNTHORYNE */}
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(32px, 8vw, 64px)',
          letterSpacing: '0.15em',
          color: '#25D366',
          textShadow: '0 0 30px rgba(37,211,102,0.9), 0 0 60px rgba(37,211,102,0.5), 0 0 100px rgba(37,211,102,0.3)',
          opacity: phase === 'enter' ? 0 : 1,
          transform: phase === 'enter' ? 'translateY(24px) scale(0.95)' : 'translateY(0) scale(1)',
          transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
          animation: phase === 'bar' ? 'splashGlow 1.2s ease-in-out infinite alternate' : 'none',
        }}>
          SYNTHORYNE
        </div>

        {/* // READRIGHT */}
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 'clamp(13px, 3vw, 18px)',
          letterSpacing: '0.3em',
          marginTop: 12,
          opacity: phase === 'sub' || phase === 'bar' || phase === 'exit' ? 1 : 0,
          transform: phase === 'sub' || phase === 'bar' || phase === 'exit' ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          <span style={{ color: 'rgba(37,211,102,0.4)' }}>// </span>
          <span style={{
            background: 'linear-gradient(135deg, #25D366, #00d4aa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            READRIGHT
          </span>
        </div>

        {/* Loading bar */}
        <div style={{
          marginTop: 48,
          width: 240, height: 2,
          background: 'rgba(37,211,102,0.12)',
          borderRadius: 2,
          overflow: 'hidden',
          opacity: phase === 'bar' || phase === 'exit' ? 1 : 0,
          transition: 'opacity 0.3s ease',
          margin: '48px auto 0',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #25D366, #00d4aa)',
            boxShadow: '0 0 10px rgba(37,211,102,0.8)',
            borderRadius: 2,
            width: phase === 'bar' || phase === 'exit' ? '100%' : '0%',
            transition: 'width 1.1s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>

        {/* Status text */}
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: 'rgba(37,211,102,0.35)', letterSpacing: 3,
          marginTop: 12,
          opacity: phase === 'bar' || phase === 'exit' ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}>
          LOADING RECOMMENDATIONS...
        </div>
      </div>

      <style>{`
        @keyframes splashGlow {
          from { text-shadow: 0 0 30px rgba(37,211,102,0.9), 0 0 60px rgba(37,211,102,0.5), 0 0 100px rgba(37,211,102,0.3); }
          to   { text-shadow: 0 0 50px rgba(37,211,102,1),   0 0 90px rgba(37,211,102,0.7), 0 0 140px rgba(37,211,102,0.5); }
        }
      `}</style>
    </div>
  );
}
