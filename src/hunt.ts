import { playChord, playPhrase, playProgression } from "./audio.ts";
import { SCALES } from "./scales.ts";
import {
  BHAIRAVI,
  BHUPALI,
  KAFI,
  KHAMAJ,
  MAJOR,
  MINOR_PENT,
  NATURAL_MINOR,
  SONGS,
  YAMAN,
  chordName,
  nearestMidi,
  noteName,
  qualityIntervals,
  sameSteps,
  usesFlats,
  type Song,
} from "./theory.ts";

export function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = out[i];
    const b = out[j];
    if (a === undefined || b === undefined) continue;
    out[i] = b;
    out[j] = a;
  }
  return out;
}

function unique(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}

function options(correct: string, pool: string[], size = 4): string[] {
  const rest = shuffle(unique(pool).filter((item) => item !== correct));
  const picked = [correct, ...rest.slice(0, Math.max(0, size - 1))];
  return shuffle(unique(picked));
}

function bedIntervals(song: Song, q: Song["chords"][number]["q"]): number[] {
  if (song.family === "Power riff") return [0, 7];
  return qualityIntervals(q);
}

export function loopLabel(song: Song): string {
  return song.chords.map((chord) => chordName(song.guitarPc, chord.semi, chord.q)).join(" · ");
}

export function homeLetter(song: Song): string {
  return noteName(song.guitarPc, usesFlats(song.guitarPc));
}

export function scaleLabel(steps: number[]): string {
  return SCALES.find((scale) => sameSteps(scale.steps, steps))?.name ?? "A custom walk";
}

export function playSongLoop(song: Song): void {
  playProgression(
    nearestMidi(song.guitarPc, 52),
    song.chords.map((chord) => ({ semi: chord.semi, intervals: bedIntervals(song, chord.q) })),
  );
}

export function playSongHome(song: Song): void {
  const chord = song.chords[0];
  if (!chord) return;
  playChord(nearestMidi(song.guitarPc + chord.semi, 52), bedIntervals(song, chord.q), 1.1);
}

export function playSongScale(song: Song): void {
  playPhrase(nearestMidi(song.guitarPc, 60), [...song.steps, 12], 0.18);
}

export type HuntStep = {
  id: string;
  title: string;
  prompt: string;
  choices: string[];
  answer: number;
  why: string;
  listen?: () => void;
  listenLabel?: string;
  pad?: boolean;
};

export type Hunt = {
  song: Song;
  steps: HuntStep[];
};

function stepOf(
  id: string,
  title: string,
  prompt: string,
  correct: string,
  pool: string[],
  why: string,
  extra: Partial<HuntStep> = {},
): HuntStep {
  const choices = extra.pad ? extra.choices ?? options(correct, pool, 12) : options(correct, pool);
  return {
    id,
    title,
    prompt,
    why,
    listenLabel: extra.listenLabel,
    listen: extra.listen,
    pad: extra.pad,
    choices,
    answer: Math.max(0, choices.indexOf(correct)),
  };
}

function faceStep(song: Song): HuntStep {
  if (song.family === "Power riff") {
    return stepOf(
      "face",
      "The face",
      `${song.title} is a riff of roots. Hear the bed. Why can't the guitar tell you happy vs sad?`,
      "No 3rd — only root and 5th",
      ["No 3rd — only root and 5th", "It is always major", "It is always minor", "The drums hide the 3rd"],
      "Power chords are two notes. The face lives in the vocal, or in a later overdub. The box is minor pentatonic.",
      { listen: () => playSongLoop(song), listenLabel: "Hear the riff bed" },
    );
  }
  const sad = song.chords[0]?.q === "min";
  const home = loopLabel(song).split(" · ")[0] ?? homeLetter(song);
  return stepOf(
    "face",
    "The face",
    `Hear the first chord of ${song.title}. Is home bright or sad?`,
    sad ? "Sad · minor (3-fret 3rd)" : "Bright · major (4-fret 3rd)",
    ["Bright · major (4-fret 3rd)", "Sad · minor (3-fret 3rd)", "No 3rd — power chord", "Diminished · restless"],
    `${home} is home in the guitar lesson. ${sad ? "Three frets up is the sad face." : "Four frets up is the bright face."} The record may sit in another letter. Capo until the singer matches.`,
    { listen: () => playSongHome(song), listenLabel: "Hear home" },
  );
}

