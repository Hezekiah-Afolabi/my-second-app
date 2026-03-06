import { useEffect, useState, useRef } from 'react';

interface Props {
  onDone: () => void;
}

function playCyberpunkSound(ctx: AudioContext, masterGain: GainNode) {
  const now = ctx.currentTime;

  // ── Sub bass thump — immediate cinematic impact ──
  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(90, now);
  sub.frequency.exponentialRampToValueAtTime(38, now + 0.5);
  subGain.gain.setValueAtTime(0.4, now);
  subGain.gain.linearRampToValueAtTime(0, now + 0.5);
  sub.connect(subGain);
  subGain.connect(masterGain);
  sub.start(now);
  sub.stop(now + 0.5);

  // ── Rising sawtooth sweep — cinematic reveal ──
  const sweep = ctx.createOscillator();
  const sweepGain = ctx.createGain();
  const sweepFilter = ctx.createBiquadFilter();
  sweep.type = 'sawtooth';
  sweep.frequency.setValueAtTime(110, now);
  sweep.frequency.exponentialRampToValueAtTime(920, now + 1.1);
  sweepFilter.type = 'lowpass';
  sweepFilter.frequency.setValueAtTime(350, now);
  sweepFilter.frequency.exponentialRampToValueAtTime(4000, now + 1.1);
  sweepFilter.Q.value = 2.5;
  sweepGain.gain.setValueAtTime(0, now);
  sweepGain.gain.linearRampToValueAtTime(0.08, now + 0.07);
  sweepGain.gain.setValueAtTime(0.08, now + 0.75);
  sweepGain.gain.linearRampToValueAtTime(0, now + 1.3);
  sweep.connect(sweepFilter);
  sweepFilter.connect(sweepGain);
  sweepGain.connect(masterGain);
  sweep.start(now);
  sweep.stop(now + 1.3);

  // ── Digital chime — bright neon ping at reveal peak ──
  const chime1 = ctx.createOscillator();
  const chimeGain1 = ctx.createGain();
  chime1.type = 'sine';
  chime1.frequency.setValueAtTime(1320, now + 0.55);
  chimeGain1.gain.setValueAtTime(0, now + 0.55);
  chimeGain1.gain.linearRampToValueAtTime(0.16, now + 0.60);
  chimeGain1.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
  chime1.connect(chimeGain1);
  chimeGain1.connect(masterGain);
  chime1.start(now + 0.55);
  chime1.stop(now + 2.2);

  // ── Harmonic overtone — richness ──
  const chime2 = ctx.createOscillator();
  const chimeGain2 = ctx.createGain();
  chime2.type = 'sine';
  chime2.frequency.setValueAtTime(1980, now + 0.6); // 3/2 × 1320
  chimeGain2.gain.setValueAtTime(0, now + 0.6);
  chimeGain2.gain.linearRampToValueAtTime(0.07, now + 0.65);
  chimeGain2.gain.exponentialRampToValueAtTime(0.001, now + 1.7);
  chime2.connect(chimeGain2);
  chimeGain2.connect(masterGain);
  chime2.start(now + 0.6);
  chime2.stop(now + 1.7);

  // ── Airy shimmer — futuristic sparkle ──
  const shimmer = ctx.createOscillator();
  const shimmerGain = ctx.createGain();
  shimmer.type = 'sine';
  shimmer.frequency.setValueAtTime(3520, now + 0.65);
  shimmerGain.gain.setValueAtTime(0, now + 0.65);
  shimmerGain.gain.linearRampToValueAtTime(0.038, now + 0.75);
  shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(masterGain);
  shimmer.start(now + 0.65);
  shimmer.stop(now + 2.4);
}

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<'enter' | 'sub' | 'bar' | 'exit'>('enter');
  const [muted, setMuted] = useState(() => localStorage.getItem('readright-muted') === '1');
  const masterGainRef = useRef<GainNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('sub'),  800);
    const t2 = setTimeout(() => setPhase('bar'),  1400);
    const t3 = setTimeout(() => setPhase('exit'), 2600);
    const t4 = setTimeout(() => onDone(),         3200);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onDone]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioCtxCtor = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxCtor) return;

    const ctx = new AudioCtxCtor() as AudioContext;
    audioCtxRef.current = ctx;

    // Compressor keeps levels pleasant
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.knee.value = 8;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    compressor.connect(ctx.destination);

    const master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.65;
    masterGainRef.current = master;
    master.connect(compressor);

    ctx.resume().then(() => playCyberpunkSound(ctx, master)).catch(() => {});

    return () => { ctx.close().catch(() => {}); };
  // only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = () => {
    setMuted(prev => {
      const next = !prev;
      localStorage.setItem('readright-muted', next ? '1' : '0');
      if (masterGainRef.current && audioCtxRef.current) {
        const now = audioCtxRef.current.currentTime;
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
        masterGainRef.current.gain.linearRampToValueAtTime(next ? 0 : 0.65, now + 0.12);
      }
      return next;
    });
  };

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

      {/* Mute / unmute button */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute sound' : 'Mute sound'}
        style={{
          position: 'absolute', bottom: 24, right: 24,
          background: 'rgba(8,0,31,0.7)',
          border: `1px solid ${muted ? 'rgba(37,211,102,0.15)' : 'rgba(37,211,102,0.35)'}`,
          borderRadius: 8,
          color: muted ? 'rgba(37,211,102,0.3)' : 'rgba(37,211,102,0.75)',
          width: 38, height: 38,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 16,
          transition: 'border-color 0.2s ease, color 0.2s ease',
          outline: 'none',
          backdropFilter: 'blur(8px)',
        }}
      >
        {muted ? (
          // Muted icon (speaker with X)
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          // Unmuted icon (speaker with waves)
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      <style>{`
        @keyframes splashGlow {
          from { text-shadow: 0 0 30px rgba(37,211,102,0.9), 0 0 60px rgba(37,211,102,0.5), 0 0 100px rgba(37,211,102,0.3); }
          to   { text-shadow: 0 0 50px rgba(37,211,102,1),   0 0 90px rgba(37,211,102,0.7), 0 0 140px rgba(37,211,102,0.5); }
        }
      `}</style>
    </div>
  );
}
