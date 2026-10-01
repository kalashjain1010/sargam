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

let bodyBus: GainNode | null = null;

/** One wooden box every note rings into — steel-string acoustic, not a pickup. */
function acousticBox(): GainNode {
  if (bodyBus) return bodyBus;
  const context = getCtx();
  const input = context.createGain();
  const hp = context.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 48;
  hp.Q.value = 0.65;
  const air = context.createBiquadFilter();
  air.type = "peaking";
  air.frequency.value = 98;
  air.Q.value = 2.5;
  air.gain.value = 7.2;
  const top = context.createBiquadFilter();
  top.type = "peaking";
  top.frequency.value = 215;
  top.Q.value = 1.55;
  top.gain.value = 5.4;
  const wood = context.createBiquadFilter();
  wood.type = "peaking";
  wood.frequency.value = 440;
  wood.Q.value = 1.05;
  wood.gain.value = 2.6;
  const scoop = context.createBiquadFilter();
  scoop.type = "peaking";
  scoop.frequency.value = 1350;
  scoop.Q.value = 0.75;
  scoop.gain.value = -3.4;
  const sparkle = context.createBiquadFilter();
  sparkle.type = "peaking";
  sparkle.frequency.value = 3100;
  sparkle.Q.value = 0.7;
  sparkle.gain.value = 1.6;
  const shelf = context.createBiquadFilter();
  shelf.type = "highshelf";
  shelf.frequency.value = 4200;
  shelf.gain.value = -5.5;
  const lp = context.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 5400;
  lp.Q.value = 0.45;
  const glue = context.createDynamicsCompressor();
  glue.threshold.value = -16;
  glue.knee.value = 14;
  glue.ratio.value = 2.1;
  glue.attack.value = 0.005;
  glue.release.value = 0.16;
  input.connect(hp);
  hp.connect(air);
  air.connect(top);
  top.connect(wood);
  wood.connect(scoop);
  scoop.connect(sparkle);
  sparkle.connect(shelf);
  shelf.connect(lp);
  lp.connect(glue);
  glue.connect(context.destination);
  bodyBus = input;
  return input;
}

function fillPluck(data: Float32Array, pick: number): void {
  const n = data.length;
  const cut = clamp(Math.floor(n * pick), 2, n - 2);
  const rest = n - cut;
  for (let i = 0; i < n; i += 1) {
    const tri = i < cut ? i / cut : (n - 1 - i) / rest;
    const nail = Math.random() * 2 - 1;
    const nailMix = i < cut ? 0.34 : 0.12;
    data[i] = tri * 0.78 + nail * nailMix;
  }
}

function knock(when: number, gain: number): void {
  const context = getCtx();
  const n = Math.max(24, Math.floor(context.sampleRate * 0.028));
  const buffer = context.createBuffer(1, n, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < n; i += 1) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (n * 0.2));
  const src = context.createBufferSource();
  src.buffer = buffer;
  const bp = context.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 102;
  bp.Q.value = 2.6;
  const amp = context.createGain();
  amp.gain.setValueAtTime(Math.max(0.0001, gain), when);
  amp.gain.exponentialRampToValueAtTime(0.0001, when + 0.14);
  src.connect(bp);
  bp.connect(amp);
  amp.connect(acousticBox());
  src.start(when);
  src.stop(when + 0.16);
}

