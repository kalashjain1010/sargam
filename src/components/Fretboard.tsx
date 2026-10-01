import { degreeOf, noteName, STRINGS, usesFlats } from "../theory.ts";
import type { FretPos } from "../theory.ts";
import { useState } from "react";

export type BoardLabel = "note" | "scale" | "degree" | "none";

type Props = {
  saPc: number;
  scale?: number[];
  label?: BoardLabel;
  frets?: number;
  activePcs?: number[];
  found?: FretPos[];
  highlight?: FretPos[];
  miss?: FretPos[];
  onPick?: (pos: FretPos & { pc: number }) => void;
};

function cellKey(stringId: string, fret: number): string {
  return `${stringId}-${fret}`;
}

function samePos(list: FretPos[], stringId: string, fret: number): boolean {
  return list.some((pos) => pos.stringId === stringId && pos.fret === fret);
}

export function Fretboard({
  saPc,
  scale,
  label = "note",
  frets = 12,
  activePcs = [],
  found = [],
  highlight = [],
  miss = [],
  onPick,
}: Props) {
  const flat = usesFlats(saPc);
  const inlays = [3, 5, 7, 9, 12];
  const [tapped, setTapped] = useState("");

  return (
    <div className="neck-wrap">
      <div className="neck" style={{ gridTemplateColumns: `52px repeat(${frets + 1}, minmax(42px, 1fr))` }}>
        <div />
        {Array.from({ length: frets + 1 }, (_, fret) => (
          <div key={`n-${fret}`} className="fret-no">
            {fret}
          </div>
        ))}
        {STRINGS.map((string) => (
          <div key={string.id} className="string-line" data-string={string.id}>
            <div className="s-name">{string.name}</div>
            {Array.from({ length: frets + 1 }, (_, fret) => {
              const midi = string.midi + fret;
              const pc = ((string.midi % 12) + fret) % 12;
              const interval = (pc - saPc + 12) % 12;
              const inScale = !!scale && scale.includes(interval);
              const isHome = interval === 0 && (!scale || inScale);
              const isFound = samePos(found, string.id, fret);
              const isGlow = samePos(highlight, string.id, fret);
              const isMiss = samePos(miss, string.id, fret);
              const isLive = activePcs.includes(pc);
              const showText = label === "note" || (label === "scale" && inScale) || (label === "degree" && inScale);
              const text = label === "degree" ? degreeOf(interval) : noteName(pc, flat);
              const isTap = tapped === cellKey(string.id, fret);
              return (
                <button
                  key={cellKey(string.id, fret)}
                  type="button"
                  className={[
                    "cell",
                    fret === 0 ? "open" : "wired",
                    inScale && scale ? "in" : "",
                    scale && !inScale ? "out" : "",
                    isHome ? "sa" : "",
                    isFound ? "found" : "",
                    isGlow ? "glow" : "",
                    isMiss ? "miss" : "",
                    isLive ? "live" : "",
                    isTap ? "tap" : "",
                  ].join(" ")}
                  onClick={() => {
                    setTapped(cellKey(string.id, fret));
                    onPick?.({ stringId: string.id, fret, midi, pc });
                  }}
                  aria-label={`${string.name} fret ${fret}, ${noteName(pc)}`}
                >
                  {showText ? <span>{text}</span> : <i />}
                </button>
              );
            })}
          </div>
        ))}
        <div />
        {Array.from({ length: frets + 1 }, (_, fret) => (
          <div key={`dot-${fret}`} className="inlay">
            {inlays.includes(fret) ? <b className={fret === 12 ? "double" : ""} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
