import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { DAY_COUNT, DAYS } from "../theory.ts";
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
        <Link to="/path">Back to the path</Link>
      </div>
    );
  }

  if (!isOpen(id)) {
    return (
      <div className="lesson">
        <p className="eyebrow">Locked</p>
        <h1>Day {id} opens after the day before it.</h1>
        <p>The check is short. Songs, the gym, the ear room, and practice are already available if you only needed a reference.</p>
        <Link className="btn" to={`/day/${id - 1}`}>
          Go to day {id - 1}
        </Link>
      </div>
    );
  }

  const next = id < DAY_COUNT && passed.includes(id) ? id + 1 : null;

  return (
    <article className="lesson">
      <p className="eyebrow">
        Day {id} of {DAY_COUNT} · {meta.unit} · {meta.minutes} min · {meta.kicker}
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
