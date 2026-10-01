import { useMemo, useRef, useState } from "react";
import { Fretboard } from "./Fretboard.tsx";
import { Harmonium } from "./Harmonium.tsx";
import { PitchCoach } from "./PitchCoach.tsx";
import {
  droneIsOn,
  hush,
  playChord,
  playClicks,
  playInterval,
  playMidi,
  playPhrase,
  playProgression,
  saMidiFor,
  startDrone,
  stopDrone,
  unlock,
} from "../audio.ts";
import { useProgress } from "../progress.tsx";
import {
  BHUPALI,
  CHORD_STEPS,
  CIRCLE,
  GUITAR_KEYS,
  KAFI,
  KEY_STEPS,
  MAJOR,
  MINOR_PENT,
  NATURAL_MINOR,
  OPEN_GRIPS,
  OPEN_HOME,
  chordsFromNotes,
  chordName,
  diatonicTriad,
  midiHz,
  nearestMidi,
  noteName,
  positionsOf,
  phraseLetters,
  qualityIntervals,
  scaleNoteNames,
  triadSymbol,
  usesFlats,
} from "../theory.ts";
import type { FretPos, Grip, Quality } from "../theory.ts";
import { SCALES } from "../scales.ts";

const STRING_MIDI: Record<string, number> = { e: 64, B: 59, G: 55, D: 50, A: 45, E: 40 };

function parseHit(key: string): FretPos {
  const [stringId, fretText] = key.split("-");
  const fret = Number(fretText);
  return { stringId, fret, midi: (STRING_MIDI[stringId] ?? 40) + fret };
}

export function SameNote() {
  const [hits, setHits] = useState<string[]>([]);
  const open = midiHz(40);
  const twelfth = midiHz(52);
  const need = ["E-0", "E-12"];
  const done = need.every((key) => hits.includes(key));

  return (
    <div className="widget">
      <h3>Tap the open low E, then fret 12 on the same string</h3>
      <p>Those two should come back as the same letter. The second is twice the frequency, because the string is half as long.</p>
      <Fretboard
        saPc={4}
        label="note"
        found={hits.map(parseHit)}
        onPick={(pos) => {
          unlock();
          playMidi(pos.midi, 0.55);
          const key = `${pos.stringId}-${pos.fret}`;
          if (need.includes(key)) setHits((current) => (current.includes(key) ? current : [...current, key]));
        }}
      />
      <p className="pitch-read">
        Open low E is {open.toFixed(1)} Hz. Fret 12 is {twelfth.toFixed(1)} Hz. Ratio {(twelfth / open).toFixed(2)}.
      </p>
      {done ? (
        <p className="ok-line">Same note name, one octave up. Every string does this at fret 12. The octave does not depend on gauge or tension. It depends on half the length.</p>
      ) : (
        <p className="muted">You want a ratio of 2.00. Fret 12 is the middle of the scale length, not a decorative inlay.</p>
      )}
    </div>
  );
}

export function NoteHunt() {
  const pc = 9;
  const targets = useMemo(() => positionsOf(pc, 12), []);
  const [hits, setHits] = useState<string[]>([]);
  const [miss, setMiss] = useState("");
  const done = hits.length === targets.length;

  return (
    <div className="widget">
      <h3>Find every A in the first 12 frets</h3>
      <p>
        {hits.length} of {targets.length}. The letters are visible. This is map reading, not a guessing game.
      </p>
      <Fretboard
        saPc={4}
        label="note"
        found={hits.map(parseHit)}
        onPick={(pos) => {
          unlock();
          playMidi(pos.midi, 0.4);
          if (pos.pc !== pc) {
            setMiss(`That was ${noteName(pos.pc)}, ${Math.min((pos.pc - pc + 12) % 12, (pc - pos.pc + 12) % 12)} frets away from A.`);
            return;
          }
          setMiss("");
          const key = `${pos.stringId}-${pos.fret}`;
          setHits((current) => (current.includes(key) ? current : [...current, key]));
        }}
      />
      {miss ? <p className="warn">{miss}</p> : null}
      {done ? (
        <p className="ok-line">
          Seven A's. Open A and fret 12 of A are the octave pair. The others cross strings: low E fret 5, D fret 7, G fret 2, B fret 10, high e fret 5. The B-string one sits off the fourths pattern, because G to B is a major third.
        </p>
      ) : null}
    </div>
  );
}

export function HomeBoard() {
  const [pc, setPc] = useState(9);
  const [drone, setDrone] = useState(false);
  const choice = OPEN_HOME.find((item) => item.pc === pc) ?? OPEN_HOME[1];

  return (
    <div className="widget">
      <h3>Put home on an open string</h3>
      <div className="chips">
        {OPEN_HOME.map((item) => (
          <button key={item.pc} type="button" className={`chip ${pc === item.pc ? "on" : ""}`} onClick={() => setPc(item.pc)}>
            Home = {item.stringName}
          </button>
        ))}
      </div>
      <p>
        The 5th is <strong>{choice.fifth}</strong>. {choice.why}
      </p>
      <Fretboard
        saPc={pc}
        scale={MAJOR}
        label="note"
        onPick={(pos) => {
          unlock();
          playMidi(pos.midi, 0.45);
        }}
      />
      <div className="row">
        <button
          type="button"
          className="btn secondary"
          onClick={() => {
            unlock();
            if (drone) {
              stopDrone();
              setDrone(false);
            } else {
              startDrone(saMidiFor(pc, 45));
              setDrone(true);
            }
          }}
        >
          {drone ? "Stop drone" : "Drone home + 5th"}
        </button>
      </div>
      <p className="muted tiny">Gold is home. A drone of home plus the 5th is the oldest accompaniment on earth. On guitar that pair is open E and B, or A and E, depending on where you put home.</p>
    </div>
  );
}

