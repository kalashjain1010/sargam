import { playMidi, unlock } from "../audio.ts";
import { noteName } from "../theory.ts";

type Props = {
  saPc: number;
  scale: number[];
  baseMidi?: number;
};

const WHITES = [0, 2, 4, 5, 7, 9, 11];
const BLACKS: { pc: number; after: number }[] = [
  { pc: 1, after: 0 },
  { pc: 3, after: 1 },
  { pc: 6, after: 3 },
  { pc: 8, after: 4 },
  { pc: 10, after: 5 },
];

export function Harmonium({ saPc, scale, baseMidi = 60 }: Props) {
  function press(pc: number) {
    unlock();
    playMidi(baseMidi + pc, 0.7);
  }

  return (
    <div className="piano-wrap">
      <div className="piano" aria-label="One octave from C">
        {WHITES.map((pc) => {
          const interval = (pc - saPc + 12) % 12;
          const inside = scale.includes(interval);
          return (
            <button key={pc} type="button" className={`white ${inside ? "inside" : ""} ${interval === 0 ? "is-sa" : ""}`} onClick={() => press(pc)}>
              <small>{noteName(pc)}</small>
            </button>
          );
        })}
        {BLACKS.map((key) => {
          const interval = (key.pc - saPc + 12) % 12;
          const inside = scale.includes(interval);
          return (
            <button
              key={key.pc}
              type="button"
              className={`black ${inside ? "inside" : ""}`}
              style={{ left: `calc(${((key.after + 1) * 100) / 7}% - 18px)` }}
              onClick={() => press(key.pc)}
            >
              {inside ? noteName(key.pc) : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
