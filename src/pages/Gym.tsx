import { useEffect, useMemo, useRef, useState } from "react";
import { Fretboard } from "../components/Fretboard.tsx";
import { playMidi, unlock } from "../audio.ts";
import { useProgress } from "../progress.tsx";
import type { GymId } from "../progress.tsx";
import {
  FLAT,
  NATURALS,
  SHARP,
  STRINGS,
  intervalName,
  noteName,
  positionsOf,
} from "../theory.ts";
import type { FretPos } from "../theory.ts";

type Mode = "hunt" | "flash" | "jump" | "strings" | "blitz";

const MODES: { id: Mode; title: string; blurb: string }[] = [
  { id: "hunt", title: "Hunt", blurb: "Find every copy of one letter. Like spotting every A on a map." },
  { id: "flash", title: "Flash", blurb: "A fret lights up. Name the letter before you think too hard." },
  { id: "jump", title: "Jump", blurb: "From this fret, tap 5 frets (4th), 7 frets (5th), or 12 (octave)." },
  { id: "strings", title: "Strings", blurb: "Name the six open strings, thick to thin: E A D G B e." },
  { id: "blitz", title: "60s blitz", blurb: "Flash round against the clock." },
];

const OPEN_ORDER = ["E", "A", "D", "G", "B", "e"] as const;

function randomOf<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)] ?? list[0];
}

function randomFret(): FretPos & { pc: number } {
  const string = randomOf(STRINGS);
  const fret = Math.floor(Math.random() * 13);
  const midi = string.midi + fret;
  return { stringId: string.id, fret, midi, pc: midi % 12 };
}

function prettyPos(pos: FretPos): string {
  const string = STRINGS.find((item) => item.id === pos.stringId);
  return `${string?.name ?? pos.stringId} fret ${pos.fret}`;
}

export function GymPage() {
  const { gym } = useProgress();
  const [mode, setMode] = useState<Mode>("hunt");
  const [hard, setHard] = useState(false);

  return (
    <div className="home wide">
      <p className="eyebrow">Fretboard gym</p>
      <h1>Make the neck as boring as a keyboard’s letter row.</h1>
      <p className="lede">
        The goal is not speed for its own sake. It is being able to point at a fret and know the letter, the way you know where W is on a keyboard. Easy shows the names. Hard hides them. Best scores stick on this browser.
      </p>
      <div className="gym-bests">
        {MODES.map((item) => (
          <div key={item.id}>
            <em>{item.title}</em>
            <strong>{gym[item.id as GymId]}</strong>
          </div>
        ))}
        <div>
          <em>Hits</em>
          <strong>{gym.hits}</strong>
        </div>
      </div>
      <div className="chips">
        {MODES.map((item) => (
          <button key={item.id} type="button" className={`chip ${mode === item.id ? "on" : ""}`} onClick={() => setMode(item.id)}>
            {item.title}
          </button>
        ))}
        <button type="button" className={`chip ${hard ? "on" : ""}`} onClick={() => setHard((value) => !value)}>
          {hard ? "Hard · names off" : "Easy · names on"}
        </button>
      </div>
      <p className="muted">{MODES.find((item) => item.id === mode)?.blurb}</p>
      {mode === "hunt" ? <Hunt hard={hard} /> : null}
      {mode === "flash" ? <Flash hard={hard} timed={false} /> : null}
      {mode === "jump" ? <Jump hard={hard} /> : null}
      {mode === "strings" ? <StringsDrill /> : null}
      {mode === "blitz" ? <Flash hard={hard} timed /> : null}
    </div>
  );
}

