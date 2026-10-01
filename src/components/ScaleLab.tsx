import { useEffect, useMemo, useState } from "react";
import { Fretboard } from "./Fretboard.tsx";
import { playMidi, playWalk, unlock } from "../audio.ts";
import { preferredBass, phraseOnBox, scaleBox, scaleRun, type BoxBass } from "../guitar.ts";
import {
  BHUPALI,
  DEGREE,
  GUITAR_KEYS,
  MAJOR,
  MINOR_PENT,
  NATURAL_MINOR,
  jumpsOf,
  noteName,
  sameSteps,
  scaleNoteNames,
  thirdsOf,
  usesFlats,
  type FretPos,
} from "../theory.ts";
import { SCALES, type ScaleDef } from "../scales.ts";

const STAIRS: { semi: number; name: string; hint: string }[] = [
  { semi: 0, name: "1 home", hint: "The floor. Always on. This is the letter that feels finished." },
  { semi: 1, name: "b2", hint: "One fret up. A tiny step. Phrygian lives here." },
  { semi: 2, name: "2", hint: "Two frets. The usual next stair in major and minor." },
  { semi: 3, name: "b3", hint: "Three frets. The sad 3rd. Keep this, drop the bright 3rd, and the face turns minor." },
  { semi: 4, name: "3", hint: "Four frets. The bright 3rd. This is why major sounds happy." },
  { semi: 5, name: "4", hint: "Five frets. Next door in major. Lydian raises this one fret." },
  { semi: 6, name: "#4 / b5", hint: "Six frets. Lydian raises the 4th to here. Blues walks through it." },
  { semi: 7, name: "5", hint: "Seven frets. The spine. Keep it unless you mean Locrian." },
  { semi: 8, name: "b6", hint: "Eight frets. Sad 6th. Natural minor keeps this." },
  { semi: 9, name: "6", hint: "Nine frets. Bright 6th. Dorian’s smile versus ordinary minor." },
  { semi: 10, name: "b7", hint: "Ten frets. Door left open. Mixolydian. The 7th does not lean home." },
  { semi: 11, name: "7", hint: "Eleven frets. Door closed. Major leans back into home." },
];

function sortedSteps(steps: number[]): number[] {
  const uniq = [...new Set(steps.map((step) => ((step % 12) + 12) % 12))];
  if (!uniq.includes(0)) uniq.push(0);
  return uniq.sort((a, b) => a - b);
}

function namedFor(steps: number[]): { kind: "exact"; scale: ScaleDef } | { kind: "other"; near: { name: string; extra: number[]; missing: number[] } | null } {
  const exact = SCALES.find((scale) => sameSteps(scale.steps, steps));
  if (exact) return { kind: "exact", scale: exact };
  let near: { name: string; extra: number[]; missing: number[] } | null = null;
  for (const scale of SCALES) {
    const have = new Set(sortedSteps(steps));
    const want = new Set(scale.steps.map((step) => step % 12));
    const extra = [...have].filter((step) => !want.has(step));
    const missing = [...want].filter((step) => !have.has(step));
    if (extra.length + missing.length === 1) {
      near = { name: scale.name, extra, missing };
      break;
    }
  }
  return { kind: "other", near };
}

function gapLabel(gap: number): string {
  if (gap === 1) return "next fret";
  if (gap === 2) return "skip one";
  if (gap === 3) return "skip two";
  return `skip ${gap - 1}`;
}

