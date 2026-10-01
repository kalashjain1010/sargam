import { useRef, useState } from "react";
import { unlock } from "../audio.ts";
import { useProgress } from "../progress.tsx";

export type Question = {
  prompt: string;
  choices: string[];
  answer: number;
  why: string;
  listen?: () => void;
};

export function Quiz({
  day,
  questions,
  passAt = 0.75,
  heading = "Check",
  onFinish,
}: {
  day?: number;
  questions: Question[];
  passAt?: number;
  heading?: string;
  onFinish?: (correct: number, total: number) => void;
}) {
  const { pass, passed } = useProgress();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const reported = useRef(false);
  const question = questions[index];
  const need = Math.ceil(questions.length * passAt);

  function choose(choice: number) {
    if (picked !== null || !question) return;
    setPicked(choice);
    if (choice === question.answer) setCorrect((count) => count + 1);
  }

  function next() {
    if (!question || picked === null) return;
    const score = correct;
    if (index + 1 >= questions.length) {
      setDone(true);
      if (!reported.current) {
        reported.current = true;
        if (day !== undefined && score >= need) pass(day);
        onFinish?.(score, questions.length);
      }
      return;
    }
    setIndex((value) => value + 1);
    setPicked(null);
  }

  function retry() {
    reported.current = day !== undefined && passed.includes(day);
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    setDone(false);
  }

  if (done) {
    const won = correct >= need;
    return (
      <section className="widget">
        <h3 className={won ? "ok-line" : ""}>{won ? (day !== undefined ? "Day clear" : "That's a pass") : "Not yet"}</h3>
        <p>
          {correct} of {questions.length}. The line is {need}.
        </p>
        {won ? (
          <p className="ok-line">
            {day !== undefined
              ? "Marked clear on this browser. Any other day is already open — another phone will not remember this mark."
              : "Run it again until the answers feel boring. That is the point of training."}
          </p>
        ) : (
          <p>The explanations are the lesson. Read the one you missed, then run it again.</p>
        )}
        <button type="button" className="btn secondary" onClick={retry}>
          {day !== undefined ? "Try the check again" : "Train this set again"}
        </button>
      </section>
    );
  }

  if (!question) return null;

  return (
    <section className="widget" id="check">
        <div className="quiz-bar">
          <b style={{ width: `${((index + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>
        <h3>
          {heading} · {index + 1} of {questions.length}
        </h3>
      <p>{question.prompt}</p>
      {question.listen ? (
        <button
          type="button"
          className="play-btn"
          onClick={() => {
            unlock();
            question.listen?.();
          }}
        >
          Play
        </button>
      ) : null}
      <div className="choices">
        {question.choices.map((choice, choiceIndex) => {
          const state = picked === null ? "" : choiceIndex === question.answer ? "right" : choiceIndex === picked ? "wrong" : "";
          return (
            <button key={choice} type="button" className={`choice ${state}`} onClick={() => choose(choiceIndex)}>
              {choice}
            </button>
          );
        })}
      </div>
      {picked !== null ? <p className="why">{question.why}</p> : null}
      {picked !== null ? (
        <button type="button" className="btn" onClick={next}>
          {index + 1 === questions.length ? "See the result" : "Next"}
        </button>
      ) : null}
    </section>
  );
}

