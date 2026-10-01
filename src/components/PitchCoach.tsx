import { useEffect, useRef, useState } from "react";
import { unlock } from "../audio.ts";
import { diagnosePitch } from "../coach.ts";
import { analyzeFreq, noteName, octaveOf } from "../theory.ts";
import { useMic } from "../useMic.ts";

type Props = {
  saPc: number;
  targetPc?: number;
  scale?: number[];
  conceal?: boolean;
  onStable?: () => void;
};

export function PitchCoach({ saPc, targetPc, scale, conceal = false, onStable }: Props) {
  const [listening, setListening] = useState(false);
  const [held, setHeld] = useState(false);
  const { freq, rms, error } = useMic(listening);
  const onStableRef = useRef(onStable);
  onStableRef.current = onStable;
  const hold = useRef({ n: 0, fired: false });

  useEffect(() => {
    setHeld(false);
    hold.current = { n: 0, fired: false };
  }, [targetPc]);

  useEffect(() => {
    if (!listening || targetPc === undefined) return;
    if (freq === null) {
      hold.current.n = 0;
      return;
    }
    const info = analyzeFreq(freq);
    if (info && info.pc === targetPc && Math.abs(info.cents) <= 25) hold.current.n += 1;
    else hold.current.n = 0;
    if (hold.current.n >= 8 && !hold.current.fired) {
      hold.current.fired = true;
      setHeld(true);
      onStableRef.current?.();
    }
  }, [freq, listening, targetPc]);

  const info = freq ? analyzeFreq(freq) : null;
  const cents = info?.cents ?? 0;
  const targetName = targetPc === undefined ? null : noteName(targetPc);
  const verdict = diagnosePitch({ freq, rms, saPc, targetPc, scale, listening });

  return (
    <div className="coach">
      <div className="coach-top">
        <div>
          <p className="eyebrow">{targetName ? "Hold this letter" : "Live listen"}</p>
          <strong className="coach-target">{conceal && !held ? "Listen, then match it" : targetName ? targetName : (info?.name ?? "—")}</strong>
          {targetName ? <p className="muted">Any octave. One string. Let it ring.</p> : null}
        </div>
        <button
          type="button"
          className={`play-btn ${listening ? "" : "ghost"}`}
          onClick={() => {
            unlock();
            setHeld(false);
            hold.current = { n: 0, fired: false };
            setListening((on) => !on);
          }}
        >
          {listening ? "Stop mic" : "Use microphone"}
        </button>
      </div>
      {error ? <p className="warn">{error}</p> : null}
      <div className="meter" aria-hidden="true">
        <i className="zone" />
        <i className="needle" style={{ left: `${50 + Math.max(-50, Math.min(50, cents))}%` }} />
      </div>
      {error ? null : <p className={`verdict ${verdict.kind}`}>{verdict.line}</p>}
      <p className="pitch-read">
        {error
          ? "Mic blocked. Written lessons still work."
          : info ? (
          <>
            {info.name}
            {octaveOf(info.midi)} · {freq?.toFixed(1)} Hz ·{" "}
            {cents > 0 ? `${cents.toFixed(0)} cents sharp` : cents < 0 ? `${Math.abs(cents).toFixed(0)} cents flat` : "centered"}
          </>
        ) : listening ? (
          "Waiting for a single note."
        ) : (
          "Mic off."
        )}
      </p>
      {held ? <p className="ok-line">Held in tune. That letter is yours.</p> : null}
      {targetPc !== undefined ? (
        <p className="muted tiny">A fretted note within about 25 cents counts. Bends between frets are music — the meter will follow them. Judge the landing.</p>
      ) : null}
    </div>
  );
}