/** Karplus–Strong into a guitar body. Steel-string acoustic, not electric, not piano. */
function pluck(midi: number, dur: number, when: number, gain: number): void {
  const context = getCtx();
  const freq = midiHz(midi);
  const period = 1 / freq;
  const samples = Math.max(8, Math.round(context.sampleRate / freq));
  const burst = context.createBuffer(1, samples, context.sampleRate);
  fillPluck(burst.getChannelData(0), midi < 52 ? 0.2 : 0.13);

  const noise = context.createBufferSource();
  noise.buffer = burst;

  const delay = context.createDelay(0.06);
  delay.delayTime.setValueAtTime(period * 0.998, when);

  const stiff = context.createBiquadFilter();
  stiff.type = "allpass";
  stiff.frequency.value = clamp(freq * 6, 400, 2800);
  stiff.Q.value = 0.4;

  const damp = context.createBiquadFilter();
  damp.type = "lowpass";
  const startBright = clamp(900 + (freq - 80) * 9, 700, 3800);
  const endBright = clamp(freq * (midi < 52 ? 3.1 : 2.1), 240, 1600);
  damp.frequency.setValueAtTime(startBright, when);
  damp.frequency.exponentialRampToValueAtTime(endBright, when + dur);
  damp.Q.value = 0.32;

  const feedback = context.createGain();
  const ring = midi < 52 ? 0.28 : midi < 64 ? 0.2 : 0.14;
  const fb = clamp(Math.pow(0.004, period / Math.max(0.16, dur + ring)), 0.84, 0.978);
  feedback.gain.setValueAtTime(fb, when);
  feedback.gain.setValueAtTime(fb, when + dur);
  feedback.gain.linearRampToValueAtTime(0, when + dur + 0.1);

  const hip = context.createBiquadFilter();
  hip.type = "highpass";
  hip.frequency.value = clamp(freq * 0.42, 42, 140);

  const out = context.createGain();
  const attack = midi < 50 ? 0.004 : 0.0025;
  out.gain.setValueAtTime(0.0001, when);
  out.gain.exponentialRampToValueAtTime(gain, when + attack);
  out.gain.exponentialRampToValueAtTime(gain * 0.52, when + Math.min(0.16, dur * 0.28));
  out.gain.exponentialRampToValueAtTime(0.0001, when + dur);

  const nail = context.createBiquadFilter();
  nail.type = "bandpass";
  nail.frequency.value = midi < 55 ? 1800 : 2600;
  nail.Q.value = 1.1;
  const nailGain = context.createGain();
  nailGain.gain.setValueAtTime(gain * 0.18, when);
  nailGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.018);

  const thump = context.createBiquadFilter();
  thump.type = "bandpass";
  thump.frequency.value = 95;
  thump.Q.value = 2.2;
  const thumpGain = context.createGain();
  thumpGain.gain.setValueAtTime(gain * (midi < 55 ? 0.2 : 0.08), when);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.07);

  const box = acousticBox();
  noise.connect(delay);
  noise.connect(nail);
  noise.connect(thump);
  delay.connect(stiff);
  stiff.connect(damp);
  damp.connect(feedback);
  feedback.connect(delay);
  damp.connect(hip);
  hip.connect(out);
  nail.connect(nailGain);
  thump.connect(thumpGain);
  out.connect(box);
  nailGain.connect(box);
  thumpGain.connect(box);

  noise.start(when);
  noise.stop(when + period * 1.8);

  const voice = { out, feedback };
  voices.push(voice);
  const mine = token;
  window.setTimeout(() => {
    if (mine !== token) return;
    const index = voices.indexOf(voice);
    if (index >= 0) voices.splice(index, 1);
  }, (dur + 0.25) * 1000);
}

export function playMidi(midi: number, dur = 0.85, delay = 0, gain = 0.2): void {
  const context = getCtx();
  const when = context.currentTime + delay;
  const note = clamp(midi, 35, 88);
  const extra = note < 52 ? 0.38 : note < 64 ? 0.12 : 0;
  const length = Math.max(0.14, dur + extra);
  const level = gain * (note < 48 ? 0.95 : note > 72 ? 0.78 : 1);
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
  const context = getCtx();
  knock(context.currentTime, 0.07);
  intervals.forEach((semi, index) => {
    playMidi(rootMidi + semi, dur + 0.18, index * 0.032, semi === 0 ? 0.16 : 0.1);
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
  body.connect(acousticBox());

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
  knock(getCtx().currentTime, 0.05);
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
  amp.connect(acousticBox());
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