function loopStep(song: Song): HuntStep {
  const correct = loopLabel(song);
  const pool = SONGS.filter((item) => item.id !== song.id).map(loopLabel);
  return stepOf(
    "loop",
    "The clothes",
    `Hear the loop under ${song.title}. Name the guitar clothes — not the hit melody.`,
    correct,
    pool,
    `${correct}. That is a practice bed, not a transcription of the record. ${song.bedNote}`,
    { listen: () => playSongLoop(song), listenLabel: "Hear the loop" },
  );
}

const LETTERS = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

function homeStep(song: Song): HuntStep {
  const raw = homeLetter(song);
  const aliases: Record<string, string> = { "C#": "Db", "D#": "Eb", "G#": "Ab", "A#": "Bb" };
  const correct = LETTERS.includes(raw) ? raw : (aliases[raw] ?? raw);
  return stepOf(
    "home",
    "Home letter",
    `This site starts ${song.title} on which letter? Easy shapes. If the singer is higher, capo — same furniture, new floor.`,
    correct,
    LETTERS,
    `${homeLetter(song)}. ${song.caveat}`,
    { pad: true, choices: LETTERS },
  );
}

function scaleStep(song: Song): HuntStep {
  const correct = scaleLabel(song.steps);
  const pool = SCALES.map((scale) => scale.name);
  return stepOf(
    "scale",
    "The scale",
    `Hear the walk from ${homeLetter(song)}. Which scale is the bed for ${song.title}?`,
    correct,
    pool,
    `${correct}. ${song.tell}`,
    { listen: () => playSongScale(song), listenLabel: "Hear the walk" },
  );
}

function visitorsOf(song: Song): string[] {
  if (song.family !== "Chromatic") return [];
  const allowed = new Set(song.steps.map((step) => step % 12));
  return unique(
    song.chords
      .filter((chord) => {
        const third = chord.q === "min" ? 3 : 4;
        return !allowed.has((chord.semi + third) % 12);
      })
      .map((chord) => chordName(song.guitarPc, chord.semi, chord.q)),
  );
}

