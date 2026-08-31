/**
 * Web Audio API synthesizer for authentic wooden clatter, singing bowl gong, and chime.
 * Safe to run in any browser without external audio assets.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playStickClack(volume = 0.3) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Wood clack impulse
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
    filter.Q.setValueAtTime(3.5, ctx.currentTime);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320 + Math.random() * 180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Ignore audio autoplay restrictions gracefully
  }
}

export function playGong(volume = 0.25) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const baseFreq = 220; // A3 resonant singing bowl
    const harmonics = [1, 2.76, 5.4, 8.93];
    const gains = [1, 0.4, 0.15, 0.05];

    harmonics.forEach((harmonic, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * harmonic, ctx.currentTime);

      const decay = 2.4 - idx * 0.4;
      gain.gain.setValueAtTime(volume * gains[idx], ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + decay);
    });
  } catch {
    // Ignore audio autoplay errors
  }
}

export function playChime(volume = 0.2) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6
    osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.1); // E6

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.3);
  } catch {
    // Ignore
  }
}