function Hunt({ hard }: { hard: boolean }) {
  const { recordGym } = useProgress();
  const reported = useRef(false);
  const [pc, setPc] = useState(() => randomOf(NATURALS));
  const [hits, setHits] = useState<string[]>([]);
  const [miss, setMiss] = useState<FretPos[]>([]);
  const [started, setStarted] = useState<number | null>(null);
  const [doneAt, setDoneAt] = useState<number | null>(null);
  const targets = useMemo(() => positionsOf(pc, 12), [pc]);
  const found = hits.map((key) => {
    const [stringId, fretText] = key.split("-");
    return { stringId, fret: Number(fretText), midi: 0 };
  });
  const complete = hits.length === targets.length && targets.length > 0;
  const seconds = doneAt && started ? Math.max(1, Math.round((doneAt - started) / 1000)) : 0;
  const score = complete ? Math.max(1, 200 - seconds * 4 - miss.length * 8) : 0;

  useEffect(() => {
    if (!complete || !started || reported.current) return;
    reported.current = true;
    const now = Date.now();
    setDoneAt(now);
    recordGym("hunt", Math.max(1, 200 - Math.round((now - started) / 1000) * 4 - miss.length * 8), targets.length);
  }, [complete, started, miss.length, recordGym, targets.length]);

  function deal(nextPc = randomOf(NATURALS)) {
    reported.current = false;
    setPc(nextPc);
    setHits([]);
    setMiss([]);
    setStarted(null);
    setDoneAt(null);
  }

  return (
    <section className="widget gym-card">
      <div className="gym-hud">
        <p className="gym-target">Find every {noteName(pc)}</p>
        <p className="gym-meta">
          {hits.length} / {targets.length}
        </p>
      </div>
      <div className="chips">
        {NATURALS.map((n) => (
          <button key={n} type="button" className={`chip ${n === pc ? "on" : ""}`} onClick={() => deal(n)}>
            {noteName(n)}
          </button>
        ))}
      </div>
      <Fretboard
        saPc={4}
        label={hard ? "none" : "note"}
        found={found}
        miss={miss}
        onPick={(pos) => {
          unlock();
          playMidi(pos.midi, 0.32);
          if (!started) setStarted(Date.now());
          if (complete) return;
          if (pos.pc !== pc) {
            setMiss((current) => [...current, pos].slice(-6));
            return;
          }
          const key = `${pos.stringId}-${pos.fret}`;
          setHits((current) => (current.includes(key) ? current : [...current, key]));
        }}
      />
      {complete ? (
        <p className="ok-line">
          Clean. {targets.length} {noteName(pc)}s in {seconds}s · {miss.length} misses · score {score}. The B-string copy sits
          two frets off the fourths pattern, because G to B is a major 3rd.
        </p>
      ) : null}
      <button type="button" className="btn" onClick={() => deal()}>
        New letter
      </button>
    </section>
  );
}