function tellStep(song: Song): HuntStep | null {
  const home = homeLetter(song);
  const letter = (semi: number) => noteName(song.guitarPc + semi, usesFlats(song.guitarPc));
  const names = song.chords.map((chord) => chordName(song.guitarPc, chord.semi, chord.q));
  const visitors = visitorsOf(song);

  if (visitors.length > 0) {
    const correct = visitors[0]!;
    const diatonic = names.filter((name) => !visitors.includes(name));
    return stepOf(
      "tell",
      "The visitor",
      `${song.title} leaves the home scale on purpose. Which chord is a visitor?`,
      correct,
      [...visitors, ...diatonic, "None — it never leaves"],
      `${correct} brings a 3rd that is not in ${scaleLabel(song.steps)} from ${home}. ${song.tell}`,
      { listen: () => playSongLoop(song), listenLabel: "Hear the loop again" },
    );
  }

  if (sameSteps(song.steps, YAMAN)) {
    return stepOf(
      "tell",
      "The tell",
      `Lydian keeps a bright 3rd and raises one stair. In ${home}, which letter is the dreamy 4th?`,
      `${letter(6)} · 6 frets (raised 4th)`,
      [`${letter(6)} · 6 frets (raised 4th)`, `${letter(5)} · 5 frets (ordinary 4th)`, `${letter(10)} · flat 7th`, `${letter(3)} · sad 3rd`],
      `In ${home}, ${letter(6)} not ${letter(5)}. One stair. That is the whole face.`,
      { listen: () => playSongScale(song), listenLabel: "Hear the walk" },
    );
  }

  if (sameSteps(song.steps, KHAMAJ)) {
    return stepOf(
      "tell",
      "The tell",
      `Mixolydian is major clothes with the door open. In ${home}, which 7th?`,
      `${letter(10)} · 10 frets (door open)`,
      [`${letter(10)} · 10 frets (door open)`, `${letter(11)} · 11 frets (door closed)`, `${letter(6)} · raised 4th`, `${letter(3)} · sad 3rd`],
      `Bright 3rd, flat 7th. In ${home} that letter is ${letter(10)}, not ${letter(11)}.`,
      { listen: () => playSongScale(song), listenLabel: "Hear the walk" },
    );
  }

  if (sameSteps(song.steps, BHAIRAVI)) {
    return stepOf(
      "tell",
      "The tell",
      `Phrygian's mood is a tiny 2nd. In ${home}, which letter sits one fret above home?`,
      `${letter(1)} · 1 fret (flat 2nd)`,
      [`${letter(1)} · 1 fret (flat 2nd)`, `${letter(2)} · 2 frets (ordinary 2nd)`, `${letter(6)} · raised 4th`, `${letter(4)} · bright 3rd`],
      `Fret 1, not fret 2. In ${home} that is ${letter(1)}.`,
      { listen: () => playSongScale(song), listenLabel: "Hear the walk" },
    );
  }

  if (sameSteps(song.steps, KAFI)) {
    return stepOf(
      "tell",
      "The tell",
      `Dorian vs natural minor: both sad in the 3rd. In ${home}, which 6th?`,
      `${letter(9)} · bright 6th (Dorian)`,
      [`${letter(9)} · bright 6th (Dorian)`, `${letter(8)} · sad 6th (natural minor)`, `${letter(4)} · bright 3rd`, `${letter(11)} · closed door`],
      `Sad 3rd, smiling 6th. In ${home} that letter is ${letter(9)}.`,
      { listen: () => playSongScale(song), listenLabel: "Hear the walk" },
    );
  }

  if (sameSteps(song.steps, BHUPALI) || sameSteps(song.steps, MINOR_PENT)) {
    const five = sameSteps(song.steps, BHUPALI) ? "Major pentatonic leaves out the 4th and the 7th." : "Minor pentatonic is 1, sad 3rd, 4, 5, sad 7th. No 2nd, no 6th.";
    return stepOf(
      "tell",
      "The tell",
      `Five notes, not seven. What did ${song.title}'s box leave out on purpose?`,
      sameSteps(song.steps, BHUPALI) ? "The 4th and the 7th" : "The 2nd and the 6th",
      ["The 4th and the 7th", "The 2nd and the 6th", "The 5th", "The root"],
      five,
      { listen: () => playSongScale(song), listenLabel: "Hear the box" },
    );
  }

  if (sameSteps(song.steps, NATURAL_MINOR) || sameSteps(song.steps, MAJOR)) {
    const sad = song.chords[0]?.q === "min";
    const homeChord = names[0] ?? home;
    return stepOf(
      "tell",
      "Who can end it",
      `Which chord can end a line of ${song.title} — the one that feels like the last word?`,
      homeChord,
      names.length >= 3 ? names : [...names, "G", "Am", "C"],
      `${homeChord} is ${sad ? "i" : "I"}. Number the others from there. ${song.loopName}`,
      { listen: () => playSongHome(song), listenLabel: "Hear home" },
    );
  }

  return null;
}

function twinStep(song: Song): HuntStep | null {
  const sameSig = (other: Song) =>
    other.chords.map((chord) => `${chord.semi}${chord.q}`).join("-") ===
    song.chords.map((chord) => `${chord.semi}${chord.q}`).join("-");
  const family = SONGS.filter((item) => item.id !== song.id && item.family === song.family);
  const ranked = shuffle(family).sort((a, b) => Number(sameSig(b)) - Number(sameSig(a)));
  const twin = ranked[0];
  if (!twin) return null;
  const decoys = SONGS.filter((item) => item.id !== song.id && item.family !== song.family).map((item) => item.title);
  return stepOf(
    "twin",
    "Same clothes",
    `${song.title} wears the same harmonic clothes as which other real title?`,
    twin.title,
    [twin.title, ...decoys],
    `${twin.title} (${twin.film}, ${twin.year}) sits in the same ${song.family} family. Learn one loop, you own the other. Capo if the singer needs a new height.`,
  );
}

export function buildHunt(song: Song): Hunt {
  const steps = [faceStep(song), loopStep(song), homeStep(song), scaleStep(song)];
  const tell = tellStep(song);
  if (tell) steps.push(tell);
  const twin = twinStep(song);
  if (twin) steps.push(twin);
  return { song, steps };
}

export function randomSong(except?: string): Song {
  const pool = except ? SONGS.filter((song) => song.id !== except) : SONGS;
  return shuffle(pool)[0] ?? SONGS[0]!;
}
