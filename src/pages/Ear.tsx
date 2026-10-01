import { useMemo, useState } from "react";
import { playChord, playInterval, playPhrase, playProgression, unlock } from "../audio.ts";
import { useProgress } from "../progress.tsx";
import type { EarId } from "../progress.tsx";
import { INTERVAL_NAMES, MAJOR, NATURAL_MINOR, YAMAN, KHAMAJ, KAFI, nearestMidi, qualityIntervals } from "../theory.ts";

type Mode = EarId;

const MODES: { id: Mode; title: string; blurb: string }[] = [
  { id: "interval", title: "Intervals", blurb: "Two notes. Count the gap in frets, then use the English name (5th = 7 frets)." },
  { id: "scale", title: "Scales", blurb: "A walk from home. Name the recipe: major, Dorian, pentatonic…" },
  { id: "quality", title: "Quality", blurb: "One chord. Bright (major), sad (minor), extra pull (dominant 7), or unstable (diminished)." },
  { id: "loop", title: "Loops", blurb: "Four chords in a row. Name the family, like G–D–Em–C versus Am–F–C–G." },
  { id: "degree", title: "Degrees", blurb: "Home keeps ringing. Then one extra note. Which step of the scale was it?" },
];

function randomOf<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)] ?? list[0];
}

export function EarPage() {
  const { ear } = useProgress();
  const [mode, setMode] = useState<Mode>("interval");

  return (
    <div className="home wide">
      <p className="eyebrow">Ear gym</p>
      <h1>Close your eyes. Name what you heard.</h1>
      <p className="lede">
        Like a spelling test, but for sound. Two notes = how many frets apart. One chord = happy, sad, or extra-note. Four chords = which family. You do not need the guitar in your hands. Best scores stick on this browser.
      </p>
      <div className="gym-bests">
        {MODES.map((item) => (
          <div key={item.id}>
            <em>{item.title}</em>
            <strong>{ear[item.id]}</strong>
          </div>
        ))}
        <div>
          <em>Hits</em>
          <strong>{ear.hits}</strong>
        </div>
      </div>
      <div className="chips">
        {MODES.map((item) => (
          <button key={item.id} type="button" className={`chip ${mode === item.id ? "on" : ""}`} onClick={() => setMode(item.id)}>
            {item.title}
          </button>
        ))}
      </div>
      <p className="muted">{MODES.find((item) => item.id === mode)?.blurb}</p>
      {mode === "interval" ? <IntervalEar /> : null}
      {mode === "scale" ? <ScaleEar /> : null}
      {mode === "quality" ? <QualityEar /> : null}
      {mode === "loop" ? <LoopEar /> : null}
      {mode === "degree" ? <DegreeEar /> : null}
    </div>
  );
}

function RoundShell({
  id,
  prompt,
  play,
  choices,
  answer,
  why,
  onNext,
}: {
  id: EarId;
  prompt: string;
  play: () => void;
  choices: string[];
  answer: number;
  why: string;
  onNext: () => void;
}) {
  const { recordEar } = useProgress();
  const [picked, setPicked] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);

  function choose(choice: number) {
    if (picked !== null) return;
    setPicked(choice);
    const ok = choice === answer;
    setScore((n) => {
      const next = ok ? n + 1 : n;
      recordEar(id, next, ok ? 1 : 0);
      return next;
    });
    setStreak((n) => (ok ? n + 1 : 0));
  }

  return (
    <div className="widget studio ear-stage">
      <div className="gym-hud">
        <p className="gym-target">{prompt}</p>
        <p className="gym-meta">
          {score} hits · streak {streak}
        </p>
      </div>
      <button
        type="button"
        className="play-btn huge"
        onClick={() => {
          unlock();
          play();
        }}
      >
        Play
      </button>
      <div className="choices">
        {choices.map((choice, index) => {
          const state = picked === null ? "" : index === answer ? "right" : index === picked ? "wrong" : "";
          return (
            <button key={choice} type="button" className={`choice ${state}`} onClick={() => choose(index)}>
              {choice}
            </button>
          );
        })}
      </div>
      {picked !== null ? <p className="why">{why}</p> : null}
      {picked !== null ? (
        <button
          type="button"
          className="btn"
          onClick={() => {
            setPicked(null);
            onNext();
          }}
        >
          Next round
        </button>
      ) : null}
    </div>
  );
}

const INTERVAL_SET = [2, 3, 4, 5, 7, 8, 9, 10, 12];

function IntervalEar() {
  const [round, setRound] = useState(0);
  const secret = useMemo(() => randomOf(INTERVAL_SET), [round]);
  const harmonic = useMemo(() => Math.random() > 0.45, [round]);
  return (
    <RoundShell
      id="interval"
      prompt={harmonic ? "Those two notes together. What distance?" : "Those two notes, one after the other. What distance?"}
      play={() => {
        if (harmonic) playChord(64, [0, secret], 1);
        else playInterval(64, secret);
      }}
      choices={INTERVAL_SET.map((n) => `${INTERVAL_NAMES[n]} · ${n} fret${n === 1 ? "" : "s"}`)}
      answer={INTERVAL_SET.indexOf(secret)}
      why={`${INTERVAL_NAMES[secret]}. Always ${secret} fret${secret === 1 ? "" : "s"} on one string.`}
      onNext={() => setRound((n) => n + 1)}
    />
  );
}

