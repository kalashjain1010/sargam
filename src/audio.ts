let ctx: AudioContext | null = null;
let token = 0;
let droneStop: (() => void) | null = null;

type Voice = { out: GainNode; feedback: GainNode };

const voices: Voice[] = [];

export function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function unlock(): void {
  const context = getCtx();
  if (context.state === "suspended") void context.resume();
}

export function droneIsOn(): boolean {
  return droneStop !== null;
}

export function stopDrone(): void {
  droneStop?.();
  droneStop = null;
}

function killVoice(voice: Voice, now: number): void {
  try {
    voice.feedback.gain.cancelScheduledValues(now);
    const fb = Math.min(0.99, Math.max(0, voice.feedback.gain.value));
    voice.feedback.gain.setValueAtTime(fb, now);
    voice.feedback.gain.linearRampToValueAtTime(0, now + 0.05);
    voice.out.gain.cancelScheduledValues(now);
    const level = Math.max(0.0001, voice.out.gain.value);
    voice.out.gain.setValueAtTime(level, now);
    voice.out.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
  } catch {
    /* already gone */
  }
}

export function hush(): void {
  token += 1;
  const now = ctx?.currentTime ?? 0;
  for (const voice of voices) killVoice(voice, now);
  voices.length = 0;
}

export function midiHz(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function fillPluck(data: Float32Array, pick: number): void {
  const n = data.length;
  const cut = clamp(Math.floor(n * pick), 2, n - 2);
  for (let i = 0; i < n; i += 1) {
    const raw = Math.random() * 2 - 1;
    const window = i < cut ? i / cut : 1;
    data[i] = raw * window * (1 - (i / n) * 0.4);
  }
}

/** Karplus–Strong plucked string. This is a guitar, not a keyboard. */
function pluck(midi: number, dur: number, when: number, gain: number): void {
  const context = getCtx();
  const freq = midiHz(midi);
  const period = 1 / freq;
  const samples = Math.max(8, Math.round(context.sampleRate / freq));
  const burst = context.createBuffer(1, samples, context.sampleRate);
  fillPluck(burst.getChannelData(0), midi < 50 ? 0.22 : 0.14);

  const noise = context.createBufferSource();
  noise.buffer = burst;

  const delay = context.createDelay(0.06);
  delay.delayTime.setValueAtTime(period, when);

  const damp = context.createBiquadFilter();
  damp.type = "lowpass";
  const brightness = clamp(700 + (freq - 70) * 14, 650, 6200);
  damp.frequency.setValueAtTime(brightness, when);
  damp.frequency.exponentialRampToValueAtTime(clamp(freq * 2.4, 280, 2400), when + dur);
  damp.Q.value = 0.35;

  const feedback = context.createGain();
  const fb = clamp(Math.pow(0.0012, period / Math.max(0.14, dur)), 0.86, 0.986);
  feedback.gain.setValueAtTime(fb, when);
  feedback.gain.setValueAtTime(fb, when + dur);
  feedback.gain.linearRampToValueAtTime(0, when + dur + 0.08);

  const hip = context.createBiquadFilter();
  hip.type = "highpass";
  hip.frequency.value = clamp(freq * 0.55, 55, 180);

  const body = context.createBiquadFilter();
  body.type = "peaking";
  body.frequency.value = 165;
  body.Q.value = 1.1;
  body.gain.value = 4.5;

  const presence = context.createBiquadFilter();
  presence.type = "peaking";
  presence.frequency.value = 920;
  presence.Q.value = 0.7;
  presence.gain.value = 2.2;

  const out = context.createGain();
  out.gain.setValueAtTime(0.0001, when);
  out.gain.exponentialRampToValueAtTime(gain, when + 0.003);
  out.gain.exponentialRampToValueAtTime(gain * 0.58, when + Math.min(0.11, dur * 0.22));
  out.gain.exponentialRampToValueAtTime(0.0001, when + dur);

  const pick = context.createGain();
  pick.gain.setValueAtTime(gain * 0.22, when);
  pick.gain.exponentialRampToValueAtTime(0.0001, when + 0.012);

  noise.connect(delay);
  noise.connect(pick);
  delay.connect(damp);
  damp.connect(feedback);
  feedback.connect(delay);
  damp.connect(hip);
  hip.connect(body);
  body.connect(presence);
  presence.connect(out);
  pick.connect(out);
  out.connect(context.destination);

  noise.start(when);
  noise.stop(when + period * 1.6);

  const voice = { out, feedback };
  voices.push(voice);
  const mine = token;
  window.setTimeout(() => {
    if (mine !== token) return;
    const index = voices.indexOf(voice);
    if (index >= 0) voices.splice(index, 1);
  }, (dur + 0.2) * 1000);
}

export function playMidi(midi: number, dur = 0.85, delay = 0, gain = 0.18): void {
  const context = getCtx();
  const when = context.currentTime + delay;
  const note = clamp(midi, 40, 88);
  const length = Math.max(0.12, dur);
  const level = gain * (note < 48 ? 1.12 : note > 72 ? 0.82 : 1);
  pluck(note, length, when, level);
}

export function playInterval(rootMidi: number, semitones: number): void {
  hush();
  playMidi(rootMidi, 0.85, 0, 0.18);
  playMidi(rootMidi + semitones, 1, 0.5, 0.18);
}

export function playPhrase(startMidi: number, offsets: number[], step = 0.32): void {
  hush();
  offsets.forEach((offset, index) => {
    playMidi(startMidi + offset, step * 1.15, index * step, 0.17);
  });
}

export function playChord(rootMidi: number, intervals: number[], dur = 1.05): void {
  intervals.forEach((semi, index) => {
    playMidi(rootMidi + semi, dur, index * 0.028, semi === 0 ? 0.15 : 0.1);
  });
}

export function startDrone(saMidi: number): void {
  stopDrone();
  const context = getCtx();
  const master = context.createGain();
  master.gain.value = 0.045;
  const body = context.createBiquadFilter();
  body.type = "lowpass";
  body.frequency.value = 720;
  const hum = context.createBiquadFilter();
  hum.type = "peaking";
  hum.frequency.value = 140;
  hum.Q.value = 1.4;
  hum.gain.value = 6;
  master.connect(hum);
  hum.connect(body);
  body.connect(context.destination);

  const layers = [
    { midi: saMidi - 12, type: "sawtooth" as const, amount: 0.55 },
    { midi: saMidi, type: "triangle" as const, amount: 0.32 },
    { midi: saMidi + 7, type: "sawtooth" as const, amount: 0.16 },
  ];
  const oscs = layers.map((layer) => {
    const osc = context.createOscillator();
    osc.type = layer.type;
    osc.frequency.value = midiHz(layer.midi);
    const gain = context.createGain();
    gain.gain.value = layer.amount;
    osc.connect(gain);
    gain.connect(master);
    osc.start();
    return osc;
  });
  droneStop = () => {
    for (const osc of oscs) {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
    }
    master.disconnect();
  };
}

export function playProgression(
  rootMidi: number,
  chords: { semi: number; intervals: number[] }[],
  chordDur = 0.72,
): void {
  hush();
  chords.forEach((chord, index) => {
    chord.intervals.forEach((semi, n) => {
      playMidi(rootMidi + chord.semi + semi, chordDur * 1.05, index * chordDur + n * 0.024, semi === 0 ? 0.14 : 0.09);
    });
  });
}

function click(when: number, accent: boolean): void {
  const context = getCtx();
  const n = Math.max(32, Math.floor(context.sampleRate * 0.004));
  const buffer = context.createBuffer(1, n, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < n; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / n);

  const src = context.createBufferSource();
  src.buffer = buffer;
  const bp = context.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = accent ? 1900 : 1200;
  bp.Q.value = 1.4;
  const amp = context.createGain();
  amp.gain.setValueAtTime(accent ? 0.22 : 0.1, when);
  amp.gain.exponentialRampToValueAtTime(0.0001, when + 0.04);
  src.connect(bp);
  bp.connect(amp);
  amp.connect(context.destination);
  src.start(when);
  src.stop(when + 0.05);
}

export function playClicks(count: number, bpm: number, accentEvery: number): void {
  hush();
  const context = getCtx();
  const step = 60 / bpm;
  const t0 = context.currentTime + 0.02;
  for (let i = 0; i < count; i += 1) click(t0 + i * step, i % accentEvery === 0);
}

export function saMidiFor(pc: number, around = 48): number {
  const want = ((pc % 12) + 12) % 12;
  const base = around - ((((around % 12) - want) + 12) % 12);
  return around - base > 6 ? base + 12 : base;
}
