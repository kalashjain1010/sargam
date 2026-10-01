import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { DAY_COUNT, DAYS } from "../theory.ts";
import { useProgress } from "../progress.tsx";
import { DayBody } from "../lessons.tsx";

export function DayPage() {
  const params = useParams();
  const id = Number(params.id);
  const meta = DAYS.find((day) => day.id === id);
  const { passed } = useProgress();

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

  const next = id < DAY_COUNT ? id + 1 : null;

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
