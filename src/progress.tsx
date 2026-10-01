import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type GymId = "hunt" | "flash" | "jump" | "strings" | "blitz";

type GymSave = Record<GymId, number> & { hits: number };

type Save = {
  passed: number[];
  stamps: string[];
  saPc: number;
  gym: GymSave;
};

const KEY = "sargam-course-v1";

const blankGym = (): GymSave => ({ hunt: 0, flash: 0, jump: 0, strings: 0, blitz: 0, hits: 0 });

const blank = (): Save => ({ passed: [], stamps: [], saPc: 9, gym: blankGym() });

function load(): Save {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const parsed = JSON.parse(raw) as Partial<Save> & { gym?: Partial<GymSave> };
    return {
      passed: Array.isArray(parsed.passed) ? parsed.passed.filter((n) => typeof n === "number") : [],
      stamps: Array.isArray(parsed.stamps) ? parsed.stamps.filter((s) => typeof s === "string") : [],
      saPc: typeof parsed.saPc === "number" ? parsed.saPc : 9,
      gym: { ...blankGym(), ...(parsed.gym ?? {}) },
    };
  } catch {
    return blank();
  }
}

type ProgressApi = {
  passed: number[];
  stamps: string[];
  saPc: number;
  gym: GymSave;
  pass: (day: number) => void;
  stamp: (id: string) => void;
  setSa: (pc: number) => void;
  isOpen: (day: number) => boolean;
  reset: () => void;
  recordGym: (id: GymId, score: number, hits?: number) => void;
};

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [save, setSave] = useState<Save>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(save));
  }, [save]);

  const api = useMemo<ProgressApi>(() => {
    return {
      passed: save.passed,
      stamps: save.stamps,
      saPc: save.saPc,
      gym: save.gym,
      pass: (day) =>
        setSave((current) =>
          current.passed.includes(day) ? current : { ...current, passed: [...current.passed, day].sort((a, b) => a - b) },
        ),
      stamp: (id) =>
        setSave((current) => (current.stamps.includes(id) ? current : { ...current, stamps: [...current.stamps, id] })),
      setSa: (pc) => setSave((current) => ({ ...current, saPc: pc })),
      isOpen: (day) => day === 1 || save.passed.includes(day - 1),
      reset: () => setSave(blank()),
      recordGym: (id, score, hits = 0) =>
        setSave((current) => ({
          ...current,
          gym: {
            ...current.gym,
            [id]: Math.max(current.gym[id], score),
            hits: current.gym.hits + hits,
          },
        })),
    };
  }, [save]);

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress needs ProgressProvider");
  return ctx;
}
