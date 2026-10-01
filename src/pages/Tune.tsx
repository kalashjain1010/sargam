import { useEffect, useMemo, useRef, useState } from "react";
import { playMidi, unlock } from "../audio.ts";
import { Explain } from "../components/Shell.tsx";
import {
  chromaticAt,
  hzOf,
  letterOf,
  midiLabel,
  nearestOpen,
  patternOf,
  stringsOf,
  TUNING_GROUPS,
  TUNINGS,
  tuningById,
} from "../tunings.ts";
import { useMic } from "../useMic.ts";

const STORE = "sargam-tuning-v1";

function loadPrefs(): { tuning: string; a4: number } {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return { tuning: "standard", a4: 440 };
    const parsed = JSON.parse(raw) as { tuning?: string; a4?: number };
    return {
      tuning: typeof parsed.tuning === "string" ? parsed.tuning : "standard",
      a4: parsed.a4 === 432 ? 432 : 440,
    };
  } catch {
    return { tuning: "standard", a4: 440 };
  }
}

function Dial({ cents, live, ok }: { cents: number; live: boolean; ok: boolean }) {
  const angle = (Math.max(-50, Math.min(50, cents)) / 50) * 58;
  return (
    <div className={`dial ${ok ? "ok" : live ? "live" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 240 148">
        <path className="dial-arc" d="M28 132 A92 92 0 0 1 212 132" />
        <path className="dial-ok" d="M96 48 A92 92 0 0 1 144 48" />
        <text x="28" y="146">−50</text>
        <text x="120" y="28">in tune</text>
        <text x="212" y="146">+50</text>
      </svg>
      <i className="dial-needle" style={{ transform: `translateX(-50%) rotate(${angle}deg)` }} />
      <b className="dial-hub" />
    </div>
  );
}

export function TunePage() {
  const prefs = useMemo(loadPrefs, []);
  const [tuningId, setTuningId] = useState(prefs.tuning);
  const [a4, setA4] = useState(prefs.a4);
  const [group, setGroup] = useState<"all" | "everyday" | "drop" | "open" | "other">("all");
  const [mode, setMode] = useState<"guitar" | "chromatic">("guitar");
  const [pinned, setPinned] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [shown, setShown] = useState(0);
  const mic = useMic(listening);
  const tuning = tuningById(tuningId);
  const strings = stringsOf(tuning);
  const smooth = useRef(0);
  const lastString = useRef("");
  const wasOk = useRef(false);

  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify({ tuning: tuningId, a4 }));
  }, [tuningId, a4]);

  const reading = useMemo(() => {
    if (mic.freq === null || mic.error) return null;
    if (mode === "chromatic") {
      const chromatic = chromaticAt(mic.freq, a4, tuning.flats);
      return {
        id: `c-${chromatic.midi}`,
        letter: chromatic.letter,
        label: chromatic.label,
        cents: chromatic.cents,
      };
    }
    const pinnedString = pinned ? strings.find((item) => item.id === pinned) : undefined;
    const hit = pinnedString
      ? { string: pinnedString, cents: 1200 * Math.log2(mic.freq / hzOf(pinnedString.midi, a4)) }
      : nearestOpen(mic.freq, tuning, a4);
    return {
      id: hit.string.id,
      letter: letterOf(hit.string.midi, tuning.flats),
      label: midiLabel(hit.string.midi, tuning.flats),
      cents: hit.cents,
    };
  }, [a4, mic.error, mic.freq, mode, pinned, strings, tuning]);

  const live = Boolean(reading) && !mic.error;
  const cents = reading?.cents ?? 0;
  const ok = live && Math.abs(cents) <= 6 && (mic.clarity ?? 0) >= 0.62;

  useEffect(() => {
    if (reading && reading.id !== lastString.current) {
      smooth.current = reading.cents;
      lastString.current = reading.id;
    }
    if (!live) {
      smooth.current *= 0.62;
      setShown(smooth.current);
      return;
    }
    smooth.current = smooth.current * 0.5 + cents * 0.5;
    setShown(smooth.current);
  }, [cents, live, reading]);

  useEffect(() => {
    if (ok && !wasOk.current) navigator.vibrate?.(18);
    wasOk.current = ok;
  }, [ok]);

  const activeId = pinned ?? (mode === "guitar" && live ? reading?.id : null);
  const listed = group === "all" ? TUNINGS : TUNINGS.filter((item) => item.group === group);
  const line = mic.error
    ? mic.error
    : !listening
      ? "Mic is off. Tap Listen, then pluck one string and let it ring."
      : !live
        ? "Waiting for one string. A full strum looks like a crowd talking at once."
        : ok
          ? `${reading?.letter} is in tune. Next string.`
          : cents > 0
            ? `${reading?.letter} is too high. Turn the peg to slacken — like loosening a shoelace.`
            : `${reading?.letter} is too low. Turn the peg to tighten.`;

  function hear(midi: number) {
    unlock();
    playMidi(midi, 1.35, 0, 0.22);
  }

  return (
    <div className="home wide tune-page">
      <p className="eyebrow">Tuner</p>
      <h1>Pluck one string. Match the letter on the screen.</h1>
      <p className="lede">
        Standard tuning is E A D G B E, thickest to thinnest. Other tunings only change which letter each open string should sing. Green means that string is ready. Sharp is too high. Flat is too low.
      </p>
      <div className="chips">
        <button type="button" className={`chip ${mode === "guitar" ? "on" : ""}`} onClick={() => setMode("guitar")}>
          Guitar strings
        </button>
        <button
          type="button"
          className={`chip ${mode === "chromatic" ? "on" : ""}`}
          onClick={() => {
            setMode("chromatic");
            setPinned(null);
          }}
        >
          Any note
        </button>
        <button type="button" className={`chip ${a4 === 440 ? "on" : ""}`} onClick={() => setA4(440)}>
          A = 440
        </button>
        <button type="button" className={`chip ${a4 === 432 ? "on" : ""}`} onClick={() => setA4(432)}>
          A = 432
        </button>
      </div>
      <section className={`tune-stage ${ok ? "ok" : ""}`}>
        <p className="eyebrow">{tuning.name}</p>
        <Dial cents={shown} live={live} ok={ok} />
        <strong className="tune-letter">{live ? reading?.letter : "—"}</strong>
        <p className="tune-meta">
          {live
            ? `${reading?.label} · ${mic.freq?.toFixed(1)} Hz · ${cents > 0 ? `+${cents.toFixed(0)}` : cents.toFixed(0)} cents`
            : listening
              ? "Listening…"
              : patternOf(tuning)}
        </p>
        <p className={`verdict ${ok ? "ok" : live ? (cents > 0 ? "sharp" : "flat") : ""}`}>{line}</p>
        <div className="row">
          <button
            type="button"
            className={`play-btn huge ${listening ? "" : "ghost"}`}
            onClick={() => {
              unlock();
              setListening((on) => !on);
            }}
          >
            {listening ? "Stop listening" : "Listen"}
          </button>
        </div>
      </section>
      {mode === "guitar" ? (
        <>
          <div className="tune-strings">
            <button
              type="button"
              className={`tune-auto ${pinned === null ? "on" : ""}`}
              onClick={() => setPinned(null)}
            >
              Auto
            </button>
            {[...strings].reverse().map((string) => {
              const on = activeId === string.id;
              const stringOk = on && ok;
              return (
                <button
                  key={string.id}
                  type="button"
                  className={`tune-string ${on ? "on" : ""} ${stringOk ? "ok" : ""}`}
                  data-n={string.slot}
                  onClick={() => {
                    setPinned(string.id);
                    hear(string.midi);
                  }}
                >
                  <span className="tune-slot">{string.slot}</span>
                  <strong>{letterOf(string.midi, tuning.flats)}</strong>
                  <em>{midiLabel(string.midi, tuning.flats)}</em>
                  <i className="wire" />
                </button>
              );
            })}
          </div>
          <p className="tiny muted">Tap a string to pin it and hear the target. Auto guesses from what you play.</p>
        </>
      ) : (
        <p className="tiny muted">Any-note mode names the nearest letter, even if it is a fret, not an open string.</p>
      )}
      <h2>Pick a tuning</h2>
      <div className="chips">
        <button type="button" className={`chip ${group === "all" ? "on" : ""}`} onClick={() => setGroup("all")}>
          All
        </button>
        {TUNING_GROUPS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`chip ${group === item.id ? "on" : ""}`}
            onClick={() => setGroup(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="tune-grid">
        {listed.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`tune-card ${item.id === tuningId ? "on" : ""}`}
            onClick={() => {
              setTuningId(item.id);
              setPinned(null);
            }}
          >
            <strong>{item.name}</strong>
            <span>{patternOf(item)}</span>
            <em>{item.hint}</em>
          </button>
        ))}
      </div>
      <Explain
        idea="A tuner does not care which song you are playing. It only asks: is this open string the letter you chose? Once the six letters are right, every fret is automatically in the right place — like lining up a ruler before you measure."
        example="In Drop D you only retune the thickest string. Play it, wait until the screen says D and sits in green, and leave the other five alone."
      />
    </div>
  );
}
