import { useEffect, useRef, useState } from "react";
import { stopDrone, unlock } from "../audio.ts";
import { detectPitch } from "../pitch.ts";
import { analyzeFreq, noteName, octaveOf } from "../theory.ts";

type Props = {
  saPc: number;
  targetPc?: number;
  scale?: number[];
  conceal?: boolean;
  onStable?: () => void;
};

export function PitchCoach({ saPc, targetPc, scale, conceal = false, onStable }: Props) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [freq, setFreq] = useState<number | null>(null);
  const [held, setHeld] = useState(false);
  const onStableRef = useRef(onStable);
  onStableRef.current = onStable;

  useEffect(() => {
    setHeld(false);
  }, [targetPc]);

  useEffect(() => {
    if (!listening) return;
    let dead = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    let actx: AudioContext | null = null;
    const hold = { n: 0, nulls: 0, fired: false };
    stopDrone();

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        });
        if (dead) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        actx = new AudioContext();
        const source = actx.createMediaStreamSource(stream);
        const analyser = actx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        const buf = new Float32Array(analyser.fftSize);
        let last = 0;
        const tick = (time: number) => {
          raf = requestAnimationFrame(tick);
          if (time - last < 80) return;
          last = time;
          analyser.getFloatTimeDomainData(buf);
          const heard = detectPitch(buf, actx?.sampleRate ?? 44100);
          setFreq(heard);
          if (targetPc === undefined) return;
          if (heard === null) {
            hold.nulls += 1;
            if (hold.nulls > 6) hold.n = 0;
            return;
          }
          hold.nulls = 0;
          const info = analyzeFreq(heard);
          if (info && info.pc === targetPc && Math.abs(info.cents) <= 25) hold.n += 1;
          else hold.n = 0;
          if (hold.n >= 8 && !hold.fired) {
            hold.fired = true;
            setHeld(true);
            onStableRef.current?.();
          }
        };
        raf = requestAnimationFrame(tick);
      } catch {
        if (!dead)
          setError("The browser did not open the microphone. You can allow it and try again, or finish the written checks. The course does not depend on a mic.");
        setListening(false);
      }
    };

    void start();
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((track) => track.stop());
      void actx?.close();
    };
  }, [listening, targetPc]);

  const info = freq ? analyzeFreq(freq) : null;
  const inScale = info && scale ? scale.includes((info.pc - saPc + 12) % 12) : false;
  const cents = info?.cents ?? 0;
  const targetName = targetPc === undefined ? null : noteName(targetPc);

  return (
    <div className="coach">
      <div className="coach-top">
        <div>
          <p className="eyebrow">{targetName ? "Hold this letter" : "Free listening"}</p>
          <strong className="coach-target">{conceal && !held ? "Listen, then match it" : targetName ? targetName : (info?.name ?? "—")}</strong>
          {targetName ? <p className="muted">Any octave counts. One string. Let it ring.</p> : null}
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            unlock();
            setError("");
            setHeld(false);
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
      <p className="pitch-read">
        {info ? (
          <>
            {info.name}
            {octaveOf(info.midi)} · {freq?.toFixed(1)} Hz ·{" "}
            {cents > 0 ? `${cents.toFixed(0)} cents sharp` : cents < 0 ? `${Math.abs(cents).toFixed(0)} cents flat` : "centered"}
            {scale ? (inScale ? " · inside the scale" : " · outside this scale") : ""}
          </>
        ) : listening ? (
          "Play one string and let it ring. Chords confuse the detector."
        ) : (
          "The mic is off. Written lessons still work without it."
        )}
      </p>
      {held ? <p className="ok-line">Held in tune. That letter is yours.</p> : null}
      {targetPc !== undefined ? (
        <p className="muted tiny">Looking for {noteName(targetPc)}. A fretted note within about 25 cents counts. Bends between frets are music, and the meter will follow them.</p>
      ) : null}
    </div>
  );
}
