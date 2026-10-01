import { PHRASE_JOBS } from "./components/PhraseCoach.tsx";
import { SCALES } from "./scales.ts";
import { CHORD_STEPS, DAYS, INTERVAL_NAMES, noteName } from "./theory.ts";
import type { DayMeta } from "./theory.ts";

export type TutorSource = "gemini" | "groq" | "chrome" | "community" | "offline";
export type TutorProvider = "auto" | TutorSource;

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type TutorQuiz = {
  prompt: string;
  choices: string[];
  answer: number;
  why: string;
};

export type TutorAction =
  | { kind: "none" }
  | { kind: "link"; to: string; label: string }
  | { kind: "quiz"; quiz: TutorQuiz }
  | { kind: "phrase"; job: string }
  | { kind: "mic" };

export type TutorReply = {
  say: string;
  action: TutorAction;
  source: TutorSource;
  note?: string;
};

export type StudentSnap = {
  passed: number[];
  next: DayMeta | null;
  saPc: number;
  saName: string;
  gymHits: number;
  ear: { interval: number; scale: number; quality: number; loop: number; degree: number; hits: number };
  heldHome: boolean;
};

export type TutorSettings = {
  provider: TutorProvider;
  gemini: string;
  groq: string;
};

const SETTINGS_KEY = "sargam-tutor-settings-v1";
const PHRASE_IDS = new Set(PHRASE_JOBS.map((job) => job.id));

const SYSTEM = `You are Sargam's guitar trainer. The student already has a 30-day path, a fretboard gym, an ear gym, a microphone coach, a chord lab, scales, songs, and videos inside this same app.

- The student plays a steel-string acoustic guitar (not electric). Examples should assume open chords, capo, and a wooden body.

Rules:
- Letters A B C D E F G only as the main language. Distances in fret counts. A fifth is 7 frets. A major 3rd is 4. A minor 3rd is 3.
- Every idea needs one everyday comparison (stairs, rooms, folding a string in half, bright vs sad, a sentence that can end). Then one guitar example with letters.
- If you must use a theory word (mode, cadence, dominant), define it in the same sentence with frets or a letter example.
- Never invent which raga a film song is in. Never paste lyrics or a copyrighted melody.
- One idea, then one drill. Keep say under 110 words. Plain text, no markdown fences.
- Do not claim you can hear them unless they used the in-app mic tools. You cannot hear a guitar through chat.
- If they ask you to train them, pick the next hole from the student snapshot. Do not restart day 1 if they already passed it.

Reply with JSON only, no extra text:
{"say":"string","action":{"kind":"none"}}
action.kind is one of none, link, quiz, phrase, mic.
link needs to (in-app path: /day/N /path /ear /coach /chords /songs /ragas /watch /gym /practice /tests) and label.
quiz needs prompt, choices (3 or 4 short strings), answer (0-based index), why.
phrase job is one of: fifth, maj3, min3, triad, minor-triad, major-walk, pent, lydian.
mic means they should hold one letter on the in-app tuner.`;

export function loadTutorSettings(): TutorSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { provider: "auto", gemini: "", groq: "" };
    const parsed = JSON.parse(raw) as Partial<TutorSettings>;
    const provider = parsed.provider;
    const allowed: TutorProvider[] = ["auto", "gemini", "groq", "chrome", "community", "offline"];
    return {
      provider: provider && allowed.includes(provider) ? provider : "auto",
      gemini: typeof parsed.gemini === "string" ? parsed.gemini : "",
      groq: typeof parsed.groq === "string" ? parsed.groq : "",
    };
  } catch {
    return { provider: "auto", gemini: "", groq: "" };
  }
}

