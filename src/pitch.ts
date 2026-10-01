import { analyzeFreq } from "./theory.ts";

const MIN_HZ = 70;
const MAX_HZ = 1320;
const CLARITY_OK = 0.62;
const HOLD_MS = 240;

export type PitchGuess = {
  freq: number;
  clarity: number;
};

export type PitchEvent = "none" | "onset" | "hold" | "offset";

export type PitchFrame = {
  freq: number | null;
  rms: number;
  clarity: number;
  midi: number | null;
  cents: number | null;
  pc: number | null;
  name: string | null;
  event: PitchEvent;
  chordish: boolean;
};

const SILENT: PitchFrame = {
  freq: null,
  rms: 0,
  clarity: 0,
  midi: null,
  cents: null,
  pc: null,
  name: null,
  event: "none",
  chordish: false,
};

export function bufferRms(buf: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buf.length; i += 1) sum += buf[i] * buf[i];
  return Math.sqrt(sum / buf.length);
}

const bitrev = new Map<number, Uint32Array>();

function bitReverseTable(n: number): Uint32Array {
  const cached = bitrev.get(n);
  if (cached) return cached;
  const bits = Math.log2(n) | 0;
  const table = new Uint32Array(n);
  for (let i = 0; i < n; i += 1) {
    let x = i;
    let y = 0;
    for (let b = 0; b < bits; b += 1) {
      y = (y << 1) | (x & 1);
      x >>= 1;
    }
    table[i] = y;
  }
  bitrev.set(n, table);
  return table;
}

function fftRadix2(re: Float64Array, im: Float64Array, inverse: boolean): void {
  const n = re.length;
  const rev = bitReverseTable(n);
  for (let i = 0; i < n; i += 1) {
    const j = rev[i] ?? i;
    if (j > i) {
      const tr = re[i];
      const ti = im[i];
      re[i] = re[j] ?? 0;
      im[i] = im[j] ?? 0;
      re[j] = tr ?? 0;
      im[j] = ti ?? 0;
    }
  }
  for (let size = 2; size <= n; size *= 2) {
    const half = size / 2;
    const step = ((inverse ? 2 : -2) * Math.PI) / size;
    for (let i = 0; i < n; i += size) {
      for (let k = 0; k < half; k += 1) {
        const ang = step * k;
        const cos = Math.cos(ang);
        const sin = Math.sin(ang);
        const even = i + k;
        const odd = even + half;
        const or = re[odd] ?? 0;
        const oi = im[odd] ?? 0;
        const tre = or * cos - oi * sin;
        const tim = or * sin + oi * cos;
        const er = re[even] ?? 0;
        const ei = im[even] ?? 0;
        re[odd] = er - tre;
        im[odd] = ei - tim;
        re[even] = er + tre;
        im[even] = ei + tim;
      }
    }
  }
  if (inverse) {
    for (let i = 0; i < n; i += 1) {
      re[i] /= n;
      im[i] /= n;
    }
  }
}

function windowed(buf: Float32Array): Float32Array {
  const out = new Float32Array(buf.length);
  const last = buf.length - 1 || 1;
  for (let i = 0; i < buf.length; i += 1) {
    const hann = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / last);
    out[i] = buf[i] * hann;
  }
  return out;
}

function autocorr(buf: Float32Array): Float32Array {
  let nfft = 1;
  while (nfft < buf.length * 2) nfft *= 2;
  const re = new Float64Array(nfft);
  const im = new Float64Array(nfft);
  for (let i = 0; i < buf.length; i += 1) re[i] = buf[i];
  fftRadix2(re, im, false);
  for (let i = 0; i < nfft; i += 1) {
    re[i] = (re[i] ?? 0) * (re[i] ?? 0) + (im[i] ?? 0) * (im[i] ?? 0);
    im[i] = 0;
  }
  fftRadix2(re, im, true);
  const out = new Float32Array(buf.length);
  for (let i = 0; i < buf.length; i += 1) out[i] = re[i] ?? 0;
  return out;
}

function nsdf(buf: Float32Array): Float32Array {
  const x = windowed(buf);
  const n = x.length;
  const r = autocorr(x);
  const prefix = new Float64Array(n + 1);
  for (let i = 0; i < n; i += 1) prefix[i + 1] = (prefix[i] ?? 0) + x[i] * x[i];
  const out = new Float32Array(Math.floor(n / 2));
  const total = prefix[n] ?? 0;
  for (let tau = 0; tau < out.length; tau += 1) {
    const left = prefix[n - tau] ?? 0;
    const right = total - (prefix[tau] ?? 0);
    const m = left + right;
    const corr = r[tau] ?? 0;
    out[tau] = m <= 1e-12 ? 0 : (2 * corr) / m;
  }
  return out;
}

