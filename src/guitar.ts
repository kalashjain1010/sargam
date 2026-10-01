import { mod12, noteName, OPEN_GRIPS, STRINGS, usesFlats } from "./theory.ts";
import type { FretPos, Grip } from "./theory.ts";

/** Open strings, low E → high e. */
export const OPEN_MIDI = [40, 45, 50, 55, 59, 64] as const;

export type ChordKind = "maj" | "min" | "7" | "dim" | "maj7" | "min7" | "sus2" | "sus4" | "add9";

export type Voicing = {
  name: string;
  kind: ChordKind;
  rootPc: number;
  frets: (number | null)[];
};

const EXTRA: Voicing[] = [
  { name: "F", kind: "maj", rootPc: 5, frets: [1, 3, 3, 2, 1, 1] },
  { name: "Fm", kind: "min", rootPc: 5, frets: [1, 3, 3, 1, 1, 1] },
  { name: "B7", kind: "7", rootPc: 11, frets: [null, 2, 1, 2, 0, 2] },
  { name: "C7", kind: "7", rootPc: 0, frets: [null, 3, 2, 3, 1, 0] },
  { name: "Cmaj7", kind: "maj7", rootPc: 0, frets: [null, 3, 2, 0, 0, 0] },
  { name: "Am7", kind: "min7", rootPc: 9, frets: [null, 0, 2, 0, 1, 0] },
  { name: "Em7", kind: "min7", rootPc: 4, frets: [0, 2, 0, 0, 0, 0] },
  { name: "Dm7", kind: "min7", rootPc: 2, frets: [null, null, 0, 2, 1, 1] },
  { name: "Dsus2", kind: "sus2", rootPc: 2, frets: [null, null, 0, 2, 3, 0] },
  { name: "Asus2", kind: "sus2", rootPc: 9, frets: [null, 0, 2, 2, 0, 0] },
  { name: "Esus4", kind: "sus4", rootPc: 4, frets: [0, 2, 2, 2, 0, 0] },
  { name: "Asus4", kind: "sus4", rootPc: 9, frets: [null, 0, 2, 2, 3, 0] },
  { name: "Fmaj7", kind: "maj7", rootPc: 5, frets: [null, null, 3, 2, 1, 0] },
];

function gripKind(grip: Grip): ChordKind {
  if (/add9/i.test(grip.name)) return "add9";
  if (/sus4/i.test(grip.name)) return "sus4";
  if (/sus2/i.test(grip.name)) return "sus2";
  if (/maj7/i.test(grip.name)) return "maj7";
  if (grip.q === "min") return "min";
  if (grip.q === "7") return "7";
  if (grip.q === "dim") return "dim";
  return "maj";
}

function known(): Voicing[] {
  return [
    ...OPEN_GRIPS.map((grip) => ({
      name: grip.name,
      kind: gripKind(grip),
      rootPc: grip.rootPc,
      frets: grip.frets,
    })),
    ...EXTRA,
  ];
}

export function kindFromIntervals(intervals: number[]): ChordKind {
  const pcs = new Set(intervals.map((semi) => mod12(semi)));
  const third = pcs.has(4);
  const minor = pcs.has(3);
  const fifth = pcs.has(7);
  const flatFive = pcs.has(6);
  const flatSeven = pcs.has(10);
  const majSeven = pcs.has(11);
  const ninth = intervals.some((semi) => semi === 14 || (mod12(semi) === 2 && third));
  if (ninth && third) return "add9";
  if (pcs.has(2) && !third && !minor) return "sus2";
  if (pcs.has(5) && !third && !minor) return "sus4";
  if (minor && flatFive && !fifth) return "dim";
  if (minor && flatSeven) return "min7";
  if (third && flatSeven) return "7";
  if (third && majSeven) return "maj7";
  if (minor) return "min";
  return "maj";
}

function eShape(fret: number, kind: ChordKind): (number | null)[] {
  const f = fret;
  if (kind === "min") return [f, f + 2, f + 2, f, f, f];
  if (kind === "7") return [f, f + 2, f, f + 1, f, f];
  if (kind === "maj7") return [f, f + 2, f + 1, f + 1, f, f];
  if (kind === "min7") return [f, f + 2, f, f, f, f];
  if (kind === "sus4") return [f, f + 2, f + 2, f + 2, f, f];
  if (kind === "sus2") return [f, f + 2, f + 4, f + 4, f, f];
  if (kind === "dim") return [f, f + 1, f + 2, f, null, null];
  if (kind === "add9") return [f, f + 2, f + 2, f + 1, f, f + 2];
  return [f, f + 2, f + 2, f + 1, f, f];
}

function aShape(fret: number, kind: ChordKind): (number | null)[] {
  const f = fret;
  if (kind === "min") return [null, f, f + 2, f + 2, f + 1, f];
  if (kind === "7") return [null, f, f + 2, f, f + 2, f];
  if (kind === "maj7") return [null, f, f + 2, f + 1, f + 2, f];
  if (kind === "min7") return [null, f, f + 2, f, f + 1, f];
  if (kind === "sus4") return [null, f, f + 2, f + 2, f + 3, f];
  if (kind === "sus2") return [null, f, f + 2, f + 2, f, f];
  if (kind === "dim") return [null, f, f + 1, f + 2, f + 1, null];
  if (kind === "add9") return [null, f, f + 2, f + 2, f, f];
  return [null, f, f + 2, f + 2, f + 2, f];
}