const SCALE_EAR = [
  { name: "Major", steps: MAJOR, tell: "Major 3rd and major 7th." },
  { name: "Natural minor", steps: NATURAL_MINOR, tell: "Minor 3rd and minor 6th." },
  { name: "Dorian", steps: KAFI, tell: "Minor 3rd, major 6th." },
  { name: "Mixolydian", steps: KHAMAJ, tell: "Major 3rd, flat 7th." },
  { name: "Lydian", steps: YAMAN, tell: "Raised 4th." },
];

function ScaleEar() {
  const [round, setRound] = useState(0);
  const secret = useMemo(() => randomOf(SCALE_EAR), [round]);
  return (
    <RoundShell
      id="scale"
      prompt="Name the scale."
      play={() => playPhrase(60, [...secret.steps, 12], 0.22)}
      choices={SCALE_EAR.map((item) => item.name)}
      answer={SCALE_EAR.findIndex((item) => item.name === secret.name)}
      why={`${secret.name}. ${secret.tell}`}
      onNext={() => setRound((n) => n + 1)}
    />
  );
}

const QUALITIES = [
  { name: "Major", iv: [0, 4, 7], why: "Major 3rd, four frets." },
  { name: "Minor", iv: [0, 3, 7], why: "Minor 3rd, three frets." },
  { name: "Dominant 7", iv: [0, 4, 7, 10], why: "Major triad plus a flat 7th. It pulls." },
  { name: "Diminished", iv: [0, 3, 6], why: "Minor 3rd and a flat 5th. Unstable." },
];

function QualityEar() {
  const [round, setRound] = useState(0);
  const secret = useMemo(() => randomOf(QUALITIES), [round]);
  const root = useMemo(() => 55 + Math.floor(Math.random() * 8), [round]);
  return (
    <RoundShell
      id="quality"
      prompt="Name the quality."
      play={() => playChord(root, secret.iv, 1.05)}
      choices={QUALITIES.map((item) => item.name)}
      answer={QUALITIES.findIndex((item) => item.name === secret.name)}
      why={`${secret.name}. ${secret.why}`}
      onNext={() => setRound((n) => n + 1)}
    />
  );
}

const LOOPS = [
  {
    name: "I–V–vi–IV",
    why: "Major home. The four-chord pop loop. Ilahi, Kesariya, Let It Be.",
    chords: [
      { semi: 0, intervals: qualityIntervals("maj") },
      { semi: 7, intervals: qualityIntervals("maj") },
      { semi: 9, intervals: qualityIntervals("min") },
      { semi: 5, intervals: qualityIntervals("maj") },
    ],
  },
  {
    name: "i–VI–III–VII",
    why: "Minor home. Am F C G. Channa Mereya, Let Her Go.",
    chords: [
      { semi: 0, intervals: qualityIntervals("min") },
      { semi: 8, intervals: qualityIntervals("maj") },
      { semi: 3, intervals: qualityIntervals("maj") },
      { semi: 10, intervals: qualityIntervals("maj") },
    ],
  },
  {
    name: "I–bVII–IV",
    why: "Major home with a flat 7 as a chord. Mixolydian rock bed.",
    chords: [
      { semi: 0, intervals: qualityIntervals("maj") },
      { semi: 10, intervals: qualityIntervals("maj") },
      { semi: 5, intervals: qualityIntervals("maj") },
    ],
  },
  {
    name: "I–IV–V",
    why: "The blues and campfire spine. Give Me Some Sunshine, Thinking Out Loud.",
    chords: [
      { semi: 0, intervals: qualityIntervals("maj") },
      { semi: 5, intervals: qualityIntervals("maj") },
      { semi: 7, intervals: qualityIntervals("maj") },
    ],
  },
];

function LoopEar() {
  const [round, setRound] = useState(0);
  const secret = useMemo(() => randomOf(LOOPS), [round]);
  return (
    <RoundShell
      id="loop"
      prompt="Name the family."
      play={() => playProgression(nearestMidi(0, 52), secret.chords, 0.7)}
      choices={LOOPS.map((item) => item.name)}
      answer={LOOPS.findIndex((item) => item.name === secret.name)}
      why={`${secret.name}. ${secret.why}`}
      onNext={() => setRound((n) => n + 1)}
    />
  );
}

const DEGREES = [
  { name: "1 · home", semi: 0 },
  { name: "b3", semi: 3 },
  { name: "3", semi: 4 },
  { name: "4", semi: 5 },
  { name: "#4", semi: 6 },
  { name: "5", semi: 7 },
  { name: "b7", semi: 10 },
  { name: "7", semi: 11 },
];

function DegreeEar() {
  const [round, setRound] = useState(0);
  const secret = useMemo(() => randomOf(DEGREES), [round]);
  return (
    <RoundShell
      id="degree"
      prompt="Home plus 5th, then one note. Which degree?"
      play={() => {
        playChord(60, [0, 7], 0.85);
        window.setTimeout(() => playPhrase(60, [secret.semi], 0.55), 480);
      }}
      choices={DEGREES.map((item) => item.name)}
      answer={DEGREES.findIndex((item) => item.semi === secret.semi)}
      why={`${secret.name}. Count frets up from home on one string.`}
      onNext={() => setRound((n) => n + 1)}
    />
  );
}
