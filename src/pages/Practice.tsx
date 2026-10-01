import { useState } from "react";
import { Harmonium } from "../components/Harmonium.tsx";
import { PhraseCoach } from "../components/PhraseCoach.tsx";
import { PitchCoach } from "../components/PitchCoach.tsx";
import { ScaleDrill } from "../components/ScaleLab.tsx";
import { ScaleBox } from "../components/widgets.tsx";
import { droneIsOn, playMidi, saMidiFor, startDrone, stopDrone, unlock } from "../audio.ts";
import { useProgress } from "../progress.tsx";
import { GUITAR_KEYS, noteName, positionsOf, scaleNoteNames, usesFlats } from "../theory.ts";
import { SCALES } from "../scales.ts";

export function PracticePage() {
  const { saPc, setSa, stamp } = useProgress();
  const [col, setCol] = useState("major");
  const [drone, setDrone] = useState(false);
  const scale = SCALES.find((item) => item.id === col) ?? SCALES[0];
  const steps = scale.steps;

  return (
    <div className="home wide">
      <p className="eyebrow">Practice room</p>
      <h1>Pick a home letter. Pick a scale. Play one note.</h1>
      <p className="lede">
        Home is the letter that feels like “done.” The neck lights one box — a small window of frets, not the whole guitar. Hear the box, then copy it with one finger per fret. Then run the drills: follow the gold light, walk in thirds, find a letter. Play one string into the mic if you want a check. A strum or a bend will look messy. That is honest: several notes, or a moving note, are not one target.
      </p>
      <h2>Home</h2>
      <div className="chips">
        {GUITAR_KEYS.map((key) => (
          <button key={key.name} type="button" className={`chip ${saPc === key.pc ? "on" : ""}`} onClick={() => setSa(key.pc)}>
            {key.name}
          </button>
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
          .filter((pc) => !GUITAR_KEYS.some((key) => key.pc === pc))
          .map((pc) => (
            <button key={pc} type="button" className={`chip ${saPc === pc ? "on" : ""}`} onClick={() => setSa(pc)}>
              {noteName(pc, usesFlats(pc))}
            </button>
          ))}
      </div>
      <h2>{scale.name}</h2>
      <div className="chips">
        {SCALES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`chip ${col === item.id ? "on" : ""}`}
            onClick={() => {
              setCol(item.id);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="pitch-read">{scaleNoteNames(saPc, steps).join("  ")}</p>
      <p className="tiny muted">{scale.tell}</p>
      <div className="row">
        <button
          type="button"
          className="play-btn ghost"
          onClick={() => {
            unlock();
            if (drone || droneIsOn()) {
              stopDrone();
              setDrone(false);
            } else {
              startDrone(saMidiFor(saPc, 45));
              setDrone(true);
            }
          }}
        >
          {drone ? "Stop drone" : "Drone home + 5th"}
        </button>
      </div>
      <ScaleBox home={saPc} steps={steps} phrase={scale.phrase} />
      <ScaleDrill home={saPc} steps={steps} />
      <Harmonium saPc={saPc} scale={steps} />
      <h2>What the mic hears</h2>
      <PitchCoach saPc={saPc} scale={steps} />
      <CallBack saPc={saPc} steps={steps} onHit={() => stamp("call-response")} />
      <PhraseCoach />
    </div>
  );
}

function CallBack({ saPc, steps, onHit }: { saPc: number; steps: number[]; onHit: () => void }) {
  const [semi, setSemi] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "go" | "ok">("idle");
  const [showHint, setShowHint] = useState(false);

  function ask() {
    const next = steps[Math.floor(Math.random() * steps.length)] ?? 0;
    setSemi(next);
    setPhase("go");
    setShowHint(false);
    unlock();
    playMidi(48 + ((saPc % 12) + 12) % 12 + next, 0.65);
  }

  const target = semi === null ? undefined : (saPc + semi) % 12;
  const hint =
    target === undefined
      ? ""
      : positionsOf(target, 12)
          .slice(0, 4)
          .map((pos) => `${pos.stringId === "e" ? "high e" : pos.stringId === "E" ? "low E" : pos.stringId} fret ${pos.fret}`)
          .join(" · ");

  return (
    <section className="widget studio">
      <h3>Call and response</h3>
      <p>The app sings a letter from this collection. You play it back and hold it. Any octave.</p>
      <button type="button" className="play-btn" onClick={ask}>
        {phase === "idle" ? "Sing one" : "Another"}
      </button>
      {semi !== null ? <p className="pitch-read">Target is hidden until you want the hint. It was just played.</p> : null}
      {phase === "go" && target !== undefined ? (
        <PitchCoach
          key={`${saPc}-${semi}`}
          saPc={saPc}
          targetPc={target}
          scale={steps}
          conceal
          onStable={() => {
            setPhase("ok");
            onHit();
          }}
        />
      ) : null}
      {phase === "ok" && semi !== null ? (
        <p className="ok-line">That was {noteName((saPc + semi) % 12, usesFlats(saPc))}. Again?</p>
      ) : null}
      {semi !== null ? (
        <button type="button" className="btn ghost" onClick={() => setShowHint(true)}>
          Show me where it sits
        </button>
      ) : null}
      {showHint && semi !== null && target !== undefined ? (
        <p>
          {noteName(target, usesFlats(saPc))}. {hint}
        </p>
      ) : null}
    </section>
  );
}