export function eRootFret(rootPc: number): number {
  return mod12(rootPc - 4);
}

export function aRootFret(rootPc: number): number {
  return mod12(rootPc - 9);
}

function shaped(rootPc: number, kind: ChordKind): Voicing {
  const eFret = eRootFret(rootPc);
  const aFret = aRootFret(rootPc);
  const useE = eFret > 0 && eFret <= 4 ? true : aFret === 0 || aFret > 5 ? true : eFret <= 4;
  if (useE) {
    const fret = eFret === 0 ? 12 : eFret;
    return { name: `${noteName(rootPc)} ${kind} (E shape)`, kind, rootPc, frets: eShape(fret, kind) };
  }
  const fret = aFret === 0 ? 12 : aFret;
  return { name: `${noteName(rootPc)} ${kind} (A shape)`, kind, rootPc, frets: aShape(fret, kind) };
}

export function voicingFor(rootPc: number, intervals: number[]): Voicing {
  const kind = kindFromIntervals(intervals);
  const pc = mod12(rootPc);
  const hit = known().find((item) => item.rootPc === pc && item.kind === kind);
  if (hit) return hit;
  return shaped(pc, kind);
}

export function gripToMidis(frets: (number | null)[]): (number | null)[] {
  return frets.map((fret, index) => (fret === null ? null : OPEN_MIDI[index] + fret));
}

export function stringLabel(id: string): string {
  if (id === "E") return "low E";
  if (id === "e") return "high e";
  return id;
}

export type BoxBass = "E" | "A";

export function preferredBass(homePc: number): BoxBass {
  const eFret = eRootFret(homePc);
  const aFret = aRootFret(homePc);
  if (eFret > 0 && eFret <= 5) return "E";
  if (aFret <= 5) return "A";
  return eFret <= aFret ? "E" : "A";
}

export function boxStartFret(homePc: number, bass: BoxBass): number {
  return bass === "A" ? aRootFret(homePc) : eRootFret(homePc);
}

export function boxSpan(steps: number[]): number {
  return steps.length <= 6 ? 3 : 4;
}

/** One playable window on the neck: same few frets, all six strings. */
export function scaleBox(homePc: number, steps: number[], bass: BoxBass = preferredBass(homePc)): FretPos[] {
  const allowed = new Set(steps.map((step) => mod12(homePc + step)));
  const start = boxStartFret(homePc, bass);
  const span = boxSpan(steps);
  const lo = start;
  const hi = start + span;
  const lowToHigh = [...STRINGS].reverse();
  const path: FretPos[] = [];
  for (const string of lowToHigh) {
    for (let fret = lo; fret <= hi; fret += 1) {
      const midi = string.midi + fret;
      if (allowed.has(mod12(midi))) path.push({ stringId: string.id, fret, midi });
    }
  }
  return path;
}

export function scaleRun(box: FretPos[], kind: "up" | "down" | "updown"): FretPos[] {
  if (kind === "up") return box;
  if (kind === "down") return [...box].reverse();
  const down = [...box].reverse().slice(1);
  return [...box, ...down];
}

export function phraseOnBox(box: FretPos[], homePc: number, phrase: number[]): FretPos[] {
  if (box.length === 0) return [];
  const home = mod12(homePc);
  const root = box.find((pos) => mod12(pos.midi) === home) ?? box[0];
  let prev = root.midi;
  return phrase.map((offset, index) => {
    const want = mod12(home + offset);
    const hits = box.filter((pos) => mod12(pos.midi) === want);
    if (hits.length === 0) return { ...root, midi: prev };
    const goingUp = index === 0 || offset >= (phrase[index - 1] ?? offset);
    let pick = hits[0];
    let best = 999;
    for (const hit of hits) {
      const score = goingUp
        ? hit.midi >= prev
          ? hit.midi - prev
          : 24 + prev - hit.midi
        : hit.midi <= prev
          ? prev - hit.midi
          : 24 + hit.midi - prev;
      if (score < best) {
        best = score;
        pick = hit;
      }
    }
    prev = pick.midi;
    return pick;
  });
}

export function fingerInBox(fret: number, boxStart: number): number {
  const gap = Math.max(0, fret - boxStart);
  if (gap <= 0) return 1;
  if (gap === 1) return 2;
  if (gap === 2) return 3;
  return 4;
}

const FINGER = ["", "index", "middle", "ring", "pinky"];

export function walkBlurb(pos: FretPos, homePc: number, boxStart: number): string {
  const finger = fingerInBox(pos.fret, boxStart);
  const letter = noteName(pos.midi, usesFlats(homePc));
  const home = mod12(pos.midi) === mod12(homePc) ? " · home" : "";
  return `${stringLabel(pos.stringId)} fret ${pos.fret} · ${FINGER[finger]} · ${letter}${home}`;
}

export function boxHint(homePc: number, bass: BoxBass, boxStart: number, span = 4): string {
  const letter = noteName(homePc, usesFlats(homePc));
  const string = bass === "A" ? "A string" : "low E string";
  const open = boxStart === 0 ? " (open string — no fret hand)" : "";
  return `Put your index finger on the ${string}, fret ${boxStart}${open}. That letter is ${letter}, which is home. Stay in this window: index on fret ${boxStart}, pinky on fret ${boxStart + span}. One finger per fret. Do not jump around the neck yet.`;
}
