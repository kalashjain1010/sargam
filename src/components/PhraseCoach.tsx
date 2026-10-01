import { useEffect, useRef, useState } from "react";
import { playPhrase, unlock } from "../audio.ts";
import { comparePhrases } from "../coach.ts";
import { analyzeFreq, nearestMidi, noteName } from "../theory.ts";
import { useMic } from "../useMic.ts";

export type PhraseJob = {
  id: string;
  name: string;
  hint: string;
  homePc: number;
  offsets: number[];
};

const JOBS: PhraseJob[] = [
  { id: "fifth", name: "Home then 5th", hint: "Two notes. Seven frets, or the next string two frets higher from E/A.", homePc: 4, offsets: [0, 7] },
  { id: "maj3", name: "Major 3rd", hint: "Home, then 4 frets up.", homePc: 0, offsets: [0, 4] },
  { id: "min3", name: "Minor 3rd", hint: "Home, then 3 frets up.", homePc: 9, offsets: [0, 3] },
  { id: "triad", name: "Major triad, one note at a time", hint: "C, E, G. Arpeggiate. Do not strum.", homePc: 0, offsets: [0, 4, 7] },
  { id: "minor-triad", name: "Minor triad", hint: "A, C, E.", homePc: 9, offsets: [0, 3, 7] },
  { id: "major-walk", name: "Major scale, first five", hint: "C D E F G. Whole whole half whole.", homePc: 0, offsets: [0, 2, 4, 5, 7] },
  { id: "pent", name: "A minor pentatonic, one octave", hint: "A C D E G A. The box.", homePc: 9, offsets: [0, 3, 5, 7, 10, 12] },
  { id: "lydian", name: "Lydian tell", hint: "C then F#. Raised 4th. Six frets.", homePc: 0, offsets: [0, 6] },
];

export function PhraseCoach({ jobs = JOBS }: { jobs?: PhraseJob[] }) {
  const [jobId, setJobId] = useState(jobs[0]?.id ?? "fifth");
  const job = jobs.find((item) => item.id === jobId) ?? jobs[0];
  const [recording, setRecording] = useState(false);
  const [heard, setHeard] = useState<number[]>([]);
  const [result, setResult] = useState<{ ok: boolean; lines: string[] } | null>(null);
  const { freq, rms, error } = useMic(recording);
  const stable = useRef({ pc: -1, n: 0 });
  const heardRef = useRef<number[]>([]);

  useEffect(() => {
    heardRef.current = heard;
  }, [heard]);

  useEffect(() => {
    if (!recording) {
      stable.current = { pc: -1, n: 0 };
      return;
    }
    if (freq === null) {
      if (rms < 0.01) stable.current.n = 0;
      return;
    }
    const info = analyzeFreq(freq);
    if (!info || Math.abs(info.cents) > 35) {
      stable.current.n = 0;
      return;
    }
    if (stable.current.pc === info.pc) stable.current.n += 1;
    else {
      stable.current = { pc: info.pc, n: 1 };
    }
    if (stable.current.n === 4) {
      setHeard((current) => (current.at(-1) === info.pc ? current : [...current, info.pc]));
    }
  }, [freq, recording, rms]);

  useEffect(() => {
    if (!recording) return;
    const id = window.setTimeout(() => finish(), 12000);
    return () => window.clearTimeout(id);
    // finish closes over latest heard via ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  function finish() {
    if (!job) return;
    setRecording(false);
    setResult(comparePhrases(job.offsets, heardRef.current, job.homePc));
  }

  if (!job) return null;

  return (
    <div className="widget studio">
      <h3>Play it back. I will say what went wrong.</h3>
      <p>
        The mic is monophonic. Arpeggiate. Chords look like noise. Slow is better than fast. Twelve seconds, then a report.
      </p>
      <div className="chips">
        {jobs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`chip ${jobId === item.id ? "on" : ""}`}
            onClick={() => {
              setJobId(item.id);
              setHeard([]);
              setResult(null);
              setRecording(false);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="muted">{job.hint}</p>
      <p className="pitch-read">Target: {job.offsets.map((semi) => noteName((job.homePc + semi + 12) % 12)).join("  ")}</p>
      <div className="row play-row">
        <button
          type="button"
          className="play-btn ghost"
          onClick={() => {
            unlock();
            playPhrase(nearestMidi(job.homePc, 60), job.offsets, 0.42);
          }}
        >
          Hear the target
        </button>
        <button
          type="button"
          className="play-btn"
          onClick={() => {
            unlock();
            if (recording) {
              finish();
              return;
            }
            setHeard([]);
            setResult(null);
            heardRef.current = [];
            setRecording(true);
          }}
        >
          {recording ? "Stop and judge" : "Record me"}
        </button>
      </div>
      {error ? <p className="warn">{error}</p> : null}
      {recording ? (
        <p className="ok-line">
          Recording… {heard.map((pc) => noteName(pc)).join("  ") || "waiting for the first note"}
        </p>
      ) : null}
      {result ? (
        <div className={result.ok ? "why" : "why warn-box"}>
          {result.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
