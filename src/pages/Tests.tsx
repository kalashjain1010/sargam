import { useMemo, useState } from "react";
import { Quiz } from "../components/Quiz.tsx";
import { DRILLS, drillById } from "../drills.ts";
import { useProgress } from "../progress.tsx";

export function TestsPage() {
  const { drills, recordDrill } = useProgress();
  const [id, setId] = useState("mixed");
  const [seed, setSeed] = useState(0);
  const pack = drillById(id) ?? DRILLS[DRILLS.length - 1]!;
  const questions = useMemo(() => pack.build(), [pack, seed]);
  const best = drills[pack.id] ?? 0;

  return (
    <div className="home wide">
      <p className="eyebrow">Training tests</p>
      <h1>A test you can fail, then take again.</h1>
      <p className="lede">
        These are not locked behind a day. Pick a pile — neck, gaps, scales, chords, loops — or sit the mixed exam. Hear the ones with a Play button. Best percent sticks on this browser only. Another phone starts at zero. That is fine. The training is the repeating.
      </p>
      <div className="gym-bests">
        {DRILLS.map((item) => (
          <div key={item.id}>
            <em>{item.title}</em>
            <strong>{drills[item.id] ? `${drills[item.id]}%` : "—"}</strong>
          </div>
        ))}
      </div>
      <div className="chips">
        {DRILLS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`chip ${id === item.id ? "on" : ""}`}
            onClick={() => {
              setId(item.id);
              setSeed((n) => n + 1);
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
      <p className="muted">{pack.blurb}</p>
      {best ? <p className="tiny muted">Best on this browser: {best}%. Beat it, or keep it warm.</p> : null}
      <Quiz
        key={`${pack.id}-${seed}`}
        questions={questions}
        heading="Train"
        passAt={0.75}
        onFinish={(correct, total) => recordDrill(pack.id, Math.round((100 * correct) / total))}
      />
      <div className="row">
        <button type="button" className="play-btn ghost" onClick={() => setSeed((n) => n + 1)}>
          New questions
        </button>
      </div>
    </div>
  );
}
