import { detectPitch } from "./pitch.ts";
import { analyzeFreq, nearestMidi } from "./theory.ts";

function sine(freq: number, sampleRate: number, length: number, harmonics = [1]): Float32Array {
  const buf = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    let sample = 0;
    harmonics.forEach((h, index) => {
      sample += Math.sin((2 * Math.PI * freq * h * i) / sampleRate) / (index + 1);
    });
    buf[i] = sample / harmonics.length;
  }
  return buf;
}

function assert(cond: boolean, message: string) {
  if (!cond) throw new Error(message);
}

const rate = 44100;
const length = 2048;
const a = detectPitch(sine(110, rate, length, [1, 2, 3]), rate);
assert(a !== null && Math.abs(a - 110) < 1.5, `A2 expected ~110, got ${a}`);
const e = detectPitch(sine(329.63, rate, length, [1, 2]), rate);
assert(e !== null && Math.abs(e - 329.63) < 2, `E4 expected ~329.6, got ${e}`);
const quiet = detectPitch(new Float32Array(length), rate);
assert(quiet === null, "silence should be null");
const info = analyzeFreq(110);
assert(info?.name === "A" && Math.abs(info.cents) < 1, `110 Hz should be A, got ${info?.name} ${info?.cents}`);
assert(nearestMidi(9, 60) === 57, `nearest A to 60 should be 57, got ${nearestMidi(9, 60)}`);
assert(nearestMidi(0, 57) === 60, `nearest C to 57 should be 60, got ${nearestMidi(0, 57)}`);
console.log("pitch and theory checks passed", { a, e });
