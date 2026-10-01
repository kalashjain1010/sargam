import { mod12 } from "./theory.ts";
import { gripToMidis, voicingFor } from "./guitar.ts";

let ctx: AudioContext | null = null;
let token = 0;
let droneStop: (() => void) | null = null;
let master: GainNode | null = null;

type Voice = { src: AudioBufferSourceNode; out: GainNode };
type Job = { midi: number; delay: number; gain: number; hold?: number };

const voices: Voice[] = [];
const buffers = new Map<number, AudioBuffer>();
const inflight = new Map<number, Promise<AudioBuffer>>();
const walkTimers: number[] = [];

/** University of Iowa steel-string recordings (via tonejs-instruments). */
const SAMPLE_NAMES = [
  "D2", "Ds2", "E2", "F2", "Fs2", "G2", "Gs2", "A2", "As2", "B2",
  "C3", "Cs3", "D3", "Ds3", "E3", "F3", "Fs3", "G3", "Gs3", "A3", "As3", "B3",
  "C4", "Cs4", "D4", "Ds4", "E4", "F4", "Fs4", "G4", "Gs4", "A4", "As4", "B4",
  "C5", "Cs5", "D5",
] as const;

const OPEN_FIRST = ["E2", "A2", "D3", "G3", "B3", "E4"] as const;

const CDN = "https://cdn.jsdelivr.net/gh/nbrosowsky/tonejs-instruments@master/samples/guitar-acoustic/";

const PC: Record<string, number> = {
  C: 0, Cs: 1, D: 2, Ds: 3, E: 4, F: 5, Fs: 6, G: 7, Gs: 8, A: 9, As: 10, B: 11,
};

export function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function midiHz(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function nameToMidi(name: string): number {
  const match = /^(A|As|B|C|Cs|D|Ds|E|F|Fs|G|Gs)(\d)$/.exec(name);
  if (!match) return 60;
  return (Number(match[2]) + 1) * 12 + (PC[match[1]] ?? 0);
}

function bus(): GainNode {
  if (master) return master;
  const context = getCtx();
  master = context.createGain();
  master.gain.value = 0.9;
  master.connect(context.destination);
  return master;
}

function killVoice(voice: Voice, now: number): void {
  try {
    voice.out.gain.cancelScheduledValues(now);
    const level = Math.max(0.0001, voice.out.gain.value);
    voice.out.gain.setValueAtTime(level, now);
    voice.out.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    voice.src.stop(now + 0.06);
  } catch {
    /* already gone */
  }
}

function clearWalk(): void {
  for (const id of walkTimers) window.clearTimeout(id);
  walkTimers.length = 0;
}

export function hush(): void {
  token += 1;
  clearWalk();
  const now = ctx?.currentTime ?? 0;
  for (const voice of voices) killVoice(voice, now);
  voices.length = 0;
}

async function fetchBytes(name: string): Promise<ArrayBuffer> {
  const urls = [`/guitar/${name}.mp3`, `${CDN}${name}.mp3`];
  let last = "";
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        last = `${url} ${res.status}`;
        continue;
      }
      const type = (res.headers.get("content-type") ?? "").toLowerCase();
      if (type.includes("html") || type.includes("json") || type.includes("text/")) {
        last = `${url} ${type}`;
        continue;
      }
      const bytes = await res.arrayBuffer();
      if (bytes.byteLength < 8000) {
        last = `${url} tiny ${bytes.byteLength}`;
        continue;
      }
      return bytes;
    } catch (err) {
      last = String(err);
    }
  }
  throw new Error(last || name);
}

function loadName(name: string): Promise<AudioBuffer> {
  const midi = nameToMidi(name);
  const cached = buffers.get(midi);
  if (cached) return Promise.resolve(cached);
  const pending = inflight.get(midi);
  if (pending) return pending;
  const job = (async () => {
    const raw = await fetchBytes(name);
    const buffer = await getCtx().decodeAudioData(raw.slice(0));
    buffers.set(midi, buffer);
    inflight.delete(midi);
    return buffer;
  })().catch((err) => {
    inflight.delete(midi);
    throw err;
  });
  inflight.set(midi, job);
  return job;
}

function closestName(midi: number): string {
  let best: string = SAMPLE_NAMES[0];
  let dist = 99;
  for (const name of SAMPLE_NAMES) {
    const gap = Math.abs(nameToMidi(name) - midi);
    if (gap < dist) {
      dist = gap;
      best = name;
    }
  }
  return best;
}

function preload(): void {
  const open = new Set<string>(OPEN_FIRST);
  for (const name of OPEN_FIRST) void loadName(name);
  for (const name of SAMPLE_NAMES) {
    if (!open.has(name)) void loadName(name);
  }
}

export function unlock(): void {
  const context = getCtx();
  if (context.state === "suspended") void context.resume();
  preload();
}

export function droneIsOn(): boolean {
  return droneStop !== null;
}

export function stopDrone(): void {
  droneStop?.();
  droneStop = null;
}

