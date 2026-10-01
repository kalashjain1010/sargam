let ctx: AudioContext | null = null;
const nodes: OscillatorNode[] = [];
let token = 0;
let droneStop: (() => void) | null = null;

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

export function hush(): void {
  token += 1;
  const now = ctx?.currentTime ?? 0;
  for (const osc of nodes) {
    try {
      osc.stop(now);
    } catch {
      /* already stopped */
    }
  }
  nodes.length = 0;
}

function midiHz(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function playMidi(midi: number, dur = 0.7, delay = 0, gain = 0.16): void {
  const context = getCtx();
  const mine = token;
  const start = context.currentTime + delay;
  const osc = context.createOscillator();
  const overtone = context.createOscillator();
  const amp = context.createGain();
  const overAmp = context.createGain();
  osc.type = "triangle";
  overtone.type = "sine";
  osc.frequency.setValueAtTime(midiHz(midi), start);
  overtone.frequency.setValueAtTime(midiHz(midi) * 2, start);
  overAmp.gain.setValueAtTime(0.15, start);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + Math.max(0.08, dur));
  osc.connect(amp);
  overtone.connect(overAmp);
  overAmp.connect(amp);
  amp.connect(context.destination);
  osc.start(start);
  overtone.start(start);
  const stopAt = start + dur + 0.05;
  osc.stop(stopAt);
  overtone.stop(stopAt);
  nodes.push(osc, overtone);
  osc.onended = () => {
    if (mine !== token) return;
  };
}

export function playInterval(rootMidi: number, semitones: number): void {
  hush();
  playMidi(rootMidi, 0.55, 0, 0.16);
  playMidi(rootMidi + semitones, 0.7, 0.42, 0.16);
}

export function playPhrase(startMidi: number, offsets: number[], step = 0.3): void {
  hush();
  offsets.forEach((offset, index) => {
    playMidi(startMidi + offset, step * 0.92, index * step, 0.15);
  });
}

export function playChord(rootMidi: number, intervals: number[], dur = 0.85): void {
  intervals.forEach((semi, index) => {
    playMidi(rootMidi + semi, dur, index * 0.025, semi === 0 ? 0.13 : 0.09);
  });
}

export function startDrone(saMidi: number): void {
  stopDrone();
  const context = getCtx();
  const master = context.createGain();
  master.gain.value = 0.06;
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1400;
  master.connect(filter);
  filter.connect(context.destination);
  const layers = [
    { midi: saMidi - 12, amount: 0.6 },
    { midi: saMidi, amount: 0.45 },
    { midi: saMidi + 7, amount: 0.28 },
  ];
  const oscs = layers.map((layer) => {
    const osc = context.createOscillator();
    osc.type = "triangle";
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

export function saMidiFor(pc: number, around = 48): number {
  const want = ((pc % 12) + 12) % 12;
  const base = around - ((((around % 12) - want) + 12) % 12);
  return around - base > 6 ? base + 12 : base;
}