export function saveTutorSettings(settings: TutorSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function sourceLabel(source: TutorSource): string {
  if (source === "gemini") return "Gemini";
  if (source === "groq") return "Groq";
  if (source === "chrome") return "Chrome on-device";
  if (source === "community") return "Free community model";
  return "Built-in coach";
}

function snapshotBlock(snap: StudentSnap): string {
  const next = snap.next ? `Day ${snap.next.id} · ${snap.next.title} · ${snap.next.promise}` : "Path complete";
  return `STUDENT SNAPSHOT
Passed days: ${snap.passed.join(", ") || "none"}
Next day: ${next}
Home letter in practice: ${snap.saName}
Gym hits: ${snap.gymHits}
Ear bests: intervals ${snap.ear.interval}, scales ${snap.ear.scale}, quality ${snap.ear.quality}, loops ${snap.ear.loop}, degrees ${snap.ear.degree} (total hits ${snap.ear.hits})
Held home in tune: ${snap.heldHome ? "yes" : "not yet"}`;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const text = fenced?.[1]?.trim() ?? trimmed;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("no json");
  return JSON.parse(text.slice(start, end + 1)) as unknown;
}

function asQuiz(value: unknown): TutorQuiz | null {
  if (!value || typeof value !== "object") return null;
  const quiz = value as Partial<TutorQuiz>;
  if (typeof quiz.prompt !== "string" || !Array.isArray(quiz.choices) || quiz.choices.length < 2) return null;
  if (typeof quiz.answer !== "number" || typeof quiz.why !== "string") return null;
  const choices = quiz.choices.filter((item): item is string => typeof item === "string").slice(0, 4);
  if (choices.length < 2) return null;
  const answer = Math.max(0, Math.min(choices.length - 1, Math.floor(quiz.answer)));
  return { prompt: quiz.prompt, choices, answer, why: quiz.why };
}

function parseReply(raw: string, source: TutorSource): TutorReply {
  try {
    const parsed = extractJson(raw) as { say?: unknown; action?: unknown };
    const say = typeof parsed.say === "string" && parsed.say.trim() ? parsed.say.trim() : raw.trim();
    const actionRaw = parsed.action;
    if (!actionRaw || typeof actionRaw !== "object") return { say, action: { kind: "none" }, source };
    const action = actionRaw as Record<string, unknown>;
    const kind = action.kind;
    if (kind === "link" && typeof action.to === "string" && action.to.startsWith("/") && typeof action.label === "string") {
      return { say, action: { kind: "link", to: action.to, label: action.label }, source };
    }
    if (kind === "quiz") {
      const quiz = asQuiz(action.quiz ?? action);
      if (quiz) return { say, action: { kind: "quiz", quiz }, source };
    }
    if (kind === "phrase" && typeof action.job === "string" && PHRASE_IDS.has(action.job)) {
      return { say, action: { kind: "phrase", job: action.job }, source };
    }
    if (kind === "mic") return { say, action: { kind: "mic" }, source };
    return { say, action: { kind: "none" }, source };
  } catch {
    const say = raw.replace(/```[\s\S]*```/g, "").trim();
    return { say: say || "Say that again in one sentence.", action: { kind: "none" }, source };
  }
}

async function geminiComplete(key: string, system: string, history: ChatTurn[]): Promise<string> {
  const models = ["gemini-2.0-flash", "gemini-2.5-flash"];
  let last = "Gemini failed.";
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: history.map((turn) => ({
          role: turn.role === "assistant" ? "model" : "user",
          parts: [{ text: turn.content }],
        })),
        generationConfig: { temperature: 0.35, maxOutputTokens: 700, responseMimeType: "application/json" },
      }),
    });
    if (!response.ok) {
      last = `Gemini ${model} ${response.status}`;
      continue;
    }
    const data = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
    if (text.trim()) return text;
  }
  throw new Error(last);
}

function groqUrl(): string {
  return import.meta.env.DEV ? "/llm/groq" : "https://api.groq.com/openai/v1/chat/completions";
}

async function groqComplete(key: string, system: string, history: ChatTurn[]): Promise<string> {
  const response = await fetch(groqUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: system }, ...history],
    }),
  });
  if (!response.ok) throw new Error(`Groq ${response.status}`);
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content ?? "";
  if (!text.trim()) throw new Error("Groq empty");
  return text;
}

async function communityComplete(system: string, history: ChatTurn[]): Promise<string> {
  const response = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openai",
      private: true,
      messages: [{ role: "system", content: system }, ...history],
    }),
  });
  if (!response.ok) throw new Error(`Community ${response.status}`);
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content ?? "";
  if (!text.trim()) throw new Error("Community empty");
  return text;
}

type PromptApi = {
  availability?: () => Promise<string>;
  create: (opts: { initialPrompts: { role: string; content: string }[] }) => Promise<{ prompt: (input: string) => Promise<string> }>;
};

function chromePromptApi(): PromptApi | null {
  const candidate = (window as Window & { LanguageModel?: PromptApi }).LanguageModel;
  return candidate?.create ? candidate : null;
}

async function chromeComplete(system: string, history: ChatTurn[]): Promise<string> {
  const api = chromePromptApi();
  if (!api) throw new Error("no chrome model");
  if (api.availability) {
    const ready = await api.availability();
    if (ready === "unavailable") throw new Error("chrome unavailable");
  }
  const model = await api.create({
    initialPrompts: [{ role: "system", content: system }],
  });
  const script = history.map((turn) => `${turn.role === "user" ? "Student" : "Coach"}: ${turn.content}`).join("\n");
  return model.prompt(`${script}\nCoach JSON:`);
}

