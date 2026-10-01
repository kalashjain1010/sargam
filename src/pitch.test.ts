import { aRootFret, eRootFret, gripToMidis, kindFromIntervals, preferredBass, scaleBox, voicingFor } from "./guitar.ts";
import { detectPitch, estimatePitch, PitchTracker } from "./pitch.ts";
import { analyzeFreq, jumpsOf, MAJOR, MINOR_PENT, mod12, nearestMidi, OPEN_GRIPS, sameSteps } from "./theory.ts";
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

const gMajor = voicingFor(7, [0, 4, 7]);
assert(gMajor.frets.join(",") === "3,2,0,0,0,3", `G should be the open G grip, got ${gMajor.frets}`);
const cMajor = voicingFor(0, [0, 4, 7]);
assert(cMajor.frets[0] === null && cMajor.frets[1] === 3, `C should be open C, got ${cMajor.frets}`);
const fMajor = voicingFor(5, [0, 4, 7]);
assert(fMajor.frets.join(",") === "1,3,3,2,1,1", `F should be E-shape at 1, got ${fMajor.frets}`);
const bMajor = voicingFor(11, [0, 4, 7]);
assert(bMajor.frets[0] === null && bMajor.frets[1] === 2, `B should be A-shape at 2, got ${bMajor.frets}`);
const eDim = voicingFor(4, [0, 3, 6]);
assert(eDim.frets.join(",") === "0,1,2,0,,", `E dim should stay open, got ${eDim.frets}`);
assert(kindFromIntervals([0, 4, 7, 14]) === "add9", "Cadd9 intervals");
assert(kindFromIntervals([0, 5, 7]) === "sus4", "sus4 intervals");
assert(eRootFret(5) === 1 && aRootFret(0) === 3, "F E-shape fret 1, C A-shape fret 3");
assert(preferredBass(7) === "E", "G box starts on low E");
assert(preferredBass(0) === "A", "C box starts on A");
const gBox = scaleBox(7, MAJOR, "E");
assert(gBox[0]?.stringId === "E" && gBox[0]?.fret === 3, `G major box should start low E fret 3, got ${gBox[0]?.stringId} ${gBox[0]?.fret}`);
for (const pos of gBox) {
  assert(MAJOR.includes(mod12(pos.midi - 7)), `G box extra ${pos.stringId}${pos.fret}`);
}
const aPent = scaleBox(9, MINOR_PENT, "E");
assert(jumpsOf(MAJOR).join(" ") === "2 2 1 2 2 2 1", `major gaps ${jumpsOf(MAJOR)}`);
assert(jumpsOf(MINOR_PENT).join(" ") === "3 2 2 3 2", `minor pent gaps ${jumpsOf(MINOR_PENT)}`);
assert(sameSteps([0, 2, 4, 5, 7, 9, 11], MAJOR), "sameSteps major");
assert(aPent.some((pos) => pos.stringId === "E" && pos.fret === 5), "A minor pent box includes low E fret 5");
assert(aPent.every((pos) => pos.fret >= 5 && pos.fret <= 8), `A minor pent stays in 5-8, got ${aPent.map((p) => p.fret)}`);

const TONES: Record<string, number[]> = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  "7": [0, 4, 7, 10],
  dim: [0, 3, 6],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  add9: [0, 2, 4, 7],
};
for (const kind of ["maj", "min", "7", "dim"] as const) {
  for (let root = 0; root < 12; root += 1) {
    const grip = voicingFor(root, TONES[kind]);
    const allowed = new Set(TONES[kind]);
    const sounding = gripToMidis(grip.frets).filter((midi): midi is number => midi !== null);
    assert(sounding.length >= 3, `${grip.name} too thin`);
    assert(
      sounding.some((midi) => mod12(midi) === root),
      `${grip.name} missing root`,
    );
    for (const midi of sounding) {
      const rel = mod12(midi - root);
      assert(allowed.has(rel), `${grip.name} extra ${rel} (midi ${midi}) frets ${grip.frets}`);
    }
  }
}
for (const grip of OPEN_GRIPS) {
  const sounding = gripToMidis(grip.frets).filter((midi): midi is number => midi !== null);
  assert(sounding.some((midi) => mod12(midi) === grip.rootPc), `open ${grip.name} missing root`);
}

console.log("pitch and theory checks passed", { a, e2, d3, e4, bright: bright?.freq, clarity: bright?.clarity, g: gMajor.name });