const INTERVALS = [
  { semi: 2, name: "Major 2nd · 2 frets" },
  { semi: 3, name: "Minor 3rd · 3 frets" },
  { semi: 4, name: "Major 3rd · 4 frets" },
  { semi: 5, name: "Perfect 4th · 5 frets" },
  { semi: 7, name: "Perfect 5th · 7 frets" },
  { semi: 12, name: "Octave · 12 frets" },
];

export function IntervalTrainer() {
  const [order] = useState(() => [...INTERVALS].sort(() => Math.random() - 0.5));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const current = order[index] ?? order[0];

  if (done) {
    return (
      <div className="widget">
        <h3>Ear round</h3>
        <p className={score >= 4 ? "ok-line" : ""}>
          {score} of {order.length}. Four out of six means you can use these distances. The fret count is the real name. The English word is a label for the count.
        </p>
      </div>
    );
  }

  return (
    <div className="widget">
      <h3>
        What distance was that? {index + 1} / {order.length}
      </h3>
      <button
        type="button"
        className="btn secondary"
        onClick={() => {
          unlock();
          playInterval(64, current.semi);
        }}
      >
        Play the two notes
      </button>
      <div className="choices">
        {INTERVALS.map((item) => {
          const state = picked === null ? "" : item.semi === current.semi ? "right" : item.semi === picked ? "wrong" : "";
          return (
            <button
              key={item.semi}
              type="button"
              className={`choice ${state}`}
              onClick={() => {
                if (picked !== null) return;
                setPicked(item.semi);
                if (item.semi === current.semi) setScore((value) => value + 1);
              }}
            >
              {item.name}
            </button>
          );
        })}
      </div>
      {picked !== null ? (
        <>
          <p className="why">
            {current.name}. From the high e, walk that many frets. A 5th is always 7. A major 3rd is always 4. A minor 3rd is always 3. The octave is always 12.
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (index + 1 >= order.length) setDone(true);
              else {
                setIndex((value) => value + 1);
                setPicked(null);
              }
            }}
          >
            Next distance
          </button>
        </>
      ) : null}
    </div>
  );
}

const PATTERN = [2, 2, 1, 2, 2, 2, 1];

function landings(steps: number[]): number[] {
  const out: number[] = [];
  let cursor = 0;
  for (const step of steps) {
    cursor += step;
    out.push(cursor);
  }
  return out;
}

export function BilawalWalk() {
  const [steps, setSteps] = useState<number[]>([]);
  const places = landings(steps);
  const done = steps.length === 7 && steps.every((step, index) => step === PATTERN[index]);
  const failed = steps.length === 7 && !done;

  function add(step: number) {
    if (steps.length >= 7) return;
    unlock();
    const fret = places.at(-1) ?? 0;
    playMidi(64 + fret + step, 0.35);
    setSteps((current) => [...current, step]);
  }

  return (
    <div className="widget">
      <h3>Walk a major scale on one string</h3>
      <p>Home is fret 0 on this diagram. Whole, whole, half, whole, whole, whole, half. A whole step is 2 frets. A half step is 1. The half steps sit between 3–4 and 7–home.</p>
      <div className="one-string">
        {Array.from({ length: 13 }, (_, index) => (
          <i key={index} className={index === 0 || places.includes(index) ? "on" : ""}>
            {index}
          </i>
        ))}
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={() => add(2)}>
          Whole step
        </button>
        <button type="button" className="btn secondary" onClick={() => add(1)}>
          Half step
        </button>
        <button type="button" className="btn ghost" onClick={() => setSteps([])}>
          Reset
        </button>
      </div>
      <p className="pitch-read">Frets: 0 {places.join(" ")}</p>
      {done ? <p className="ok-line">2 2 1 2 2 2 1, and you landed on fret 12. That is a major scale from any home. Move the whole walk up a fret and the song is in a new key.</p> : null}
      {failed ? <p className="warn">That walk is not major. Reset. Count 2, 2, 1, 2, 2, 2, 1.</p> : null}
    </div>
  );
}

