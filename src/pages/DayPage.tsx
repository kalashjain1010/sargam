import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { DAYS } from "../theory.ts";
import { useProgress } from "../progress.tsx";
import { DayBody } from "../lessons.tsx";

export function DayPage() {
  const params = useParams();
  const id = Number(params.id);
  const meta = DAYS.find((day) => day.id === id);
  const { isOpen, passed } = useProgress();

  useEffect(() => {
    document.title = meta ? `${meta.title} · Sargam` : "Sargam";
  }, [meta]);

  if (!meta) {
    return (
      <div className="lesson">
        <h1>That day is not on the path.</h1>
        <Link to="/path">Back to the twelve</Link>
      </div>
    );
  }

  if (!isOpen(id)) {
    return (
      <div className="lesson">
        <p className="eyebrow">Locked</p>
        <h1>Day {id} opens after the day before it.</h1>
        <p>The check is short. Songs, the gym, and the practice room are already available if you only needed a reference.</p>
        <Link className="btn" to={`/day/${id - 1}`}>
          Go to day {id - 1}
        </Link>
      </div>
    );
  }

  const next = id < 12 && passed.includes(id) ? id + 1 : null;

  return (
    <article className="lesson">
      <p className="eyebrow">
        Day {id} of 12 · {meta.minutes} min · {meta.kicker}
        {passed.includes(id) ? " · clear" : ""}
      </p>
      <h1>{meta.title}</h1>
      <p className="lede">{meta.promise}</p>
      <DayBody id={id} />
      {next ? (
        <p className="next-day">
          <Link className="btn" to={`/day/${next}`}>
            Day {next}
          </Link>
        </p>
      ) : null}
    </article>
  );
}
