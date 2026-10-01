import { detectPitch, estimatePitch, PitchTracker } from "./pitch.ts";
import { analyzeFreq, nearestMidi } from "./theory.ts";
import { nearestOpen, patternOf, TUNINGS } from "./tunings.ts";

function tone(freq: number, sampleRate: number, length: number, harmonics: number[]): Float32Array {
  const buf = new Float32Array(length);
  const weight = harmonics.reduce((sum, h) => sum + h, 0);
  for (let i = 0; i < length; i += 1) {
    let sample = 0;
    harmonics.forEach((amp, index) => {
      sample += amp * Math.sin((2 * Math.PI * freq * (index + 1) * i) / sampleRate);
    });
    const env = Math.exp((-2.2 * i) / sampleRate);
    buf[i] = (sample / weight) * env;
  }
  return buf;
}

function assert(cond: boolean, message: string) {
  if (!cond) throw new Error(message);
}

const rate = 44100;
const length = 4096;
const guitar = [1, 0.62, 0.4, 0.28, 0.18, 0.12, 0.08];

const a = detectPitch(tone(110, rate, length, guitar), rate);
assert(a !== null && Math.abs(a - 110) < 1.5, `A2 expected ~110, got ${a}`);

const e2 = detectPitch(tone(82.41, rate, length, guitar), rate);
assert(e2 !== null && Math.abs(e2 - 82.41) < 1.2, `E2 expected ~82.4, got ${e2}`);

const d3 = detectPitch(tone(146.83, rate, length, guitar), rate);
assert(d3 !== null && Math.abs(d3 - 146.83) < 1.5, `D3 expected ~146.8, got ${d3}`);

const e4 = detectPitch(tone(329.63, rate, length, guitar), rate);
assert(e4 !== null && Math.abs(e4 - 329.63) < 2, `E4 expected ~329.6, got ${e4}`);

const bright = estimatePitch(tone(196, rate, length, [0.4, 1, 0.7, 0.35]), rate);
assert(bright !== null && Math.abs(bright.freq - 196) < 3, `G3 with loud 2nd should stay ~196, got ${bright?.freq}`);
assert(bright !== null && Math.abs(bright.freq - 392) > 20, `G3 should not jump an octave, got ${bright?.freq}`);

const quiet = detectPitch(new Float32Array(length), rate);
assert(quiet === null, "silence should be null");

const info = analyzeFreq(110);
assert(info?.name === "A" && Math.abs(info.cents) < 1, `110 Hz should be A, got ${info?.name} ${info?.cents}`);
const dropC = analyzeFreq(65.41);
assert(dropC?.name === "C" && Math.abs(dropC.cents) < 8, `Drop C C2 should read C, got ${dropC?.name} ${dropC?.cents}`);
const standard = TUNINGS.find((item) => item.id === "standard");
assert(standard !== undefined && patternOf(standard) === "E  A  D  G  B  E", `standard pattern, got ${standard && patternOf(standard)}`);
const nearD = nearestOpen(73.4, TUNINGS.find((item) => item.id === "drop-d") ?? TUNINGS[0]);
assert(nearD.string.slot === 6 && Math.abs(nearD.cents) < 8, `Drop D low string should be D, got slot ${nearD.string.slot} ${nearD.cents}`);
assert(nearestMidi(9, 60) === 57, `nearest A to 60 should be 57, got ${nearestMidi(9, 60)}`);
assert(nearestMidi(0, 57) === 60, `nearest C to 57 should be 60, got ${nearestMidi(0, 57)}`);

const tracker = new PitchTracker();
const first = tracker.push(tone(110, rate, length, guitar), rate, 0);
const second = tracker.push(tone(110, rate, length, guitar), rate, 40);
assert(second.pc === 9, `tracker should lock A, got ${second.name}`);
assert(second.event === "onset" || first.event === "onset", `expected an onset, got ${first.event} then ${second.event}`);
const rest = tracker.push(new Float32Array(length), rate, 400);
assert(rest.event === "offset" || rest.freq === null, `expected release after silence, got ${rest.event}`);

console.log("pitch and theory checks passed", { a, e2, d3, e4, bright: bright?.freq, clarity: bright?.clarity });