export function MinorCompare() {
  const [id, setId] = useState("kafi");
  const sets = [
    { id: "bilawal", name: "Major", steps: MAJOR, line: "All natural degrees. The reference major scale." },
    { id: "kafi", name: "Dorian", steps: KAFI, line: "b3 and b7. The 6th stays major. That major 6th is the tell." },
    { id: "minor", name: "Natural minor", steps: NATURAL_MINOR, line: "b3, b6, and b7. The pop minor." },
    { id: "bhairavi", name: "Phrygian", steps: [0, 1, 3, 5, 7, 8, 10], line: "b2, b3, b6, and b7. The 2nd is one fret above home." },
  ];
  const current = sets.find((item) => item.id === id) ?? sets[1];

  return (
    <div className="widget">
      <h3>Same home, four collections</h3>
      <div className="chips">
        {sets.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`chip ${id === item.id ? "on" : ""}`}
            onClick={() => {
              setId(item.id);
              unlock();
              playPhrase(60, [...item.steps, 12]);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p>{current.line}</p>
      <p className="pitch-read">{scaleNoteNames(0, current.steps).join("  ")}</p>
      <Fretboard
        saPc={0}
        scale={current.steps}
        label="note"
        onPick={(pos) => {
          unlock();
          playMidi(pos.midi, 0.4);
        }}
      />
    </div>
  );
}

export function ChordStack() {
  const [pc, setPc] = useState(0);
  const [degree, setDegree] = useState(0);
  const flat = usesFlats(pc);

  function hear(next: number, tonic: number) {
    unlock();
    hush();
    const row = diatonicTriad(next);
    playChord(nearestMidi(tonic + row.rootSemi, 52), row.intervals, 1);
  }

  return (
    <div className="widget">
      <h3>Stack every other scale note</h3>
      <div className="chips">
        {GUITAR_KEYS.map((key) => (
          <button
            key={key.name}
            type="button"
            className={`chip ${pc === key.pc ? "on" : ""}`}
            onClick={() => {
              setPc(key.pc);
              hear(degree, key.pc);
            }}
          >
            {key.name}
          </button>
        ))}
      </div>
      <div className="degree-row">
        {MAJOR.map((_, index) => {
          const row = diatonicTriad(index);
          return (
            <button
              key={row.roman}
              type="button"
              className={`choice ${degree === index ? "right" : ""}`}
              onClick={() => {
                setDegree(index);
                hear(index, pc);
              }}
            >
              <b>{row.roman}</b>
              <span>{triadSymbol((pc + row.rootSemi) % 12, row.q, flat)}</span>
            </button>
          );
        })}
      </div>
      <p>
        I is major. ii, iii, and vi are minor. IV and V are major. vii° is diminished, two minor thirds, and it does not want to be home. In {noteName(pc, flat)}, the notes of the selected chord are{" "}
        {diatonicTriad(degree).intervals.map((semi) => noteName(pc + diatonicTriad(degree).rootSemi + semi, flat)).join(" ")}.
      </p>
    </div>
  );
}

export function LoopPlayer() {
  const [pc, setPc] = useState(7);
  const [which, setWhich] = useState<"major" | "minor" | null>(null);
  const [secret, setSecret] = useState<"major" | "minor">("major");
  const [picked, setPicked] = useState<"major" | "minor" | null>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }

  function chordsFor(kind: "major" | "minor"): { semi: number; q: "maj" | "min" }[] {
    return kind === "major"
      ? [
          { semi: 0, q: "maj" },
          { semi: 7, q: "maj" },
          { semi: 9, q: "min" },
          { semi: 5, q: "maj" },
        ]
      : [
          { semi: 0, q: "min" },
          { semi: 8, q: "maj" },
          { semi: 3, q: "maj" },
          { semi: 10, q: "maj" },
        ];
  }

  function play(kind: "major" | "minor", tonic = pc) {
    unlock();
    hush();
    clearTimers();
    setWhich(kind);
    chordsFor(kind).forEach((chord, index) => {
      const id = window.setTimeout(() => {
        const intervals = chord.q === "min" ? [0, 3, 7] : [0, 4, 7];
        playChord(nearestMidi(tonic + chord.semi, 52), intervals, 0.7);
      }, index * 780);
      timers.current.push(id);
    });
  }

  const names = (kind: "major" | "minor") => chordsFor(kind).map((chord) => chordName(pc, chord.semi, chord.q)).join("  ");

  return (
    <div className="widget">
      <h3>Hear the two loops</h3>
      <div className="chips">
        {GUITAR_KEYS.filter((key) => key.name !== "F").map((key) => (
          <button key={key.name} type="button" className={`chip ${pc === key.pc ? "on" : ""}`} onClick={() => setPc(key.pc)}>
            Home = {key.name}
          </button>
        ))}
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={() => play("major")}>
          Major · {names("major")}
        </button>
        <button type="button" className="btn secondary" onClick={() => play("minor")}>
          Minor · {names("minor")}
        </button>
      </div>
      {which ? <p className="muted">The {which} family, home on {noteName(pc, usesFlats(pc))}.</p> : null}
      <h3>Which family is this?</h3>
      <button
        type="button"
        className="btn secondary"
        onClick={() => {
          const next = Math.random() > 0.5 ? "major" : "minor";
          setSecret(next);
          setPicked(null);
          play(next);
        }}
      >
        Play a hidden loop
      </button>
      <div className="choices">
        {(["major", "minor"] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            className={`choice ${picked ? (kind === secret ? "right" : kind === picked ? "wrong" : "") : ""}`}
            onClick={() => {
              if (picked) return;
              setPicked(kind);
              if (kind === secret) setScore((value) => value + 1);
              setRound((value) => value + 1);
            }}
          >
            {kind === "major" ? "Major home · I V vi IV" : "Minor home · i VI III VII"}
          </button>
        ))}
      </div>
      {picked ? <p className="why">That was the {secret} loop. Judge the first chord. A minor home can still be followed by three major chords. The home is what names the key.</p> : null}
      <p className="tiny muted">
        Hidden rounds: {round}. Correct: {score}.
      </p>
    </div>
  );
}

const MELODIES: { id: string; name: string; phrase: number[] }[] = [
  { id: "yaman", name: "Lydian · raised 4th (Yaman)", phrase: [0, 2, 4, 6, 7, 6, 4, 2, 0] },
  { id: "bhupali", name: "Major pentatonic · no 4th, no 7th", phrase: [0, 2, 4, 7, 9, 7, 4, 2, 0] },
  { id: "kafi", name: "Dorian · major 6th", phrase: [5, 7, 9, 7, 5, 3, 2, 0] },
  { id: "minor", name: "Natural minor · minor 6th", phrase: [0, 3, 5, 7, 8, 7, 5, 3, 0] },
];

