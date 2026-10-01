import { useState } from "react";
import { Harmonium } from "../components/Harmonium.tsx";
import { PitchCoach } from "../components/PitchCoach.tsx";
import { Fretboard } from "../components/Fretboard.tsx";
import { droneIsOn, playMidi, playPhrase, saMidiFor, startDrone, stopDrone, unlock } from "../audio.ts";
import { useProgress } from "../progress.tsx";
import {
  BLUES,
  GUITAR_KEYS,
  MINOR_PENT,
  RAGAS,
  MAJOR,
  nearestMidi,
  noteName,
  positionsOf,
  scaleNoteNames,
  usesFlats,
} from "../theory.ts";

const EXTRAS = [
  { id: "bilawal-scale", name: "Major", steps: MAJOR },
  { id: "minor-pent", name: "Minor pentatonic", steps: MINOR_PENT },
  { id: "blues", name: "Blues", steps: BLUES },
];

export function PracticePage() {
  const { saPc, setSa, stamp } = useProgress();
  const [col, setCol] = useState("yaman");
  const [drone, setDrone] = useState(false);
  const raga = RAGAS.find((item) => item.id === col);
  const extra = EXTRAS.find((item) => item.id === col);
  const steps = raga?.steps ?? extra?.steps ?? MAJOR;
  const name = raga ? `${raga.western}` : extra?.name ?? "Major";

  return (
    <div className="home wide">
      <p className="eyebrow">Practice room</p>
      <h1>Pick a home letter. Pick a scale. Play one note.</h1>
      <p className="lede">
        The neck is labeled in C D E F G A B from your home. The mic names whatever single note it hears, in cents, and says whether that letter belongs. Chords and bends will look unstable. That is the detector telling the truth about a moving pitch.
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
      <h2>{raga ? raga.name : name}</h2>
      <div className="chips">
        {RAGAS.map((item) => (
          <button key={item.id} type="button" className={`chip ${col === item.id ? "on" : ""}`} onClick={() => setCol(item.id)}>
            {item.name}
          </button>
        ))}
        {EXTRAS.map((item) => (
          <button key={item.id} type="button" className={`chip ${col === item.id ? "on" : ""}`} onClick={() => setCol(item.id)}>
            {item.name}
          </button>
        ))}
      </div>
      <p className="pitch-read">{scaleNoteNames(saPc, steps).join("  ")}</p>
      <p className="tiny muted">{raga ? `${raga.western}. Indian names are on the Scales page if you want the translation.` : null}</p>
      <div className="row">
        <button
          type="button"
          className="btn secondary"
          onClick={() => {
            unlock();
            playPhrase(nearestMidi(saPc, 60), [...steps, 12]);
          }}
        >
          Play the scale
        </button>
        <button
          type="button"
          className="btn secondary"
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
      <Fretboard
        saPc={saPc}
        scale={steps}
        label="note"
        onPick={(pos) => {
          unlock();
          playMidi(pos.midi, 0.5);
        }}
      />
      <Harmonium saPc={saPc} scale={steps} />
      <h2>What the mic hears</h2>
      <PitchCoach saPc={saPc} scale={steps} />
      <CallBack saPc={saPc} steps={steps} onHit={() => stamp("call-response")} />
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
    <section className="widget">
      <h3>Call and response</h3>
      <p>The app sings a letter from this collection. You play it back and hold it. Any octave.</p>
      <button type="button" className="btn" onClick={ask}>
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