const BANK: TutorQuiz[] = [
  {
    prompt: "Fret 12 is where, on the speaking length of the string?",
    choices: ["A quarter of the way", "Exactly halfway", "Two thirds of the way", "It depends on the gauge"],
    answer: 1,
    why: "Halfway. Fold the string in half: same letter, one floor up. That is the octave.",
  },
  {
    prompt: "A perfect 5th is how many frets on one string?",
    choices: ["3", "4", "5", "7"],
    answer: 3,
    why: "Seven frets. From C that letter is G. From E it is B. From A it is E. Count stairs.",
  },
  {
    prompt: "A major 3rd is how many frets?",
    choices: ["2", "3", "4", "5"],
    answer: 2,
    why: "Four frets is a smile (C to E). Three frets is sad (C to Eb). That one fret is major versus minor.",
  },
  {
    prompt: "C major walks which pattern of frets?",
    choices: ["2 2 1 2 2 2 1", "2 1 2 2 1 2 2", "1 3 1 2 1 3 1", "3 2 2 3 2"],
    answer: 0,
    why: "Skip, skip, next, skip, skip, skip, next. From C: C D E F G A B.",
  },
  {
    prompt: "What is the tell of Lydian against a major scale?",
    choices: ["Flat 7th", "Raised 4th", "Flat 2nd", "Minor 3rd"],
    answer: 1,
    why: "The 4th is one fret higher — like a raised stair. In C that is F# instead of F. Six frets above home.",
  },
  {
    prompt: "Mixolydian keeps a major 3rd and changes which degree?",
    choices: ["The 2nd, down one fret", "The 4th, up one fret", "The 7th, down one fret", "The 6th, down one fret"],
    answer: 2,
    why: "The 7th drops one fret. The door stays open. In C that letter is Bb, not B.",
  },
  {
    prompt: "Dorian versus natural minor. Which note moved?",
    choices: ["The 3rd", "The 6th", "The 2nd", "The 5th"],
    answer: 1,
    why: "Dorian keeps a bright 6th. Natural minor makes it sad. In A: F# is Dorian, F is natural minor. Same clothes, one button changed.",
  },
  {
    prompt: "How do you find the chords of a song, in order?",
    choices: ["Solo first, then key", "Bass, quality, letters, numerals, family, capo", "Download a tab and stop listening", "Guess Yaman if it is romantic"],
    answer: 1,
    why: "Lowest note first. Then ask bright or sad (4 frets vs 3). Number from the chord that can end the chorus. Capo if the shapes are hard.",
  },
  {
    prompt: "G D Em C and Am F C G are what, to each other?",
    choices: ["Unrelated keys", "The same four-chord family with home moved", "Lydian and Mixolydian", "A raga pair"],
    answer: 1,
    why: "G D Em C and Am F C G are the same neighborhood with a different front door. Home moved from G to A.",
  },
  {
    prompt: "A power chord is which two notes?",
    choices: ["Root and 3rd", "Root and 5th", "Root and 7th", "3rd and 5th"],
    answer: 1,
    why: "Root and 5th. No 3rd, so the guitar does not argue happy vs sad. From the E string: this fret, plus two frets higher on the A string.",
  },
  {
    prompt: "Capo 2 with G shapes sounds as which key?",
    choices: ["G", "A", "F", "E"],
    answer: 1,
    why: "Capo is addition. G plus two frets is A. The shapes did not change. Home did.",
  },
];

function pickQuiz(index: number): TutorQuiz {
  return BANK[index % BANK.length] ?? BANK[0];
}

function weakEar(snap: StudentSnap): { id: keyof StudentSnap["ear"]; title: string } {
  const rows: { id: keyof StudentSnap["ear"]; title: string; score: number }[] = [
    { id: "interval", title: "intervals", score: snap.ear.interval },
    { id: "scale", title: "scales", score: snap.ear.scale },
    { id: "quality", title: "quality", score: snap.ear.quality },
    { id: "loop", title: "loops", score: snap.ear.loop },
    { id: "degree", title: "degrees", score: snap.ear.degree },
  ];
  const worst = rows.sort((a, b) => a.score - b.score)[0];
  return { id: worst?.id ?? "interval", title: worst?.title ?? "intervals" };
}