function trigger(midi: number, when: number, gain: number, sampleMidi: number, buffer: AudioBuffer, hold?: number): void {
  const context = getCtx();
  const rate = clamp(midiHz(midi) / midiHz(sampleMidi), 0.5, 2);
  const src = context.createBufferSource();
  src.buffer = buffer;
  src.playbackRate.value = rate;
  const out = context.createGain();
  const amp = Math.max(0.0008, gain * 2.3);
  const natural = buffer.duration / rate;
  const len = hold ?? natural;
  out.gain.setValueAtTime(amp, when);
  if (hold !== undefined && hold < natural) {
    const fade = Math.max(when + 0.04, when + hold - 0.09);
    out.gain.setValueAtTime(amp, fade);
    out.gain.exponentialRampToValueAtTime(0.0001, when + hold);
  }
  src.connect(out);
  out.connect(bus());
  src.start(when);
  src.stop(when + len + 0.02);
  const voice = { src, out };
  voices.push(voice);
  const mine = token;
  window.setTimeout(() => {
    if (mine !== token) return;
    const index = voices.indexOf(voice);
    if (index >= 0) voices.splice(index, 1);
  }, (len + 0.2) * 1000);
}

async function fire(jobs: Job[], mine: number): Promise<void> {
  if (jobs.length === 0) return;
  const prepared = await Promise.all(
    jobs.map(async (job) => {
      const note = clamp(job.midi, 35, 88);
      const name = closestName(note);
      const buffer = await loadName(name);
      return { ...job, midi: note, name, buffer };
    }),
  );
  if (mine !== token) return;
  const t0 = getCtx().currentTime + 0.03;
  for (const job of prepared) {
    trigger(job.midi, t0 + job.delay, job.gain, nameToMidi(job.name), job.buffer, job.hold);
  }
}

export function playMidi(midi: number, _dur = 0.85, delay = 0, gain = 0.2): void {
  void fire([{ midi, delay, gain }], token).catch(() => undefined);
}

function fretJobs(frets: (number | null)[], delay0: number, gap: number, hold?: number): Job[] {
  const midis = gripToMidis(frets);
  const jobs: Job[] = [];
  let n = 0;
  midis.forEach((midi, index) => {
    if (midi === null) return;
    const bass = n === 0;
    jobs.push({
      midi,
      delay: delay0 + index * gap,
      gain: bass ? 0.14 : 0.1,
      hold,
    });
    n += 1;
  });
  return jobs;
}

/** Real guitar strum: recorded notes on the actual strings of the shape. */
export function playFrets(frets: (number | null)[], gap = 0.015): void {
  hush();
  void fire(fretJobs(frets, 0, gap), token).catch(() => undefined);
}

export function playWalk(midis: number[], step = 0.3, onStep?: (index: number) => void): void {
  hush();
  const mine = token;
  const jobs = midis.map((midi, index) => ({ midi, delay: index * step, gain: 0.18 }));
  if (onStep) {
    midis.forEach((_, index) => {
      walkTimers.push(
        window.setTimeout(() => {
          if (mine !== token) return;
          onStep(index);
        }, (0.03 + index * step) * 1000),
      );
    });
  }
  void fire(jobs, mine).catch(() => undefined);
}

export function playInterval(rootMidi: number, semitones: number): void {
  hush();
  playMidi(rootMidi, 0.85, 0, 0.18);
  playMidi(rootMidi + semitones, 1, 0.5, 0.18);
}

export function playPhrase(startMidi: number, offsets: number[], step = 0.32): void {
  playWalk(
    offsets.map((offset) => startMidi + offset),
    step,
  );
}

export function playChord(rootMidi: number, intervals: number[], _dur = 1.05): void {
  if (intervals.length < 3) {
    hush();
    const jobs = intervals.map((semi, index) => ({
      midi: rootMidi + semi,
      delay: index * 0.028,
      gain: index === 0 ? 0.16 : 0.12,
    }));
    void fire(jobs, token).catch(() => undefined);
    return;
  }
  playFrets(voicingFor(mod12(rootMidi), intervals).frets);
}

export function startDrone(saMidi: number): void {
  stopDrone();
  let alive = true;
  const pulse = () => {
    if (!alive) return;
    playMidi(saMidi, 2.4, 0, 0.05);
    playMidi(saMidi + 12, 2.4, 0.02, 0.028);
  };
  pulse();
  const id = window.setInterval(pulse, 1700);
  droneStop = () => {
    alive = false;
    window.clearInterval(id);
  };
}

export function playProgression(
  rootMidi: number,
  chords: { semi: number; intervals: number[] }[],
  chordDur = 0.72,
): void {
  hush();
  const mine = token;
  const jobs: Job[] = [];
  chords.forEach((chord, index) => {
    const grip = voicingFor(mod12(rootMidi + chord.semi), chord.intervals);
    jobs.push(...fretJobs(grip.frets, index * chordDur, 0.014, chordDur * 0.92));
  });
  void fire(jobs, mine).catch(() => undefined);
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
  amp.gain.setValueAtTime(accent ? 0.18 : 0.08, when);
  amp.gain.exponentialRampToValueAtTime(0.0001, when + 0.04);
  src.connect(bp);
  bp.connect(amp);
  amp.connect(bus());
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
