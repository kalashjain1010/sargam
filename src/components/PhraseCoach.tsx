import { useEffect, useRef, useState } from "react";
import { playPhrase, unlock } from "../audio.ts";
import { comparePhrases } from "../coach.ts";
import { nearestMidi, noteName } from "../theory.ts";
import { useMic } from "../useMic.ts";

export type PhraseJob = {
  id: string;
  name: string;
  hint: string;
  homePc: number;
  offsets: number[];
};

export const PHRASE_JOBS: PhraseJob[] = [
  { id: "fifth", name: "Home then 5th", hint: "Two notes. Seven frets on one string. Or: next string, two frets higher, from E or A.", homePc: 4, offsets: [0, 7] },
  { id: "maj3", name: "Bright 3rd", hint: "Home, then 4 frets up. Like C to E. A smile.", homePc: 0, offsets: [0, 4] },
  { id: "min3", name: "Sad 3rd", hint: "Home, then 3 frets up. Like A to C.", homePc: 9, offsets: [0, 3] },
  { id: "triad", name: "Major chord, one note at a time", hint: "C, then E, then G. Do not strum. Walk the three letters.", homePc: 0, offsets: [0, 4, 7] },
  { id: "minor-triad", name: "Minor chord, one note at a time", hint: "A, then C, then E.", homePc: 9, offsets: [0, 3, 7] },
  { id: "major-walk", name: "Major scale, first five", hint: "C D E F G. Skip, skip, next, skip.", homePc: 0, offsets: [0, 2, 4, 5, 7] },
  { id: "pent", name: "A minor pentatonic, one octave", hint: "A C D E G A. The first rock box.", homePc: 9, offsets: [0, 3, 5, 7, 10, 12] },
  { id: "lydian", name: "Lydian tell", hint: "C then F#. The raised 4th. Six frets. The dreamy stair.", homePc: 0, offsets: [0, 6] },
];

export function PhraseCoach({ jobs = PHRASE_JOBS }: { jobs?: PhraseJob[] }) {
  const [jobId, setJobId] = useState(jobs[0]?.id ?? "fifth");
  useEffect(() => {
    if (jobs[0] && !jobs.some((item) => item.id === jobId)) setJobId(jobs[0].id);
  }, [jobs, jobId]);
  const job = jobs.find((item) => item.id === jobId) ?? jobs[0];
  const [recording, setRecording] = useState(false);
  const [heard, setHeard] = useState<number[]>([]);
  const [result, setResult] = useState<{ ok: boolean; lines: string[] } | null>(null);
  const { event, pc, error } = useMic(recording);
  const heardRef = useRef<number[]>([]);

  useEffect(() => {
    heardRef.current = heard;
  }, [heard]);

  useEffect(() => {
    if (!recording || event !== "onset" || pc === null) return;
    setHeard((current) => (current.at(-1) === pc ? current : [...current, pc]));
  }, [event, pc, recording]);

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
        Think of the mic as a person who can hear one speaker at a time. Pluck one string, let it speak, then the next. A strum is a crowd. Slow is better than fast. Twelve seconds, then a report.
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