function phraseForDay(id: number): string {
  if (id <= 3) return "fifth";
  if (id === 4) return "major-walk";
  if (id === 5 || id === 9) return "pent";
  if (id === 6) return "triad";
  if (id === 10 || id === 11 || id === 26) return "lydian";
  if (id === 24) return "fifth";
  return id % 2 === 0 ? "maj3" : "min3";
}

export function opening(snap: StudentSnap): TutorReply {
  if (!snap.next) {
    const ear = weakEar(snap);
    return {
      say: `Path is done. Leftover work is speed, like knowing a keyboard without looking. Weakest ear score is ${ear.title}. Ten minutes there, then hold ${snap.saName} on the mic until the letter sits.`,
      action: { kind: "link", to: "/ear", label: "Open the ear gym" },
      source: "offline",
    };
  }
  if (!snap.heldHome && snap.next.id <= 6) {
    return {
      say: `You are on day ${snap.next.id}: ${snap.next.title}. Before new ideas, hold ${snap.saName} on one string and let it ring — like saying your name clearly. The mic will name the letter and say if you are a little high or low.`,
      action: { kind: "mic" },
      source: "offline",
    };
  }
  if (snap.gymHits < 8 && snap.next.id >= 2) {
    return {
      say: `Day ${snap.next.id} is ${snap.next.title}. The neck is still slow (${snap.gymHits} gym hits). Two minutes of hunt — find every copy of one letter, like spotting every A on a map — then come back and I will quiz the idea.`,
      action: { kind: "link", to: "/gym", label: "Open the gym" },
      source: "offline",
    };
  }
  const quiz = pickQuiz(snap.next.id);
  return {
    say: `Today is day ${snap.next.id}: ${snap.next.title}. ${snap.next.promise} Answer this first. Then we play it on the guitar.`,
    action: { kind: "quiz", quiz },
    source: "offline",
  };
}

export function offlineReply(message: string, snap: StudentSnap): TutorReply {
  const q = message.toLowerCase();
  if (/\b(train|coach|practice|session|what should i)\b/.test(q)) return opening(snap);
  if (/\b(tests?|exam|train more)\b/.test(q)) {
    return {
      say: "Open Tests and pick a real song. Hear the guitar loop — not the hit melody — then find home, the scale, the clothes, and another title that wears the same loop. Skills quizzes are still there if you want a mixed exam. Best percent sticks on this browser only.",
      action: { kind: "link", to: "/tests", label: "Open training tests" },
      source: "offline",
    };
  }
  if (/\b(quiz|test|check me|question)\b/.test(q)) {
    const quiz = pickQuiz((snap.next?.id ?? 12) + message.length);
    return { say: "No guitar yet. Name this.", action: { kind: "quiz", quiz }, source: "offline" };
  }
  if (/\b(mic|listen|record|playing|tune|pitch)\b/.test(q)) {
    if (/\b(phrase|lick|scale|riff|fifth|triad)\b/.test(q) || /check/.test(q)) {
      const job = phraseForDay(snap.next?.id ?? 3);
      const named = PHRASE_JOBS.find((item) => item.id === job)?.name ?? "that phrase";
      return {
        say: `The mic hears one string at a time, like one person talking. I will play ${named}, then you play it back slowly. I will name skipped and extra letters.`,
        action: { kind: "phrase", job },
        source: "offline",
      };
    }
    return {
      say: `Use the tuner. Target ${snap.saName}. One string, let it ring. If it says chord, you hit extra strings — mute them. Sharp means a little too high: sit closer to the fret wire, or tune that string down a hair.`,
      action: { kind: "mic" },
      source: "offline",
    };
  }
  const scaleHit = [...SCALES]
    .sort((a, b) => b.name.length - a.name.length)
    .find((scale) => q.includes(scale.name.toLowerCase()) || q.includes(scale.id.replaceAll("-", " ")));
  if (scaleHit) {
    return {
      say: `${scaleHit.name}. Tell: ${scaleHit.tell} Everyday picture: ${scaleHit.example} From C, walk it, then do not sit on the note in the avoid line.`,
      action: { kind: "link", to: "/ragas", label: "Open the scale studio" },
      source: "offline",
    };
  }
  if (/\b(chord|harmony|barre|loop|progression|numeral)\b/.test(q)) {
    return {
      say: CHORD_STEPS.slice(0, 3).join(" ") + " Then numerals from the chord that can end the chorus.",
      action: { kind: "link", to: "/chords", label: "Open the chord lab" },
      source: "offline",
    };
  }
  if (/\b(interval|fret|distance|fifth|third|octave)\b/.test(q)) {
    const n = /\b(5th|fifth)\b/.test(q) ? 7 : /\bminor 3\b/.test(q) ? 3 : /\bmajor 3\b/.test(q) ? 4 : 7;
    return {
      say: `A ${INTERVAL_NAMES[n]} is ${n} frets on one string. Count stairs. Do not guess. Play it, then name it in the ear gym.`,
      action: { kind: "phrase", job: n === 4 ? "maj3" : n === 3 ? "min3" : "fifth" },
      source: "offline",
    };
  }
  if (/\b(mode|lydian|mixo|dorian|ionian|aeolian)\b/.test(q)) {
    return {
      say: "Same seven notes. New home. That is all a mode is. Like the same room photographed from a different chair. Play C D E F G A B, then rest on D: that is Dorian. The tell is the one step the neighbor scale does not have.",
      action: { kind: "link", to: "/day/10", label: "Open the modes day" },
      source: "offline",
    };
  }
  if (/\b(capo)\b/.test(q)) {
    return {
      say: "A capo is a movable nut. Shape letter plus fret number equals the sounding key. Capo 2 on G shapes is A. Same song, two stairs higher. Your hands did not learn new shapes.",
      action: { kind: "quiz", quiz: pickQuiz(10) },
      source: "offline",
    };
  }
  if (/\b(song|kesariya|ilahi|wonderwall|perfect)\b/.test(q)) {
    return {
      say: "Songs in this lab are furniture you can move, not copied melodies. Hear the four-chord loop, name the family, capo until the shapes are easy. A romantic lyric does not pick a scale. Test the 3rd.",
      action: { kind: "link", to: "/songs", label: "Open the song lab" },
      source: "offline",
    };
  }
  if (/\b(video|youtube|watch)\b/.test(q)) {
    return {
      say: "Pick a teacher for the one idea you are stuck on, then come back and tap the neck. The path still works if you skip the video.",
      action: { kind: "link", to: "/watch", label: "Open videos" },
      source: "offline",
    };
  }
  return opening(snap);
}