export function MelodyId() {
  const [secret, setSecret] = useState(MELODIES[0]);
  const [picked, setPicked] = useState<string | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  function ask(next = secret) {
    unlock();
    playPhrase(60, next.phrase, 0.34);
  }

  return (
    <div className="widget">
      <h3>Name the collection · round {round}</h3>
      <p>Original phrases, not film hooks. Home is C. Hunt the one note that the others do not have.</p>
      <button type="button" className="btn secondary" onClick={() => ask()}>
        Play the phrase
      </button>
      <div className="choices">
        {MELODIES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`choice ${picked ? (item.id === secret.id ? "right" : item.id === picked ? "wrong" : "") : ""}`}
            onClick={() => {
              if (picked) return;
              setPicked(item.id);
              if (item.id === secret.id) setScore((value) => value + 1);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
      {picked ? (
        <>
          <p className="why">
            {secret.name}. Lydian steps on the raised 4th. Major pentatonic never plays the 4th or 7th. Dorian's 6th is major while its 3rd is minor. Natural minor lowers the 6th too.
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              const next = MELODIES[Math.floor(Math.random() * MELODIES.length)];
              setSecret(next);
              setPicked(null);
              setRound((value) => value + 1);
              ask(next);
            }}
          >
            Another phrase
          </button>
        </>
      ) : null}
      <p className="tiny muted">Correct this sitting: {score}.</p>
    </div>
  );
}

