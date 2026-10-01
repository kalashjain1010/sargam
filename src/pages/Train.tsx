import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PhraseCoach, PHRASE_JOBS } from "../components/PhraseCoach.tsx";
import { PitchCoach } from "../components/PitchCoach.tsx";
import { MAJOR } from "../theory.ts";
import { useProgress } from "../progress.tsx";
import {
  askTutor,
  loadTutorSettings,
  opening,
  saveTutorSettings,
  sourceLabel,
  studentSnap,
} from "../tutor.ts";
import type { ChatTurn, TutorAction, TutorProvider, TutorReply, TutorSettings } from "../tutor.ts";

const STARTERS = ["Train me", "Quiz me", "Check my playing", "Explain Lydian", "How do I find chords?", "What is a fifth?"];

type Bubble = { id: number; role: "user" | "coach"; text: string; source?: string; note?: string };

function Drill({ action, saPc }: { action: TutorAction; saPc: number }) {
  if (action.kind === "link") {
    return (
      <p>
        <Link className="btn" to={action.to}>
          {action.label}
        </Link>
      </p>
    );
  }
  if (action.kind === "mic") {
    return <PitchCoach saPc={saPc} targetPc={saPc} scale={MAJOR} />;
  }
  if (action.kind === "phrase") {
      const job = PHRASE_JOBS.find((item) => item.id === action.job);
      return <PhraseCoach key={action.job} jobs={job ? [job] : PHRASE_JOBS} />;
  }
  return null;
}