function interpolate(ns: Float32Array, tau: number): number {
  const y0 = ns[tau - 1] ?? 0;
  const y1 = ns[tau] ?? 0;
  const y2 = ns[tau + 1] ?? 0;
  const denom = y0 - 2 * y1 + y2;
  if (Math.abs(denom) < 1e-12) return tau;
  return tau + (y0 - y2) / (2 * denom);
}

/** McLeod pitch method. Built for plucked strings: fundamental, not the loud overtone. */
export function estimatePitch(buf: Float32Array, sampleRate: number): PitchGuess | null {
  if (buf.length < 512) return null;
  const rms = bufferRms(buf);
  if (rms < 0.0018) return null;

  const ns = nsdf(buf);
  const minTau = Math.max(2, Math.floor(sampleRate / MAX_HZ));
  const maxTau = Math.min(ns.length - 2, Math.floor(sampleRate / MIN_HZ));
  let peakMax = 0;
  const peaks: number[] = [];
  for (let tau = minTau + 1; tau < maxTau; tau += 1) {
    const y = ns[tau] ?? 0;
    if (y > (ns[tau - 1] ?? 0) && y >= (ns[tau + 1] ?? 0) && y > 0.2) {
      peaks.push(tau);
      if (y > peakMax) peakMax = y;
    }
  }
  if (peaks.length === 0 || peakMax < 0.28) return null;

  const cutoff = peakMax * 0.93;
  let chosen = -1;
  for (const tau of peaks) {
    if ((ns[tau] ?? 0) >= cutoff) {
      chosen = tau;
      break;
    }
  }
  if (chosen < 0) return null;

  const tau = interpolate(ns, chosen);
  const freq = sampleRate / tau;
  if (freq < MIN_HZ || freq > MAX_HZ) return null;
  const clarity = Math.min(1, Math.max(0, ns[chosen] ?? 0));
  if (clarity < 0.35) return null;
  return { freq, clarity };
}

export function detectPitch(buf: Float32Array, sampleRate: number): number | null {
  return estimatePitch(buf, sampleRate)?.freq ?? null;
}

function named(freq: number): PitchFrame {
  const info = analyzeFreq(freq);
  if (!info) {
    return { ...SILENT, freq, rms: 0, clarity: 0 };
  }
  return {
    freq,
    rms: 0,
    clarity: 1,
    midi: info.midi,
    cents: info.cents,
    pc: info.pc,
    name: info.name,
    event: "none",
    chordish: false,
  };
}

export class PitchTracker {
  private noise = 0.004;
  private last: PitchFrame | null = null;
  private lastAt = 0;
  private pendingPc = -1;
  private pendingN = 0;
  private live = false;

  reset(): void {
    this.noise = 0.004;
    this.last = null;
    this.lastAt = 0;
    this.pendingPc = -1;
    this.pendingN = 0;
    this.live = false;
  }

  push(buf: Float32Array, sampleRate: number, now: number): PitchFrame {
    const rms = bufferRms(buf);
    if (rms < this.noise) this.noise = this.noise * 0.82 + rms * 0.18;
    else this.noise += (rms - this.noise) * 0.004;
    this.noise = Math.max(0.0007, this.noise);

    const gate = Math.max(0.0024, this.noise * 3.8);
    const guess = rms > gate * 0.85 ? estimatePitch(buf, sampleRate) : null;
    const chordish = rms > gate * 3.2 && (!guess || guess.clarity < 0.32);

    if (guess && guess.clarity >= CLARITY_OK && rms > gate) {
      const frame = { ...named(guess.freq), rms, clarity: guess.clarity, chordish: false };
      const same = this.last?.pc === frame.pc;
      if (frame.pc === this.pendingPc) this.pendingN += 1;
      else {
        this.pendingPc = frame.pc ?? -1;
        this.pendingN = 1;
      }
      const confirmed = this.pendingN >= 2;
      let event: PitchEvent = "hold";
      if (confirmed && (!this.live || !same)) event = "onset";
      else if (!confirmed) event = this.live ? "hold" : "none";
      if (confirmed) this.live = true;
      this.last = frame;
      this.lastAt = now;
      return { ...frame, event };
    }

    if (this.last && now - this.lastAt < HOLD_MS && rms > gate * 0.4) {
      return { ...this.last, rms, event: "hold", chordish };
    }

    const event: PitchEvent = this.live ? "offset" : "none";
    this.live = false;
    this.pendingPc = -1;
    this.pendingN = 0;
    this.last = null;
    return { ...SILENT, rms, event, chordish };
  }
}

export const idleFrame = (): PitchFrame => ({ ...SILENT });