async function llmReply(source: TutorSource, settings: TutorSettings, system: string, history: ChatTurn[]): Promise<string> {
  if (source === "gemini") return geminiComplete(settings.gemini.trim(), system, history);
  if (source === "groq") return groqComplete(settings.groq.trim(), system, history);
  if (source === "chrome") return chromeComplete(system, history);
  if (source === "community") return communityComplete(system, history);
  throw new Error("offline");
}

function chainFor(settings: TutorSettings): TutorSource[] {
  if (settings.provider === "offline") return ["offline"];
  if (settings.provider !== "auto") return [settings.provider, "offline"];
  const list: TutorSource[] = [];
  if (chromePromptApi()) list.push("chrome");
  if (settings.gemini.trim()) list.push("gemini");
  if (settings.groq.trim()) list.push("groq");
  list.push("community", "offline");
  return list;
}

export async function askTutor(opts: {
  message: string;
  history: ChatTurn[];
  snap: StudentSnap;
  settings: TutorSettings;
}): Promise<TutorReply> {
  const { message, history, snap, settings } = opts;
  const system = `${SYSTEM}\n\n${snapshotBlock(snap)}`;
  const turns: ChatTurn[] = [...history.slice(-8), { role: "user", content: message }];
  const chain = chainFor(settings);

  for (const source of chain) {
    if (source === "offline") return offlineReply(message, snap);
    if (source === "gemini" && !settings.gemini.trim()) continue;
    if (source === "groq" && !settings.groq.trim()) continue;
    try {
      const raw = await withTimeout(llmReply(source, settings, system, turns), source === "community" ? 22000 : 16000);
      const reply = parseReply(raw, source);
      if (source === "community") {
        return { ...reply, note: "Free community model. No key. Quality varies." };
      }
      return reply;
    } catch {
      continue;
    }
  }
  return offlineReply(message, snap);
}

export function studentSnap(input: {
  passed: number[];
  saPc: number;
  gymHits: number;
  ear: StudentSnap["ear"];
  heldHome: boolean;
}): StudentSnap {
  const next = DAYS.find((day) => (day.id === 1 || input.passed.includes(day.id - 1)) && !input.passed.includes(day.id)) ?? null;
  return {
    passed: input.passed,
    next,
    saPc: input.saPc,
    saName: noteName(input.saPc),
    gymHits: input.gymHits,
    ear: input.ear,
    heldHome: input.heldHome,
  };
}