export function ScaleMaker() {
  const [home, setHome] = useState(0);
  const [picked, setPicked] = useState<number[]>([...MAJOR]);
  const [focus, setFocus] = useState(4);
  const steps = sortedSteps(picked);
  const named = namedFor(steps);
  const jumps = jumpsOf(steps);
  const hasBright = steps.includes(4);
  const hasSad = steps.includes(3);
  const hasFifth = steps.includes(7);
  const bass: BoxBass = preferredBass(home);
  const box = useMemo(() => scaleBox(home, steps, bass), [home, steps, bass]);
  const focused = STAIRS[focus] ?? STAIRS[0];

  function toggle(semi: number) {
    setFocus(semi);
    if (semi === 0) return;
    setPicked((current) => (current.includes(semi) ? current.filter((item) => item !== semi) : [...current, semi]));
  }

  function hear() {
    unlock();
    playWalk(
      scaleRun(box, "up").map((pos) => pos.midi),
      0.26,
    );
  }

  return (
    <div className="widget studio" id="make-scale">
      <div className="studio-head">
        <div>
          <p className="eyebrow">Your recipe</p>
          <h3>How to make your own scale</h3>
        </div>
      </div>
      <div className="how-card">
        <p>
          There are twelve stairs from one home to the next home (the octave). A scale is which stairs you stand on. You write it as
          the <strong>gaps in frets</strong> between those stairs. Major, the default happy walk, is{" "}
          <strong>2 2 1 2 2 2 1</strong> — skip, skip, next, skip, skip, skip, next.
        </p>
        <ol>
          <li>Pick a home letter. That is the note that feels finished.</li>
          <li>Home (1) stays on. Most recipes also keep the 5th — seven frets up. That is the spine.</li>
          <li>The 3rd is the face: 3 frets = sad, 4 frets = bright. Do not keep both unless you mean blues.</li>
          <li>
            Change <em>one</em> stair of major and listen. Raise the 4th (F becomes F# in C) → Lydian. Lower the 7th → Mixolydian.
            Flatten the 3rd → a minor world.
          </li>
          <li>If the app names it, you rediscovered a known recipe. If it does not, that is allowed. Hear it. Keep the hole you like.</li>
          <li>Then practice it as a box, same as any named scale. Move home. The gaps travel. The letters change.</li>
        </ol>
        <p className="example">
          <strong>Example. </strong>
          Start from C major: C D E F G A B. Tap the 4th off, tap #4 on. Letters become C D E F# G A B. Gaps become 2 2 2 1 2 2 1.
          That is Lydian. One stair. New face.
        </p>
      </div>
      <div className="row">
        <span className="tiny muted">Home</span>
        {GUITAR_KEYS.map((key) => (
          <button key={key.pc} type="button" className={`chip ${home === key.pc ? "on" : ""}`} onClick={() => setHome(key.pc)}>
            {key.name}
          </button>
        ))}
      </div>
      <div className="row">
        <span className="tiny muted">Start from</span>
        <button type="button" className="chip" onClick={() => setPicked([...MAJOR])}>
          Major
        </button>
        <button type="button" className="chip" onClick={() => setPicked([...NATURAL_MINOR])}>
          Natural minor
        </button>
        <button type="button" className="chip" onClick={() => setPicked([...MINOR_PENT])}>
          Minor pentatonic
        </button>
        <button type="button" className="chip" onClick={() => setPicked([...BHUPALI])}>
          Major pentatonic
        </button>
        <button type="button" className="chip" onClick={() => setPicked([0, 7])}>
          Home + 5th only
        </button>
      </div>
      <p className="tiny muted">Tap a stair to add or remove it. Home will not turn off.</p>
      <div className="note-pad degree-pad">
        {STAIRS.map((stair) => (
          <button
            key={stair.semi}
            type="button"
            className={`note-key ${steps.includes(stair.semi) ? "right" : ""} ${stair.semi === 0 ? "sa-key" : ""} ${focus === stair.semi ? "focus" : ""}`}
            onClick={() => toggle(stair.semi)}
          >
            <strong>{stair.name}</strong>
            <em>{stair.semi === 0 ? noteName(home, usesFlats(home)) : `${stair.semi} fret${stair.semi === 1 ? "" : "s"}`}</em>
          </button>
        ))}
      </div>
      <p className="tiny muted">
        <strong>{focused.name}. </strong>
        {focused.hint}
      </p>
      <p className="pitch-read">{scaleNoteNames(home, steps).join("  ")}</p>
      <div className="jump-row" aria-label="fret gaps">
        {jumps.map((gap, index) => (
          <span key={`${index}-${gap}`} className="jump-pill">
            <b>{gap}</b>
            <em>{gapLabel(gap)}</em>
          </span>
        ))}
      </div>
      {named.kind === "exact" ? (
        <p className="ok-line">
          That is <strong>{named.scale.name}</strong>. {named.scale.tell}
        </p>
      ) : named.near ? (
        <p>
          One stair away from <strong>{named.near.name}</strong>
          {named.near.extra.length ? ` · you added ${DEGREE[named.near.extra[0] ?? 0]}` : ""}
          {named.near.missing.length ? ` · you dropped ${DEGREE[named.near.missing[0] ?? 0]}` : ""}. Hear it. Keep it if you like the
          hole.
        </p>
      ) : (
        <p>No famous name. That is fine. It is your recipe. Judge it with your ears, not a list.</p>
      )}
      {hasBright && hasSad ? (
        <p className="tiny muted">You kept both 3rds. Blues does this. Parking on both at once is muddy. Use one as a passing fret.</p>
      ) : null}
      {!hasFifth ? <p className="tiny muted">No 5th. The spine is gone. Locrian and some pentatonics do this. Home will feel less “finished.”</p> : null}
      <div className="row">
        <button type="button" className="play-btn" onClick={hear}>
          Hear this recipe
        </button>
      </div>
      <Fretboard
        saPc={home}
        scale={steps}
        found={box}
        label="degree"
        onPick={(pos) => {
          unlock();
          playMidi(pos.midi, 0.45);
        }}
      />
      <p className="tiny muted">Gold numbers are scale degrees from home. Tap a lit fret to hear that guitar note.</p>
      <ScaleDrill home={home} steps={steps} title="Practice this recipe" />
    </div>
  );
}

export function ScaleDrill({
  home,
  steps,
  title = "Scale practice",
}: {
  home: number;
  steps: number[];
  title?: string;
}) {
  const [job, setJob] = useState<"follow" | "thirds" | "find">("follow");
  const [path, setPath] = useState<FretPos[]>([]);
  const [at, setAt] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [miss, setMiss] = useState<FretPos[]>([]);
  const [phase, setPhase] = useState<"idle" | "go" | "done">("idle");
  const [findPc, setFindPc] = useState<number | null>(null);
  const box = useMemo(() => scaleBox(home, steps), [home, steps]);
  const target = phase === "go" && job !== "find" ? path[at] : null;
  const findTarget = phase === "go" && job === "find" && findPc !== null;

  useEffect(() => {
    setPhase("idle");
    setPath([]);
    setAt(0);
    setMiss([]);
    setFindPc(null);
  }, [home, steps, job]);

  function startFollow() {
    const next = scaleRun(box, "up");
    setPath(next);
    setAt(0);
    setPhase(next.length ? "go" : "idle");
    setMiss([]);
    if (next[0]) {
      unlock();
      playMidi(next[0].midi, 0.4);
    }
  }

  function startThirds() {
    const next = phraseOnBox(box, home, thirdsOf(steps));
    setPath(next);
    setAt(0);
    setPhase(next.length ? "go" : "idle");
    setMiss([]);
    unlock();
    playWalk(
      next.map((pos) => pos.midi),
      0.28,
    );
  }

  function startFind() {
    const pick = box[Math.floor(Math.random() * box.length)];
    if (!pick) return;
    setFindPc(((pick.midi % 12) + 12) % 12);
    setPhase("go");
    setMiss([]);
    unlock();
    playMidi(pick.midi, 0.55);
  }

  function onPick(pos: FretPos & { pc: number }) {
    unlock();
    playMidi(pos.midi, 0.35);
    if (phase !== "go") return;
    if (job === "find" && findPc !== null) {
      if (pos.pc === findPc) {
        setHits((n) => n + 1);
        setPhase("done");
        setMiss([]);
      } else {
        setMisses((n) => n + 1);
        setMiss([pos]);
      }
      return;
    }
    const want = path[at];
    if (!want) return;
    if (want.stringId === pos.stringId && want.fret === pos.fret) {
      const nextAt = at + 1;
      setHits((n) => n + 1);
      setMiss([]);
      if (nextAt >= path.length) {
        setAt(nextAt);
        setPhase("done");
      } else {
        setAt(nextAt);
        const nxt = path[nextAt];
        if (nxt) playMidi(nxt.midi, 0.28, 0.05);
      }
    } else {
      setMisses((n) => n + 1);
      setMiss([pos]);
    }
  }

  const letter = findPc === null ? "" : noteName(findPc, usesFlats(home));

  return (
    <div className="widget">
      <h3>{title}</h3>
      <p>
        The guitar does not care about the name. It cares that your fingers walk the same gaps, in time, without looking at a
        chart. Three drills. No mic needed. Tap the neck.
      </p>
      <div className="chips">
        <button type="button" className={`chip ${job === "follow" ? "on" : ""}`} onClick={() => setJob("follow")}>
          Follow the light
        </button>
        <button type="button" className={`chip ${job === "thirds" ? "on" : ""}`} onClick={() => setJob("thirds")}>
          Thirds
        </button>
        <button type="button" className={`chip ${job === "find" ? "on" : ""}`} onClick={() => setJob("find")}>
          Find the letter
        </button>
      </div>
      {job === "follow" ? (
        <p>Gold is the next fret. Tap that exact cell, thick string to thin, then the next. Say the letter as you land.</p>
      ) : null}
      {job === "thirds" ? (
        <p>
          Thirds means skip one scale stair: 1 then 3, 2 then 4, like walking every other stepping stone. Hear the pattern, then
          tap the gold cells in order.
        </p>
      ) : null}
      {job === "find" ? (
        <p>The app plays a letter from this box. Tap any fret that is that letter. Same letter, any string.</p>
      ) : null}
      <div className="row">
        {job === "follow" ? (
          <button type="button" className="play-btn" onClick={startFollow}>
            {phase === "idle" ? "Start follow" : "Restart"}
          </button>
        ) : null}
        {job === "thirds" ? (
          <button type="button" className="play-btn" onClick={startThirds}>
            {phase === "idle" ? "Hear thirds, then tap" : "Again"}
          </button>
        ) : null}
        {job === "find" ? (
          <button type="button" className="play-btn" onClick={startFind}>
            {phase === "idle" ? "Play one letter" : "Another"}
          </button>
        ) : null}
      </div>
      {phase === "go" && job !== "find" ? (
        <p className="pitch-read">
          {at + 1} / {path.length}
          {target ? ` · ${noteName(target.midi, usesFlats(home))}` : ""}
        </p>
      ) : null}
      {phase === "go" && findTarget ? <p className="pitch-read">Find {letter}</p> : null}
      {phase === "done" ? (
        <p className="ok-line">{job === "find" ? `That was ${letter}.` : "Box complete. Do it again, then change home."}</p>
      ) : null}
      <p className="tiny muted">
        Hits {hits} · misses {misses}. Misses are information. The next tap is the real practice.
      </p>
      <Fretboard
        saPc={home}
        scale={steps}
        found={box}
        highlight={target ? [target] : []}
        miss={miss}
        label="note"
        onPick={onPick}
      />
    </div>
  );
}