function Flash({ hard, timed }: { hard: boolean; timed: boolean }) {
  const { recordGym } = useProgress();
  const reported = useRef(false);
  const [spot, setSpot] = useState(() => randomFret());
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [left, setLeft] = useState(timed ? 60 : 0);
  const [over, setOver] = useState(false);
  const names = usesSharpBoard(spot.pc) ? SHARP : FLAT;

  useEffect(() => {
    unlock();
    playMidi(spot.midi, 0.4);
  }, [spot]);

  useEffect(() => {
    if (!timed || over) return;
    const id = window.setInterval(() => {
      setLeft((value) => {
        if (value <= 1) {
          window.clearInterval(id);
          setOver(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timed, over]);

  useEffect(() => {
    if (!over || reported.current) return;
    reported.current = true;
    recordGym(timed ? "blitz" : "flash", score, timed ? score : 0);
  }, [over, timed, score, recordGym]);

  function next(correct: boolean) {
    if (correct) {
      setScore((value) => value + 1 + Math.floor(streak / 3));
      setStreak((value) => value + 1);
    } else {
      setStreak(0);
    }
    if (!timed && round >= 20) {
      setOver(true);
      return;
    }
    setRound((value) => value + 1);
    setPicked(null);
    setSpot(randomFret());
  }

  if (over) {
    return (
      <section className="widget gym-card">
        <p className="gym-target">{timed ? "Time." : "Round done."}</p>
        <p className="ok-line">
          {score} correct{timed ? " in 60 seconds" : " in 20 flashes"}. Streak died at {streak}.
        </p>
        <button
          type="button"
          className="btn"
          onClick={() => {
            reported.current = false;
            setScore(0);
            setStreak(0);
            setRound(1);
            setLeft(timed ? 60 : 0);
            setOver(false);
            setPicked(null);
            setSpot(randomFret());
          }}
        >
          Again
        </button>
      </section>
    );
  }

  return (
    <section className="widget gym-card">
      <div className="gym-hud">
        <p className="gym-target">{prettyPos(spot)}</p>
        <p className="gym-meta">
          {timed ? `${left}s` : `${round} / 20`} · streak {streak} · {score}
        </p>
      </div>
      <Fretboard saPc={4} label={hard ? "none" : "note"} highlight={[spot]} />
      <div className="note-pad">
        {names.map((name, index) => {
          const state = picked === null ? "" : index === spot.pc ? "right" : index === picked ? "wrong" : "";
          return (
            <button
              key={name}
              type="button"
              className={`note-key ${state}`}
              onClick={() => {
                if (picked !== null) return;
                unlock();
                playMidi(spot.midi, 0.28);
                setPicked(index);
                window.setTimeout(() => next(index === spot.pc), 420);
              }}
            >
              {name}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="btn ghost"
        onClick={() => {
          unlock();
          playMidi(spot.midi, 0.45);
        }}
      >
        Hear it again
      </button>
    </section>
  );
}

function usesSharpBoard(pc: number): boolean {
  return ![1, 3, 5, 8, 10].includes(pc);
}

function Jump({ hard }: { hard: boolean }) {
  const { recordGym } = useProgress();
  const jumps = [
    { semi: 5, ask: "perfect 4th · 5 frets" },
    { semi: 7, ask: "perfect 5th · 7 frets" },
    { semi: 12, ask: "octave · 12 frets, same letter" },
  ];
  const [from, setFrom] = useState(() => randomFret());
  const [jump, setJump] = useState(() => randomOf(jumps));
  const [hits, setHits] = useState<FretPos[]>([]);
  const [miss, setMiss] = useState<FretPos[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const want = jump.semi === 12 ? from.pc : (from.pc + jump.semi) % 12;

  function deal() {
    setFrom(randomFret());
    setJump(randomOf(jumps));
    setHits([]);
    setMiss([]);
  }

  return (
    <section className="widget gym-card">
      <div className="gym-hud">
        <p className="gym-target">
          From {prettyPos(from)}, tap a {jump.ask}
        </p>
        <p className="gym-meta">
          Round {round} · {score} clean
        </p>
      </div>
      <p className="muted">
        Start is {noteName(from.pc)}. Target letter is {jump.semi === 12 ? noteName(from.pc) : noteName(from.pc + jump.semi)}. Any
        string, any octave.
      </p>
      <Fretboard
        saPc={from.pc}
        label={hard ? "none" : "note"}
        highlight={[from]}
        found={hits}
        miss={miss}
        onPick={(pos) => {
          unlock();
          playMidi(pos.midi, 0.34);
          if (pos.stringId === from.stringId && pos.fret === from.fret) return;
          if (pos.pc !== want) {
            setMiss([pos]);
            return;
          }
          setHits([pos]);
          setMiss([]);
          setScore((value) => value + 1);
          recordGym("jump", score + 1, 1);
          window.setTimeout(() => {
            setRound((value) => value + 1);
            deal();
          }, 650);
        }}
      />
      <p className="tiny muted">
        {intervalName(jump.semi === 12 ? 12 : jump.semi)} from {noteName(from.pc)} is {noteName(want)}.
      </p>
    </section>
  );
}

function StringsDrill() {
  const { recordGym } = useProgress();
  const [step, setStep] = useState(0);
  const [miss, setMiss] = useState(0);
  const [done, setDone] = useState(false);
  const target = OPEN_ORDER[step];
  const choices = ["E", "A", "D", "G", "B", "e"];

  if (done) {
    const score = Math.max(1, 60 - miss * 8);
    return (
      <section className="widget gym-card">
        <p className="gym-target">E A D G B e</p>
        <p className="ok-line">
          {miss === 0 ? "No misses. That order is the whole guitar." : `${miss} miss${miss === 1 ? "" : "es"}. Score ${score}.`}
        </p>
        <p>Low E, A, D, G, B, high e. The only pair that is not a 4th is G to B, a major 3rd. That is why shapes shift there.</p>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setStep(0);
            setMiss(0);
            setDone(false);
          }}
        >
          Again
        </button>
      </section>
    );
  }

  return (
    <section className="widget gym-card">
      <div className="gym-hud">
        <p className="gym-target">Open string {step + 1} of 6, low to high</p>
        <p className="gym-meta">{miss} misses</p>
      </div>
      <div className="string-slots">
        {OPEN_ORDER.map((name, index) => (
          <i key={name} className={index < step ? "on" : index === step ? "now" : ""}>
            {index < step ? name : "?"}
          </i>
        ))}
      </div>
      <div className="note-pad">
        {choices.map((name) => (
          <button
            key={name}
            type="button"
            className="note-key"
            onClick={() => {
              unlock();
              const string = STRINGS[5 - step];
              if (string) playMidi(string.midi, 0.4);
              if (name !== target) {
                setMiss((value) => value + 1);
                return;
              }
              if (step + 1 >= 6) {
                setDone(true);
                recordGym("strings", Math.max(1, 60 - miss * 8), 6);
                return;
              }
              setStep((value) => value + 1);
            }}
          >
            {name === "e" ? "high e" : name === "E" && step === 0 ? "low E" : name}
          </button>
        ))}
      </div>
    </section>
  );
}