function LiveQuiz({
  quiz,
  onDone,
}: {
  quiz: Extract<TutorAction, { kind: "quiz" }>["quiz"];
  onDone: (line: string) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="widget">
      <h3>{quiz.prompt}</h3>
      <div className="choices">
        {quiz.choices.map((choice, index) => {
          const state = picked === null ? "" : index === quiz.answer ? "right" : index === picked ? "wrong" : "";
          return (
            <button
              key={choice}
              type="button"
              className={`choice ${state}`}
              onClick={() => {
                if (picked !== null) return;
                setPicked(index);
                const ok = index === quiz.answer;
                onDone(ok ? `Correct. ${quiz.why}` : `You picked “${choice}”. ${quiz.why}`);
              }}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {picked !== null ? <p className="why">{quiz.why}</p> : null}
    </div>
  );
}

export function TrainPage() {
  const progress = useProgress();
  const snap = useMemo(
    () =>
      studentSnap({
        passed: progress.passed,
        saPc: progress.saPc,
        gymHits: progress.gym.hits,
        ear: progress.ear,
        heldHome: progress.stamps.includes("held-sa"),
      }),
    [progress.passed, progress.saPc, progress.gym.hits, progress.ear, progress.stamps],
  );
  const [settings, setSettings] = useState<TutorSettings>(loadTutorSettings);
  const [bubbles, setBubbles] = useState<Bubble[]>(() => {
    const first = opening(snap);
    return [{ id: 1, role: "coach", text: first.say, source: sourceLabel(first.source) }];
  });
  const [action, setAction] = useState<TutorAction>(() => opening(snap).action);
  const [quizKey, setQuizKey] = useState(0);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const history = useRef<ChatTurn[]>([]);
  const nextId = useRef(2);

  function remember(role: "user" | "assistant", content: string) {
    history.current = [...history.current, { role, content }].slice(-10);
  }

  function applyReply(reply: TutorReply) {
    remember("assistant", reply.say);
    setBubbles((current) => [
      ...current,
      {
        id: nextId.current++,
        role: "coach",
        text: reply.say,
        source: sourceLabel(reply.source),
        note: reply.note,
      },
    ]);
    setAction(reply.action);
    if (reply.action.kind === "quiz") setQuizKey((n) => n + 1);
  }

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setDraft("");
    setBusy(true);
    setBubbles((current) => [...current, { id: nextId.current++, role: "user", text: message }]);
    remember("user", message);
    try {
      const reply = await askTutor({ message, history: history.current.slice(0, -1), snap, settings });
      applyReply(reply);
    } catch {
      applyReply({
        say: "The cloud coach missed. Using the built-in trainer.",
        action: { kind: "none" },
        source: "offline",
      });
    } finally {
      setBusy(false);
    }
  }

  function updateSettings(patch: Partial<TutorSettings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveTutorSettings(next);
  }

  const provider: { id: TutorProvider; label: string }[] = [
    { id: "auto", label: "Auto" },
    { id: "community", label: "Free cloud" },
    { id: "gemini", label: "Gemini" },
    { id: "groq", label: "Groq" },
    { id: "chrome", label: "Chrome" },
    { id: "offline", label: "Built-in" },
  ];

  return (
    <div className="home wide">
      <p className="eyebrow">AI trainer</p>
      <h1>Yes — there is an AI coach. It is this page.</h1>
      <p className="lede">
        Type in ordinary words: “what is a fifth?”, “how do I find chords?”, “train me.” Auto uses a free cloud model — no key. Built-in always works if the cloud is sleepy. Optional Gemini or Groq keys stay in this browser only. Chat cannot hear your acoustic guitar; tap Use microphone for that.
      </p>
      <div className="chips">
        {provider.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`chip ${settings.provider === item.id ? "on" : ""}`}
            onClick={() => updateSettings({ provider: item.id })}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="tiny muted">
        Next on your path: {snap.next ? `day ${snap.next.id} · ${snap.next.title}` : "path complete"} · home {snap.saName}
      </p>
      <div className="chat" aria-live="polite">
        {bubbles.map((bubble) => (
          <div key={bubble.id} className={`bubble ${bubble.role}`}>
            <p>{bubble.text}</p>
            {bubble.role === "coach" && bubble.source ? (
              <small>
                {bubble.source}
                {bubble.note ? ` · ${bubble.note}` : ""}
              </small>
            ) : null}
          </div>
        ))}
        {busy ? (
          <div className="bubble coach">
            <p>Listening to the question…</p>
          </div>
        ) : null}
      </div>
      {action.kind === "quiz" ? (
        <LiveQuiz
          key={quizKey}
          quiz={action.quiz}
          onDone={(line) => {
            setBubbles((current) => [...current, { id: nextId.current++, role: "coach", text: line, source: "Built-in coach" }]);
            remember("assistant", line);
          }}
        />
      ) : (
        <Drill action={action} saPc={progress.saPc} />
      )}
      <div className="chips">
        {STARTERS.map((item) => (
          <button key={item} type="button" className="chip" disabled={busy} onClick={() => void send(item)}>
            {item}
          </button>
        ))}
      </div>
      <form
        className="train-compose"
        onSubmit={(event) => {
          event.preventDefault();
          void send(draft);
        }}
      >
        <textarea
          rows={2}
          value={draft}
          placeholder="Ask, or say train me."
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send(draft);
            }
          }}
        />
        <button type="submit" className="play-btn" disabled={busy || !draft.trim()}>
          Send
        </button>
      </form>
      <button type="button" className="btn ghost" onClick={() => setShowKeys((on) => !on)}>
        {showKeys ? "Hide keys" : "Optional API keys"}
      </button>
      {showKeys ? (
        <div className="widget">
          <h3>Stronger free models</h3>
          <p className="muted">
            Keys stay in this browser. They are sent only to Google or Groq when you pick those. Auto does not need a key.
          </p>
          <label className="key-field">
            Gemini (free at aistudio.google.com)
            <input
              type="password"
              autoComplete="off"
              value={settings.gemini}
              onChange={(event) => updateSettings({ gemini: event.target.value })}
              placeholder="AIza…"
            />
          </label>
          <label className="key-field">
            Groq (free at console.groq.com)
            <input
              type="password"
              autoComplete="off"
              value={settings.groq}
              onChange={(event) => updateSettings({ groq: event.target.value })}
              placeholder="gsk_…"
            />
          </label>
          <p className="tiny muted">Chrome on-device only works in a Chrome build that already downloaded Gemini Nano. If it is not there, Auto skips it.</p>
        </div>
      ) : null}
    </div>
  );
}
