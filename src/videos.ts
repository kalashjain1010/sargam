export type VideoClip = {
  id: string;
  title: string;
  by: string;
  why: string;
  topics: string[];
};

export const VIDEOS: VideoClip[] = [
  {
    id: "-YkiaALRb54",
    title: "The most essential thing in music theory",
    by: "Paul Davids",
    why: "Letters, the 12 notes, and why the guitar is a grid. Watch before you worry about scales.",
    topics: ["notes", "foundation"],
  },
  {
    id: "77JzblP6URE",
    title: "Intervals",
    by: "Paul Davids",
    why: "Names the distances in English. Pair it with counting frets on one string.",
    topics: ["intervals", "ear"],
  },
  {
    id: "G-X1RemAzks",
    title: "Minor pentatonic scale (BC-176)",
    by: "JustinGuitar",
    why: "The A-minor box at fret 5, slowly, with fingering. This is the shape Day 9 lives in.",
    topics: ["pentatonic", "box"],
  },
  {
    id: "bwaeBUYcO5o",
    title: "All 7 modes in parallel",
    by: "Signals Music Studio",
    why: "Same home, seven colors. The tell of each mode, heard, not just listed.",
    topics: ["modes", "scales"],
  },
  {
    id: "M8eItITv8QA",
    title: "How to write chord progressions",
    by: "Signals Music Studio",
    why: "I, IV, V, vi as a machine. Then you can hear those numerals in the song lab.",
    topics: ["chords", "progressions"],
  },
  {
    id: "H9e_1DTm-VQ",
    title: "How to recognise chord progressions by ear",
    by: "David Bennett Piano",
    why: "Relative pitch for loops: what I, V, IV, and vi feel like. Then come back and name our beds.",
    topics: ["ear", "progressions", "chords"],
  },
  {
    id: "O43EBVnwNvo",
    title: "Circle of fifths: everything you need to know",
    by: "Brad Harrison Music",
    why: "Clockwise adds a sharp. Neighbors are the chords songs actually use.",
    topics: ["circle", "keys"],
  },
  {
    id: "7MbwbWSeZjc",
    title: "The CAGED system (TB-030)",
    by: "JustinGuitar",
    why: "Five photographs of the same chord along the neck. Two shapes are enough to start.",
    topics: ["caged", "barre"],
  },
  {
    id: "trf80-R41X8",
    title: "Power chords 1 (BC-172)",
    by: "JustinGuitar",
    why: "Root plus 5th, sixth-string root, muting the extras. Move the grip.",
    topics: ["power", "rock"],
  },
  {
    id: "KjU-ga47lXI",
    title: "Using a capo (BC-163)",
    by: "JustinGuitar",
    why: "Capo is addition: shape letter plus fret number equals sounding key.",
    topics: ["capo", "transpose"],
  },
  {
    id: "pMopMBiHKfQ",
    title: "Secondary dominants explained",
    by: "David Bennett Piano",
    why: "A major chord that ‘should’ be minor, pointing at the next chord. Creep’s B, V of V.",
    topics: ["secondary", "harmony"],
  },
];

export function videosFor(topics: string[]): VideoClip[] {
  const want = new Set(topics);
  return VIDEOS.filter((video) => video.topics.some((topic) => want.has(topic)));
}
