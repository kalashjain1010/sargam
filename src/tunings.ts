import { mod12, noteName, octaveOf } from "./theory.ts";

export type OpenString = {
  id: string;
  slot: number;
  midi: number;
};

export type TuningGroup = "everyday" | "drop" | "open" | "other";

export type Tuning = {
  id: string;
  name: string;
  group: TuningGroup;
  hint: string;
  flats?: boolean;
  midis: number[];
};

export const TUNING_GROUPS: { id: TuningGroup; label: string }[] = [
  { id: "everyday", label: "Everyday" },
  { id: "drop", label: "Drop" },
  { id: "open", label: "Open" },
  { id: "other", label: "Other" },
];

export const TUNINGS: Tuning[] = [
  {
    id: "standard",
    name: "Standard",
    group: "everyday",
    hint: "The usual six. Almost every lesson here assumes this: thickest string E, then A D G B, thinnest e.",
    midis: [40, 45, 50, 55, 59, 64],
  },
  {
    id: "eb",
    name: "Half step down",
    group: "everyday",
    flats: true,
    hint: "Every string one fret lower than standard. Same shapes, slightly darker, easier on the voice.",
    midis: [39, 44, 49, 54, 58, 63],
  },
  {
    id: "d-standard",
    name: "Whole step down",
    group: "everyday",
    hint: "Every string two frets lower than standard. Same cowboy shapes, the song sits in D instead of E.",
    midis: [38, 43, 48, 53, 57, 62],
  },
  {
    id: "drop-d",
    name: "Drop D",
    group: "drop",
    hint: "Only the thickest string changes. Tune low E down to D. Power chords on that string become one finger.",
    midis: [38, 45, 50, 55, 59, 64],
  },
  {
    id: "drop-c",
    name: "Drop C",
    group: "drop",
    hint: "Whole step down, then drop the thickest string one more step. Heavy, slack, still a guitar.",
    midis: [36, 43, 48, 53, 57, 62],
  },
  {
    id: "drop-csharp",
    name: "Drop C#",
    group: "drop",
    flats: true,
    hint: "Between Drop D and Drop C. Half step down from Drop D — thickest string is C#.",
    midis: [37, 44, 49, 54, 58, 63],
  },
  {
    id: "double-drop-d",
    name: "Double drop D",
    group: "drop",
    hint: "Thickest and thinnest strings both go down to D. Folk and Neil Young territory.",
    midis: [38, 45, 50, 55, 59, 62],
  },
  {
    id: "open-g",
    name: "Open G",
    group: "open",
    hint: "Strum open and you hear G major. Slide a bar across one fret and the chord moves.",
    midis: [38, 43, 50, 55, 59, 62],
  },
  {
    id: "open-d",
    name: "Open D",
    group: "open",
    hint: "Open strings make D major. A slide or one finger across a fret walks the chord up the neck.",
    midis: [38, 45, 50, 54, 57, 62],
  },
  {
    id: "open-e",
    name: "Open E",
    group: "open",
    hint: "Open strings make E major. Same idea as Open D, just two frets higher — or use a capo on Open D.",
    midis: [40, 47, 52, 56, 59, 64],
  },
  {
    id: "open-a",
    name: "Open A",
    group: "open",
    hint: "Open strings make A major. Blues and slide players like this because the bar becomes the chord.",
    midis: [40, 45, 52, 57, 61, 64],
  },
  {
    id: "open-c",
    name: "Open C",
    group: "open",
    hint: "Open strings make C major. Wide, ringing, a little slack on the thickest string.",
    midis: [36, 43, 48, 55, 60, 64],
  },
  {
    id: "open-dm",
    name: "Open D minor",
    group: "open",
    hint: "Like Open D, but the third string sits one fret lower so the open chord is sad instead of bright.",
    midis: [38, 45, 50, 53, 57, 62],
  },
  {
    id: "dadgad",
    name: "DADGAD",
    group: "other",
    hint: "D modal. Open strings are neither fully major nor minor, so drones ring under both moods.",
    midis: [38, 45, 50, 55, 57, 62],
  },
  {
    id: "fourths",
    name: "All fourths",
    group: "other",
    hint: "Every string is the same jump: 5 frets. The B-string surprise of standard tuning is gone.",
    midis: [40, 45, 50, 55, 60, 65],
  },
];

export function letterOf(midi: number, flats = false): string {
  return noteName(mod12(midi), flats);
}

export function midiLabel(midi: number, flats = false): string {
  return `${letterOf(midi, flats)}${octaveOf(midi)}`;
}

export function stringsOf(tuning: Tuning): OpenString[] {
  return tuning.midis.map((midi, index) => ({
    id: String(6 - index),
    slot: 6 - index,
    midi,
  }));
}

export function patternOf(tuning: Tuning): string {
  return tuning.midis.map((midi) => letterOf(midi, tuning.flats)).join("  ");
}

export function hzOf(midi: number, a4 = 440): number {
  return a4 * 2 ** ((midi - 69) / 12);
}

export function centsBetween(freq: number, targetHz: number): number {
  return 1200 * Math.log2(freq / targetHz);
}

export function nearestOpen(freq: number, tuning: Tuning, a4 = 440): { string: OpenString; cents: number; abs: number } {
  const strings = stringsOf(tuning);
  const first = strings[0];
  if (!first) throw new Error("tuning needs six strings");
  let best = first;
  let bestCents = centsBetween(freq, hzOf(best.midi, a4));
  let bestAbs = Math.abs(bestCents);
  for (const string of strings.slice(1)) {
    const cents = centsBetween(freq, hzOf(string.midi, a4));
    const abs = Math.abs(cents);
    if (abs < bestAbs) {
      best = string;
      bestCents = cents;
      bestAbs = abs;
    }
  }
  return { string: best, cents: bestCents, abs: bestAbs };
}

export function chromaticAt(freq: number, a4 = 440, flats = false): { midi: number; cents: number; letter: string; label: string } {
  const midiFloat = 69 + 12 * Math.log2(freq / a4);
  const midi = Math.round(midiFloat);
  return {
    midi,
    cents: (midiFloat - midi) * 100,
    letter: letterOf(midi, flats),
    label: midiLabel(midi, flats),
  };
}

export function tuningById(id: string): Tuning {
  return TUNINGS.find((item) => item.id === id) ?? TUNINGS[0]!;
}
