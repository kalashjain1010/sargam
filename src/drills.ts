import { playChord, playInterval, playPhrase } from "./audio.ts";
import type { Question } from "./components/Quiz.tsx";
import { homeLetter, loopLabel, playSongLoop, playSongScale, scaleLabel } from "./hunt.ts";
import { KAFI, KHAMAJ, MAJOR, NATURAL_MINOR, SONGS as CATALOG, YAMAN } from "./theory.ts";

export type DrillPack = {
  id: string;
  title: string;
  blurb: string;
  size: number;
  build: () => Question[];
};

function shuffle<T>(items: T[]): T[] {
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

function take(bank: Question[], size: number): Question[] {
  return shuffle(bank).slice(0, Math.min(size, bank.length));
}

const NECK: Question[] = [
  {
    prompt: "Name the six open strings, thick to thin.",
    choices: ["E A D G B E", "E A D G C E", "D A D G B E", "G C E A D G"],
    answer: 0,
    why: "Standard tuning. The last E is the same letter as the first, two octaves up.",
  },
  {
    prompt: "Fret 12 on any string is what, compared with the open string?",
    choices: ["A fifth higher", "The same letter, one octave up", "A random new letter", "Always B"],
    answer: 1,
    why: "Halfway along the speaking length. Same name, twice the frequency.",
  },
  {
    prompt: "Low E, fret 5, is which letter?",
    choices: ["G", "A", "B", "C"],
    answer: 1,
    why: "Five frets is a fourth. E plus a fourth is A — the next open string.",
  },
  {
    prompt: "The open G cowboy shape, low E to high e, is which frets?",
    choices: ["3 2 0 0 0 3", "x 3 2 0 1 0", "x x 0 2 3 2", "1 3 3 2 1 1"],
    answer: 0,
    why: "Campfire G. If this is wrong, the first song night is wrong.",
  },
  {
    prompt: "F major as a barre is the open E shape slid where?",
    choices: ["Fret 5, because F is pitch-class 5", "Fret 1", "Fret 8", "You cannot barre F"],
    answer: 1,
    why: "E to F is one fret. Index across fret 1: 1 3 3 2 1 1.",
  },
  {
    prompt: "Open C mutes which string?",
    choices: ["High e", "Low E", "The B string", "None — strum all six"],
    answer: 1,
    why: "x 3 2 0 1 0. The low E would add an extra E under a C chord. Let it sit.",
  },
  {
    prompt: "Capo 2 plus G cowboy shapes puts the song in which letter?",
    choices: ["G still", "A", "B", "F"],
    answer: 1,
    why: "Capo is addition. G is 7. Plus two frets is 9, which is A. Same hands, new home.",
  },
  {
    prompt: "The B string is how many frets above the G string, open?",
    choices: ["5, like every other pair", "4 — the one surprise in standard tuning", "7", "2"],
    answer: 1,
    why: "G to B is a major 3rd (4 frets). Every other neighbor is a 4th (5 frets). That is why the B-string fingering shifts.",
  },
];

const GAPS: Question[] = [
  {
    prompt: "A perfect 5th is how many frets on one string?",
    choices: ["5", "7", "4", "12"],
    answer: 1,
    why: "Seven frets. Power chords are root plus this.",
  },
  {
    prompt: "A major 3rd is how many frets? A minor 3rd?",
    choices: ["4 and 3", "3 and 4", "5 and 4", "7 and 3"],
    answer: 0,
    why: "Four frets = bright face. Three frets = sad face. That is the whole major/minor difference.",
  },
  {
    prompt: "An octave is how many frets?",
    choices: ["7", "8", "12", "5"],
    answer: 2,
    why: "Twelve stairs, then the letter comes back. Fret 12.",
  },
  {
    prompt: "A perfect 4th is how many frets?",
    choices: ["4", "5", "6", "7"],
    answer: 1,
    why: "Five. Open E to open A. Open A to open D. Open D to open G.",
  },
  {
    prompt: "Play these two notes. What distance?",
    choices: ["Minor 3rd · 3 frets", "Major 3rd · 4 frets", "Perfect 5th · 7 frets", "Octave · 12 frets"],
    answer: 2,
    why: "Seven frets. That is a 5th — the spine of a chord.",
    listen: () => playInterval(64, 7),
  },
  {
    prompt: "Play these two notes. Bright 3rd or sad 3rd?",
    choices: ["Sad · 3 frets", "Bright · 4 frets", "Neither — it is a 5th", "Octave"],
    answer: 1,
    why: "Four frets. Major 3rd. The happy face.",
    listen: () => playInterval(60, 4),
  },
  {
    prompt: "Play these two notes. Bright 3rd or sad 3rd?",
    choices: ["Sad · 3 frets", "Bright · 4 frets", "A 4th", "A 2nd"],
    answer: 0,
    why: "Three frets. Minor 3rd. The sad face.",
    listen: () => playInterval(60, 3),
  },
  {
    prompt: "The tritone — the restless jump — is how many frets?",
    choices: ["5", "6", "7", "8"],
    answer: 1,
    why: "Six frets. Exactly halfway to the octave. Dim chords and Lydian’s raised 4th live here.",
  },
];

const SCALES: Question[] = [
  {
    prompt: "The major scale walk in frets is:",
    choices: ["2 2 1 2 2 2 1", "2 1 2 2 1 2 2", "3 2 2 3 2", "2 2 2 1 2 2 1"],
    answer: 0,
    why: "Skip, skip, next, skip, skip, skip, next. Happy Birthday. Let It Be. Open G, C, D, A, E.",
  },
  {
    prompt: "In C, Lydian is major with which one change?",
    choices: ["F becomes F#", "B becomes Bb", "E becomes Eb", "G becomes Gb"],
    answer: 0,
    why: "Raise the 4th one fret. C D E F# G A B. One stair. New face.",
  },
  {
    prompt: "Mixolydian keeps a bright 3rd and changes what?",
    choices: ["The 4th goes up", "The 7th drops one fret (door open)", "The 2nd becomes tiny", "There is no 5th"],
    answer: 1,
    why: "10 frets, not 11. In C: Bb instead of B. Major clothes, unlatched door.",
  },
  {
    prompt: "Dorian versus natural minor. What is the tell?",
    choices: ["Dorian has a bright 6th", "Dorian has a bright 3rd", "Dorian has no 5th", "They are the same"],
    answer: 0,
    why: "Both sad in the 3rd. Dorian’s 6th is 9 frets (bright). Natural minor’s is 8 (sad). In A: F# vs F.",
  },
  {
    prompt: "A minor pentatonic is which five stairs?",
    choices: ["1 2 3 5 6", "1 b3 4 5 b7", "1 b3 4 b5 5 b7", "1 2 4 5 6"],
    answer: 1,
    why: "The rock box. In A: A C D E G. Index on low E fret 5.",
  },
  {
    prompt: "Play this walk. Which recipe?",
    choices: ["Major", "Natural minor", "Dorian", "Mixolydian"],
    answer: 0,
    why: "Bright 3rd and a 7th that leans home. 2 2 1 2 2 2 1.",
    listen: () => playPhrase(60, [...MAJOR, 12], 0.2),
  },
  {
    prompt: "Play this walk. Which recipe?",
    choices: ["Major", "Natural minor", "Lydian", "Major pentatonic"],
    answer: 1,
    why: "Sad 3rd and sad 6th. The default sad-pop walk.",
    listen: () => playPhrase(57, [...NATURAL_MINOR, 12], 0.2),
  },
  {
    prompt: "Play this walk. The 4th is raised. Name it.",
    choices: ["Mixolydian", "Lydian", "Dorian", "Major"],
    answer: 1,
    why: "F# in C, not F. Dreamy major.",
    listen: () => playPhrase(60, [...YAMAN, 12], 0.2),
  },
  {
    prompt: "Same seven notes as C major, but you rest on D. That mode is:",
    choices: ["D Mixolydian", "D Dorian", "D Lydian", "D major"],
    answer: 1,
    why: "Modes are a new home, not new notes. D E F G A B C is Dorian: sad 3rd, bright 6th.",
  },
];

const CHORDS: Question[] = [
  {
    prompt: "A major triad is which three intervals from home?",
    choices: ["0, 3, 7 (sad 3rd)", "0, 4, 7 (bright 3rd + 5th)", "0, 4, 10", "0, 3, 6"],
    answer: 1,
    why: "C E G. Four-fret 3rd, seven-fret 5th.",
  },
  {
    prompt: "A minor triad changes only the:",
    choices: ["5th, down one fret", "3rd, down one fret", "Root", "Add a 7th"],
    answer: 1,
    why: "C Eb G. The face flips. The spine stays.",
  },
  {
    prompt: "Dominant 7 (C7) adds which extra note to a major triad?",
    choices: ["The major 7 (11 frets)", "The flat 7 (10 frets)", "The 2nd", "A second root"],
    answer: 1,
    why: "It pulls toward home. G7 wants C. That is why V–I feels like a period.",
  },
  {
    prompt: "Play this chord. Quality?",
    choices: ["Major", "Minor", "Dominant 7", "Diminished"],
    answer: 0,
    why: "Bright 3rd. Four frets.",
    listen: () => playChord(60, [0, 4, 7], 1),
  },
  {
    prompt: "Play this chord. Quality?",
    choices: ["Major", "Minor", "Dominant 7", "Diminished"],
    answer: 1,
    why: "Sad 3rd. Three frets.",
    listen: () => playChord(57, [0, 3, 7], 1),
  },
  {
    prompt: "Play this chord. Quality?",
    choices: ["Major", "Minor", "Dominant 7", "Sus4"],
    answer: 2,
    why: "Major triad plus the door-open 7th. It wants to resolve.",
    listen: () => playChord(55, [0, 4, 7, 10], 1),
  },
  {
    prompt: "In C major, the V chord (the one that points home) is:",
    choices: ["F", "G", "Am", "Dm"],
    answer: 1,
    why: "Five letters up from C, or seven frets. G, often G7.",
  },
  {
    prompt: "Power chords are:",
    choices: ["Root + 5th, no 3rd, so not major or minor", "A full barre major", "Always sad", "Three random notes"],
    answer: 0,
    why: "Two notes. Move the two-fret shape. The face is missing on purpose.",
  },
];

function four(correct: string, pool: string[]): string[] {
  const rest = shuffle([...new Set(pool)].filter((item) => item !== correct));
  return shuffle([correct, ...rest.slice(0, 3)]);
}

function catalogLoops(): Question[] {
  const families = CATALOG.map((song) => song.family);
  return CATALOG.map((song) => {
    const choices = four(song.family, families);
    return {
      prompt: `${song.title} (${song.film}, ${song.year}). Hear the guitar loop — not the hit melody. Which family?`,
      choices,
      answer: choices.indexOf(song.family),
      why: `${loopLabel(song)}. ${scaleLabel(song.steps)} from ${homeLetter(song)}. ${song.tell}`,
      listen: () => playSongLoop(song),
    };
  });
}

function catalogScales(): Question[] {
  const names = CATALOG.map((song) => scaleLabel(song.steps));
  return CATALOG.map((song) => {
    const correct = scaleLabel(song.steps);
    const choices = four(correct, names);
    return {
      prompt: `${song.title}. Hear the walk from ${homeLetter(song)}. Which scale is the bed?`,
      choices,
      answer: choices.indexOf(correct),
      why: `${correct}. ${song.tell}`,
      listen: () => playSongScale(song),
    };
  });
}

const SONG_SKILL: Question[] = [
  {
    prompt: "Let It Be and I'm Yours share which loop?",
    choices: ["i–VI–III–VII (Am F C G)", "I–V–vi–IV (C G Am F)", "I–IV–V", "A raga unique to each song"],
    answer: 1,
    why: "Major loop. Learn one, you own the other. Capo if the singer needs a new height.",
  },
  {
    prompt: "Am F C G, resting on Am, is which family?",
    choices: ["I–V–vi–IV in C", "i–VI–III–VII in A minor", "I–IV–V in G", "Lydian in A"],
    answer: 1,
    why: "Home is sad. F is VI, C is III, G is VII. Channa Mereya lives here too.",
  },
  {
    prompt: "The fastest way to name a chord in a song is:",
    choices: ["Guess from the title", "Bass letter first, then ask if the 3rd is 3 or 4 frets", "Watch the drummer", "Assume G"],
    answer: 1,
    why: "Lowest note is usually the root. Then the face. Letter plus quality is the chord.",
  },
  {
    prompt: "I–IV–V in G is which open chords?",
    choices: ["G C D", "G Em C", "Am F C", "C G Am F"],
    answer: 0,
    why: "Home, the next-door 4th, the pointing 5th. Campfire spine. Sunshine. Blues.",
  },
];

function listenScales(): Question[] {
  return [
    {
      prompt: "Play this walk. Dorian or natural minor?",
      choices: ["Dorian (bright 6th)", "Natural minor (sad 6th)", "Major", "Phrygian"],
      answer: 0,
      why: "Sad 3rd, then a 6th that smiles. In A that note is F#.",
      listen: () => playPhrase(57, [...KAFI, 12], 0.2),
    },
    {
      prompt: "Play this walk. Door open or door closed?",
      choices: ["Mixolydian — door open (b7)", "Major — door closed (7)", "Minor", "Blues"],
      answer: 0,
      why: "Bright 3rd, flat 7th. Ten frets, not eleven.",
      listen: () => playPhrase(62, [...KHAMAJ, 12], 0.2),
    },
  ];
}

export const DRILLS: DrillPack[] = [
  {
    id: "neck",
    title: "The neck",
    blurb: "Open strings, fret 12, cowboy shapes, capo math. No guitar required — but better with one in your lap.",
    size: 8,
    build: () => take(NECK, 8),
  },
  {
    id: "gaps",
    title: "Gaps in frets",
    blurb: "3rd, 4th, 5th, octave. Some rounds play the distance. Count, then name.",
    size: 7,
    build: () => take(GAPS, 7),
  },
  {
    id: "scales",
    title: "Scale recipes",
    blurb: "Major, the one-stair modes, pentatonic. Hear a walk, name the holes.",
    size: 8,
    build: () => take([...SCALES, ...listenScales()], 8),
  },
  {
    id: "chords",
    title: "Chord faces",
    blurb: "Major, minor, 7, power chords. Hear the quality. Name the V in C.",
    size: 7,
    build: () => take(CHORDS, 7),
  },
  {
    id: "songs",
    title: "Loops under songs",
    blurb: "Real titles. Hear the loop, name the family or the scale. Same clothes, different singers.",
    size: 8,
    build: () => take([...catalogLoops(), ...catalogScales(), ...SONG_SKILL], 8),
  },
  {
    id: "mixed",
    title: "Mixed exam",
    blurb: "Twelve questions pulled from every pile, including real songs. Replay until it is boring.",
    size: 12,
    build: () => take([...NECK, ...GAPS, ...SCALES, ...CHORDS, ...SONG_SKILL, ...catalogLoops(), ...listenScales()], 12),
  },
];

export function drillById(id: string): DrillPack | undefined {
  return DRILLS.find((pack) => pack.id === id);
}
