import { analyzeFreq, degreeOf, intervalName, noteName } from "./theory.ts";

export function diagnosePitch(opts: {
  freq: number | null;
  rms: number;
  saPc: number;
  targetPc?: number;
  scale?: number[];
  listening: boolean;
  clarity?: number;
  chordish?: boolean;
}): { kind: "idle" | "quiet" | "chord" | "ok" | "sharp" | "flat" | "wrong" | "outside"; line: string } {
  const { freq, rms, saPc, targetPc, scale, listening, clarity = 0, chordish = false } = opts;
  if (!listening) return { kind: "idle", line: "Mic is off. Written lessons still work — like reading before you speak." };
  if (chordish || (rms > 0.04 && (freq === null || clarity < 0.4))) {
    return { kind: "chord", line: "That sounded like more than one string, or a scrape. Mute the extras. One note at a time — like one person talking." };
  }
  if (freq === null || clarity < 0.35) {
    return { kind: "quiet", line: "Too quiet, or still dying off. Play one string nearer the mic and let it ring." };
  }
  const info = analyzeFreq(freq);
  if (!info) return { kind: "quiet", line: "Could not lock a pitch. Play nearer the mic, or pluck harder and let it speak." };

  const letter = info.name;
  if (targetPc !== undefined && info.pc !== targetPc) {
    const want = noteName(targetPc);
    const up = (targetPc - info.pc + 12) % 12;
    const down = (info.pc - targetPc + 12) % 12;
    const nearer = up <= down ? `${up} fret${up === 1 ? "" : "s"} higher` : `${down} fret${down === 1 ? "" : "s"} lower`;
    return {
      kind: "wrong",
      line: `You played ${letter}. Target is ${want}. That is ${nearer} on the same string.`,
    };
  }
  if (Math.abs(info.cents) > 25) {
    if (info.cents > 0) {
      return { kind: "sharp", line: `Right letter (${letter}), ${info.cents.toFixed(0)} cents sharp. Finger closer to the metal fret, or tune that string down a hair.` };
    }
    return { kind: "flat", line: `Right letter (${letter}), ${Math.abs(info.cents).toFixed(0)} cents flat. Press a little more, sit closer to the fret wire, or tune up a hair.` };
  }
  if (scale) {
    const interval = (info.pc - saPc + 12) % 12;
    if (!scale.includes(interval)) {
      return {
        kind: "outside",
        line: `${letter} is ${degreeOf(interval)} from home. It is not in this scale. If you wanted that color, keep it. If you wanted the scale, move one fret — like stepping onto the next stair.`,
      };
    }
  }
  if (targetPc !== undefined) return { kind: "ok", line: `${letter} is in tune. Hold it.` };
  if (scale) return { kind: "ok", line: `${letter}. Inside the scale.` };
  return { kind: "ok", line: `${letter}.` };
}

export function comparePhrases(
  want: number[],
  heard: number[],
  homePc: number,
): { ok: boolean; lines: string[] } {
  const target = collapse(want.map((semi) => ((homePc + semi) % 12 + 12) % 12));
  const got = collapse(heard);
  if (got.length === 0) {
    return { ok: false, lines: ["I did not catch a clear single-note line. Play slower, one string at a time, and let each note speak — like saying one word, then the next."] };
  }
  const lines: string[] = [];
  const extras: string[] = [];
  let i = 0;
  for (const pc of got) {
    if (i < target.length && pc === target[i]) {
      i += 1;
      continue;
    }
    const later = target.indexOf(pc, i + 1);
    if (later > i) {
      const skipped = target.slice(i, later).map((item) => noteName(item));
      lines.push(`Skipped ${skipped.join(" · ")}. I heard ${noteName(pc)} next.`);
      i = later + 1;
    } else {
      extras.push(noteName(pc));
    }
  }
  const missing = target.slice(i).map((pc) => noteName(pc));
  if (missing.length) lines.push(`Still waiting for: ${missing.join(" · ")}.`);
  if (extras.length) lines.push(`Extra notes I heard: ${extras.join(" · ")}. Passing tones are fine. A scale walk should not need them.`);
  const ok = missing.length === 0;
  if (ok && lines.length === 0) lines.push(`That matched: ${target.map((pc) => noteName(pc)).join("  ")}.`);
  else if (ok) lines.unshift("Every target letter arrived in order.");
  return { ok, lines };
}

function collapse(pcs: number[]): number[] {
  const out: number[] = [];
  for (const pc of pcs) {
    const n = ((pc % 12) + 12) % 12;
    if (out.at(-1) !== n) out.push(n);
  }
  return out;
}

export function distanceHint(fromPc: number, toPc: number): string {
  const up = (toPc - fromPc + 12) % 12;
  return `${intervalName(up)} · ${up} fret${up === 1 ? "" : "s"}`;
}