export function MethodList() {
  const [done, setDone] = useState<number[]>([]);
  return (
    <div className="widget">
      <h3>The method, in order</h3>
      <ol className="method">
        {KEY_STEPS.map((step, index) => (
          <li key={step}>
            <label>
              <input
                type="checkbox"
                checked={done.includes(index)}
                onChange={() =>
                  setDone((current) => (current.includes(index) ? current.filter((item) => item !== index) : [...current, index]))
                }
              />
              <span>{step}</span>
            </label>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function PentatonicLink() {
  const [mode, setMode] = useState<"minor" | "bhupali">("minor");
  const sa = mode === "minor" ? 9 : 0;
  const steps = mode === "minor" ? MINOR_PENT : BHUPALI;
  return (
    <div className="widget">
      <h3>One shape, two names</h3>
      <div className="chips">
        <button type="button" className={`chip ${mode === "minor" ? "on" : ""}`} onClick={() => setMode("minor")}>
          A minor pentatonic
        </button>
        <button type="button" className={`chip ${mode === "bhupali" ? "on" : ""}`} onClick={() => setMode("bhupali")}>
          C major pentatonic
        </button>
      </div>
      <p>
        {mode === "minor"
          ? "Home is A. A C D E G. Start this box with the index finger on low E, fret 5."
          : "Home is C. C D E G A. Same pitches as A minor pentatonic. Home moved up three semitones, a minor 3rd."}
      </p>
      <Fretboard
        saPc={sa}
        scale={steps}
        label="note"
        onPick={(pos) => {
          unlock();
          playMidi(pos.midi, 0.4);
        }}
      />
      <button
        type="button"
        className="btn secondary"
        onClick={() => {
          unlock();
          playPhrase(nearestMidi(sa, 60), [...steps, 12]);
        }}
      >
        Play it
      </button>
    </div>
  );
}

export function ScaleStudio({ startId = "lydian" }: { startId?: string }) {
  const [id, setId] = useState(startId);
  const [home, setHome] = useState(0);
  const scale = SCALES.find((item) => item.id === id) ?? SCALES[1];
  const flat = usesFlats(home);

  function hear(kind: "up" | "down" | "phrase") {
    unlock();
    const root = nearestMidi(home, 60);
    if (kind === "up") playPhrase(root, [...scale.steps, 12], 0.26);
    else if (kind === "down") playPhrase(root, [12, ...[...scale.steps].reverse()], 0.26);
    else playPhrase(root, scale.phrase, 0.32);
  }

  return (
    <div className="widget studio">
      <div className="studio-head">
        <div>
          <p className="eyebrow">{scale.family} · {scale.aka}</p>
          <h3>{scale.name}</h3>
        </div>
        <p className="tell-pill">{scale.tell}</p>
      </div>
      <div className="chips">
        {SCALES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`chip ${id === item.id ? "on" : ""}`}
            onClick={() => {
              setId(item.id);
              unlock();
              playPhrase(nearestMidi(home, 60), [...item.steps, 12], 0.18);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p>{scale.rule}</p>
      <p className="pitch-read">{scaleNoteNames(home, scale.steps).join("  ")}</p>
      <p className="tiny muted">Catch phrase from {noteName(home, flat)}: {phraseLetters(home, scale.phrase)}</p>
      <div className="row">
        <span className="tiny muted">Home</span>
        {GUITAR_KEYS.map((key) => (
          <button key={key.name} type="button" className={`chip ${home === key.pc ? "on" : ""}`} onClick={() => setHome(key.pc)}>
            {key.name}
          </button>
        ))}
      </div>
      <div className="row play-row">
        <button type="button" className="play-btn" onClick={() => hear("up")}>
          Play up
        </button>
        <button type="button" className="play-btn ghost" onClick={() => hear("down")}>
          Play down
        </button>
        <button type="button" className="play-btn ghost" onClick={() => hear("phrase")}>
          Catch phrase
        </button>
      </div>
      <Fretboard
        saPc={home}
        scale={scale.steps}
        label="note"
        onPick={(pos) => {
          unlock();
          playMidi(pos.midi, 0.4);
        }}
      />
      <p className="muted">{scale.avoid}</p>
      <p className="tiny muted">{scale.guitar}</p>
    </div>
  );
}

export const RagaStudio = ScaleStudio;

export function TellButtons() {
  const rows = [
    { name: "Lydian keeps the higher 4th", a: 5, b: 6, keep: "Keep the second one. Raised 4th is six frets above home. In C: F#." },
    { name: "Mixolydian’s main 7th is the lower one", a: 11, b: 10, keep: "Keep the second one. Flat 7th is ten frets above home. In C: Bb." },
    { name: "A minor loop keeps the lower 3rd", a: 4, b: 3, keep: "Keep the second one. Minor 3rd is three frets above home. In C: Eb." },
  ];
  return (
    <div className="widget">
      <h3>The one-fret tells</h3>
      <p>Home is C in these examples. Play both. The tell is which of the two the song is willing to lean on.</p>
      {rows.map((row) => (
        <div key={row.name} className="tell">
          <p>{row.name}</p>
          <div className="row">
            <button type="button" className="btn secondary" onClick={() => { unlock(); playInterval(60, row.a); }}>
              {noteName(row.a)}
            </button>
            <button type="button" className="btn secondary" onClick={() => { unlock(); playInterval(60, row.b); }}>
              {noteName(row.b)}
            </button>
          </div>
          <p className="tiny muted">{row.keep}</p>
        </div>
      ))}
    </div>
  );
}

export function HoldSa() {
  const { saPc, stamp } = useProgress();
  const [got, setGot] = useState(false);
  return (
    <div className="widget">
      <h3>Optional: hold home on the guitar</h3>
      <p>
        Home is {noteName(saPc, usesFlats(saPc))} right now. Change it from Practice if you want a different open string. The written check does not need the mic.
      </p>
      <PitchCoach
        saPc={saPc}
        targetPc={saPc}
        onStable={() => {
          if (got) return;
          setGot(true);
          stamp("held-sa");
        }}
      />
      {got ? <p className="ok-line">Home is in the book.</p> : null}
      {droneIsOn() ? <p className="tiny muted">The drone stops while the mic is open, so it does not listen to the speaker.</p> : null}
    </div>
  );
}

export function KeyPicker({ value, onChange }: { value: number; onChange: (pc: number) => void }) {
  return (
    <div className="chips">
      {GUITAR_KEYS.map((key) => (
        <button key={key.name} type="button" className={`chip ${value === key.pc ? "on" : ""}`} onClick={() => onChange(key.pc)}>
          Home = {key.name}
        </button>
      ))}
    </div>
  );
}

export function ReferenceBoard({ saPc, steps }: { saPc: number; steps: number[] }) {
  return (
    <Fretboard
      saPc={saPc}
      scale={steps}
      label="note"
      onPick={(pos) => {
        unlock();
        playMidi(pos.midi, 0.45);
      }}
    />
  );
}

export function HarmoniumBlock({ saPc, steps }: { saPc: number; steps: number[] }) {
  return <Harmonium saPc={saPc} scale={steps} />;
}

export function ChordBed({ saPc, chords }: { saPc: number; chords: { semi: number; q: Exclude<Quality, "dim"> }[] }) {
  const [active, setActive] = useState(-1);
  const timers = useRef<number[]>([]);

  return (
    <div className="row">
      {chords.map((chord, index) => (
        <button
          key={`${chord.semi}-${chord.q}-${index}`}
          type="button"
          className={`chip ${active === index ? "on" : ""}`}
          onClick={() => {
            unlock();
            hush();
            setActive(index);
            const intervals = chord.q === "min" ? [0, 3, 7] : chord.q === "7" ? [0, 4, 7, 10] : [0, 4, 7];
            playChord(nearestMidi(saPc + chord.semi, 52), intervals, 0.9);
          }}
        >
          {chordName(saPc, chord.semi, chord.q)}
        </button>
      ))}
      <button
        type="button"
        className="play-btn"
        onClick={() => {
          unlock();
          playProgression(
            nearestMidi(saPc, 52),
            chords.map((chord) => ({ semi: chord.semi, intervals: qualityIntervals(chord.q) })),
          );
          timers.current.forEach((id) => window.clearTimeout(id));
          timers.current = chords.map((_, index) => window.setTimeout(() => setActive(index), index * 620));
        }}
      >
        Play the bed
      </button>
    </div>
  );
}

export function PlayScale({ saPc, steps, label }: { saPc: number; steps: number[]; label?: string }) {
  return (
    <button
      type="button"
      className="play-btn ghost"
      onClick={() => {
        unlock();
        playPhrase(nearestMidi(saPc, 60), [...steps, 12]);
      }}
    >
      {label ?? `Play ${scaleNoteNames(saPc, steps).join(" ")}`}
    </button>
  );
}

const LOW_MIDI = [40, 45, 50, 55, 59, 64];

export function playGrip(grip: Grip) {
  unlock();
  hush();
  grip.frets.forEach((fret, index) => {
    if (fret === null) return;
    playMidi(LOW_MIDI[index] + fret, 0.9, index * 0.02, 0.08);
  });
}

export function GripCard({ grip }: { grip: Grip }) {
  return (
    <button type="button" className="grip-card" onClick={() => playGrip(grip)}>
      <strong>{grip.name}</strong>
      <div className="grip-grid" aria-hidden>
        {grip.frets.map((fret, index) => (
          <span key={`${grip.name}-${index}`}>{fret === null ? "x" : fret}</span>
        ))}
      </div>
      <em>E A D G B e</em>
    </button>
  );
}

export function ChordFinder() {
  const [picked, setPicked] = useState<number[]>([]);
  const hits = chordsFromNotes(picked);

  function toggle(pc: number) {
    unlock();
    playMidi(60 + ((pc - 0 + 12) % 12), 0.4);
    setPicked((current) => (current.includes(pc) ? current.filter((item) => item !== pc) : [...current, pc]));
  }

  return (
    <div className="widget studio">
      <h3>Tap notes. The chord names itself.</h3>
      <p>
        Two or three letters are enough. The app lists every triad or seventh that contains them. The tightest match is first. This is how you find chords from a melody: collect the notes that are sounding, then pick the name that also matches the bass.
      </p>
      <div className="note-pad">
        {["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"].map((name, pc) => (
          <button key={name} type="button" className={`note-key ${picked.includes(pc) ? "right" : ""}`} onClick={() => toggle(pc)}>
            {name}
          </button>
        ))}
      </div>
      <Fretboard
        saPc={picked[0] ?? 0}
        scale={picked.length ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : undefined}
        activePcs={picked}
        label="note"
        onPick={(pos) => toggle(pos.pc)}
      />
      <div className="row">
        <button type="button" className="btn ghost" onClick={() => setPicked([])}>
          Clear
        </button>
      </div>
      {hits.length === 0 ? (
        <p className="muted">Tap at least one note. Two is better. Three usually names a triad.</p>
      ) : (
        <ul className="hit-list">
          {hits.map((hit) => (
            <li key={hit.label}>
              <button
                type="button"
                className="chip on"
                onClick={() => {
                  unlock();
                  const q = QUALITY_FROM_NAME[hit.quality] ?? [0, 4, 7];
                  playChord(nearestMidi(hit.rootPc, 52), q, 1);
                }}
              >
                {hit.label}
              </button>
              <span>{hit.quality}{hit.extra ? ` · ${hit.extra} extra chord tone${hit.extra === 1 ? "" : "s"} not in your tap` : " · exact"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const QUALITY_FROM_NAME: Record<string, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  "dominant 7": [0, 4, 7, 10],
  diminished: [0, 3, 6],
  "major 7": [0, 4, 7, 11],
  "minor 7": [0, 3, 7, 10],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
};

export function ChordMethod() {
  const [done, setDone] = useState<number[]>([]);
  return (
    <div className="widget">
      <h3>How to find the chords</h3>
      <ol className="method">
        {CHORD_STEPS.map((step, index) => (
          <li key={step}>
            <label>
              <input
                type="checkbox"
                checked={done.includes(index)}
                onChange={() =>
                  setDone((current) => (current.includes(index) ? current.filter((item) => item !== index) : [...current, index]))
                }
              />
              <span>{step}</span>
            </label>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CircleFifths() {
  const [i, setI] = useState(0);
  const home = CIRCLE[i];
  const neighbors = [CIRCLE[(i + 11) % 12], home, CIRCLE[(i + 1) % 12]];
  const vi = noteName(home.pc + 9, usesFlats(home.pc));

  return (
    <div className="widget studio">
      <h3>Circle of fifths</h3>
      <p>Clockwise is up a 5th (add a sharp). Counter-clockwise is up a 4th (add a flat). Neighbors are I, IV, and V.</p>
      <div className="circle">
        {CIRCLE.map((key, index) => (
          <button
            key={key.name}
            type="button"
            className={`circle-key ${index === i ? "on" : ""}`}
            style={{ transform: `rotate(${index * 30}deg) translate(118px) rotate(${-index * 30}deg)` }}
            onClick={() => {
              setI(index);
              unlock();
              playChord(nearestMidi(key.pc, 52), [0, 4, 7], 0.8);
            }}
          >
            {key.name}
          </button>
        ))}
      </div>
      <p className="pitch-read">
        IV {neighbors[0].name} · I {home.name} · V {neighbors[2].name} · vi {vi}m
      </p>
      <button
        type="button"
        className="play-btn"
        onClick={() => {
          unlock();
          playProgression(nearestMidi(home.pc, 52), [
            { semi: 0, intervals: [0, 4, 7] },
            { semi: 7, intervals: [0, 4, 7] },
            { semi: 9, intervals: [0, 3, 7] },
            { semi: 5, intervals: [0, 4, 7] },
          ]);
        }}
      >
        Play I–V–vi–IV in {home.name}
      </button>
    </div>
  );
}

export function OpenDictionary() {
  return (
    <div className="widget">
      <h3>Open grips. Tap to hear.</h3>
      <p>Numbers are frets, low E to high e. x is mute. These twelve cover most of the song lab once you add a capo.</p>
      <div className="grip-row">
        {OPEN_GRIPS.map((grip) => (
          <GripCard key={grip.name} grip={grip} />
        ))}
      </div>
    </div>
  );
}

export function BarreShapes() {
  const [root, setRoot] = useState(5);
  const eShape: Grip = { name: `${noteName(root)} barre (E shape)`, q: "maj", rootPc: root, frets: [root, root + 2, root + 2, root + 1, root, root] };
  const aShapeFret = root < 2 ? root + 12 : root;
  const aShape: Grip = {
    name: `${noteName(root)} barre (A shape)`,
    q: "maj",
    rootPc: root,
    frets: [null, aShapeFret - 2, aShapeFret, aShapeFret, aShapeFret, aShapeFret - 2],
  };

  return (
    <div className="widget studio">
      <h3>Two barre shapes. Twelve letters.</h3>
      <p>
        Open E, slid: the root is on the low E string. Fret 1 is F. Fret 3 is G. Open A, slid: the root is on the A string. Fret 2 is B. Fret 3 is C.
      </p>
      <div className="chips">
        {GUITAR_KEYS.map((key) => (
          <button key={key.pc} type="button" className={`chip ${root === key.pc ? "on" : ""}`} onClick={() => setRoot(key.pc)}>
            {key.name}
          </button>
        ))}
      </div>
      <div className="grip-row">
        <GripCard grip={eShape} />
        <GripCard grip={aShape} />
      </div>
      <p className="tiny muted">
        Minor: drop the 3rd one fret. E-shape minor is the open Em slid (G string open in Em). A-shape minor is the open Am slid.
      </p>
    </div>
  );
}

export function CadencePlayer() {
  const rows = [
    { name: "Authentic V–I", a: 7, aq: [0, 4, 7, 10] as number[], b: 0, bq: [0, 4, 7] as number[], line: "The period at the end of a sentence. G7 to C in C major." },
    { name: "Plagal IV–I", a: 5, aq: [0, 4, 7] as number[], b: 0, bq: [0, 4, 7] as number[], line: "Amen. F to C. Softer landing." },
    { name: "Deceptive V–vi", a: 7, aq: [0, 4, 7, 10] as number[], b: 9, bq: [0, 3, 7] as number[], line: "You expected home. You got the relative minor. G7 to Am." },
    { name: "Half cadence to V", a: 0, aq: [0, 4, 7] as number[], b: 7, bq: [0, 4, 7] as number[], line: "A comma. The phrase is not done. C to G." },
  ];
  return (
    <div className="widget">
      <h3>Last two chords</h3>
      {rows.map((row) => (
        <div key={row.name} className="tell">
          <p>
            <strong>{row.name}. </strong>
            {row.line}
          </p>
          <button
            type="button"
            className="play-btn ghost"
            onClick={() => {
              unlock();
              playProgression(60, [
                { semi: row.a, intervals: row.aq },
                { semi: row.b, intervals: row.bq },
              ], 0.85);
            }}
          >
            Hear it
          </button>
        </div>
      ))}
    </div>
  );
}

export function CagedMap() {
  const shapes: { name: string; grip: Grip; blurb: string }[] = [
    { name: "C", blurb: "Open C. Root on A string fret 3.", grip: { name: "C", q: "maj", rootPc: 0, frets: [null, 3, 2, 0, 1, 0] } },
    { name: "A", blurb: "A shape at fret 3. Root on A string fret 3.", grip: { name: "C (A shape)", q: "maj", rootPc: 0, frets: [null, 3, 5, 5, 5, 3] } },
    { name: "G", blurb: "G shape around fret 5. Root on low E fret 8.", grip: { name: "C (G shape)", q: "maj", rootPc: 0, frets: [8, 7, 5, 5, 5, 8] } },
    { name: "E", blurb: "E-shape barre at 8. Root on low E fret 8.", grip: { name: "C (E shape)", q: "maj", rootPc: 0, frets: [8, 10, 10, 9, 8, 8] } },
    { name: "D", blurb: "D shape around 10. Root on D string fret 10.", grip: { name: "C (D shape)", q: "maj", rootPc: 0, frets: [null, null, 10, 12, 13, 12] } },
  ];
  return (
    <div className="widget studio">
      <h3>Five grips, one C major</h3>
      <p>CAGED is not a religion. It is five photographs of the same chord, laid along the neck. Learn two well. Then the third.</p>
      <div className="grip-row">
        {shapes.map((shape) => (
          <div key={shape.name}>
            <GripCard grip={shape.grip} />
            <p className="tiny muted">{shape.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RhythmPad() {
  const meters = [
    { name: "4/4", every: 4, bpm: 96, line: "Most of the song lab. Count 1 2 3 4. Accents on 1, often also 3." },
    { name: "3/4", every: 3, bpm: 84, line: "Waltz. Count 1 2 3. The 1 is the only heavy beat." },
    { name: "6/8", every: 6, bpm: 160, line: "Two big beats, each split in three. 1-la-li 2-la-li. Ballads love this." },
  ];
  return (
    <div className="widget">
      <h3>Count it before you strum it</h3>
      {meters.map((meter) => (
        <div key={meter.name} className="tell">
          <p>
            <strong>{meter.name}. </strong>
            {meter.line}
          </p>
          <button
            type="button"
            className="play-btn ghost"
            onClick={() => {
              unlock();
              playClicks(meter.every * 2, meter.bpm, meter.every === 6 ? 3 : meter.every);
            }}
          >
            Click {meter.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export function ModeClock() {
  const modes = [
    { name: "Ionian / major", start: 0 },
    { name: "Dorian", start: 2 },
    { name: "Phrygian", start: 4 },
    { name: "Lydian", start: 5 },
    { name: "Mixolydian", start: 7 },
    { name: "Aeolian / minor", start: 9 },
    { name: "Locrian", start: 11 },
  ];
  return (
    <div className="widget studio">
      <h3>One walk. Seven homes.</h3>
      <p>The notes of C major: C D E F G A B. Rest on a different letter and the mood changes. That is a mode. The guitar did not gain notes. Home moved.</p>
      <div className="chips">
        {modes.map((mode) => (
          <button
            key={mode.name}
            type="button"
            className="chip"
            onClick={() => {
              unlock();
              playPhrase(60 + mode.start, MAJOR, 0.28);
            }}
          >
            {mode.name}
          </button>
        ))}
      </div>
      <Fretboard
        saPc={0}
        scale={MAJOR}
        label="note"
        onPick={(pos) => {
          unlock();
          playMidi(pos.midi, 0.4);
        }}
      />
    </div>
  );
}

export function CapoMath() {
  const [capo, setCapo] = useState(2);
  const [shape, setShape] = useState(7);
  const sounding = (shape + capo) % 12;
  return (
    <div className="widget studio">
      <h3>Capo is addition</h3>
      <p>
        Shape letter + capo frets = sounding letter. G shapes, capo 2, sounding A. The roman numerals do not change.
      </p>
      <div className="row">
        <span className="tiny muted">Shape</span>
        {GUITAR_KEYS.map((key) => (
          <button key={key.name} type="button" className={`chip ${shape === key.pc ? "on" : ""}`} onClick={() => setShape(key.pc)}>
            {key.name}
          </button>
        ))}
      </div>
      <div className="row">
        <span className="tiny muted">Capo</span>
        {[0, 1, 2, 3, 4, 5, 7].map((fret) => (
          <button key={fret} type="button" className={`chip ${capo === fret ? "on" : ""}`} onClick={() => setCapo(fret)}>
            {fret === 0 ? "off" : fret}
          </button>
        ))}
      </div>
      <p className="pitch-read">
        {noteName(shape)} shapes + capo {capo} = sounding {noteName(sounding)}
      </p>
      <button
        type="button"
        className="play-btn"
        onClick={() => {
          unlock();
          playChord(nearestMidi(sounding, 52), [0, 4, 7], 1);
        }}
      >
        Hear the sounding chord
      </button>
    </div>
  );
}

export function SecondaryDom() {
  return (
    <div className="widget">
      <h3>V of V</h3>
      <p>
        In C major, G is V. The V of G is D major. D major contains F#, which is not in C major. That visitor exists to point at G. Creep’s B major in G is V of vi (or a chromatic III). Same idea: a major chord a 5th above a target.
      </p>
      <div className="row">
        <button
          type="button"
          className="play-btn"
          onClick={() => {
            unlock();
            playProgression(60, [
              { semi: 0, intervals: [0, 4, 7] },
              { semi: 2, intervals: [0, 4, 7] },
              { semi: 7, intervals: [0, 4, 7] },
              { semi: 0, intervals: [0, 4, 7] },
            ]);
          }}
        >
          C · D · G · C
        </button>
        <button
          type="button"
          className="play-btn ghost"
          onClick={() => {
            unlock();
            playProgression(67, [
              { semi: 0, intervals: [0, 4, 7] },
              { semi: 4, intervals: [0, 4, 7] },
              { semi: 5, intervals: [0, 4, 7] },
              { semi: 5, intervals: [0, 3, 7] },
            ]);
          }}
        >
          Creep letters: G · B · C · Cm
        </button>
      </div>
    </div>
  );
}

export function SeventhColors() {
  const colors = [
    { name: "Major", iv: [0, 4, 7], line: "1 3 5. The triad." },
    { name: "Dominant 7", iv: [0, 4, 7, 10], line: "Add the flat 7th. It wants to resolve down. This is V7." },
    { name: "Major 7", iv: [0, 4, 7, 11], line: "Add the major 7th. It sits. Jazz and quiet pop." },
    { name: "Minor 7", iv: [0, 3, 7, 10], line: "Minor triad plus flat 7. The default jazz minor. Also ii7 in major." },
    { name: "Diminished", iv: [0, 3, 6], line: "Minor 3rd and a flat 5th. Unstable. Often vii°." },
  ];
  return (
    <div className="widget">
      <h3>One extra note changes the job</h3>
      <div className="chips">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            className="chip"
            onClick={() => {
              unlock();
              playChord(60, color.iv, 1.1);
            }}
          >
            {color.name}
          </button>
        ))}
      </div>
      {colors.map((color) => (
        <p key={color.name} className="tiny muted">
          <strong>{color.name}. </strong>
          {color.line}
        </p>
      ))}
    </div>
  );
}

export function PowerShapes() {
  const [fret, setFret] = useState(0);
  return (
    <div className="widget studio">
      <h3>Root and 5th. No 3rd.</h3>
      <p>
        On the E or A string, a power chord is this fret on the thick string and two frets higher on the next string (root and 5th). Move it. Seven Nation Army is this idea with roots E G D C B.
      </p>
      <div className="row">
        {[0, 3, 5, 7, 8, 10].map((n) => (
          <button
            key={n}
            type="button"
            className={`chip ${fret === n ? "on" : ""}`}
            onClick={() => {
              setFret(n);
              unlock();
              hush();
              playMidi(40 + n, 0.8, 0, 0.12);
              playMidi(45 + n + 2, 0.8, 0.02, 0.1);
            }}
          >
            {noteName(4 + n)}5
          </button>
        ))}
      </div>
    </div>
  );
}

export function SusAdd() {
  return (
    <div className="widget">
      <h3>Replace the 3rd, or add a 9</h3>
      <div className="row">
        <button type="button" className="play-btn ghost" onClick={() => { unlock(); playChord(62, [0, 4, 7], 1); }}>
          D
        </button>
        <button type="button" className="play-btn ghost" onClick={() => { unlock(); playChord(62, [0, 5, 7], 1); }}>
          Dsus4
        </button>
        <button type="button" className="play-btn ghost" onClick={() => { unlock(); playChord(62, [0, 2, 7], 1); }}>
          Dsus2
        </button>
        <button type="button" className="play-btn ghost" onClick={() => { unlock(); playChord(60, [0, 4, 7, 14], 1); }}>
          Cadd9
        </button>
      </div>
      <p className="muted">Sus4 wants to fall to the 3rd. Sus2 is already near the 3rd. Add9 keeps the 3rd and adds the 2nd an octave up. Wonderwall lives on sus voicings.</p>
    </div>
  );
}
